from fastapi import FastAPI
from dotenv import load_dotenv
from supabase import create_client, Client
from auth import router as auth_router

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()

# Include auth routes with /auth prefix
app.include_router(auth_router, prefix="/auth")

@app.get("/")
async def root():
    # Example: fetch rows from 'destinations' table
    response = supabase.table("user").select("*").execute()
    return {"data": response.data}