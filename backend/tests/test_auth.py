from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from server import app
from schemas.auth import SignupRequest, LoginRequest

client = TestClient(app)

# Mock user for auth tests
MOCK_USER_ID = "123e4567-e89b-12d3-a456-426614174000"

def test_signup_success():
    # Mock Supabase responses
    with patch("features.auth.auth.supabase") as mock_supabase:
        # Mock auth.sign_up
        mock_response = MagicMock()
        mock_response.user.id = MOCK_USER_ID
        mock_response.user.email_confirmed_at = None
        mock_response.session = None
        mock_supabase.auth.sign_up.return_value = mock_response
        
        # Mock db insert
        mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock()

        response = client.post(
            "/auth/signup",
            json={
                "email": "newuser@example.com",
                "password": "password123",
                "first_name": "Test",
                "last_name": "User"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "User signed up successfully. Please check your email to confirm your account."
        assert data["user_id"] == MOCK_USER_ID

def test_signup_invalid_email():
    response = client.post(
        "/auth/signup",
        json={
            "email": "invalid-email",
            "password": "password123",
            "first_name": "Test",
            "last_name": "User"
        }
    )
    assert response.status_code == 422 

def test_signup_short_password():
    response = client.post(
        "/auth/signup",
        json={
            "email": "test@example.com",
            "password": "123", # Too short
            "first_name": "Test",
            "last_name": "User"
        }
    )
    assert response.status_code == 422

def test_login_success():
    with patch("features.auth.auth.supabase") as mock_supabase:
        # Mock auth.sign_in_with_password
        mock_response = MagicMock()
        mock_response.user.id = MOCK_USER_ID
        mock_response.session.access_token = "fake-jwt-token"
        mock_supabase.auth.sign_in_with_password.return_value = mock_response

        response = client.post(
            "/auth/login",
            json={
                "email": "test@example.com",
                "password": "password123"
            }
        )
        
        assert response.status_code == 200
        assert response.cookies.get("access_token") == "fake-jwt-token"
        assert response.json()["message"] == "Login successful"
