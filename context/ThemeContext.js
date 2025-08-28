// context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    searchBar: '#e0e0e0',
    emphasis: '#ffffff',
  },
  soft: {
    background: '#FFFFFF',
    text: '#333333',
    primary: '#A49DF5',
    secondary: '#666666',
    card: '#f8f9fa',
    border: '#e0e0e0',
    searchBar: '#e0e0e0',
    emphasis: '#ffffff',
  },
  greenLight: {
    background: '#FFFFFF',
    text: '#333333',
    primary: '#2E7906',
    secondary: '#666666',
    card: '#f8f9fa',
    border: '#e0e0e0',
    searchBar: '#e0e0e0',
    emphasis: '#ffffff',
  },
  redLight: {
    background: '#FFFFFF',
    text: '#333333',
    primary: '#c6013b',
    secondary: '#666666',
    card: '#f8f9fa',
    border: '#e0e0e0',
    searchBar: '#e0e0e0',
    emphasis: '#ffffff',
  },
  blueLight: {
    background: '#FFFFFF',
    text: '#333333',
    primary: '#000E98',
    secondary: '#666666',
    card: '#f8f9fa',
    border: '#e0e0e0',
    searchBar: '#e0e0e0',
    emphasis: '#ffffff',
  },
  dark: {
    background: '#1a1a1a',
    text: '#ebebeb',
    primary: '#8458ba',
    secondary: '#AAAAAA',
    card: '#424242',
    border: '#38383A',
    searchBar: '#e0e0e0',
    emphasis: '#432272',
  },
  greenDark: {
    background: '#1a1a1a',
    text: '#ebebeb',
    primary: '#067918',
    secondary: '#AAAAAA',
    card: '#424242',
    border: '#38383A',
    searchBar: '#e0e0e0',
    emphasis: '#432272',
  },
  redDark: {
    background: '#1a1a1a',
    text: '#ebebeb',
    primary: '#c6013b',
    secondary: '#AAAAAA',
    card: '#424242',
    border: '#38383A',
    searchBar: '#e0e0e0',
    emphasis: '#432272',
  },
  yellowDark: {
    background: '#1a1a1a',
    text: '#ebebeb',
    primary: '#E7A507',
    secondary: '#AAAAAA',
    card: '#424242',
    border: '#38383A',
    searchBar: '#e0e0e0',
    emphasis: '#432272',
  },
};

const ThemeContext = createContext();

const THEME_STORAGE_KEY = '@theme_preference';

export const ThemeProvider = ({ children }) => {
  const [themeKey, setThemeKey] = useState('default');
  const [isLoading, setIsLoading] = useState(true);

  // Ensure we always have a valid theme, with multiple fallbacks
  const theme = themes[themeKey] || themes.default || {
    background: '#FFFFFF',
    text: '#333333',
    primary: '#432272',
    secondary: '#666666',
    card: '#f8f9fa',
    border: '#e0e0e0',
    searchBar: '#e0e0e0',
    emphasis: '#ffffff',
  };

  // Load saved theme preference on app startup
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && themes[savedTheme]) {
        setThemeKey(savedTheme);
      } else if (savedTheme) {
        // If saved theme doesn't exist anymore, clear it and use default
        console.warn(`Theme '${savedTheme}' not found, reverting to default`);
        await AsyncStorage.removeItem(THEME_STORAGE_KEY);
        setThemeKey('default');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
      setThemeKey('default'); // Ensure we have a valid theme
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