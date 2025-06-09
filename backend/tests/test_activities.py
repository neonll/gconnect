import unittest
from unittest.mock import patch, MagicMock
import json
import sys
import os

# Add the parent directory to the path so we can import app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import app


class TestActivities(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

        # Sample activity data for mocking
        self.sample_activity = {
            "activityId": 1234567890,
            "activityName": "Test Running",
            "activityType": {"typeId": 1, "typeKey": "running"},
            "distance": 5000,
            "duration": 1800,
            "startTimeGMT": "2023-01-01 12:00:00",
        }

        self.sample_activities = [
            self.sample_activity,
            {
                "activityId": 9876543210,
                "activityName": "Test Cycling",
                "activityType": {"typeId": 2, "typeKey": "cycling"},
                "distance": 20000,
                "duration": 3600,
                "startTimeGMT": "2023-01-02 12:00:00",
            },
        ]

    @patch("app.login_with_token")
    def test_latest_activity_success(self, mock_login):
        # Mock the Garmin API response
        mock_garmin = MagicMock()
        mock_garmin.get_last_activity.return_value = self.sample_activity
        mock_login.return_value = mock_garmin

        # Test the latest activity endpoint
        response = self.app.get(
            "/activities/latest", headers={"Authorization": "Bearer test_token_123"}
        )

        # Check the response
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["activityId"], 1234567890)
        self.assertEqual(data["activityName"], "Test Running")

        # Verify the mock was called correctly
        mock_login.assert_called_once_with("Bearer test_token_123")
        mock_garmin.get_last_activity.assert_called_once()

    @patch("app.login_with_token")
    def test_latest_activity_no_auth(self, mock_login):
        # Test without authorization header
        response = self.app.get("/activities/latest")

        # Check the response
        self.assertEqual(response.status_code, 401)
        data = json.loads(response.data)
        self.assertIn("error", data)
        self.assertEqual(data["error"], "Authorization header is required")

        # Verify the mock was not called
        mock_login.assert_not_called()

    @patch("app.login_with_token")
    def test_latest_activity_invalid_token(self, mock_login):
        # Mock invalid token
        mock_login.return_value = None

        # Test with invalid token
        response = self.app.get(
            "/activities/latest", headers={"Authorization": "Bearer invalid_token"}
        )

        # Check the response
        self.assertEqual(response.status_code, 401)
        data = json.loads(response.data)
        self.assertIn("error", data)
        self.assertEqual(data["error"], "Invalid or expired token")

    @patch("app.login_with_token")
    def test_get_activities_success(self, mock_login):
        # Mock the Garmin API response
        mock_garmin = MagicMock()
        mock_garmin.get_activities.return_value = self.sample_activities
        mock_login.return_value = mock_garmin

        # Test the activities endpoint with default parameters
        response = self.app.get("/activities", headers={"Authorization": "Bearer test_token_123"})

        # Check the response
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]["activityId"], 1234567890)
        self.assertEqual(data[1]["activityId"], 9876543210)

        # Verify the mock was called correctly
        mock_login.assert_called_once_with("Bearer test_token_123")
        mock_garmin.get_activities.assert_called_once_with(0, 1)

    @patch("app.login_with_token")
    def test_get_activities_with_num(self, mock_login):
        # Mock the Garmin API response
        mock_garmin = MagicMock()
        mock_garmin.get_activities.return_value = self.sample_activities
        mock_login.return_value = mock_garmin

        # Test the activities endpoint with num parameter
        response = self.app.get(
            "/activities?num=5", headers={"Authorization": "Bearer test_token_123"}
        )

        # Check the response
        self.assertEqual(response.status_code, 200)

        # Verify the mock was called with correct parameters
        mock_garmin.get_activities.assert_called_once_with(0, 5)

    @patch("app.login_with_token")
    def test_get_activities_error(self, mock_login):
        # Mock an error in the Garmin API
        mock_garmin = MagicMock()
        mock_garmin.get_activities.side_effect = Exception("API error")
        mock_login.return_value = mock_garmin

        # Test the activities endpoint
        response = self.app.get("/activities", headers={"Authorization": "Bearer test_token_123"})

        # Check the response
        self.assertEqual(response.status_code, 500)
        data = json.loads(response.data)
        self.assertIn("error", data)
        self.assertEqual(data["error"], "API error")


if __name__ == "__main__":
    unittest.main()
