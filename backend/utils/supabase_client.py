import os
from dotenv import load_dotenv
from supabase import create_client, Client
from fastapi import HTTPException, Request

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def get_authenticated_sb(request: Request):
    """Provides a fresh Supabase client per request."""
    access_token = request.cookies.get("access_token")
    if not access_token:
        raise HTTPException(401, "Not authenticated")
    
    sb = create_client(SUPABASE_URL, SUPABASE_KEY)
    sb.auth.set_session(access_token=access_token, refresh_token="")  # Authenticate for this request only
    return sb