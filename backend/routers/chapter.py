from fastapi import APIRouter, Depends, HTTPException
from dependencies import verify_user
from pydantic import BaseModel
from agent.agent import get_summary, get_embeddings
from database import save_chapter_embedding_to_db
from tools.chunk import chunk_text

router = APIRouter()


class SummaryRequest(BaseModel):
    chapter_content: str

class embedRequest(BaseModel):
    chapter_id: str
    chapter_content_summary: str

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

@router.post('/get-summary-embedding')
async def router_get_embedding(
    request: embedRequest,
    auth = Depends(verify_user)
):
    if not auth['user']:
        raise HTTPException(status_code=401, detail="Not authenticated")

    if not request.chapter_content_summary.strip():
        raise HTTPException(status_code=400, detail="Please summarize your novel first.")

    if not request.chapter_id.strip():
        raise HTTPException(status_code=400, detail="Chapter ID cannot be empty.")

    chapter_id = request.chapter_id
    text = request.chapter_content_summary.strip()
    try:
        chapter_embedding = await get_embeddings(text)
        await save_chapter_embedding_to_db(
            access_token=auth["access_token"],
            chapter_id=chapter_id,
            chapter_content_embedding=chapter_embedding,
        )
    except LookupError as exc:
        print(f"Chapter embedding save failed: {exc}")
        raise HTTPException(
            status_code=404,
            detail="Chapter was not found or embedding update was not permitted.",
        ) from exc
    except Exception as exc:
        print(f"Chapter embedding generation or save failed: {exc}")
        raise HTTPException(
            status_code=502,
            detail="Failed to generate or save chapter embedding.",
        ) from exc

    return {"message": "Chapter embedding saved successfully.", "chapter_id": chapter_id}
    