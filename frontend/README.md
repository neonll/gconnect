# Garmin Activity Reporter

A React-based web application that allows users to view and interact with their Garmin fitness activity data.

## Description

Garmin Activity Reporter is a modern web application built with React and TypeScript that provides a user-friendly interface for accessing and visualizing Garmin fitness activity data. The application authenticates users against a backend service and displays comprehensive activity information such as running sessions, workout statistics, and training metrics.

## Features

- **User Authentication**: Secure login and session management
- **Activity Dashboard**: Overview of recent fitness activities
- **Detailed Activity Views**: In-depth metrics and statistics for individual activities
- **Responsive Design**: Mobile-friendly interface using Material-UI components
- **Data Visualization**: Clear presentation of activity metrics
- **Secure API Integration**: Authenticated communication with Garmin Connect API

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/neonll/gconnect-react.git
   cd gconnect-react
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_API_URL=your_api_url_here
   ```

## Usage

### Development

Start the development server:

```bash
npm start
```

This will launch the application in development mode at [http://localhost:3000](http://localhost:3000).

### Production

Build the application for production:

```bash
npm run build
```

The optimized build will be created in the `build` directory, ready for deployment to a static hosting service.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run lint` - Runs ESLint to check code quality

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
