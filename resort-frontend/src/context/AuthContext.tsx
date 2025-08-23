import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { localStorage } from '../services/storage';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.remove('auth_token');
      setToken(null);
      setUser(null);
      setIsLoading(false);
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    async function loadStoredData() {
      try {
        const storedToken = localStorage.get<string>('auth_token');
        
        if (storedToken) {
          setToken(storedToken);
          const user = await authService.me();
          setUser(user);
        }
      } catch (error) {
        console.error('Error loading stored auth data:', error);
        await signOut();
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredData();
  }, [signOut]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
      localStorage.set('auth_token', response.token);
      setToken(response.token);
      setUser(response.user);

      navigate('/dashboard');
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      setIsLoading(true);
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}