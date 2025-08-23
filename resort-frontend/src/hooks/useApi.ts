import { useCallback } from 'react';
import { useAuth } from '../context';

interface RequestConfig extends RequestInit {
  secure?: boolean;
  params?: Record<string, any>;
}

interface ApiError extends Error {
  status?: number;
  data?: any;
}

export function useApi(baseURL: string = '/api') {
  const { token } = useAuth();

  const request = useCallback(async <T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> => {
    const { secure = true, headers: customHeaders = {}, params, ...restConfig } = config;
    
    const headers = new Headers(customHeaders);
    
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    if (secure && token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Construir URL com query params
    let url = `${baseURL}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, String(v)));
          } else {
            searchParams.append(key, String(value));
          }
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const response = await fetch(url, {
      ...restConfig,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = new Error('API request failed');
      error.status = response.status;
      
      try {
        error.data = await response.json();
      } catch {
        error.data = await response.text();
      }
      
      throw error;
    }

    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  }, [token, baseURL]);

  const get = useCallback(<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ) => {
    return request<T>(endpoint, { ...config, method: 'GET' });
  }, [request]);

  const post = useCallback(<T = any>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ) => {
    return request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }, [request]);

  const put = useCallback(<T = any>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ) => {
    return request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }, [request]);

  const patch = useCallback(<T = any>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ) => {
    return request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }, [request]);

  const del = useCallback(<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ) => {
    return request<T>(endpoint, { ...config, method: 'DELETE' });
  }, [request]);

  return {
    request,
    get,
    post,
    put,
    patch,
    delete: del,
  };
}