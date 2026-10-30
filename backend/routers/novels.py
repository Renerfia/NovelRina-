from fastapi import APIRouter, HTTPException
from datab
router = APIRouter()

@router.get("/novels")
async def get_novels(user_id: str):

    