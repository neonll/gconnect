import React, { useState } from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import LoginForm from './LoginForm';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleLoginClick = () => {
    setShowLoginForm(true);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            Garmin Activity Reporter
          </Typography>
          
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            Please log in to access your Garmin activities
          </Typography>
          
          {!showLoginForm ? (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleLoginClick}
              sx={{ mt: 2 }}
            >
              Log in to Garmin
            </Button>
          ) : (
            <Box sx={{ width: '100%', mt: 2 }}>
              <LoginForm onLoginSuccess={onLoginSuccess} />
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthScreen;