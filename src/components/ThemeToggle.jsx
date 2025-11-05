import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext.jsx';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border border-brand-border bg-brand-bg backdrop-blur-sm transition-all duration-200 hover:bg-brand-surface"
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 text-brand-text-primary" />
      ) : (
        <Moon className="w-5 h-5 text-brand-text-primary" />
      )}
    </button>
  );
}
