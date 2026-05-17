import asyncio
import logging
from datetime import date, datetime, timezone, timedelta

import schedule
import time
from sqlalchemy import select, delete

from app.database import AsyncSessionLocal
from app.models.subscriber_notice import SubscriberNotice
from app.models.subscription import Subscriber, Subscription
from app.services.notice_collector import fetch_notices_from_crawler
from app.email_template import build_email_html
from app.SendMail import send_email

logger = logging.getLogger(__name__)

ALL_CATEGORIES = [
    "전체", "학사", "장학", "국제교류", "외국인유학생",
    "채용", "비교과·행사", "교원채용", "교직", "봉사", "기타",
]


async def _fetch_by_categories(categories: set[str]) -> tuple[dict[str, list[dict]], set[str]]:
    """카테고리별 크롤링. 반환: (category→notices 맵, 실패한 카테고리 집합)"""
    category_raw: dict[str, list[dict]] = {}
    failed: set[str] = set()
    for cat in categories:
        cat_param = "" if cat == "전체" else cat
        try:
            category_raw[cat] = await fetch_notices_from_crawler(page=1, category=cat_param)
        except Exception:
            logger.exception("크롤링 실패: %s", cat)
            failed.add(cat)
    return category_raw, failed


async def _sent_links_for(db, subscriber_id: int) -> set[str]:
    result = await db.execute(
        select(SubscriberNotice.link).where(SubscriberNotice.subscriber_id == subscriber_id)
    )
    return set(result.scalars().all())


async def _record_sent(db, subscriber_id: int, links: set[str]) -> None:
    for link in links:
        db.add(SubscriberNotice(subscriber_id=subscriber_id, link=link))
    await db.commit()


async def _collect_and_send():
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Subscriber, Subscription.category)
            .join(Subscription, Subscriber.id == Subscription.subscriber_id)
        )
        rows = result.all()

        if not rows:
            logger.info("구독자가 없어 발송 스킵")
            return

        subscriber_map: dict[int, dict] = {}
        all_categories: set[str] = set()
        for subscriber, category in rows:
            if subscriber.id not in subscriber_map:
                subscriber_map[subscriber.id] = {"subscriber": subscriber, "categories": set()}
            subscriber_map[subscriber.id]["categories"].add(category)
            all_categories.add(category)

        category_raw, failed_categories = await _fetch_by_categories(all_categories)

        if not category_raw:
            logger.info("크롤링 가능한 카테고리 없음, 발송 스킵")
            return

        today = date.today()

        for sid, info in subscriber_map.items():
            subscriber = info["subscriber"]
            cats = info["categories"]

            if cats & failed_categories:
                logger.info("실패 카테고리 구독으로 이번 회차 스킵: %s", subscriber.email)
                continue

            sent_links = await _sent_links_for(db, sid)

            matched: list[dict] = []
            seen: set[str] = set()
            for cat in cats:
                for n in category_raw.get(cat, []):
                    link = n.get("link")
                    if link and link not in sent_links and link not in seen:
                        seen.add(link)
                        matched.append(n)

            if not matched:
                continue

            html = build_email_html(matched, target_date=today, unsub_token=subscriber.unsub_token)
            subject = f"숭실대 공지사항 ({today.strftime('%Y.%m.%d')}) — {len(matched)}건"

            try:
                send_email(subscriber.email, subject, html_body=html)
                await _record_sent(db, sid, seen)
                logger.info("발송 완료: %s (%d건)", subscriber.email, len(matched))
            except Exception:
                await db.rollback()
                logger.exception("발송 실패: %s", subscriber.email)


async def _cleanup_old_records():
    """60일 초과 subscriber_notices 레코드 삭제"""
    cutoff = datetime.now(timezone.utc) - timedelta(days=60)
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            delete(SubscriberNotice).where(SubscriberNotice.sent_at < cutoff)
        )
        await db.commit()
        deleted = result.rowcount
        if deleted:
            logger.info("cleanup: %d개 오래된 발송 이력 삭제", deleted)


async def seed_existing_notices() -> None:
    """부팅 시 1회 — 현재 page=1의 링크를 모든 기존 구독자의 발송 이력에 사전 저장.
    첫 cron 시점의 누적분 폭주 발송을 차단한다. 메일 발송은 하지 않는다."""
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Subscriber, Subscription.category)
            .join(Subscription, Subscriber.id == Subscription.subscriber_id)
        )
        rows = result.all()

        if not rows:
            logger.info("seed: 구독자 없음")
            return

        subscriber_map: dict[int, dict] = {}
        all_categories: set[str] = set()
        for subscriber, category in rows:
            if subscriber.id not in subscriber_map:
                subscriber_map[subscriber.id] = {"subscriber": subscriber, "categories": set()}
            subscriber_map[subscriber.id]["categories"].add(category)
            all_categories.add(category)

        category_raw, _ = await _fetch_by_categories(all_categories)

        total = 0
        for sid, info in subscriber_map.items():
            sent_links = await _sent_links_for(db, sid)
            new_links: set[str] = set()
            for cat in info["categories"]:
                for n in category_raw.get(cat, []):
                    link = n.get("link")
                    if link and link not in sent_links and link not in new_links:
                        new_links.add(link)
            if new_links:
                await _record_sent(db, sid, new_links)
                total += len(new_links)

        logger.info("seed 완료: %d 구독자에게 총 %d 링크 사전 저장", len(subscriber_map), total)


async def _fetch_notices_for_categories(categories: set[str]) -> list[dict]:
    """카테고리별 크롤링 후 링크 기준 중복 제거하여 반환."""
    seen: set[str] = set()
    result: list[dict] = []
    for cat in categories:
        cat_param = "" if cat == "전체" else cat
        try:
            notices = await fetch_notices_from_crawler(page=1, category=cat_param)
        except Exception:
            logger.exception("크롤링 실패: %s", cat)
            continue
        for n in notices:
            link = n.get("link")
            if link and link not in seen:
                seen.add(link)
                result.append(n)
    return result


async def send_now_to_subscriber(subscriber_id: int, categories: set[str]) -> None:
    """구독 완료 직후 현재 공지사항을 1회 즉시 발송하고 발송 이력에 기록."""
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Subscriber).where(Subscriber.id == subscriber_id)
        )
        subscriber = result.scalar_one_or_none()
        if subscriber is None:
            return

        sent_links = await _sent_links_for(db, subscriber_id)

    notices = await _fetch_notices_for_categories(categories)
    notices = [n for n in notices if n.get("link") and n["link"] not in sent_links]

    if not notices:
        logger.info("즉시 발송 스킵: 새 공지 없음 (%s)", subscriber.email)
        return

    today = date.today()
    html = build_email_html(notices, target_date=today, unsub_token=subscriber.unsub_token)
    subject = f"숭실대 공지사항 ({today.strftime('%Y.%m.%d')}) — {len(notices)}건"

    try:
        send_email(subscriber.email, subject, html_body=html)
        async with AsyncSessionLocal() as db:
            new_links = {n["link"] for n in notices}
            await _record_sent(db, subscriber_id, new_links)
        logger.info("즉시 발송 완료: %s (%d건)", subscriber.email, len(notices))
    except Exception:
        logger.exception("즉시 발송 실패: %s", subscriber.email)


async def resend_today_to_all() -> int:
    """모든 구독자에게 현재 공지사항 강제 재발송 (관리자용, 발송 이력 갱신 없음).
    반환: 발송 성공 수."""
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Subscriber, Subscription.category)
            .join(Subscription, Subscriber.id == Subscription.subscriber_id)
        )
        rows = result.all()

    if not rows:
        return 0

    subscriber_map: dict[int, dict] = {}
    for subscriber, category in rows:
        if subscriber.id not in subscriber_map:
            subscriber_map[subscriber.id] = {"subscriber": subscriber, "categories": set()}
        subscriber_map[subscriber.id]["categories"].add(category)

    sent = 0
    for info in subscriber_map.values():
        sub = info["subscriber"]
        notices = await _fetch_notices_for_categories(info["categories"])
        if not notices:
            continue
        today = date.today()
        html = build_email_html(notices, target_date=today, unsub_token=sub.unsub_token)
        subject = f"숭실대 공지사항 ({today.strftime('%Y.%m.%d')}) — {len(notices)}건"
        try:
            send_email(sub.email, subject, html_body=html)
            sent += 1
            logger.info("재발송 완료: %s (%d건)", sub.email, len(notices))
        except Exception:
            logger.exception("재발송 실패: %s", sub.email)

    return sent


def _job():
    asyncio.run(_collect_and_send())


def _cleanup_job():
    asyncio.run(_cleanup_old_records())


def run_scheduler():
    schedule.every().day.at("08:00").do(_job)
    schedule.every().monday.at("03:00").do(_cleanup_job)
    logger.info("스케줄러 시작 — 매일 08:00 발송 / 매주 월요일 03:00 cleanup")

    while True:
        schedule.run_pending()
        time.sleep(60)
