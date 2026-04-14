# backend/app/models/subscription.py (또는 새로 생성)
from sqlalchemy import BigInteger, String, Boolean, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.database import Base

# 1. 최종 구독자(학생) 테이블
class Subscriber(Base):
    __tablename__ = "subscribers"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False) # 인증 여부
    subscribed_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

# 2. 임시 인증번호 저장 테이블 (5분 뒤 만료 확인용)
class AuthCode(Base):
    __tablename__ = "auth_codes"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String, nullable=False)
    auth_code: Mapped[str] = mapped_column(String(6), nullable=False) # 6자리 인증번호
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False) # 만료 시간
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())