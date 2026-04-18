import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.config import settings


def _smtp_send(msg: MIMEMultipart | MIMEText):
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(settings.email_from, settings.email_password)
        server.send_message(msg)


def send_email(to_email: str, subject: str, html_body: str):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.email_from
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html"))
    _smtp_send(msg)


def send_auth_code(to_email: str, code: str):
    msg = MIMEText(
        f"숭실대 공지사항 구독 인증번호: {code}\n\n10분 내에 입력해주세요.",
    )
    msg["Subject"] = f"[숭실대 공지] 인증번호: {code}"
    msg["From"] = settings.email_from
    msg["To"] = to_email
    _smtp_send(msg)