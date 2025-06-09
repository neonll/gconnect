import { fetchWithAuth } from './apiClient';

interface AuthCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

export async function login(credentials: AuthCredentials) {
  return fetchWithAuth<AuthResponse>('/auth', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function isTokenExpired(error: string): boolean {
  return error.toLowerCase().includes('invalid') || 
         error.toLowerCase().includes('expired') || 
         error.toLowerCase().includes('token');
}