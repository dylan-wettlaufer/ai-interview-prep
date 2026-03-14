import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request

load_dotenv()

# Environment variable validation
REQUIRED_ENV_VARS = ["SUPABASE_URL", "SUPABASE_KEY", "JWT_SECRET", "API_KEY"]
missing_vars = [var for var in REQUIRED_ENV_VARS if not os.getenv(var)]
if missing_vars:
    raise RuntimeError(f"Missing required environment variables: {', '.join(missing_vars)}")

from features.auth.auth import router as auth_router
from features.interview.generate_questions import router as generate_questions_router
from features.interview.feedback import router as feedback_router
from features.interview.interview import router as interview_router
from utils.supabase_client import supabase
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://ai-interview-prep-beta-smoky.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include auth routes with /auth prefix
app.include_router(auth_router, prefix="/auth")
app.include_router(generate_questions_router, prefix="/gen-ai")
app.include_router(feedback_router, prefix="/feedback-ai")
app.include_router(interview_router, prefix="/data")

@app.get("/")
async def root():
    # Example: fetch rows from 'destinations' table
    response = supabase.table("user").select("*").execute()
    return {"data": response.data}