import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Navigation() {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path) => location.pathname === path;
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" onClick={closeMobileMenu}>
          <img 
            src="/mac-logo.png" 
            alt="Nathan A. King" 
            className={`h-12 w-auto transition-all duration-200 ${isDarkMode ? 'brightness-0 invert' : ''}`}
          />
        </Link>
        
        {/* Desktop Navigation Links and Theme Toggle */}
        <div className="hidden md:flex items-center space-x-6">
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
                to="/resume"
                className={`transition ${
                  isActive('/resume') 
                    ? 'text-black dark:text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                Resume
              </Link>
            </li>
          </ul>
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button and Theme Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          <ThemeToggle />
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span className={`block h-0.5 w-6 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <ul className="flex flex-col space-y-4 text-md font-medium">
              <li>
                <Link 
                  to="/"
                  onClick={closeMobileMenu}
                  className={`block py-2 transition ${
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
                  onClick={closeMobileMenu}
                  className={`block py-2 transition ${
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
                  onClick={closeMobileMenu}
                  className={`block py-2 transition ${
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
                  to="/resume"
                  onClick={closeMobileMenu}
                  className={`block py-2 transition ${
                    isActive('/resume') 
                      ? 'text-black dark:text-white' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  Resume
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}
