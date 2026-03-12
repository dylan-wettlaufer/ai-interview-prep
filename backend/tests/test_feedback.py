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

def test_generate_feedback_success():
    # Mock dependencies
    app.dependency_overrides[get_current_user] = lambda: MOCK_USER
    mock_sb = MagicMock()
    app.dependency_overrides[get_authenticated_sb] = lambda: mock_sb
    
    # Mock AI response
    with patch("features.interview.feedback.genai.GenerativeModel") as MockModel:
        # Create a mock instance of the model
        mock_model_instance = MockModel.return_value
        
        # Mock the generate_content method
        mock_response = MagicMock()
        mock_response.text = json.dumps({
            "positive_feedback": "Great use of examples.",
            "negative_feedback": "Could be more concise.",
            "improvement_suggestions": ["Structure your answer better.", "Use STAR method."],
            "content_quality": 8,
            "clarity": 7,
            "completeness": 9,
            "overall_score": 80
        })
        mock_model_instance.generate_content.return_value = mock_response

        # Mock DB operations
        mock_sb.table.return_value.insert.return_value.execute.return_value.data = [{"id": "new-feedback-id"}]

        response = client.post(
            "/feedback-ai/response",
            json={
                "interview_id": "interview-123",
                "question_number": 1,
                "job_title": "Product Manager",
                "question": "How do you prioritize features?",
                "response": "I use the RICE framework..."
            },
            cookies={"access_token": "valid.token.format"}
        )

        assert response.status_code == 200
        data = response.json()
        assert "feedback" in data
        assert data["feedback"]["overall_score"] == 80
        assert len(data["feedback"]["improvement_suggestions"]) == 2

    app.dependency_overrides = {}

def test_generate_feedback_empty_response():
    app.dependency_overrides[get_current_user] = lambda: MOCK_USER
    mock_sb = MagicMock()
    app.dependency_overrides[get_authenticated_sb] = lambda: mock_sb
    
    with patch("features.interview.feedback.genai.GenerativeModel") as MockModel:
        mock_model_instance = MockModel.return_value
        
        # Mock a low-score response for empty input
        mock_response = MagicMock()
        mock_response.text = json.dumps({
            "positive_feedback": "None.",
            "negative_feedback": "No response provided.",
            "improvement_suggestions": ["Provide an answer next time."],
            "content_quality": 1,
            "clarity": 1,
            "completeness": 1,
            "overall_score": 10
        })
        mock_model_instance.generate_content.return_value = mock_response
        
        # Mock DB
        mock_sb.table.return_value.insert.return_value.execute.return_value.data = [{"id": "new-feedback-id"}]

        response = client.post(
            "/feedback-ai/response",
            json={
                "interview_id": "interview-123",
                "question_number": 1,
                "job_title": "Product Manager",
                "question": "How do you prioritize features?",
                "response": "" # Empty response
            },
            cookies={"access_token": "valid.token.format"}
        )
        
        # Expect 200 OK because the system handles empty responses as "poor" answers
        assert response.status_code == 200
        data = response.json()
        assert data["feedback"]["overall_score"] <= 20
    
    app.dependency_overrides = {}
