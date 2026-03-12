from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from server import app
import json
from features.auth.auth import get_current_user
from utils.supabase_client import get_authenticated_sb

client = TestClient(app)

class MockUser:
    def __init__(self):
        self.id = "123e4567-e89b-12d3-a456-426614174000"
        self.email = "test@example.com"
        self.aud = "authenticated"
        self.role = "authenticated"

MOCK_USER = MockUser()

def test_generate_interview_questions_success():
    # Mock dependencies using dependency_overrides
    app.dependency_overrides[get_current_user] = lambda: MOCK_USER
    
    mock_sb = MagicMock()
    app.dependency_overrides[get_authenticated_sb] = lambda: mock_sb
    
    # Mock AI response
    with patch("features.interview.generate_questions.genai.GenerativeModel") as MockModel:
        mock_chat = MagicMock()
        mock_chat.send_message.return_value.text = json.dumps({
            "questions": [
                "Tell me about a time you solved a complex problem.",
                "How do you handle conflict in the workplace?",
                "What is your greatest strength?"
            ]
        })
        MockModel.return_value.start_chat.return_value = mock_chat

        # Mock DB operations
        mock_sb.table.return_value.insert.return_value.execute.return_value.data = [{"id": "new-interview-id"}]

        response = client.post(
            "/gen-ai/generate",
            json={
                "jobTitle": "Software Engineer",
                "jobDescription": "Python, React, AWS",
                "interviewType": "Behavioral",
                "difficultyLevel": "Medium",
                "interviewSource": "AI"
            },
            cookies={"access_token": "valid-token"} 
        )

        assert response.status_code == 200
        data = response.json()
        assert "interview_id" in data
        assert len(data["questions"]) == 3
        
    # Clean up overrides
    app.dependency_overrides = {}

def test_generate_interview_questions_missing_fields():
    app.dependency_overrides[get_current_user] = lambda: MOCK_USER
    
    # Also override Supabase client to avoid parsing the token
    mock_sb = MagicMock()
    app.dependency_overrides[get_authenticated_sb] = lambda: mock_sb
    
    response = client.post(
        "/gen-ai/generate",
        json={
            "jobTitle": "Software Engineer"
        },
        cookies={"access_token": "valid.token.format"} 
    )
    assert response.status_code == 422
    
    app.dependency_overrides = {}
