from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
import os
from dotenv import load_dotenv
from utils.supabase_client import supabase
from schemas.auth import SignupRequest, LoginRequest, User
from datetime import datetime, timedelta
from fastapi.responses import JSONResponse
from supabase_auth.errors import AuthApiError
from utils.rate_limiter import check_rate_limit, login_limiter, signup_limiter

load_dotenv()

router = APIRouter()

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET")
SECURE_COOKIES = os.getenv("SECURE_COOKIES", "false").lower() == "true"

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(request: Request):
    """
    Dependency to get the current user by verifying the JWT from the cookie.
    Raises an HTTPException if the token is invalid or missing.
    """
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        # Use Supabase's get_user method to verify the JWT and get user info.
        # This is the key to using auth.uid in RLS.
        user_response = supabase.auth.get_user(token)
        if user_response and user_response.user:
            return user_response.user
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except Exception as e:
        # The Supabase client raises exceptions on invalid tokens
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Authentication routes
@router.post("/signup")
async def signup(data: SignupRequest, request: Request):
    try:
        # Check rate limit by IP and Email
        check_rate_limit(request, signup_limiter, "signup", str(data.email))
        
        # Step 1: Sign up with Supabase Auth
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
                detail="Signup failed: Could not create user account."
            )

        # Step 2: Create user profile in 'user' table
        try:
            supabase.table("user").insert({
                "id": response.user.id,
                "first_name": data.first_name,
                "last_name": data.last_name,
                "email": data.email
            }).execute()
        except Exception as db_e:
            # If inserting the profile fails (e.g., duplicate email in public.user)
            # but auth.user was created, we should ideally handle this.
            # If it's a duplicate, it's a 400, otherwise 500
            if "duplicate key" in str(db_e).lower():
                raise HTTPException(status_code=400, detail="An account with this email already exists.")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to create user profile: {str(db_e)}"
            )
        
        # Step 3: Check if we have a session (confirmation might be OFF)
        # If confirmation is OFF, we log them in immediately
        if response.session:
            access_token = response.session.access_token
            res = JSONResponse(content={
                "message": "Signup successful! You have been logged in.",
                "user": {
                    "id": response.user.id,
                    "email": response.user.email,
                    "first_name": data.first_name,
                    "last_name": data.last_name
                },
                "email_confirmed": True
            })
            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,
                samesite="none",  # must be lowercase "none"
                domain=".ai-interview-prep-beta-smoky.vercel.app",
                max_age=3600,
                path="/"
            )
            return res
            
        return {
            "message": "Signup successful!", 
            "user": {
                "id": response.user.id,
                "email": response.user.email,
                "first_name": data.first_name,
                "last_name": data.last_name
            },
            "email_confirmed": True
        }
    
    except AuthApiError as e:
        # Specific errors like weak password or user already exists
        detail = str(e)
        if "User already registered" in detail:
            detail = "An account with this email already exists."
        elif "Password is too short" in detail:
            detail = "Password must be at least 6 characters."
            
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during signup. Please try again."
        )

@router.post("/login")
async def login(data: LoginRequest, request: Request):
    try:
        # Check rate limit by IP and Email
        check_rate_limit(request, login_limiter, "login", data.email)
        
        # Step 1: Call Supabase to authenticate
        login_response = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password
        })
        
        # Step 2: Check if authentication was successful
        if login_response.user is None:
            raise HTTPException(status_code=400, detail="The email or password you entered is incorrect. Please check your credentials and try again.")

        
        # Step 3: Create a JWT and set the cookie
        access_token = login_response.session.access_token
        
        user_metadata = login_response.user.user_metadata if hasattr(login_response.user, 'user_metadata') else {}

        response = JSONResponse(content={
            "message": "Login successful",
            "user": {
                "id": login_response.user.id,
                "email": login_response.user.email,
                "first_name": user_metadata.get("first_name", ""),
                "last_name": user_metadata.get("last_name", "")
            }
        })
        # In auth.py, login endpoint (lines 188-196)
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=True,  # Always true in production
            samesite="none",  # Required for cross-domain
            domain=".ai-interview-prep-beta-smoky.vercel.app",
            max_age=3600,
            path="/"
        )
        
        return response
        
    except AuthApiError as e:
        if "Invalid login credentials" in str(e):
            raise HTTPException(
                status_code=400, 
                detail="The email or password you entered is incorrect. Please check your credentials and try again."
            )
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Authentication failed: {str(e)}"
            )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred during login. Please try again."
        )

# And for a clean test, let's also update the logout route
@router.post("/logout")
async def logout():
    response = JSONResponse(content={"message": "Logged out"})
    response.delete_cookie("access_token", path="/")
    return response

@router.get("/user")
async def get_user(current_user: dict = Depends(get_current_user)):
    return current_user

@router.get("/protected")
async def protected_route(current_user: dict = Depends(get_current_user)):
    return {
        "message": "This is a protected route!",
        "user_email": current_user.email,
        "user_uid": current_user.id
    }
