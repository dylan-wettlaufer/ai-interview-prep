from pydantic import BaseModel, Field
from typing import Dict

class FeedbackRequest(BaseModel):
    interview_id: str = Field(..., description="The id of the interview")
    question_number: int = Field(..., description="The number of the question that was asked")
    question: str = Field(..., description="The interview question that was asked")
    response: str = Field(..., description="The user's transcribed response")
    job_title: str = Field(default="Software Engineer", description="The job title being interviewed for")


class FeedbackResponse(BaseModel):
    overall_score: int = Field(..., ge=0, le=100, description="Overall score out of 100")
    content_quality: float = Field(..., ge=0, le=100, description="Content quality score out of 100")
    clarity: float = Field(..., ge=0, le=100, description="Clarity score out of 100")
    completeness: float = Field(..., ge=0, le=100, description="Completeness score out of 100")
    positive_feedback: str
    negative_feedback: str
    improvement_suggestions: list[str]


class FeedbackItem(BaseModel):
    feedback: dict  # or create a specific feedback model
    response: str
    question_number: int

# Then create the response model for all feedback
class AllFeedbackResponse(BaseModel):
    feedback_by_question: Dict[str, FeedbackItem]