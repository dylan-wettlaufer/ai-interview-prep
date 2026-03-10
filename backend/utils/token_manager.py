import jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from typing import Optional, Dict, Any
import os

class TokenManager:
    def __init__(self):
        self.SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key")
        self.ALGORITHM = "HS256"
        
    def create_tokens(self, user_id: str, remember_me: bool = False) -> Dict[str, Any]:
        """Create access and refresh tokens"""
        now = datetime.utcnow()
        
        # Access token (short-lived)
        access_expire = now + timedelta(hours=1 if remember_me else timedelta(minutes=30))
        access_payload = {
            "user_id": user_id,
            "exp": access_expire,
            "type": "access"
        }
        access_token = jwt.encode(access_payload, self.SECRET_KEY, algorithm=self.ALGORITHM)
        
        # Refresh token (long-lived)
        refresh_expire = now + timedelta(days=30 if remember_me else timedelta(days=7))
        refresh_payload = {
            "user_id": user_id,
            "exp": refresh_expire,
            "type": "refresh",
            "jti": f"refresh_{user_id}_{int(now.timestamp())}"  # Unique identifier
        }
        refresh_token = jwt.encode(refresh_payload, self.SECRET_KEY, algorithm=self.ALGORITHM)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "access_expires_in": int((access_expire - now).total_seconds()),
            "refresh_expires_in": int((refresh_expire - now).total_seconds()),
            "remember_me": remember_me
        }
    
    def verify_access_token(self, token: str) -> Dict[str, Any]:
        """Verify and decode access token"""
        try:
            payload = jwt.decode(token, self.SECRET_KEY, algorithms=[self.ALGORITHM])
            if payload.get("type") != "access":
                raise ValueError("Invalid token type")
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Access token expired"
            )
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid access token"
            )
    
    def verify_refresh_token(self, token: str) -> Dict[str, Any]:
        """Verify and decode refresh token"""
        try:
            payload = jwt.decode(token, self.SECRET_KEY, algorithms=[self.ALGORITHM])
            if payload.get("type") != "refresh":
                raise ValueError("Invalid token type")
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token expired"
            )
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )

# Global token manager instance
token_manager = TokenManager()
