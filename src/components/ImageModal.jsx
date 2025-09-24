import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext.jsx';

export default function ImageModal({ src, alt, isOpen, onClose }) {
  const { isDarkMode } = useTheme();
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;

      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling on both body and html
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      // Restore scroll position if it changed
      if (window.scrollY !== scrollY) {
        window.scrollTo(0, scrollY);
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className={isDarkMode ? 'fixed inset-0 backdrop-blur-sm bg-gray-900' : 'fixed inset-0 backdrop-blur-sm bg-white/95'}
      style={{ zIndex: 999999 }}
      onClick={onClose}
    >
      <div className="fixed inset-0 flex items-center justify-center p-4 pt-24 pb-16">
        <div className="relative">
          {/* Image */}
          <img
            src={src}
            alt={alt}
            className="max-w-[85vw] max-h-[75vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          
          {/* Close button - positioned relative to the image */}
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 p-2 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            style={{ zIndex: 1000000 }}
            aria-label="Close image"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Caption */}
        {alt && (
          <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg text-sm max-w-[80%] text-center ${isDarkMode ? 'bg-gray-800/90 text-gray-200' : 'bg-gray-100/90 text-gray-800'}`}>
            {alt}
          </div>
        )}
      </div>
    </div>
  );
}
