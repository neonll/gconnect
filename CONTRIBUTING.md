# Contributing to GConnect

Thank you for considering contributing to GConnect! This document provides guidelines and instructions for contributing to both the frontend and backend components of the project.

## Development Setup

### Prerequisites

- Python 3.9+ (for backend)
- Node.js 14+ (for frontend)
- Docker and Docker Compose (for full-stack development)

### Setting Up the Development Environment

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd gconnect
   ```

2. Set up the backend:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```

4. Create environment files:
   - Copy `.env.example` to `.env` in the frontend directory
   - Configure any necessary environment variables

## Development Workflow

### Backend Development

1. Make your changes in the `backend/` directory
2. Run tests to ensure functionality:
   ```bash
   cd backend
   pytest
   ```
3. Format your code:
   ```bash
   black .
   ```
4. Check for linting issues:
   ```bash
   flake8
   ```

### Frontend Development

1. Make your changes in the `frontend/` directory
2. Run tests:
   ```bash
   cd frontend
   npm test
   ```
3. Check for linting issues:
   ```bash
   npm run lint
   ```

### Full-Stack Development

Use Docker Compose to run the entire stack:
```bash
docker-compose up --build
```

## Pull Request Process

1. Ensure your code passes all tests and linting checks
2. Update documentation if you're changing functionality
3. Create a pull request with a clear description of the changes
4. Reference any related issues in your pull request

## Code Style Guidelines

### Backend (Python)

- Follow PEP 8 style guide
- Use Black for code formatting (line length: 100)
- Write docstrings for all functions, classes, and modules
- Include type hints where appropriate

### Frontend (TypeScript/React)

- Follow the ESLint configuration in the project
- Use functional components with hooks
- Organize components in a logical folder structure
- Write unit tests for components and utilities

## Commit Message Guidelines

- Use clear, descriptive commit messages
- Start with a verb in the present tense (e.g., "Add feature" not "Added feature")
- Reference issue numbers when applicable
- Separate subject from body with a blank line
- Limit the subject line to 50 characters
- Wrap the body at 72 characters

## License

By contributing to GConnect, you agree that your contributions will be licensed under the project's license.