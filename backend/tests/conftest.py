import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock
import sys
import os

# Add backend directory to sys.path so we can import from server
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from server import app
from features.auth.auth import get_current_user
from utils.supabase_client import get_authenticated_sb

# Mock user data
MOCK_USER = {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "test@example.com",
    "aud": "authenticated",
    "role": "authenticated"
}

# Mock Supabase client
class MockSupabaseClient:
    def __init__(self):
        self.table = MagicMock()
        self.auth = MagicMock()

@pytest.fixture
def mock_sb_client():
    return MockSupabaseClient()

@pytest.fixture
def client(mock_sb_client):
    # Override dependencies
    app.dependency_overrides[get_current_user] = lambda: MOCK_USER
    app.dependency_overrides[get_authenticated_sb] = lambda: mock_sb_client
    
    with TestClient(app) as client:
        yield client
    
    # Clean up overrides
    app.dependency_overrides = {}
