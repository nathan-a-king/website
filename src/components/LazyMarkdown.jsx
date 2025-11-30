import React, { lazy, Suspense } from 'react';
import remarkGfm from 'remark-gfm';
import remarkSupersub from 'remark-supersub';

// Lazy load ReactMarkdown and related components
const ReactMarkdown = lazy(() => import('react-markdown'));

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

// Lazy-loaded markdown component with fade-in effect
export default function LazyMarkdown({ children, components, className, ...props }) {
  const [hasLoaded, setHasLoaded] = React.useState(false);

  React.useEffect(() => {
    // Small delay to ensure smooth transition after skeleton
    const timer = setTimeout(() => {
      setHasLoaded(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Suspense fallback={<MarkdownSkeleton />}>
      <div
        className={`transition-opacity duration-1000 ease-in-out ${
          hasLoaded ? 'opacity-100' : 'opacity-0'
        } ${className || ''}`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkSupersub]}
          components={components}
          {...props}
        >
          {children}
        </ReactMarkdown>
      </div>
    </Suspense>
  );
}
