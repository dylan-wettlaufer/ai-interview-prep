from fastapi.testclient import TestClient
from server import app

client = TestClient(app)

def test_read_root():
    # The root endpoint interacts with Supabase "user" table
    # We should mock it or expect it might fail if not authenticated/mocked
    # However, for a simple availability check, we can check if it returns 200 or 500
    # depending on whether we want to mock the DB.
    # Let's mock the DB for a clean test.
    from unittest.mock import patch, MagicMock
    
    with patch("server.supabase") as mock_supabase:
        mock_response = MagicMock()
        mock_response.data = [{"id": "1", "email": "test@example.com"}]
        mock_supabase.table.return_value.select.return_value.execute.return_value = mock_response

        response = client.get("/")
        assert response.status_code == 200
        assert response.json() == {"data": [{"id": "1", "email": "test@example.com"}]}

def test_health_check_cors():
    # Test if CORS headers are present (TestClient doesn't fully simulate browser CORS, 
    # but we can check if middleware is running)
    response = client.options("/", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "GET"})
    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:3000"
