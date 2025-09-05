import React, { lazy, Suspense } from 'react';

// Lazy load ReactMarkdown and related components
const ReactMarkdown = lazy(() => import('react-markdown'));
const CodeBlock = lazy(() => import('../components/CodeBlock.tsx'));

// Loading fallback component
const MarkdownSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
    </div>
    <div className="h-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
    </div>
  </div>
);

// Lazy-loaded markdown component
export default function LazyMarkdown({ children, components, ...props }) {
  return (
    <Suspense fallback={<MarkdownSkeleton />}>
      <ReactMarkdown 
        components={components}
        {...props}
      >
        {children}
      </ReactMarkdown>
    </Suspense>
  );
}