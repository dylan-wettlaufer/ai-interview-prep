from fastapi import FastAPI
from features.auth.auth import router as auth_router
from features.generate_questions.generate_questions import router as generate_questions_router
from utils.supabase_client import supabase
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:3000"   
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include auth routes with /auth prefix
app.include_router(auth_router, prefix="/auth")
app.include_router(generate_questions_router, prefix="/gen-ai")

@app.get("/")
async def root():
    # Example: fetch rows from 'destinations' table
    response = supabase.table("user").select("*").execute()
    return {"data": response.data}