from fastapi import APIRouter, HTTPException, Depends, status
from supabase import Client
from utils.supabase_client import get_authenticated_sb
from features.auth.auth import get_current_user

router = APIRouter()


@router.get("/interviews/summary")
async def get_interviews_summary(user: dict = Depends(get_current_user), sb: Client = Depends(get_authenticated_sb)):
    """Get quick summary stats - for dashboard overview"""
    try:
        # Get counts only, no detailed data
        all_interviews = sb.table("interview").select("id, completed").eq("user_id", user.id).execute()
        
        completed_count = sum(1 for i in all_interviews.data if i.get('completed'))
        in_progress_count = len(all_interviews.data) - completed_count
        
        return {
            "total_interviews": len(all_interviews.data),
            "completed_count": completed_count,
            "in_progress_count": in_progress_count,
            "completion_rate": round((completed_count / len(all_interviews.data)) * 100) if all_interviews.data else 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/interviews/in-progress")
async def get_in_progress_interviews(user: dict = Depends(get_current_user), sb: Client = Depends(get_authenticated_sb)):
    """Get only in-progress interviews - for dashboard"""
    try:
        interviews_response = sb.table("interview").select("id, job_type, interview_type, interview_source, difficulty_level, completed").eq("user_id", user.id).eq("completed", False).execute()
        
        if not interviews_response.data:
            return {"data": [], "count": 0}
        
        # Get feedback for in-progress interviews
        interview_ids = [interview['id'] for interview in interviews_response.data]
        feedback_response = sb.table("feedback").select("id, interview_id").in_("interview_id", interview_ids).execute()
        
        # Process and return with progress calculations
        processed_interviews = process_interviews_with_progress(interviews_response.data, feedback_response.data)
        
        return {
            "data": processed_interviews,
            "count": len(processed_interviews)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



def process_interviews_with_progress(interviews, feedback_data):
    """Helper function to process interviews with progress calculations"""
    # Group feedback by interview_id
    feedback_by_interview = {}
    for feedback in feedback_data:
        interview_id = feedback['interview_id']
        if interview_id not in feedback_by_interview:
            feedback_by_interview[interview_id] = []
        feedback_by_interview[interview_id].append(feedback)
    
    processed = []
    for interview in interviews:
        interview_id = interview['id']
        interview_feedback = feedback_by_interview.get(interview_id, [])
        
        total_questions = interview.get('total_questions', 3)
        answered_questions = len(interview_feedback)
        progress_percentage = round((answered_questions / total_questions) * 100) if total_questions > 0 else 0
        
        processed.append({
            "interview": interview,
            "feedback": interview_feedback,
            "progress": {
                "answered_questions": answered_questions,
                "total_questions": total_questions,
                "progress_percentage": progress_percentage,
                "estimated_remaining_time": (total_questions - answered_questions) * 3
            }
        })
    
    return processed