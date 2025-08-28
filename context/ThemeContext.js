// context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const themes = {
  default: {
    background: '#FFFFFF',
    text: '#333333',
    primary: '#432272',
    secondary: '#666666',
    card: '#f8f9fa',
    border: '#e0e0e0',
    searchBar: '#e0e0e0'
  },
  dark: {
    background: '#1a1a1a',
    text: '#ebebeb',
    primary: '#8458ba',
    secondary: '#AAAAAA',
    card: '#424242',
    border: '#38383A',
    searchBar: '#e0e0e0'
  },
  light: {
    background: '#FFFFFF',
    text: '#333333',
    primary: '#432272',
    secondary: '#666666',
    card: '#f8f9fa',
    border: '#e0e0e0'
  },
  highContrast: {
    background: '#000000',
    text: '#FFFFFF',
    primary: '#A999FF',
    secondary: '#AAAAAA',
    card: '#1C1C1E',
    border: '#38383A'
  }
};

const ThemeContext = createContext();

const THEME_STORAGE_KEY = '@theme_preference';

export const ThemeProvider = ({ children }) => {
  const [themeKey, setThemeKey] = useState('default');
  const [isLoading, setIsLoading] = useState(true);

  const theme = themes[themeKey] || themes.default;

  // Load saved theme preference on app startup
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && themes[savedTheme]) {
        setThemeKey(savedTheme);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveThemePreference = async (key) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, key);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const selectTheme = (key) => {
    if (themes[key]) {
      setThemeKey(key);
      saveThemePreference(key);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, themeKey, selectTheme, themes, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};