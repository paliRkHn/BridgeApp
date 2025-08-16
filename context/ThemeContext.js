// context/ThemeContext.js
import React, { createContext, useContext, useState } from 'react';

const themes = {
  default: {
    background: '#FFFFFF',
    text: '#333333',
    primary: '#432272',
    secondary: '#666666',
    card: '#f8f9fa',
    border: '#e0e0e0'
  },
  dark: {
    background: '#000000',
    text: '#FFFFFF',
    primary: '#A999FF',
    secondary: '#AAAAAA',
    card: '#1C1C1E',
    border: '#38383A'
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

export const ThemeProvider = ({ children }) => {
  const [themeKey, setThemeKey] = useState('default');

  const theme = themes[themeKey] || themes.default;

  const selectTheme = (key) => {
    if (themes[key]) {
      setThemeKey(key);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, themeKey, selectTheme, themes }}>
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