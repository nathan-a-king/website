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
    <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-4 flex justify-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-5xl px-6 py-3 bg-white/70 dark:bg-brand-ink/40 border border-brand-charcoal/10 dark:border-brand-charcoal/40 backdrop-blur-xl backdrop-saturate-150 rounded-pill shadow-pill transition-all duration-300">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" onClick={closeMobileMenu}>
            <img 
              src="/mac-logo.png" 
              alt="Nathan A. King" 
              className={`h-12 w-auto transition-all duration-200 ${isDarkMode ? 'brightness-0 invert' : ''}`}
            />
          </Link>
          
          {/* Desktop Navigation Links and Theme Toggle */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-6 text-sm font-medium tracking-wide">
              <li>
                <Link 
                  to="/"
                  className={`transition-colors ${
                    isActive('/') 
                      ? 'text-brand-primary dark:text-white' 
                      : 'text-brand-charcoal/80 dark:text-gray-200 hover:text-brand-primary dark:hover:text-white'
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog"
                  className={`transition-colors ${
                    isActive('/blog') 
                      ? 'text-brand-primary dark:text-white' 
                      : 'text-brand-charcoal/80 dark:text-gray-200 hover:text-brand-primary dark:hover:text-white'
                  }`}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  to="/about"
                  className={`transition-colors ${
                    isActive('/about') 
                      ? 'text-brand-primary dark:text-white' 
                      : 'text-brand-charcoal/80 dark:text-gray-200 hover:text-brand-primary dark:hover:text-white'
                  }`}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/resume"
                  className={`transition-colors ${
                    isActive('/resume') 
                      ? 'text-brand-primary dark:text-white' 
                      : 'text-brand-charcoal/80 dark:text-gray-200 hover:text-brand-primary dark:hover:text-white'
                  }`}
                >
                  Resume
                </Link>
              </li>
            </ul>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu Button and Theme Toggle */}
        <div className="md:hidden mt-4 flex justify-end">
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-brand-charcoal/70 dark:text-gray-200 hover:text-brand-charcoal dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
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
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/70 dark:bg-brand-ink/40 border-t border-brand-charcoal/10 dark:border-brand-charcoal/40 backdrop-blur-xl backdrop-saturate-150 shadow-xl pointer-events-auto">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <ul className="flex flex-col space-y-4 text-md font-medium">
              <li>
                <Link 
                  to="/"
                  onClick={closeMobileMenu}
                  className={`block py-2 transition-colors ${
                    isActive('/') 
                      ? 'text-brand-primary dark:text-white' 
                      : 'text-brand-charcoal/80 dark:text-gray-200 hover:text-brand-primary dark:hover:text-white'
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog"
                  onClick={closeMobileMenu}
                  className={`block py-2 transition-colors ${
                    isActive('/blog') 
                      ? 'text-brand-primary dark:text-white' 
                      : 'text-brand-charcoal/80 dark:text-gray-200 hover:text-brand-primary dark:hover:text-white'
                  }`}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  to="/about"
                  onClick={closeMobileMenu}
                  className={`block py-2 transition-colors ${
                    isActive('/about') 
                      ? 'text-brand-primary dark:text-white' 
                      : 'text-brand-charcoal/80 dark:text-gray-200 hover:text-brand-primary dark:hover:text-white'
                  }`}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/resume"
                  onClick={closeMobileMenu}
                  className={`block py-2 transition-colors ${
                    isActive('/resume') 
                      ? 'text-brand-primary dark:text-white' 
                      : 'text-brand-charcoal/80 dark:text-gray-200 hover:text-brand-primary dark:hover:text-white'
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
