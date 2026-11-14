from supabase import AsyncClient, acreate_client
from postgrest.exceptions import APIError
from dotenv import load_dotenv
import os

load_dotenv()

url: str = str(os.environ.get("SUPABASE_URL"))
public_key: str = str(os.environ.get("SUPABASE_PUBLIC_KEY"))

async def init_supabase(access_token: str | None = None) -> AsyncClient:
    """Initialize the Supabase client."""
    client = await acreate_client(url, public_key)
    if access_token:
        client.postgrest.auth(access_token)
    return client

async def save_chapter_embedding_to_db(
    access_token: str,
    chapter_id: str,
    chapter_content_embedding,
) -> None:
    if not chapter_id.strip():
        raise ValueError("Chapter ID cannot be empty.")
    if not chapter_content_embedding:
        raise ValueError("Chapter embedding cannot be empty.")

    supabase = await init_supabase(access_token)

    try:
        response = await (
            supabase.table("chapters")
            .update({"chapter_content_embedding": chapter_content_embedding})
            .eq("chapter_id", chapter_id)
            .select("chapter_id")
            .execute()
        )
    except APIError as exc:
        raise RuntimeError(
            f"Failed to save embedding for chapter {chapter_id}: {exc}"
        ) from exc

    if not response.data:
        raise LookupError(
            f"No chapter was updated for ID {chapter_id}. "
            "The chapter may not exist, or row-level security may block the update."
        )


async def vector_search(user_id: str, novel_id: str, query: str, top_k: int = 3, access_token: str | None = None):
    supabase = await init_supabase(access_token)

    from agent.agent import get_embeddings
    query_embedding = await get_embeddings(query)
    return await supabase.rpc(
        "match_chapters_novelrina",
        {
            "query_embedding": query_embedding,
            "match_count": top_k,
            "filter_novel_id": novel_id,
            "filter_user_id": user_id
        },
    ).execute()
