import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  TextField, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  RadioGroup, 
  Radio, 
  FormControl, 
  FormLabel, 
  Paper,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from 'react-router-dom';
import { useActivity } from '../../contexts/ActivityContext';
import { formatDate, formatDistance, generateReportText } from '../../utils/formatters';

const ActivityDetailScreen: React.FC = () => {
  const navigate = useNavigate();
  const { selectedActivity } = useActivity();
  
  const [temperature, setTemperature] = useState('');
  const [weatherConditions, setWeatherConditions] = useState({
    strongWind: false,
    lightRain: false,
    strongRain: false,
    storm: false,
    snow: false
  });
  const [effortLevel, setEffortLevel] = useState('5');
  const [comments, setComments] = useState('');
  const [reportText, setReportText] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  // Redirect if no activity is selected
  useEffect(() => {
    if (!selectedActivity) {
      navigate('/');
    }
  }, [selectedActivity, navigate]);
  
  // Generate report text whenever inputs change
  useEffect(() => {
    if (selectedActivity) {
      const text = generateReportText(
        selectedActivity,
        temperature,
        weatherConditions,
        effortLevel,
        comments
      );
      setReportText(text);
    }
  }, [selectedActivity, temperature, weatherConditions, effortLevel, comments]);
  
  const handleWeatherChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWeatherConditions({
      ...weatherConditions,
      [event.target.name]: event.target.checked
    });
  };
  
  const handleCopyReport = () => {
    navigator.clipboard.writeText(reportText)
      .then(() => {
        setSnackbarOpen(true);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  if (!selectedActivity) {
    return null;
  }
  
  const activityTitle = `${formatDate(selectedActivity.startTimeLocal)} ${selectedActivity.activityName} ${formatDistance(selectedActivity.distance)} km`;
  
  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton 
            onClick={() => navigate('/')} 
            aria-label="back"
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            {activityTitle}
          </Typography>
        </Box>
        
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Generated Report</Typography>
            <Button 
              variant="outlined" 
              startIcon={<ContentCopyIcon />}
              onClick={handleCopyReport}
            >
              Copy
            </Button>
          </Box>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={reportText}
            InputProps={{
              readOnly: true,
            }}
          />
        </Paper>
        
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Activity Details
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Temperature (°C)"
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              sx={{ width: { xs: '100%', sm: '200px' } }}
            />
          </Box>
          
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">Weather Conditions</FormLabel>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={weatherConditions.strongWind} 
                    onChange={handleWeatherChange} 
                    name="strongWind" 
                  />
                }
                label="Strong wind 💨"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={weatherConditions.lightRain} 
                    onChange={handleWeatherChange} 
                    name="lightRain" 
                  />
                }
                label="Light rain 🌦️"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={weatherConditions.strongRain} 
                    onChange={handleWeatherChange} 
                    name="strongRain" 
                  />
                }
                label="Strong rain 🌧️"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={weatherConditions.storm} 
                    onChange={handleWeatherChange} 
                    name="storm" 
                  />
                }
                label="Storm ⛈️"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={weatherConditions.snow} 
                    onChange={handleWeatherChange} 
                    name="snow" 
                  />
                }
                label="Snow 🌨️"
              />
            </FormGroup>
          </FormControl>
          
          <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
            <FormLabel component="legend">Effort Level</FormLabel>
            <RadioGroup
              row
              value={effortLevel}
              onChange={(e) => setEffortLevel(e.target.value)}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <FormControlLabel
                  key={level}
                  value={level.toString()}
                  control={<Radio />}
                  label={level.toString()}
                  sx={{
                    '& .MuiRadio-root': {
                      color: level <= 3 ? 'green' : level <= 7 ? 'orange' : 'red',
                    }
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
          
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Comments"
              multiline
              rows={3}
              fullWidth
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </Box>
        </Paper>
      </Box>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Report copied to clipboard!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ActivityDetailScreen;