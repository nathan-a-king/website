import React, { createContext, useContext, useState, useEffect } from 'react';
import logger from '../utils/logger';

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
    // Update both light and dark theme-color meta tags to match actual CSS background colors
    const metaThemeColorLight = document.querySelector('meta[name="theme-color"][media*="light"]');
    const metaThemeColorDark = document.querySelector('meta[name="theme-color"][media*="dark"]');

    if (metaThemeColorLight) {
      metaThemeColorLight.setAttribute('content', '#FAF9F5');
    }
    if (metaThemeColorDark) {
      metaThemeColorDark.setAttribute('content', '#252522');
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

    // Use the appropriate logo based on theme
    const logoPath = isDark ? '/mac-logo-white.png' : '/mac-logo.png';
    
    // Create an image element to load the logo
    const img = new Image();
    img.onload = () => {
      // Create canvas for favicon
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 32;
      canvas.height = 32;

      // Draw the logo image onto the canvas
      ctx.drawImage(img, 0, 0, 32, 32);

      // Convert canvas to data URL and update favicon
      const dataURL = canvas.toDataURL('image/png');
      favicon.href = dataURL;
    };
    
    // Fallback: if logo fails to load, keep current favicon
    img.onerror = () => {
      logger.warn('Failed to load logo for favicon', { logoPath });
    };
    
    img.src = logoPath;
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
