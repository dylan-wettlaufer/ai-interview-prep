from pydantic import BaseModel, Field, EmailStr
from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional

class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")
    first_name: str = Field(..., min_length=1)
    last_name: str = Field(..., min_length=1)


class LoginRequest(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    first_name: str
    last_name: str
    email: str
    token: Optional[str] = None
    