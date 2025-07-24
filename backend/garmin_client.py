"""Direct Garth-based Garmin Connect client implementation."""

import logging
import os
from typing import Any, Dict, List, Optional

import garth

logger = logging.getLogger(__name__)


class GarminConnectAuthenticationError(Exception):
    """Raised when authentication is failed."""


class GarminClient:
    """Direct Garth-based client for Garmin Connect API."""

    def __init__(
        self,
        email: Optional[str] = None,
        password: Optional[str] = None,
        is_cn: bool = False,
        prompt_mfa=None,
        return_on_mfa: bool = False,
    ):
        """Initialize Garmin client."""
        self.username = email
        self.password = password
        self.is_cn = is_cn
        self.prompt_mfa = prompt_mfa
        self.return_on_mfa = return_on_mfa

        # API endpoints
        self.garmin_connect_user_settings_url = "/userprofile-service/userprofile/user-settings"
        self.garmin_connect_daily_summary_url = "/usersummary-service/usersummary/daily"
        self.garmin_connect_activities = "/activitylist-service/activities/search/activities"

        # Initialize garth client
        self.garth = garth.Client(
            domain="garmin.cn" if is_cn else "garmin.com",
            pool_connections=20,
            pool_maxsize=20,
        )

        self.display_name = None
        self.full_name = None
        self.unit_system = None

    def connectapi(self, path: str, **kwargs) -> Dict[str, Any]:
        """Make a request to Garmin Connect API."""
        return self.garth.connectapi(path, **kwargs)

    def download(self, path: str, **kwargs) -> bytes:
        """Download content from Garmin Connect."""
        return self.garth.download(path, **kwargs)

    def login(self, tokenstore: Optional[str] = None) -> tuple[Any, Any]:
        """Log in using Garth."""
        tokenstore = tokenstore or os.getenv("GARMINTOKENS")

        if tokenstore:
            if len(tokenstore) > 512:
                self.garth.loads(tokenstore)
            else:
                self.garth.load(tokenstore)

            self.display_name = self.garth.profile["displayName"]
            self.full_name = self.garth.profile["fullName"]

            settings = self.garth.connectapi(self.garmin_connect_user_settings_url)
            self.unit_system = settings["userData"]["measurementSystem"]

            return None, None
        else:
            if self.return_on_mfa:
                token1, token2 = self.garth.login(
                    self.username,
                    self.password,
                    return_on_mfa=self.return_on_mfa,
                )
            else:
                token1, token2 = self.garth.login(
                    self.username, self.password, prompt_mfa=self.prompt_mfa
                )
                self.display_name = self.garth.profile["displayName"]
                self.full_name = self.garth.profile["fullName"]

                settings = self.garth.connectapi(self.garmin_connect_user_settings_url)
                self.unit_system = settings["userData"]["measurementSystem"]

        return token1, token2

    def resume_login(self, client_state: dict, mfa_code: str):
        """Resume login using Garth."""
        result1, result2 = self.garth.resume_login(client_state, mfa_code)

        self.display_name = self.garth.profile["displayName"]
        self.full_name = self.garth.profile["fullName"]

        settings = self.connectapi(self.garmin_connect_user_settings_url)
        self.unit_system = settings["userData"]["measurementSystem"]

        return result1, result2

    def get_activities(
        self,
        start: int = 0,
        limit: int = 20,
        activitytype: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Return available activities.
        :param start: Starting activity offset, where 0 means the most recent activity
        :param limit: Number of activities to return
        :param activitytype: (Optional) Filter activities by type
        :return: List of activities from Garmin
        """
        url = self.garmin_connect_activities
        params = {"start": str(start), "limit": str(limit)}
        if activitytype:
            params["activityType"] = str(activitytype)

        logger.debug("Requesting activities")

        return self.connectapi(url, params=params)

    def get_last_activity(self) -> Optional[Dict[str, Any]]:
        """Return last activity."""
        activities = self.get_activities(0, 1)
        if activities:
            return activities[-1]

        return None

    def get_user_summary(self, cdate: str) -> Dict[str, Any]:
        """Return user activity summary for 'cdate' format 'YYYY-MM-DD'."""
        url = f"{self.garmin_connect_daily_summary_url}/{self.display_name}"
        params = {"calendarDate": str(cdate)}
        logger.debug("Requesting user summary")

        response = self.connectapi(url, params=params)

        if response["privacyProtected"] is True:
            raise GarminConnectAuthenticationError("Authentication error")

        return response

    def get_stats(self, cdate: str) -> Dict[str, Any]:
        """
        Return user activity summary for 'cdate' format 'YYYY-MM-DD'
        (compat for garminconnect).
        """
        return self.get_user_summary(cdate)

    def get_full_name(self) -> Optional[str]:
        """Return full name."""
        return self.full_name

    def get_unit_system(self) -> Optional[str]:
        """Return unit system."""
        return self.unit_system
