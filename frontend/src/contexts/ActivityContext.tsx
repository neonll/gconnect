import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Activity {
  activityId: number;
  activityName: string;
  activityTrainingLoad: number;
  activityType: {
    isHidden: boolean;
    parentTypeId: number;
    restricted: boolean;
    trimmable: boolean;
    typeId: number;
    typeKey: string;
  };
  aerobicTrainingEffect: number;
  anaerobicTrainingEffect: number;
  averageHR: number;
  calories: number;
  distance: number;
  duration: number;
  endLatitude: string;
  endLongitude: string;
  startLatitude: string;
  startLongitude: string;
  ownerFullName: string;
  ownerDisplayName: string;
  startTimeGMT: string;
  startTimeLocal: string;
  steps: number;
  vO2MaxValue: number;
  elevationGain?: number;
  averageSpeed?: number;
}

interface ActivityContextType {
  selectedActivity: Activity | null;
  activities: Activity[];
  setSelectedActivity: (activity: Activity | null) => void;
  setActivities: (activities: Activity[]) => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

interface ActivityProviderProps {
  children: ReactNode;
}

export const ActivityProvider: React.FC<ActivityProviderProps> = ({ children }) => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  return (
    <ActivityContext.Provider value={{ selectedActivity, activities, setSelectedActivity, setActivities }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = (): ActivityContextType => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};