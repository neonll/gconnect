const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<ApiResponse<T>> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const status = response.status;

    // For 204 No Content responses
    if (status === 204) {
      return { status };
    }

    // Try to parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (e) {
      // If response is not JSON, return empty data
      return { status };
    }

    // Handle error responses
    if (!response.ok) {
      console.error(`API Error (${status}):`, data);
      return {
        error: data.error || 'An unexpected error occurred',
        status,
      };
    }

    return { data, status };
  } catch (error) {
    console.error('API Request Failed:', error);
    return {
      error: 'Network error or server unavailable',
      status: 0,
    };
  }
}
