import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext.jsx';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full border border-brand-charcoal/10 dark:border-brand-charcoal/40 bg-white/80 dark:bg-brand-ink/45 backdrop-blur-sm transition-colors hover:bg-brand-highlight dark:hover:bg-brand-charcoal/45"
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 text-brand-charcoal/80 dark:text-gray-100" />
      ) : (
        <Moon className="w-5 h-5 text-brand-charcoal/80 dark:text-gray-100" />
      )}
    </button>
  );
}
