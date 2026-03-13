from collections import defaultdict
from time import time
from fastapi import HTTPException, Request
from typing import Dict
import os

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
        self.attempts: Dict[str, list] = {}
        self.last_cleanup = time()
    
    def _cleanup(self):
        """Periodically remove all expired entries from memory"""
        now = time()
        if now - self.last_cleanup < 600: # Cleanup every 10 minutes
            return
            
        keys_to_delete = []
        for key, attempt_times in self.attempts.items():
            valid_attempts = [t for t in attempt_times if now - t < self.window_seconds]
            if not valid_attempts:
                keys_to_delete.append(key)
            else:
                self.attempts[key] = valid_attempts
        
        for key in keys_to_delete:
            del self.attempts[key]
        self.last_cleanup = now

    def is_allowed(self, key: str) -> bool:
        """Check if the request is allowed"""
        self._cleanup()
        now = time()
        
        if key not in self.attempts:
            self.attempts[key] = [now]
            return True
            
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
        
        if key not in self.attempts:
            return self.max_attempts
            
        # Clean old attempts
        self.attempts[key] = [
            attempt_time for attempt_time in self.attempts[key] 
            if now - attempt_time < self.window_seconds
        ]
        
        return max(0, self.max_attempts - len(self.attempts[key]))

# Global rate limiter instances
login_limiter = RateLimiter(max_attempts=100, window_seconds=3600)    # 100 attempts per hour
signup_limiter = RateLimiter(max_attempts=100, window_seconds=3600)   # 100 attempts per hour
gen_ai_limiter = RateLimiter(max_attempts=50, window_seconds=3600)    # 50 interview generations per hour
feedback_limiter = RateLimiter(max_attempts=100, window_seconds=3600) # 100 feedback responses per hour
data_api_limiter = RateLimiter(max_attempts=1000, window_seconds=60)  # 1000 data requests per minute

def get_client_key(request: Request) -> str:
    """
    Get client identifier for rate limiting.
    Security: Prioritize remote_addr to prevent IP spoofing unless behind a trusted proxy.
    """
    # If explicitly configured to trust proxies (e.g. in production behind Nginx/Cloudflare)
    if os.getenv("TRUST_PROXIES", "false").lower() == "true":
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
    
    # Default to the direct connection IP (safest against spoofing)
    return request.client.host if request.client else "unknown"

def check_rate_limit(request: Request, limiter: RateLimiter, action: str, identifier: str = None):
    """
    Check rate limit and raise exception if exceeded.
    Can limit by IP and optionally by another identifier (like email).
    """
    # 1. Check IP-based limit
    client_ip = get_client_key(request)
    ip_key = f"{action}:ip:{client_ip}"
    
    if not limiter.is_allowed(ip_key):
        raise_rate_limit_error(limiter, action, ip_key)
    
    # 2. Check Identifier-based limit (e.g., email or user_id) if provided
    if identifier:
        id_key = f"{action}:id:{str(identifier).lower()}"
        if not limiter.is_allowed(id_key):
            raise_rate_limit_error(limiter, action, id_key)

def raise_rate_limit_error(limiter: RateLimiter, action: str, key: str):
    """Helper to raise consistent 429 errors"""
    remaining = limiter.get_remaining_attempts(key)
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
