from fastapi import FastAPI
from features.auth.auth import router as auth_router
from utils.supabase_client import supabase


app = FastAPI()

# Include auth routes with /auth prefix
app.include_router(auth_router, prefix="/auth")

@app.get("/")
async def root():
    # Example: fetch rows from 'destinations' table
    response = supabase.table("user").select("*").execute()
    return {"data": response.data}