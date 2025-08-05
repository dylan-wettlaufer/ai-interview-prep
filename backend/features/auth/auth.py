from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import os
from dotenv import load_dotenv
from jose import JWTError, jwt
from utils.supabase_client import supabase
from schemas.auth import SignupRequest, LoginRequest, User
from datetime import datetime, timedelta
from fastapi.responses import JSONResponse

load_dotenv()

router = APIRouter()

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Authentication routes
@router.post("/signup")
async def signup(data: SignupRequest):
    try:
        
        response = supabase.auth.sign_up({
            "email": data.email,
            "password": data.password,
            "options": {
                "data": {
                    "first_name": data.first_name,
                    "last_name": data.last_name
                }
            }
        })
        
        
        if response.user is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Signup failed: No user created"
            )

        supabase.table("user").insert({
            "id": response.user.id,
            "first_name": data.first_name,
            "last_name": data.last_name,
            "email": data.email
        }).execute()
        
        return {
            "message": "User signed up successfully", 
            "user_id": response.user.id,
            "email_confirmed": response.user.email_confirmed_at is not None
        }
    
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/login")
async def login(data: LoginRequest):
    print("--- Starting login process ---")
    print(f"Attempting login for email: {data.email}")

    # Step 1: Call Supabase to authenticate
    login_response = supabase.auth.sign_in_with_password({
        "email": data.email,
        "password": data.password
    })
    print(f"Supabase login response received.")
    
    # Step 2: Check if authentication was successful
    if login_response.user is None:
        print("Login FAILED. Supabase did not return a user object.")
        # We're raising an exception here, so the next lines will never run.
        raise HTTPException(status_code=400, detail="Invalid credentials")

    print(f"Login SUCCESSFUL! User ID: {login_response.user.id}")
    
    # Step 3: Create a JWT and set the cookie
    access_token = create_access_token(login_response.user.id)
    
    response = JSONResponse(content={"message": "Login successful"})
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,  # Still using False for local testing
        samesite="Lax",
        max_age=3600,
        path="/"
    )
    print("Cookie was set on the response object.")
    
    print("--- Login process complete ---")
    return response

# And for a clean test, let's also update the logout route
@router.post("/logout")
async def logout():
    response = JSONResponse(content={"message": "Logged out"})
    response.delete_cookie("access_token", path="/")
    return response

@router.get("/user")
async def get_user():
    response = supabase.auth.get_user()
    return response

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # Query the database to get the full user object
    try:
        print("hi")
        response = supabase.table("user").select("*").eq("id", user_id).execute()
        user_data = response.data[0]
        
        if user_data is None:
            raise credentials_exception
        
        # Return the Pydantic User model
        return User(**user_data)
        
    except Exception:
        raise credentials_exception

def create_access_token(user_id: str):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": user_id,
        "exp": expire
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

@router.get("/protected")
async def protected_route(current_user: User = Depends(get_current_user)):
    return {"message": f"Hello {current_user}, this is a protected route!"}

