import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Default to 'light' to respect user's previous request, but allow toggling
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
            return localStorage.getItem('theme');
        }
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    const [accentColor, setAccentColor] = useState(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('accentColor')) {
            return localStorage.getItem('accentColor');
        }
        return '#9333ea'; // Default purple-600
    });

    const updateAccentColor = (color) => {
        setAccentColor(color);
        localStorage.setItem('accentColor', color);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, accentColor, updateAccentColor }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
