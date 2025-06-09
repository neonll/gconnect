import unittest
from unittest.mock import patch, MagicMock
import json
import sys
import os

# Add the parent directory to the path so we can import app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import app


class TestAuth(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    @patch("app.init_api_reuse")
    def test_auth_success(self, mock_init_api):
        # Mock the Garmin API response
        mock_garmin = MagicMock()
        mock_garmin.garth.dumps.return_value = "test_token_123"
        mock_init_api.return_value = mock_garmin

        # Test the auth endpoint
        response = self.app.post(
            "/auth", json={"email": "test@example.com", "password": "password123"}
        )

        # Check the response
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn("token", data)
        self.assertEqual(data["token"], "test_token_123")

        # Verify the mock was called with correct parameters
        mock_init_api.assert_called_once_with("test@example.com", "password123")

    @patch("app.init_api_reuse")
    def test_auth_failure(self, mock_init_api):
        # Mock authentication failure
        mock_init_api.return_value = None

        # Test the auth endpoint
        response = self.app.post(
            "/auth", json={"email": "test@example.com", "password": "wrong_password"}
        )

        # Check the response
        self.assertEqual(response.status_code, 401)
        data = json.loads(response.data)
        self.assertIn("error", data)
        self.assertEqual(data["error"], "Authentication failed")

    def test_auth_missing_credentials(self):
        # Test with missing email
        response = self.app.post("/auth", json={"password": "password123"})
        self.assertEqual(response.status_code, 400)

        # Test with missing password
        response = self.app.post("/auth", json={"email": "test@example.com"})
        self.assertEqual(response.status_code, 400)

        # Test with empty request
        response = self.app.post("/auth", json={})
        self.assertEqual(response.status_code, 400)


if __name__ == "__main__":
    unittest.main()
