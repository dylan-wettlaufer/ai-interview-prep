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

if not SECRET_KEY:
    print("WARNING: JWT_SECRET is not set in environment variables.")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Authentication routes
@router.post("/signup")
async def signup(data: SignupRequest, request: Request):
    try:
        # Check rate limit by IP and Email
        check_rate_limit(request, signup_limiter, "signup", data.email)
        
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
async def login(data: LoginRequest, request: Request):
    print("--- Starting login process ---")
    print(f"Attempting login for email: {data.email}")

    try:
        # Check rate limit by IP and Email
        check_rate_limit(request, login_limiter, "login", data.email)
        
        # Step 1: Call Supabase to authenticate
        login_response = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password
        })
        print(f"Supabase login response received.")
        
        # Step 2: Check if authentication was successful
        if login_response.user is None:
            print("Login FAILED. Supabase did not return a user object.")
            raise HTTPException(status_code=400, detail="The email or password you entered is incorrect. Please check your credentials and try again.")

        print(f"Login SUCCESSFUL! User ID: {login_response.user.id}")
        
        # Step 3: Create a JWT and set the cookie
        access_token = login_response.session.access_token
        
        response = JSONResponse(content={"message": "Login successful"})
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=SECURE_COOKIES, 
            samesite="Lax",
            max_age=3600,
            path="/"
        )
        print(f"Cookie was set on the response object. Secure: {SECURE_COOKIES}")
        
        print("--- Login process complete ---")
        return response
        
    except AuthApiError as e:
        print(f"Supabase Auth Error: {e}")
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
        print(f"Unexpected error during login: {e}")
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
async def get_user():
    response = supabase.auth.get_user()
    return response

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
        print(f"Token verification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.get("/protected")
async def protected_route(current_user: dict = Depends(get_current_user)):
    return {
        "message": "This is a protected route!",
        "user_email": current_user.email,
        "user_uid": current_user.id
    }

