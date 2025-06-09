import React from 'react';
import { Box, Typography, Card, CardContent, CardActionArea, Grid, CircularProgress } from '@mui/material';
import { Activity } from '../../contexts/ActivityContext';
import { formatDate, formatDistance } from '../../utils/formatters';

interface ActivityListProps {
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
  onActivitySelect: (activity: Activity) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  isLoading,
  error,
  onActivitySelect
}) => {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box my={4}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  if (activities.length === 0) {
    return (
      <Box my={4}>
        <Typography align="center">
          No activities found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box my={4}>
      <Typography variant="h6" gutterBottom>
        Activities
      </Typography>
      <Grid container spacing={2}>
        {activities.map((activity: Activity) => (
          <Grid item xs={12} key={activity.activityId}>
            <Card>
              <CardActionArea
                onClick={() => activity.activityType.typeKey === 'running' ? onActivitySelect(activity) : null}
                disabled={activity.activityType.typeKey !== 'running'}
              >
                <CardContent>
                  <Typography variant="body1">
                    {formatDate(activity.startTimeLocal)} {activity.activityName} {activity.activityType.typeKey === 'running' ? formatDistance(activity.distance) + ' km' : ''}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ActivityList;