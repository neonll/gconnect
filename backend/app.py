from flask import Flask, request, jsonify
from garminconnect import Garmin, GarminConnectAuthenticationError
from flask_cors import CORS
import base64
import json
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
# Configure CORS with more specific settings for security
CORS(
    app,
    resources={r"/*": {"origins": "*"}},  # In production, specify allowed origins
    supports_credentials=True,
    methods=["GET", "POST", "OPTIONS"],
)

# In-memory token store
active_tokens = {}


def init_api_reuse(email, password):
    """Modified init_api function without saving files or MFA"""
    try:
        garmin = Garmin(email=email, password=password)
        garmin.login()  # Login without MFA
        return garmin
    except GarminConnectAuthenticationError as e:
        logger.error(f"Authentication error: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error during authentication: {e}")
        return None


def login_with_token(header):
    """Log a Garmin instance using base64-encoded tokenstore."""
    try:
        if not header or not header.startswith("Bearer "):
            logger.warning("Invalid authorization header format")
            return None

        tokenstore = header.replace("Bearer ", "", 1)
        garmin = Garmin()
        garmin.login(tokenstore)
        return garmin
    except Exception as e:
        logger.error(f"Error during login with token: {e}")
        return None


@app.route("/auth", methods=["POST"])
def auth():
    """
    Authenticate using email and password from request body.
    Return base64 string token.
    """
    data = request.json
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    garmin = init_api_reuse(email, password)
    if not garmin:
        return jsonify({"error": "Authentication failed"}), 401

    tokenstore = garmin.garth.dumps()  # Base64-encoded token
    return jsonify({"token": tokenstore})


@app.route("/activities/latest", methods=["GET"])
def latest_activity():
    """Get the latest activity details."""
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Authorization header is required"}), 401

    garmin = login_with_token(auth_header)
    if not garmin:
        return jsonify({"error": "Invalid or expired token"}), 401

    try:
        latest_activity = garmin.get_last_activity()
        return jsonify(latest_activity)
    except Exception as e:
        logger.error(f"Error retrieving latest activity: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/activities", methods=["GET"])
def get_activities():
    """
    Get a list of activities.
    Query param 'num' determines the number of activities to fetch.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Authorization header is required"}), 401

    garmin = login_with_token(auth_header)
    if not garmin:
        return jsonify({"error": "Invalid or expired token"}), 401

    try:
        num = request.args.get("num", default=1, type=int)
        if num < 1:
            return jsonify({"error": "Parameter 'num' must be a positive integer"}), 400

        start = 0
        limit = num

        activities = garmin.get_activities(start, limit)
        return jsonify(activities)
    except ValueError:
        return jsonify({"error": "Invalid parameter format"}), 400
    except Exception as e:
        logger.error(f"Error retrieving activities: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint for monitoring."""
    return jsonify({"status": "healthy"}), 200


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
