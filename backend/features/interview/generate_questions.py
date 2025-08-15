from fastapi import APIRouter, HTTPException, Depends, status
from schemas.interview_request import InterviewRequest, JobInput
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
from utils.supabase_client import get_authenticated_sb
from features.auth.auth import get_current_user
from supabase import Client
from datetime import datetime
from typing import Dict
import re
import random


load_dotenv()

genai.configure(api_key=os.getenv("API_KEY")) # get api key

router = APIRouter()

STATIC_QUESTIONS = {
    "Software Engineering": [
        "Explain the difference between a stack and a queue.",
        "How would you design a URL shortening service like Bitly?",
        "What is the time complexity of quicksort in the average and worst case?",
        "Explain the concept of Big-O notation with examples.",
        "How does garbage collection work in Java or C#?",
        "Describe the difference between multithreading and multiprocessing.",
        "What is the purpose of dependency injection?",
        "How would you debug a memory leak in a production environment?",
        "Explain the CAP theorem and its implications for distributed systems.",
        "What’s the difference between REST and GraphQL APIs?"
    ],
    "Data Science": [
        "Explain the difference between supervised and unsupervised learning.",
        "How would you handle missing data in a dataset?",
        "What is regularization in machine learning and why is it important?",
        "Describe the bias-variance tradeoff.",
        "When would you use a decision tree over logistic regression?",
        "Explain the difference between precision and recall.",
        "What is overfitting, and how can it be prevented?",
        "How would you approach feature selection for a predictive model?",
        "What are some common distance metrics used in clustering?",
        "Explain the difference between bagging and boosting."
    ],
    "Product Management": [
        "How would you prioritize features for a new product launch?",
        "Describe a time you had to make a trade-off between speed and quality.",
        "How do you define a product's success metrics?",
        "How would you handle conflicting feedback from stakeholders?",
        "Describe how you would gather user requirements for a new product.",
        "What’s your process for validating a product idea?",
        "How would you approach building a product roadmap?",
        "Explain the concept of Minimum Viable Product (MVP).",
        "What’s your approach to managing product risks?",
        "How do you handle scope creep during a project?"
    ],
    "UX/UI Design": [
        "Describe the difference between UX and UI design.",
        "How would you conduct a usability test?",
        "What’s your process for creating a wireframe?",
        "How do you ensure accessibility in your designs?",
        "Explain the importance of design systems.",
        "What’s your approach to user persona creation?",
        "How would you redesign a popular app to improve usability?",
        "Describe the importance of visual hierarchy in design.",
        "How do you use color theory in interface design?",
        "What’s the difference between responsive and adaptive design?"
    ],
    "Marketing": [
        "How would you measure the ROI of a marketing campaign?",
        "Describe a successful campaign you’ve worked on and why it worked.",
        "What’s the difference between inbound and outbound marketing?",
        "How would you conduct market segmentation?",
        "What’s your approach to A/B testing?",
        "How would you launch a new product in a competitive market?",
        "Explain the concept of a marketing funnel.",
        "How would you approach influencer marketing for a niche audience?",
        "What’s your process for creating a content marketing strategy?",
        "How do you optimize a website for search engines?"
    ],
    "Cybersecurity": [
        "Explain the principle of least privilege.",
        "What is the difference between symmetric and asymmetric encryption?",
        "How would you secure an API from unauthorized access?",
        "What are some common types of phishing attacks?",
        "Explain the concept of a zero-trust security model.",
        "How would you detect and respond to a DDoS attack?",
        "What’s the difference between hashing and encryption?",
        "Describe how multi-factor authentication works.",
        "How do you secure sensitive data at rest and in transit?",
        "What’s the difference between vulnerability assessment and penetration testing?"
    ],
    "Mobile Development": [
        "What’s the difference between native and cross-platform development?",
        "How would you optimize a mobile app for performance?",
        "Explain the Android activity lifecycle.",
        "What’s your process for handling offline data synchronization?",
        "How would you secure sensitive data in a mobile app?",
        "Describe the difference between Swift and Objective-C for iOS development.",
        "How do you handle push notifications in iOS and Android?",
        "What’s your approach to responsive UI design for multiple devices?",
        "How would you implement in-app purchases?",
        "Explain how you would debug a crash reported by users."
    ],
    "Web Development": [
        "What’s the difference between client-side and server-side rendering?",
        "Explain the concept of a Single Page Application (SPA).",
        "How would you optimize a website for faster load times?",
        "What’s the difference between SQL and NoSQL databases?",
        "Explain the concept of middleware in web frameworks.",
        "How do you handle authentication and authorization in a web app?",
        "What’s the difference between GET and POST requests?",
        "How would you implement responsive web design?",
        "What’s your approach to preventing XSS attacks?",
        "Explain the differences between REST and WebSockets."
    ],
    "default": [
        "Tell me about yourself.",
        "How would you handle conflict with a coworker?",
        "Why do you want to work for this company?",
        "What would you consider to be your greatest weaknesses?",
        "Where do you see yourself in the next 5 years?",
        "What would you consider to be your 3 greatest strengths?",
        "Describe a time when you worked in a team to accomplish a goal.",
        "How do you prioritize tasks when you have multiple deadlines?",
        "Tell me about a time you overcame a significant challenge.",
        "Why should we hire you over other candidates?"
    ]
}


GENERIC_TITLES = {"worker", "employee", "assistant", "staff", "team member", "cashier"}
TITLE_KEYWORDS = {"developer", "engineer", "designer", "analyst", "manager", "technician",  "nurse", "intern", "associate"}
DESCRIPTION_KEYWORDS = {
    "develop", "design", "analyze", "manage", "implement", "collaborate", "lead",
    "customer", "sales", "support", "troubleshoot", "optimize", "research",
    "data", "programming", "code", "debug", "test"
}

def use_ai_api(job_title: str, job_description: str):
    """
    Calculate a weighted score for AI question generation.
    Both title and description must meet minimum quality thresholds.
    """

    title_weight = 2.0           # Title relevance counts more
    description_length_weight = 0.5
    keyword_weight = 1.0
    diversity_weight = 0.5
    generic_penalty = 2.0

    title = job_title.strip().lower()
    desc = job_description.strip().lower()

    if check_for_gibberish(title) or check_for_gibberish(desc):
        return 0

    # Reject too short description
    if len(desc.split()) < 10:
        return 0

    # ---- Title Score ----
    title_score = 0.0

    if len(title) >= 25:
        title_score += 1 * title_weight
    elif len(title) >= 15:
        title_score += 0.5 * title_weight

    if any(g in title for g in GENERIC_TITLES):
        title_score -= generic_penalty

    if any(k in title for k in TITLE_KEYWORDS):
        title_score += 1 * keyword_weight

    if len(title.split()) > 2:
        title_score += 0.5

    # ---- Description Score ----
    desc_score = 0.0

    if len(desc) >= 150:
        desc_score += 2 * description_length_weight
    elif len(desc) >= 100:
        desc_score += 1 * description_length_weight
    elif len(desc) >= 50:
        desc_score += 0.5 * description_length_weight
    elif len(desc) < 50:
        desc_score -= 2 * description_length_weight

    keyword_hits = sum(1 for kw in DESCRIPTION_KEYWORDS if kw in desc)
    desc_score += min(keyword_hits, 2) * keyword_weight

    diversity = vocabulary_diversity(desc)
    if diversity >= 0.8:
        desc_score += 1 * diversity_weight
    elif diversity >= 0.5:
        desc_score += 0.5 * diversity_weight
    else:
        desc_score -= 2 * diversity_weight  # Penalize low diversity

    # ---- Minimum thresholds ----
    MIN_TITLE_SCORE = 2.0
    MIN_DESC_SCORE = 2.0

    print("Title score: ", title_score)
    print("Description score: ", desc_score)

    if title_score < MIN_TITLE_SCORE or desc_score < MIN_DESC_SCORE:
        return 0  # Fail if either is below threshold

    total_score = title_score + desc_score
    return total_score


    
def check_for_gibberish(text: str):
    if not text:
        return True

    # Regex to detect a single character repeated more than 5 times consecutively
    if re.search(r'(.)\1{5,}', text):
        return True

    if len(set(text.lower())) < 5:  # very low character diversity
        return True
    
    # Regex to detect a repeating pattern of 2 or 3 characters (e.g., 'ababab')
    if re.search(r'(.{2})\1{2,}', text):
        return True

    # Regex to detect a high density of non-alphanumeric characters or spaces.
    # If more than 50% of the text is non-alphanumeric, it's likely gibberish.
    non_alpha_chars = len(re.findall(r'[^a-zA-Z0-9\s]', text))
    if non_alpha_chars / len(text) > 0.5:
        return True

    return False

def vocabulary_diversity(text: str) -> float:
    words = re.findall(r"\b\w+\b", text.lower())
    if not words:
        return 0
    unique_words = set(words)
    return len(unique_words) / len(words)


async def genrate_ai_questions(job_title: str, job_description: str, interview_type: str, difficulty_level: str):
    prompt =  f"Generate three interview questions for the role: {job_title}. Job description: {job_description}. Interview type: {interview_type}. Difficulty level: {difficulty_level}. Do not include questions like 'Do you have any questions for us?'"
    
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
        
        if response.text:
            questions_json = json.loads(response.text)
            return questions_json
        else:
            raise HTTPException(status_code=500, detail="API returned an empty response.")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# select 3 random questions from the static questions
def get_predefined_questions(job_title: str):
    job_title = job_title.strip()
    if job_title in STATIC_QUESTIONS:
        return random.sample(STATIC_QUESTIONS[job_title], 3)
    else:
        return random.sample(STATIC_QUESTIONS["default"], 3)


@router.post("/generate")
async def generate_custom_questions(request: JobInput, user: dict = Depends(get_current_user), sb: Client = Depends(get_authenticated_sb)):
    job_title = request.jobTitle
    job_description = request.jobDescription
    interview_type = request.interviewType
    difficulty_level = request.difficultyLevel
    interview_source = request.interviewSource

    if interview_source == "Category":
        print("Using predefined questions")
        questions = get_predefined_questions(job_title)
       
    else:
        score = use_ai_api(job_title, job_description)
        if score < 5:
            questions = get_predefined_questions(job_title)
            interview_source = "Category"
            print("Using predefined questions, score too low: ", score)
        else:
            questions = await genrate_ai_questions(job_title, job_description, interview_type, difficulty_level)
            print("Using AI questions, score: ", score)

    try:
        data_to_insert = {
            "user_id": user.id,
            "job_type": job_title,
            "job_description": job_description,
            "interview_type": interview_type,
            "interview_source": interview_source,
            "difficulty_level": difficulty_level,
            "questions": questions
        }
        
        response = sb.table("interview").insert(data_to_insert).execute()

        interview_id = response.data[0]['id'] if response.data else None
        return {"questions": questions, "interview_id": interview_id}

    except Exception as db_e:
        print("Error storing data in Supabase:", db_e)
        # We can still return the questions even if the DB insert fails
        return {"questions": questions, "message": "Failed to save to database."}


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