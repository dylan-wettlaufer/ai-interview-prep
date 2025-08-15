from pydantic import BaseModel

class InterviewRequest(BaseModel):
    jobType: str
    interviewType: str


class CustomInterviewRequest(BaseModel):
    jobTitle: str
    jobDescription: str
    skillLevel: str

class JobInput(BaseModel):
    jobTitle: str
    jobDescription: str
    interviewType: str
    difficultyLevel: str
    interviewSource: str