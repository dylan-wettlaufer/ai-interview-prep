from fastapi import APIRouter, HTTPException, Depends, status
from schemas.interview_request import InterviewRequest
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
from utils.supabase_client import get_authenticated_sb
from features.auth.auth import get_current_user
from supabase import Client
from datetime import datetime
from typing import Dict


load_dotenv()

genai.configure(api_key=os.getenv("API_KEY")) # get api key

router = APIRouter()

@router.post("/test")
async def test(request: InterviewRequest, user: dict = Depends(get_current_user), sb: Client = Depends(get_authenticated_sb)):
    try:

        # Rest of your existing code
        data_to_insert = {
            "user_id": user.id,
            "job_type": request.jobType,
            "interview_type": request.interviewType,
            "interview_source": "Basic",
        }
        
        response = sb.table("interview").insert(data_to_insert).execute()
        
        return {"message": "Interview created successfully", "interview_id": response.data[0]['id']}
    
    except Exception as e:
        print(f"Insertion Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create interview")
    

@router.post("/generate-questions")
async def generate_questions(request: InterviewRequest, user: dict = Depends(get_current_user), sb: Client = Depends(get_authenticated_sb)):

    job = request.jobType
    interview = request.interviewType

    # The text prompt is now simpler, as the schema will enforce the format.
    prompt = f"Generate 3 {interview} interview questions for a {job} role. Do not include questions like 'Do you have any questions for us?'"
    
    try:
        model = genai.GenerativeModel(
            "gemini-2.5-flash-preview-05-20",  # Using the same model as the frontend
            generation_config={
                "response_mime_type": "application/json",
                "response_schema": {
                    "type": "ARRAY",
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "question": {"type": "STRING"}
                        }
                    }
                }
            }
        )
        
        response = model.generate_content(prompt)
        
        # The response.text is now guaranteed to be a valid JSON string.
        # We can parse it directly without any manual string manipulation.
        if response.text:
            questions_json = json.loads(response.text)
            

            try:
                data_to_insert = {
                    "user_id": user.id,
                    "job_type": request.jobType,
                    "interview_type": request.interviewType,
                    "interview_source": "Basic",
                    "questions": questions_json
                }
                
                response = sb.table("interview").insert(data_to_insert).execute()

                interview_id = response.data[0]['id'] if response.data else None
                return {"questions": questions_json, "interview_id": interview_id}

            except Exception as db_e:
                print("Error storing data in Supabase:", db_e)
                # We can still return the questions even if the DB insert fails
                return {"questions": questions_json, "message": "Failed to save to database."}
            

        else: # if no questions were generated
            raise HTTPException(status_code=500, detail="API returned an empty response.")

    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Failed to generate questions.")


        

@router.get("/interview/{interview_id}")
async def get_interview(interview_id: str, user: dict = Depends(get_current_user), sb: Client = Depends(get_authenticated_sb)):
    try:
        response = sb.table("interview").select("*").eq("id", interview_id).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/interview/{interview_id}/complete", response_model=Dict)
async def mark_interview_complete(
    interview_id: str,
    db: Client = Depends(get_authenticated_sb),
    current_user = Depends(get_current_user)
):
    """
    Mark an interview as completed.
    """
    # 1. First, check if the interview exists and is not already completed
    try:
        response = db.table("interview").select("completed").eq("id", interview_id).limit(1).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Interview not found"
            )

        interview_data = response.data[0]
        if interview_data['completed']:
            return {"message": "Interview was already marked as complete", "interview_id": interview_id}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error checking interview status: {str(e)}"
        )

    # 2. If it exists and isn't completed, perform the update
    try:
        data_to_update = {
            "completed": True,
            "completed_at": datetime.now().isoformat()  # Use ISO format for Supabase
        }
        
        updated_response = db.table("interview").update(data_to_update).eq("id", interview_id).execute()
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating interview: {str(e)}"
        )
    
    return {
        "message": "Interview marked as complete",
        "interview_id": interview_id,
        "completed": True,
        "updated_at": data_to_update['completed_at']
    }