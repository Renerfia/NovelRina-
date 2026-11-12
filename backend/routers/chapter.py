from fastapi import APIRouter, Depends, HTTPException
from dependencies import verify_user
from pydantic import BaseModel
from agent.agent import get_summary
from tools.chunk import chunk_text

router = APIRouter()


class SummaryRequest(BaseModel):
    chapter_content: str


@router.post('/get-summary')
async def router_get_summary(
    request: SummaryRequest,
    auth=Depends(verify_user),
):
    if not auth['user']:
        raise HTTPException(status_code=401, detail="Not authenticated")

    if not request.chapter_content.strip():
        raise HTTPException(status_code=400, detail="Chapter content cannot be empty.")

    chunks = chunk_text(request.chapter_content)

    chunk_summaries = []

    for chunk in chunks:
        try:
            chunk_summary = await get_summary(chunk)
            chunk_summaries.append(chunk_summary)
        except Exception as exc:
            print(f"router_get_summary got error: {exc}")
            raise HTTPException(
                status_code=502,
                detail="Summary generation failed.",
            ) from exc

    return {"summary": "\n\n".join(chunk_summaries)}



    