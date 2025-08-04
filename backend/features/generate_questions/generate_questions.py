from fastapi import APIRouter, HTTPException
from schemas.interview_request import InterviewRequest
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json

load_dotenv()

genai.configure(api_key=os.getenv("API_KEY"))

router = APIRouter()

@router.post("/generate-questions")
async def generate_questions(request: InterviewRequest):

    job = request.jobType
    interview = request.interviewType

    # The text prompt is now simpler, as the schema will enforce the format.
    prompt = f"Generate 5 {interview} interview questions for a {job} role."
    
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
            return {"questions": questions_json}
        else:
            raise HTTPException(status_code=500, detail="API returned an empty response.")

    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Failed to generate questions.")


        

