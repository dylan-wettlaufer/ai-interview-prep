from fastapi import APIRouter, Depends, HTTPException, status, Request, Cookie
from fastapi.security import OAuth2PasswordBearer
import os
from dotenv import load_dotenv
from utils.supabase_client import supabase
from schemas.auth import SignupRequest, LoginRequest, User
from datetime import datetime, timedelta
from fastapi.responses import JSONResponse
from supabase_auth.errors import AuthApiError
from utils.rate_limiter import check_rate_limit, login_limiter, signup_limiter
from utils.token_manager import token_manager
from pydantic import BaseModel

class RefreshTokenRequest(BaseModel):
    refresh_token: str

load_dotenv()

router = APIRouter()

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Authentication routes
@router.post("/signup")
async def signup(data: SignupRequest, request: Request):
    try:
        # Check rate limit
        check_rate_limit(request, signup_limiter, "signup")
        
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
        # Check rate limit
        check_rate_limit(request, login_limiter, "login")
        
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
        
        # Step 3: Create tokens using our token manager
        tokens = token_manager.create_tokens(
            user_id=str(login_response.user.id),
            remember_me=getattr(data, 'remember_me', False)
        )
        
        # Step 4: Set cookies with appropriate expiration
        response = JSONResponse(content={
            "message": "Login successful",
            "user": {
                "id": login_response.user.id,
                "email": login_response.user.email
            }
        })
        
        # Access token cookie (shorter expiration)
        response.set_cookie(
            key="access_token",
            value=tokens["access_token"],
            httponly=True,
            secure=False,  # Still using False for local testing
            samesite="Lax",
            max_age=tokens["access_expires_in"],
            path="/"
        )
        
        # Refresh token cookie (longer expiration)
        response.set_cookie(
            key="refresh_token",
            value=tokens["refresh_token"],
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=tokens["refresh_expires_in"],
            path="/"
        )
        
        print("Tokens were set on the response object.")
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

@router.post("/refresh")
async def refresh_token(data: RefreshTokenRequest, request: Request):
    """Refresh access token using refresh token"""
    try:
        # Verify the refresh token
        payload = token_manager.verify_refresh_token(data.refresh_token)
        
        # Create new tokens
        new_tokens = token_manager.create_tokens(
            user_id=payload["user_id"],
            remember_me=True  # If user has refresh token, they want extended session
        )
        
        response = JSONResponse(content={
            "message": "Token refreshed successfully",
            "access_token": new_tokens["access_token"],
            "expires_in": new_tokens["access_expires_in"]
        })
        
        # Update access token cookie
        response.set_cookie(
            key="access_token",
            value=new_tokens["access_token"],
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=new_tokens["access_expires_in"],
            path="/"
        )
        
        # Optionally rotate refresh token (more secure)
        response.set_cookie(
            key="refresh_token",
            value=new_tokens["refresh_token"],
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=new_tokens["refresh_expires_in"],
            path="/"
        )
        
        return response
        
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        print(f"Refresh token error: {e}")
        raise HTTPException(
            status_code=401,
            detail="Failed to refresh token. Please log in again."
        )

# And for a clean test, let's also update the logout route
@router.post("/logout")
async def logout():
    response = JSONResponse(content={"message": "Logged out"})
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
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
    access_token = request.cookies.get("access_token")
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        # Use our token manager to verify the access token
        payload = token_manager.verify_access_token(access_token)
        
        # Get user info from Supabase to ensure user still exists
        user_response = supabase.auth.get_user(access_token)
        if user_response and user_response.user:
            return user_response.user
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        # The token manager raises exceptions on invalid tokens
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

