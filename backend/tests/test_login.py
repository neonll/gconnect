import unittest
from unittest.mock import patch, MagicMock
import sys
import os

# Add the parent directory to the path so we can import app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import init_api_reuse, login_with_token


class TestLogin(unittest.TestCase):
    @patch("app.GarminClient")
    def test_init_api_reuse_success(self, mock_garmin_class):
        # Setup mock
        mock_garmin_instance = MagicMock()
        mock_garmin_class.return_value = mock_garmin_instance

        # Call the function
        result = init_api_reuse("test@example.com", "password123")

        # Assertions
        mock_garmin_class.assert_called_once_with(email="test@example.com", password="password123")
        mock_garmin_instance.login.assert_called_once()
        self.assertEqual(result, mock_garmin_instance)

    @patch("app.GarminClient")
    def test_init_api_reuse_auth_error(self, mock_garmin_class):
        # Setup mock to raise authentication error
        mock_garmin_instance = MagicMock()
        mock_garmin_instance.login.side_effect = Exception("Authentication error")
        mock_garmin_class.return_value = mock_garmin_instance

        # Call the function
        result = init_api_reuse("test@example.com", "wrong_password")

        # Assertions
        self.assertIsNone(result)

    @patch("app.GarminClient")
    def test_login_with_token_success(self, mock_garmin_class):
        # Setup mock
        mock_garmin_instance = MagicMock()
        mock_garmin_class.return_value = mock_garmin_instance

        # Call the function
        result = login_with_token("Bearer test_token_123")

        # Assertions
        mock_garmin_class.assert_called_once()
        mock_garmin_instance.login.assert_called_once_with("test_token_123")
        self.assertEqual(result, mock_garmin_instance)

    @patch("app.GarminClient")
    def test_login_with_token_error(self, mock_garmin_class):
        # Setup mock to raise error
        mock_garmin_instance = MagicMock()
        mock_garmin_instance.login.side_effect = Exception("Token error")
        mock_garmin_class.return_value = mock_garmin_instance

        # Call the function
        result = login_with_token("Bearer invalid_token")

        # Assertions
        self.assertIsNone(result)

    def test_login_with_token_invalid_header(self):
        # Test with invalid header format
        result = login_with_token("InvalidHeader")
        self.assertIsNone(result)

        # Test with None header
        result = login_with_token(None)
        self.assertIsNone(result)


if __name__ == "__main__":
    unittest.main()
