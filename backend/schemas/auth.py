from pydantic import BaseModel

class SignupRequest(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str