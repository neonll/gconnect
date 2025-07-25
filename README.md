# GConnect - Garmin Connect API & Dashboard

[![CI](https://github.com/neonll/gconnect/actions/workflows/ci.yml/badge.svg)](https://github.com/neonll/gconnect/actions/workflows/ci.yml)
[![Python](https://img.shields.io/badge/Python-3.13+-blue.svg)](https://python.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)

A full-stack application that provides a RESTful API wrapper for Garmin Connect services and a modern React-based dashboard for visualizing fitness activity data.

## Project Overview

GConnect consists of two main components:

1. **Backend API**: A Flask-based RESTful API that authenticates with Garmin Connect and retrieves fitness activity data.
2. **Frontend Dashboard**: A React application that provides a user-friendly interface for viewing and interacting with Garmin fitness data.

This project enables developers and fitness enthusiasts to access their Garmin fitness data programmatically and visualize it through a modern web interface.

## Prerequisites

- Docker and Docker Compose
- Git
- Modern web browser (for frontend access)

For local development:
- Python 3.13+ (backend)
- Node.js 18+ (frontend)
- npm 10+ (frontend)

## Directory Structure

```
gconnect/
├── backend/               # Flask API
│   ├── app.py             # Main application file
│   ├── Dockerfile         # Backend container configuration
│   ├── requirements.txt   # Python dependencies
│   ├── openapi.yml        # API documentation
│   └── tests/             # Backend test suite
├── frontend/              # React application
│   ├── public/            # Static assets
│   ├── src/               # React source code
│   ├── Dockerfile         # Frontend container configuration
│   └── package.json       # Node.js dependencies
├── docker-compose.yml     # Development Docker stack
├── docker-compose.prod.yml # Production Docker stack
└── README.md              # Project documentation
```

## Building & Running

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd gconnect
   ```

2. Start the Docker stack:
   ```bash
   docker compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Production Deployment

For production environments:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

### Local Development

#### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

#### Frontend

```bash
cd frontend
npm install
npm start
```

## API Endpoints

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/auth` | POST | Authenticate with Garmin credentials | JSON body with `email` and `password` |
| `/activities/latest` | GET | Retrieve the latest activity | Authorization header |
| `/activities` | GET | Retrieve a list of activities | Authorization header, `num` query parameter |
| `/health` | GET | Health check endpoint | None |

## Frontend Features

- **User Authentication**: Secure login and session management
- **Activity Dashboard**: Overview of recent fitness activities
- **Detailed Activity Views**: In-depth metrics and statistics for individual activities
- **Responsive Design**: Mobile-friendly interface using Material-UI components
- **Data Visualization**: Clear presentation of activity metrics

## Development

### Running Tests

#### Backend
```bash
cd backend
pytest
```

#### Frontend
```bash
cd frontend
npm test
```

### Code Quality

#### Backend
```bash
cd backend
black .
flake8
```

#### Frontend
```bash
cd frontend
npm run lint
```

### Security Scanning

```bash
cd backend
pip-audit
```

## Continuous Integration

The project includes a comprehensive CI/CD pipeline using GitHub Actions that automatically:

- **Backend Testing**: Runs on Python 3.13
  - Code linting with flake8
  - Code formatting validation with black
  - Unit tests with pytest and coverage reporting
  - Security vulnerability scanning with pip-audit

- **Frontend Testing**: Runs on Node.js 18
  - Code linting with ESLint
  - Unit tests with Jest (when present)
  - Build validation

- **Docker Integration Testing**: 
  - Builds Docker images for both frontend and backend
  - Tests the complete Docker stack with health checks

The CI pipeline ensures code quality and prevents regressions before merging changes.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

See the [LICENSE.md](LICENSE.md) file for details.