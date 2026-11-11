from fastapi import APIRouter, HTTPException
from dependencies import verify_user
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from agent.agent import ChatDeps, response_agent, get_full_prompt
from pydantic import BaseModel
from database import init_supabase
from agent.agent import get_summary
from tools.chunk import chunk_text

router = APIRouter()

class SummaryRequest(BaseModel):
    chapter_content: str


@router.post('/get-summary')
async def router_get_summary(
    chapter_content: SummaryRequest,
    auth = Depends(verify_user)
):
    if not auth['user']:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    chunks = chunk_text(chapter_content)

    for chunk in chunks:
        try:
            summary = await get_summary(chunk)

        except Exception as exc:
            raise HTTPException(
                status_code=502,
                detail="Summary generation failed.",
            ) from exc










    