from datetime import datetime

from sqlalchemy import BigInteger, String, ForeignKey, UniqueConstraint, Index, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SubscriberNotice(Base):
    __tablename__ = "subscriber_notices"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    subscriber_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("subscribers.id", ondelete="CASCADE"), nullable=False
    )
    link: Mapped[str] = mapped_column(String, nullable=False)
    sent_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint("subscriber_id", "link", name="uq_subscriber_link"),
        Index("ix_subscriber_notices_sent_at", "sent_at"),
        Index("ix_subscriber_notices_subscriber_id", "subscriber_id"),
    )
