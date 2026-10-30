from supabase import AsyncClient, acreate_client
from dotenv import load_dotenv
import os

load_dotenv()

url: str = str(os.environ.get("SUPABASE_URL"))
public_key: str = str(os.environ.get("SUPABASE_PUBLIC_KEY"))

async def init_supabase() -> AsyncClient:
    """Initialize the Supabase client."""
    return await acreate_client(url, public_key)



async def fetch_novels(user_id: str):
    supabase = await init_supabase()
    return await (
        supabase.table("novels")
        .select("*")
        .eq("author_id", user_id)
        .execute()
    )


async def user_sign_up(email: str, password: str):
    supabase = await init_supabase()
    return await supabase.auth.sign_up({"email": email, "password": password})


async def user_sign_in(email: str, password: str):
    supabase = await init_supabase()
    return await supabase.auth.sign_in_with_password(
        {"email": email, "password": password}
    )


async def get_current_user():
    supabase = await init_supabase()
    return await supabase.auth.get_user()


async def logout():
    supabase = await init_supabase()
    return await supabase.auth.sign_out()


async def create_novel(novel_name: str):
    supabase = await init_supabase()
    author = await get_current_user()
    if not author.user:
        raise ValueError("Author isn't verified.")

    return await (
        supabase.table("novels")
        .insert({"novel_name": novel_name, "author_id": author.user.id})
        .execute()
    )


async def delete_novel(author_id: str, novel_id: str):
    supabase = await init_supabase()
    return await (
        supabase.table("novels")
        .delete()
        .eq("novel_id", novel_id)
        .eq("author_id", author_id)
        .execute()
    )


async def create_chapter(
    chapter_name: str,
    novel_id: str,
    content: str,
    max_tokens: int = 1000,
):
    supabase = await init_supabase()
    author = await get_current_user()
    if not author.user:
        raise ValueError("The author isn't verified.")

    is_novel = await (
        supabase.table("novels")
        .select("novel_id")
        .eq("novel_id", novel_id)
        .eq("author_id", author.user.id)
        .single()
        .execute()
    )
    if not is_novel.data:
        raise ValueError("The novel doesn't exist in the database.")

    from agent.agent import get_embeddings

    try:
        content_embedding = await get_embeddings(content)
    except Exception as e:
        raise RuntimeError(f"Failed to generate embedding: {e}") from e

    if not content_embedding:
        raise ValueError("Embedding generation returned an empty vector.")

    return await (
        supabase.table("chapters")
        .insert({
            "novel_id": novel_id,
            "chapter_name": chapter_name,
            "chapter_content": content,
            "chapter_content_embedding": content_embedding,
        })
        .execute()
    )


async def delete_chapter(novel_id: str, chapter_id: str):
    supabase = await init_supabase()
    return await (
        supabase.table("chapters")
        .delete()
        .eq("novel_id", novel_id)
        .eq("chapter_id", chapter_id)
        .execute()
    )


async def vector_search(novel_id: str, query: str, top_k: int = 3):
    supabase = await init_supabase()
    from agent.agent import get_embeddings

    query_embedding = await get_embeddings(query)
    return await supabase.rpc(
        "match_chapters",
        {
            "query_embedding": query_embedding,
            "match_count": top_k,
            "filter_novel_id": novel_id,
        },
    ).execute()

