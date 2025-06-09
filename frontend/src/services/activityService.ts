import { fetchWithAuth } from './apiClient';
import { Activity } from '../contexts/ActivityContext';

export async function getLatestActivity(token: string | null) {
  return fetchWithAuth<Activity>('/activities/latest', {
    method: 'GET',
  }, token);
}

export async function getActivities(token: string | null, num: number = 5) {
  return fetchWithAuth<Activity[]>(`/activities?num=${num}`, {
    method: 'GET',
  }, token);
}