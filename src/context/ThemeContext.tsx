import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

interface Colors {
  primary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  card: string;
  notification: string;
}

interface ThemeContextType {
  isDark: boolean;
  colors: Colors;
  toggleTheme: () => void;
}

const lightColors: Colors = {
  primary: '#0066cc',
  background: '#ffffff',
  surface: '#f8f9fa',
  text: '#000000',
  textSecondary: '#6c757d',
  border: '#dee2e6',
  error: '#dc3545',
  success: '#28a745',
  warning: '#ffc107',
  card: '#ffffff',
  notification: '#ff3b30',
};

const darkColors: Colors = {
  primary: '#0d7ae4',
  background: '#000000',
  surface: '#1a1a1a',
  text: '#ffffff',
  textSecondary: '#adb5bd',
  border: '#495057',
  error: '#dc3545',
  success: '#28a745',
  warning: '#ffc107',
  card: '#1a1a1a',
  notification: '#ff453a',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const colors = isDark ? darkColors : lightColors;

  const value: ThemeContextType = {
    isDark,
    colors,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}