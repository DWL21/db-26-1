from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.notice import Notice

router = APIRouter(prefix="/notices", tags=["notices"])


@router.get("/count")
async def count_sent_notices(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(func.count(Notice.id)))
    return {"count": result.scalar_one()}
