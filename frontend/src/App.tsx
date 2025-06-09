import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ActivityProvider } from './contexts/ActivityContext';
import theme from './theme/theme';
import Layout from './components/Layout';
import AuthScreen from './features/auth/AuthScreen';
import MainScreen from './features/activities/MainScreen';
import ActivityDetailScreen from './features/activities/ActivityDetailScreen';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// App routes with auth check
const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <AuthScreen onLoginSuccess={() => {}} />} 
      />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <MainScreen />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/activity" 
        element={
          <ProtectedRoute>
            <ActivityDetailScreen />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ActivityProvider>
          <Router>
            <Layout>
              <AppRoutes />
            </Layout>
          </Router>
        </ActivityProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;