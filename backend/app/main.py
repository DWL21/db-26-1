from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
import threading
import logging

from app.database import get_db
from app.models.subscription import Subscriber, Subscription
from app.routers import auth, subscription, notice, test_page

try:
    from app.scheuler import run_scheduler, _collect_and_send
except Exception as e:
    logging.getLogger(__name__).warning("scheduler disabled: %s", e)
    run_scheduler = None
    _collect_and_send = None

app = FastAPI(title="ssu-chapel backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(subscription.router)
app.include_router(notice.router)
app.include_router(test_page.router)


@app.get("/unsubscribe")
async def unsubscribe_by_token(
    token: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Subscriber).where(Subscriber.unsub_token == token)
    )
    subscriber = result.scalar_one_or_none()
    if subscriber is None:
        raise HTTPException(404, "유효하지 않거나 이미 해지된 토큰입니다.")

    email = subscriber.email
    await db.execute(
        delete(Subscription).where(Subscription.subscriber_id == subscriber.id)
    )
    await db.execute(delete(Subscriber).where(Subscriber.id == subscriber.id))
    await db.commit()

    return {"ok": True, "email": email}


@app.post("/admin/run-cron")
async def run_cron():
    if _collect_and_send is None:
        raise HTTPException(503, "스케줄러 모듈 로드 실패")
    await _collect_and_send()
    return {"ok": True, "message": "Cron 실행 완료"}


@app.get("/health")
async def health() -> JSONResponse:
    return JSONResponse({"status": "ok"})


@app.on_event("startup")
def start_scheduler():
    if run_scheduler is None:
        return
    t = threading.Thread(target=run_scheduler)
    t.daemon = True
    t.start()