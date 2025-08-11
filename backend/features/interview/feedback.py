from fastapi import APIRouter, HTTPException, Depends
from schemas.interview_request import InterviewRequest
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
from utils.supabase_client import get_authenticated_sb
from features.auth.auth import get_current_user
from supabase import Client
from schemas.feedback import FeedbackRequest, FeedbackResponse

load_dotenv()

genai.configure(api_key=os.getenv("API_KEY"))

router = APIRouter()

@router.post("/response", response_model=FeedbackResponse)
async def response(request: FeedbackRequest, user: dict = Depends(get_current_user), sb: Client = Depends(get_authenticated_sb)):
    try:
        interview_id = request.interview_id
        question_number = request.question_number
        job_title = request.job_title
        question = request.question
        response = request.response

        prompt = f"""
            You are an expert interview coach and hiring manager with 15+ years of experience evaluating candidates across various industries. Your task is to provide comprehensive, constructive feedback on an interview response.

            **INTERVIEW CONTEXT:**
            - Job Title: {job_title}
            - Question: "{question}"
            - Candidate's Response: "{response}"

            **EVALUATION FRAMEWORK:**
            Analyze the response across three key dimensions:

            1. **Content Quality (1-10)**: Relevance, depth of knowledge, technical accuracy, use of examples, industry understanding
            2. **Clarity (1-10)**: Communication clarity, structure, logical flow, articulation, professional language
            3. **Completeness (1-10)**: Thoroughness in addressing the question, covering all aspects, providing sufficient detail

            **SCORING GUIDELINES:**
            - 9-10: Exceptional - Would impress senior hiring managers
            - 7-8: Strong - Solid response with minor improvements needed
            - 5-6: Average - Adequate but requires significant improvement
            - 3-4: Below Average - Major gaps in response quality
            - 1-2: Poor - Substantial rework needed

            Calculate the overall score as: (Content Quality × 0.4) + (Clarity × 0.3) + (Completeness × 0.3), then multiply by 10 and round to nearest integer.

            **IMPORTANT INSTRUCTIONS:**
            - Be honest but constructive in your feedback
            - Focus on actionable improvements
            - Provide specific examples when pointing out issues
            - Maintain a professional, encouraging tone
            - Provide exactly 3 improvement suggestions

            Analyze the response and return your evaluation.
                    """

        # Fixed schema definition
        model = genai.GenerativeModel(
            "gemini-2.0-flash-exp",
            generation_config={
                "response_mime_type": "application/json",
                "response_schema": {
                    "type": "OBJECT",  # Changed from ARRAY to OBJECT
                    "properties": {
                        "overall_score": {"type": "INTEGER"},
                        "content_quality": {"type": "NUMBER"},  # Changed to NUMBER for float support
                        "clarity": {"type": "NUMBER"},
                        "completeness": {"type": "NUMBER"},
                        "positive_feedback": {"type": "STRING"},
                        "negative_feedback": {"type": "STRING"},
                        "improvement_suggestions": {
                            "type": "ARRAY", 
                            "items": {"type": "STRING"}
                        }
                    },
                    "required": ["overall_score", "content_quality", "clarity", "completeness", 
                               "positive_feedback", "negative_feedback", "improvement_suggestions"]
                }
            }
        )

        feedback = model.generate_content(prompt)

        if feedback.text:
            feedback_json = json.loads(feedback.text)

            # Validate the response structure
            required_fields = ["overall_score", "content_quality", "clarity", "completeness", 
                             "positive_feedback", "negative_feedback", "improvement_suggestions"]
            
            for field in required_fields:
                if field not in feedback_json:
                    raise HTTPException(status_code=500, detail=f"Missing field in AI response: {field}")

            # Ensure scores are within valid ranges
            if not (0 <= feedback_json["overall_score"] <= 100):
                raise HTTPException(status_code=500, detail="Overall score out of range")
            
            for score_field in ["content_quality", "clarity", "completeness"]:
                if not (1 <= feedback_json[score_field] <= 10):
                    raise HTTPException(status_code=500, detail=f"{score_field} score out of range")

            data_to_insert = {
                "user_id": user.id,
                "interview_id": interview_id,
                "question": question,
                "question_number": question_number,
                "user_response": response,
                "job_title": job_title,
                "overall_score": feedback_json["overall_score"],
                "content_quality_score": feedback_json["content_quality"],
                "clarity_score": feedback_json["clarity"],
                "completeness_score": feedback_json["completeness"],
                "positive_feedback": feedback_json["positive_feedback"],
                "negative_feedback": feedback_json["negative_feedback"],
                "improvement_suggestions": feedback_json["improvement_suggestions"]
            }

            try:
                db_response = sb.table("feedback").insert(data_to_insert).execute()
                
                return FeedbackResponse(
                    overall_score=feedback_json["overall_score"],
                    content_quality=feedback_json["content_quality"],
                    clarity=feedback_json["clarity"],
                    completeness=feedback_json["completeness"],
                    positive_feedback=feedback_json["positive_feedback"],
                    negative_feedback=feedback_json["negative_feedback"],
                    improvement_suggestions=feedback_json["improvement_suggestions"]
                )
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

        else:
            raise HTTPException(status_code=500, detail="AI returned an empty response.")

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse AI response as JSON: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")