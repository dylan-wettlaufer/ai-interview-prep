from pydantic import BaseModel

class InterviewRequest(BaseModel):
    jobType: str
    interviewType: str


class CustomInterviewRequest(BaseModel):
    jobTitle: str
    jobDescription: str
    skillLevel: str
