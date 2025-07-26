import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "./ThemeToggle";

export default function Navigation() {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <img 
            src="/mac-logo.png" 
            alt="Nathan A. King" 
            className={`h-12 w-auto transition-all duration-200 ${isDarkMode ? 'brightness-0 invert' : ''}`}
          />
        </Link>
        
        {/* Navigation Links and Theme Toggle */}
        <div className="flex items-center space-x-6">
          <ul className="flex space-x-6 text-md font-medium">
            <li>
              <Link 
                to="/"
                className={`transition ${
                  isActive('/') 
                    ? 'text-black dark:text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/blog"
                className={`transition ${
                  isActive('/blog') 
                    ? 'text-black dark:text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link 
                to="/about"
                className={`transition ${
                  isActive('/about') 
                    ? 'text-black dark:text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                to="/contact"
                className={`transition ${
                  isActive('/contact') 
                    ? 'text-black dark:text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                Contact
              </Link>
            </li>
          </ul>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
