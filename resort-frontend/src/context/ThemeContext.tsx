import React, { createContext, useContext, useEffect } from 'react';
import { useTheme as useThemeHook } from '../hooks';

interface ThemeContextData {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  setCustomColors: (colors: Partial<ThemeContextData['colors']>) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const {
    theme,
    setTheme,
    colors,
    setCustomColors,
    toggleTheme,
    isDark,
  } = useThemeHook();

  // Apply theme class to body
  useEffect(() => {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${isDark ? 'dark' : 'light'}-theme`);
  }, [isDark]);

  // Apply theme colors as CSS variables
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value as string);
    });
  }, [colors]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        colors,
        setCustomColors,
        toggleTheme,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextData {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}