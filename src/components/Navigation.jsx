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
      <div className="pointer-events-auto w-full max-w-5xl px-6 py-3 bg-brand-cream dark:bg-brand-ink border border-brand-gray-border dark:border-white/10 rounded-lg shadow-card transition-all duration-300">
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
                      ? 'text-brand-charcoal dark:text-brand-cream font-medium'
                      : 'text-brand-gray-medium dark:text-brand-gray-light hover:text-brand-charcoal dark:hover:text-brand-cream'
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
                      ? 'text-brand-charcoal dark:text-brand-cream font-medium'
                      : 'text-brand-gray-medium dark:text-brand-gray-light hover:text-brand-charcoal dark:hover:text-brand-cream'
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
                      ? 'text-brand-charcoal dark:text-brand-cream font-medium'
                      : 'text-brand-gray-medium dark:text-brand-gray-light hover:text-brand-charcoal dark:hover:text-brand-cream'
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
                      ? 'text-brand-charcoal dark:text-brand-cream font-medium'
                      : 'text-brand-gray-medium dark:text-brand-gray-light hover:text-brand-charcoal dark:hover:text-brand-cream'
                  }`}
                >
                  Resume
                </Link>
              </li>
            </ul>
            <ThemeToggle />
          </div>

          {/* Mobile Theme Toggle and Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-brand-gray-medium dark:text-brand-gray-light hover:text-brand-charcoal dark:hover:text-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-terracotta/40"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-brand-cream dark:bg-brand-ink border-t border-brand-gray-border dark:border-white/10 shadow-md pointer-events-auto">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <ul className="flex flex-col space-y-4 text-md font-medium">
              <li>
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className={`block py-2 transition-colors ${
                    isActive('/')
                      ? 'text-brand-charcoal dark:text-brand-cream font-medium'
                      : 'text-brand-gray-medium dark:text-brand-gray-light hover:text-brand-charcoal dark:hover:text-brand-cream'
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
                      ? 'text-brand-charcoal dark:text-brand-cream font-medium'
                      : 'text-brand-gray-medium dark:text-brand-gray-light hover:text-brand-charcoal dark:hover:text-brand-cream'
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
                      ? 'text-brand-charcoal dark:text-brand-cream font-medium'
                      : 'text-brand-gray-medium dark:text-brand-gray-light hover:text-brand-charcoal dark:hover:text-brand-cream'
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
                      ? 'text-brand-charcoal dark:text-brand-cream font-medium'
                      : 'text-brand-gray-medium dark:text-brand-gray-light hover:text-brand-charcoal dark:hover:text-brand-cream'
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
