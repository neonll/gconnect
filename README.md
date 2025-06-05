# Garmin API Flask Application

This is a Python Flask-based web application for interfacing with Garmin's API. It provides authentication and activity endpoints.

## Endpoints
- `POST /auth`: Authenticate and receive a token.
- `GET /activities/latest`: Retrieve the latest activity.
- `GET /activities`: Retrieve a list of activities.

## Setup
1. Clone this repo.
2. Install dependencies: `pip install -r requirements.txt`.
3. Run the app: `python app.py`.

## Dependencies
- Flask
- GarminConnect API library
