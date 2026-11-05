from database import init_supabase
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def verify_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify the user using the provided token from the Authorization header."""
    token = credentials.credentials
    try:
        supabase = await init_supabase()
        response = await supabase.auth.get_user(token)
        print(f"User verified: {response.user}")
        return response.user
    except Exception as e:
        print(f"User verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
