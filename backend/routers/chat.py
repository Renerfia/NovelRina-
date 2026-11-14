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
    auth = Depends(verify_user),
):
    """Handle chat requests for a specific novel."""

    user_query = request_body.query  # contains single user question
    history = request_body.history #for now its empty
    user = auth["user"]
    access_token = auth["access_token"]
    print(f"Received chat request for novel_id: {novel_id}, user_id: {user.id}, query: {user_query}")

    #handles empty request
    if not user_query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    try:
        prompt = get_full_prompt(user_query=user_query, message_history=history)
        response = await response_agent.run(
            prompt,
            deps=ChatDeps(
                user_id=user.id,
                novel_id=novel_id,
                access_token=access_token,
            ),
        )
        return response.output
    except HTTPException:
        raise
    except Exception as exc:
        print(f"Chat service failed: {type(exc).__name__}: {exc}")
        raise HTTPException(
            status_code=502,
            detail="AI response service failed",
        ) from exc