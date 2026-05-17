"""replace notices with per-subscriber subscriber_notices

Revision ID: 0003
Revises: 0002
Create Date: 2026-05-17

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0003"
down_revision: Union[str, None] = "0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table("notices")

    op.create_table(
        "subscriber_notices",
        sa.Column("id", sa.BigInteger, primary_key=True, autoincrement=True),
        sa.Column(
            "subscriber_id",
            sa.BigInteger,
            sa.ForeignKey("subscribers.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("link", sa.String, nullable=False),
        sa.Column(
            "sent_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.UniqueConstraint("subscriber_id", "link", name="uq_subscriber_link"),
    )
    op.create_index("ix_subscriber_notices_sent_at", "subscriber_notices", ["sent_at"])
    op.create_index("ix_subscriber_notices_subscriber_id", "subscriber_notices", ["subscriber_id"])


def downgrade() -> None:
    op.drop_index("ix_subscriber_notices_subscriber_id", "subscriber_notices")
    op.drop_index("ix_subscriber_notices_sent_at", "subscriber_notices")
    op.drop_table("subscriber_notices")

    op.create_table(
        "notices",
        sa.Column("id", sa.BigInteger, primary_key=True, autoincrement=True),
        sa.Column("link", sa.String, unique=True, nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
