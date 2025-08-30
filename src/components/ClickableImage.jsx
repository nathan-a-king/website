import React, { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import ImageModal from './ImageModal.jsx';

export default function ClickableImage({ src, alt, className = '' }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="my-8 group cursor-pointer" onClick={() => setIsModalOpen(true)}>
        <div className="relative overflow-hidden rounded-lg">
          <img 
            src={src} 
            alt={alt} 
            className={`w-full max-w-2xl mx-auto rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-[1.02] ${className}`}
            loading="lazy"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
              <Maximize2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </div>
          </div>
        </div>
        {alt && (
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center mt-3 italic">
            {alt}
          </div>
        )}
      </div>
      
      <ImageModal 
        src={src}
        alt={alt}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
