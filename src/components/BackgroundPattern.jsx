import React from 'react';

export default function BackgroundPattern({ variant = 'dots', className = '' }) {
  if (variant === 'dots') {
    return (
      <div
        className={`absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none ${className}`}
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />
    );
  }

  if (variant === 'grid') {
    return (
      <div
        className={`absolute inset-0 opacity-[0.025] dark:opacity-[0.015] pointer-events-none ${className}`}
        style={{
          backgroundImage: `
            linear-gradient(currentColor 1px, transparent 1px),
            linear-gradient(90deg, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />
    );
  }

  return null;
}
