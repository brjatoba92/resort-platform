import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export function useAuth(): AuthContextData {
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useLocalStorage<AuthState>('auth', {
    token: null,
    user: null,
  });

  useEffect(() => {
    const loadStoredData = async () => {
      setLoading(false);
    };

    loadStoredData();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      // TODO: Implement API call to /auth/login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      
      setAuthState({
        token: data.token,
        user: data.user,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setAuthState]);

  const logout = useCallback(() => {
    setAuthState({
      token: null,
      user: null,
    });
  }, [setAuthState]);

  return {
    user: authState.user,
    isAuthenticated: !!authState.token,
    loading,
    login,
    logout,
  };
}
