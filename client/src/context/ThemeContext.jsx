import React, { useState, useMemo, useCallback, useEffect, useContext, createContext } from 'react';

// Define the Theme Context
export const ThemeContext = createContext({
    theme: 'light',
    toggleTheme: () => {},
});

// Custom hook to consume the Theme Context
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
    // Determine initial theme preference from OS or localStorage
    const getInitialTheme = () => {
        // 1. Check local storage first
        if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
            return localStorage.getItem('theme');
        }
        // 2. Check system preference
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        // 3. Default to light
        return 'light';
    };

    const [theme, setTheme] = useState(getInitialTheme);

    const toggleTheme = useCallback(() => {
        setTheme(prev => {
            const newTheme = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    }, []);

    // Effect to apply the 'dark' class to the HTML root element
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
