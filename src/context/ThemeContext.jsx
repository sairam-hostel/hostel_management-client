import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [accentColor, setAccentColor] = useState('#7c3aed'); // Default purple-600

  useEffect(() => {
    const savedColor = localStorage.getItem('accentColor');
    if (savedColor) {
      setAccentColor(savedColor);
    }
  }, []);

  const updateAccentColor = (color) => {
    setAccentColor(color);
    localStorage.setItem('accentColor', color);
  };

  return (
    <ThemeContext.Provider value={{ accentColor, updateAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
};
