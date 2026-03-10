from collections import defaultdict
from time import time
from fastapi import HTTPException, Request
from typing import Dict

class RateLimiter:
    def __init__(self, max_attempts: int = 5, window_seconds: int = 300):
        """
        Simple in-memory rate limiter
        
        Args:
            max_attempts: Maximum number of attempts allowed
            window_seconds: Time window in seconds
        """
        self.max_attempts = max_attempts
        self.window_seconds = window_seconds
        self.attempts: Dict[str, list] = defaultdict(list)
    
    def is_allowed(self, key: str) -> bool:
        """Check if the request is allowed"""
        now = time()
        
        # Remove old attempts outside the time window
        self.attempts[key] = [
            attempt_time for attempt_time in self.attempts[key] 
            if now - attempt_time < self.window_seconds
        ]
        
        # Check if under the limit
        if len(self.attempts[key]) < self.max_attempts:
            self.attempts[key].append(now)
            return True
        
        return False
    
    def get_remaining_attempts(self, key: str) -> int:
        """Get remaining attempts"""
        now = time()
        
        # Clean old attempts
        self.attempts[key] = [
            attempt_time for attempt_time in self.attempts[key] 
            if now - attempt_time < self.window_seconds
        ]
        
        return max(0, self.max_attempts - len(self.attempts[key]))

# Global rate limiter instances
login_limiter = RateLimiter(max_attempts=5, window_seconds=300)  # 5 attempts per 5 minutes
signup_limiter = RateLimiter(max_attempts=3, window_seconds=300)  # 3 attempts per 5 minutes

def get_client_key(request: Request) -> str:
    """Get client identifier for rate limiting"""
    # Use IP address as the key
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip
    
    return request.client.host if request.client else "unknown"

def check_rate_limit(request: Request, limiter: RateLimiter, action: str):
    """Check rate limit and raise exception if exceeded"""
    client_key = f"{action}:{get_client_key(request)}"
    
    if not limiter.is_allowed(client_key):
        remaining = limiter.get_remaining_attempts(client_key)
        raise HTTPException(
            status_code=429,
            detail=f"Too many {action} attempts. Please try again later.",
            headers={
                "Retry-After": str(limiter.window_seconds),
                "X-RateLimit-Limit": str(limiter.max_attempts),
                "X-RateLimit-Remaining": str(remaining),
                "X-RateLimit-Reset": str(int(time()) + limiter.window_seconds)
            }
        )
