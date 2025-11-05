import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext.jsx';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border border-brand-gray-border dark:border-white/10 bg-brand-cream dark:bg-brand-ink backdrop-blur-sm transition-all duration-200 hover:bg-brand-soft dark:hover:bg-white/5"
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 text-brand-charcoal dark:text-brand-cream" />
      ) : (
        <Moon className="w-5 h-5 text-brand-charcoal dark:text-brand-cream" />
      )}
    </button>
  );
}
