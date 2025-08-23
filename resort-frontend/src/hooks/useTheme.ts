import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

type Theme = 'light' | 'dark' | 'system';

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

const lightTheme: ThemeColors = {
  primary: '#1976d2',
  secondary: '#dc004e',
  background: '#ffffff',
  text: '#000000',
  error: '#f44336',
  success: '#4caf50',
  warning: '#ff9800',
  info: '#2196f3',
};

const darkTheme: ThemeColors = {
  primary: '#90caf9',
  secondary: '#f48fb1',
  background: '#121212',
  text: '#ffffff',
  error: '#ef5350',
  success: '#81c784',
  warning: '#ffb74d',
  info: '#64b5f6',
};

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'system');
  const [colors, setColors] = useLocalStorage<ThemeColors>('theme-colors', lightTheme);

  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  const getCurrentTheme = useCallback((): 'light' | 'dark' => {
    return theme === 'system' ? getSystemTheme() : theme;
  }, [theme, getSystemTheme]);

  const applyTheme = useCallback((newTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    const themeColors = newTheme === 'dark' ? darkTheme : lightTheme;

    // Apply theme colors to CSS variables
    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Update body class
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${newTheme}-theme`);

    setColors(themeColors);
  }, [setColors]);

  const toggleTheme = useCallback(() => {
    const currentTheme = getCurrentTheme();
    const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [getCurrentTheme, setTheme]);

  const setCustomColors = useCallback((newColors: Partial<ThemeColors>) => {
    setColors(prevColors => ({
      ...prevColors,
      ...newColors,
    }));
  }, [setColors]);

  // Handle system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        applyTheme(getSystemTheme());
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, getSystemTheme, applyTheme]);

  // Apply theme on mount and theme changes
  useEffect(() => {
    applyTheme(getCurrentTheme());
  }, [getCurrentTheme, applyTheme]);

  return {
    theme,
    setTheme,
    colors,
    setCustomColors,
    toggleTheme,
    isDark: getCurrentTheme() === 'dark',
  };
}