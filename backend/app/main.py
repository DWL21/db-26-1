from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# 크롤러 & 스케줄러 라이브러리
import requests
from bs4 import BeautifulSoup
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from contextlib import asynccontextmanager
import datetime

import os
from dotenv import load_dotenv

# .env 금고 문 열기
load_dotenv() 

# --- [1] 기본 설정 ---
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

# 금고에서 이메일과 비밀번호 꺼내오기! (코드에 직접 안 보임)
SENDER_EMAIL = os.getenv("SENDER_EMAIL")     
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")
print("====================================")
print(f"✅ 이메일 확인: {SENDER_EMAIL}")
print(f"✅ 비번 확인: {SENDER_PASSWORD}")
print("====================================")
auth_store = {}
subscription_db = [] # 가상의 데이터베이스 (실제 서비스 시 MySQL/PostgreSQL 사용 권장)

# --- [2] 크롤러 함수 (공지사항 긁어오기) ---
def fetch_recent_notices():
    """
    실제 숭실대 채플 사이트 HTML 구조에 맞춰 BeautifulSoup로 크롤링하는 함수입니다.
    현재는 테스트를 위해 '가상의 최신 공지사항'을 반환하도록 작성되었습니다.
    """
    # 실제 크롤링 코드 예시:
    # url = "https://chaplain.ssu.ac.kr/notice"
    # response = requests.get(url)
    # soup = BeautifulSoup(response.text, 'html.parser')
    # ... (HTML 분석 및 추출) ...

    print("🔍 [크롤러] 최신 공지사항을 수집했습니다.")
    return [
        {"category": "학사", "title": "[학사] 2026학년도 1학기 채플 이수 기준 안내", "link": "https://chaplain.ssu.ac.kr/1"},
        {"category": "장학", "title": "[장학] 채플 우수자 장학금 신청 안내", "link": "https://chaplain.ssu.ac.kr/2"},
        {"category": "행사", "title": "[비교과·행사] 봄 맞이 채플 특별 음악회", "link": "https://chaplain.ssu.ac.kr/3"}
    ]

# --- [3] 이메일 발송 핵심 로직 ---
def send_summary_emails():
    print(f"⏰ [스케줄러] {datetime.datetime.now()} - 구독자 이메일 발송 시작!")
    notices = fetch_recent_notices()
    
    if not subscription_db:
        print("ℹ️ 현재 구독자가 없습니다.")
        return

    for user in subscription_db:
        user_email = user["email"]
        user_categories = user["categories"]
        
        # 사용자가 구독한 카테고리의 공지사항만 필터링
        filtered_notices = [n for n in notices if n["category"] in user_categories or "전체" in user_categories]
        
        if not filtered_notices:
            continue # 해당 사용자가 볼만한 새 공지가 없으면 패스
            
        # 메일 본문(HTML) 생성
        mail_body = f"""
        <html><body>
        <h2>숭실대학교 채플 새 공지사항 요약 📬</h2>
        <p>선택하신 카테고리(<strong>{', '.join(user_categories)}</strong>)의 새로운 공지입니다.</p>
        <ul>
        """
        for n in filtered_notices:
            mail_body += f"<li><a href='{n['link']}'>{n['title']}</a></li>"
        
        mail_body += """
        </ul>
        <hr>
        <p style='font-size: 12px; color: gray;'>이 메일은 자동 발송되었습니다. 구독 해제를 원하시면 앱에서 설정해주세요.</p>
        </body></html>
        """

        # 메일 전송
        try:
            msg = MIMEMultipart()
            msg['From'] = SENDER_EMAIL
            msg['To'] = user_email
            msg['Subject'] = "[숭실대 채플] 오늘의 공지사항 요약입니다."
            msg.attach(MIMEText(mail_body, 'html')) # HTML 형식으로 전송

            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)
            server.quit()
            print(f"✅ [{user_email}] 요약 메일 발송 성공!")
        except Exception as e:
            print(f"❌ [{user_email}] 요약 메일 발송 실패: {e}")

# --- [4] 스케줄러 설정 (서버 켜질 때 같이 켜짐) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler = AsyncIOScheduler()
    # 매일 아침 9시 0분에 send_summary_emails 함수 실행
    scheduler.add_job(send_summary_emails, 'cron', hour=9, minute=0)
    scheduler.start()
    print("🚀 [시스템] 아침 9시 자동 발송 스케줄러가 가동되었습니다.")
    yield
    scheduler.shutdown()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"]
)

# --- [5] API 엔드포인트 ---
class AuthRequest(BaseModel): email: EmailStr
class SubscriptionRequest(BaseModel): email: EmailStr; categories: List[str]; auth_code: str

@app.post("/auth/request-code")
async def request_code(request: AuthRequest):
    code = f"{random.randint(100000, 999999)}"
    auth_store[request.email] = code
    try:
        msg = MIMEMultipart()
        msg['From'], msg['To'], msg['Subject'] = SENDER_EMAIL, request.email, "[숭실대 채플] 서비스 구독 인증번호입니다."
        msg.attach(MIMEText(f"안녕하세요. 인증번호는 [{code}] 입니다. 5분 내에 입력해 주세요.", 'plain'))
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()
        return {"message": "인증번호가 발송되었습니다."}
    except Exception as e:
        raise HTTPException(status_code=500, detail="이메일 발송 중 오류가 발생했습니다.")

@app.post("/subscriptions")
async def subscribe(request: SubscriptionRequest):
    saved_code = auth_store.get(request.email)
    if not saved_code or saved_code != request.auth_code:
        raise HTTPException(status_code=400, detail="인증번호가 일치하지 않거나 만료되었습니다.")
    
    # DB에 저장
    subscription_db.append({"email": request.email, "categories": request.categories})
    del auth_store[request.email]
    print(f"🎉 새 구독자 추가됨! DB 현황: {subscription_db}")
    return {"message": "구독이 완료되었습니다."}

# 🔥 테스트용 API: 아침 9시까지 안 기다리고 강제로 크롤링 & 메일 쏘기 🔥
@app.get("/test-fire-emails")
async def force_send_emails():
    send_summary_emails()
    return {"message": "강제 발송 로직이 실행되었습니다. 백엔드 터미널을 확인하세요!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)