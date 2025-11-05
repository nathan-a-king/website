import React, { useEffect, useState } from 'react';

export default function SkillBar({ name, level, delay = 0 }) {
  const [animatedLevel, setAnimatedLevel] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedLevel(level);
    }, delay);

    return () => clearTimeout(timer);
  }, [level, delay]);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-brand-charcoal/80 dark:text-gray-200">
          {name}
        </span>
        <span className="text-sm text-brand-charcoal/60 dark:text-gray-200">
          {level}%
        </span>
      </div>
      
      <div className="w-full bg-brand-soft dark:bg-brand-charcoal/50 rounded-full h-2">
        <div
          className="bg-brand-terracotta dark:bg-brand-terracotta h-2 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${animatedLevel}%` }}
        />
      </div>
    </div>
  );
}
