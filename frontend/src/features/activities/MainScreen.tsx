import React, { useState } from 'react';
import { Container, Typography, Box, Button, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useActivity } from '../../contexts/ActivityContext';
import { getLatestActivity, getActivities } from '../../services/activityService';
import { isTokenExpired } from '../../services/authService';
import ActivityList from './ActivityList';
import { Activity } from '../../contexts/ActivityContext';

const MainScreen: React.FC = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const { setSelectedActivity, setActivities, activities } = useActivity();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showActivities, setShowActivities] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error' as 'error' | 'warning' | 'info' | 'success'
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleApiError = (error: string) => {
    console.error('API Error:', error);
    
    // Check if token is expired or invalid
    if (isTokenExpired(error)) {
      logout();
      setSnackbar({
        open: true,
        message: 'Your session has expired. Please log in again.',
        severity: 'warning'
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Something went wrong. Please try again later.',
        severity: 'error'
      });
    }
  };

  const handleLoadLatestActivity = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getLatestActivity(token);
      
      if (response.error || !response.data) {
        if (response.status === 401 || response.status === 403) {
          handleApiError(response.error || 'Unauthorized');
        } else {
          setError(response.error || 'Failed to load latest activity');
        }
        return;
      }
      
      setSelectedActivity(response.data);
      navigate('/activity');
    } catch (err) {
      console.error('Error loading latest activity:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadActivities = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getActivities(token, 5);
      
      if (response.error || !response.data) {
        if (response.status === 401 || response.status === 403) {
          handleApiError(response.error || 'Unauthorized');
        } else {
          setError(response.error || 'Failed to load activities');
        }
        return;
      }
      
      setActivities(response.data);
      setShowActivities(true);
    } catch (err) {
      console.error('Error loading activities:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivitySelect = (activity: Activity) => {
    setSelectedActivity(activity);
    navigate('/activity');
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Garmin Activity Reporter
        </Typography>
        
        <Box 
          display="flex" 
          flexDirection={{ xs: 'column', sm: 'row' }} 
          justifyContent="center" 
          gap={2} 
          my={4}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleLoadLatestActivity}
            disabled={isLoading}
          >
            Load the latest activity
          </Button>
          
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleLoadActivities}
            disabled={isLoading}
          >
            Load the list of 5 latest activities
          </Button>
        </Box>
        
        {showActivities && (
          <ActivityList
            activities={activities}
            isLoading={isLoading}
            error={error}
            onActivitySelect={handleActivitySelect}
          />
        )}
      </Box>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MainScreen;