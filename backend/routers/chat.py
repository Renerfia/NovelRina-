from fastapi import APIRouter, HTTPException
from dependencies import verify_user
from fastapi import Depends
from agent.agent import ChatDeps, response_agent, get_full_prompt
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    history: list = []

@router.post("/novels/{novel_id}/chat")
async def chat(
    novel_id: str,
    request_body:ChatRequest,
    user = Depends(verify_user),
):
    """Handle chat requests for a specific novel."""

    user_query = request_body.query  # contains single user question
    history = request_body.history #for now its empty

    #handles empty request
    if not user_query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    try:
        prompt = get_full_prompt(user_query=user_query, message_history=history)
        response = await response_agent.run(
            prompt,
            deps=ChatDeps(novel_id=novel_id),
        )
        return response.output
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="AI response service failed",
        ) from exc