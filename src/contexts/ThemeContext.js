import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize state based on system preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Only use saved theme if it exists, otherwise use system preference
      if (savedTheme && savedTheme !== 'system') {
        return savedTheme === 'dark';
      }
      return prefersDark;
    }
    return false;
  });

  const [useSystemPreference, setUseSystemPreference] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return !savedTheme || savedTheme === 'system';
    }
    return true;
  });

  // Listen for system theme changes
  useEffect(() => {
    if (!useSystemPreference) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (useSystemPreference) {
        setIsDarkMode(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [useSystemPreference]);

  useEffect(() => {
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDarkMode ? '#111827' : '#ffffff');
    }
    
    // Update favicon based on theme
    updateFavicon(isDarkMode);
    
    // Only save to localStorage if user has made a manual choice
    if (!useSystemPreference) {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode, useSystemPreference]);

  const updateFavicon = (isDark) => {
    const favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) return;

    // Create a canvas to generate a dynamic favicon
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 32;
    canvas.height = 32;

    // Set background and text color based on theme
    ctx.fillStyle = isDark ? '#1f2937' : '#ffffff';
    ctx.fillRect(0, 0, 32, 32);
    
    ctx.fillStyle = isDark ? '#ffffff' : '#1f2937';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', 16, 16);

    // Convert canvas to data URL and update favicon
    const dataURL = canvas.toDataURL('image/png');
    favicon.href = dataURL;
  };

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    setUseSystemPreference(false);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  const resetToSystemPreference = () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    setUseSystemPreference(true);
    localStorage.setItem('theme', 'system');
  };

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleTheme, 
      resetToSystemPreference, 
      useSystemPreference 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
