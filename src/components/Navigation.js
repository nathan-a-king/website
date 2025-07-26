import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/70 border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <img src="/mac-logo.png" alt="Nathan A. King" className="h-12 w-auto" />
        </Link>
        
        {/* Navigation Links */}
        <ul className="flex space-x-6 text-md font-medium">
          <li>
            <Link 
              to="/"
              className={`transition ${
                isActive('/') 
                  ? 'text-black' 
                  : 'text-gray-600 hover:text-gray-700'
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
                  ? 'text-black' 
                  : 'text-gray-600 hover:text-gray-700'
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
                  ? 'text-black' 
                  : 'text-gray-600 hover:text-gray-700'
              }`}
            >
              About
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
