import axios from 'axios';

const config = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
};

export const api = axios.create(config);

interface RefreshTokenResponse {
  token: string;
}

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    
    // If token exists, add it to request headers
    if (token) {
      // Ensure headers object exists
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post<RefreshTokenResponse>('/auth/refresh-token', {
          refreshToken,
        });

        const { token } = response.data;
        localStorage.setItem('auth_token', token);

        // Retry original request with new token
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, clear auth data and redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Type for API responses
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

// Type for API error
export interface ApiError extends Error {
  response?: {
    data: any;
    status: number;
    headers: Record<string, string>;
  };
  config?: any;
}

export * from './auth';
export * from './dashboard';
export * from './employees';
export * from './guests';
export * from './payments';
export * from './reservations';
export * from './rooms';
export * from './weather';