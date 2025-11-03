import React from 'react';
import { useLocation } from 'react-router-dom';
import logger, { formatError } from '../utils/logger';

/**
 * Error Boundary component to catch and handle React errors gracefully
 *
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 *
 * This component will:
 * - Catch errors in child components
 * - Log errors to error tracking service (in production)
 * - Display a user-friendly error message
 * - Prevent the entire app from crashing
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to error tracking service with standardized format
    logger.error('React Error Boundary caught an error', formatError(error, {
      componentStack: errorInfo?.componentStack || 'No component stack available'
    }));

    // Store error details in state for development debugging
    this.setState({
      error,
      errorInfo
    });

    // In production, you could send this to an error tracking service:
    // if (window.Sentry) {
    //   Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
    // }
  }

  componentDidUpdate(prevProps) {
    // Reset error state when location changes (route navigation)
    // This requires passing location as a prop from parent
    if (this.props.location && prevProps.location !== this.props.location) {
      if (this.state.hasError) {
        this.handleReset();
      }
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen bg-white dark:bg-brand-ink text-brand-charcoal dark:text-gray-200 font-avenir transition-colors flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <div className="bg-white/95 dark:bg-brand-ink/60 border-2 border-red-500/30 dark:border-red-500/50 rounded-3xl p-8 shadow-soft-xl">
              <div className="text-center mb-6">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <h1 className="text-3xl font-bold mb-2 text-brand-charcoal dark:text-white">
                  Oops! Something went wrong
                </h1>
                <p className="text-brand-charcoal/70 dark:text-gray-200">
                  We're sorry for the inconvenience. An unexpected error occurred.
                </p>
              </div>

              {import.meta.env.MODE === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2 text-red-800 dark:text-red-400">
                    Error Details (Development Only)
                  </h2>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-2 font-mono break-all">
                    {this.state.error?.toString?.() || this.state.error?.message || 'Unknown error occurred'}
                  </p>
                  {this.state.errorInfo?.componentStack && (
                    <details className="text-xs text-red-600 dark:text-red-400">
                      <summary className="cursor-pointer font-semibold mb-2">
                        Component Stack Trace
                      </summary>
                      <pre className="whitespace-pre-wrap font-mono bg-red-100 dark:bg-red-900/30 p-2 rounded overflow-auto max-h-64">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={this.handleReset}
                  className="px-6 py-3 bg-brand-primary border-2 border-brand-primary text-white rounded-full font-medium shadow-primary hover:shadow-primary-lg hover:-translate-y-0.5 transition-all"
                >
                  Try Again
                </button>
                <a
                  href="/"
                  className="px-6 py-3 bg-white/95 dark:bg-brand-ink/60 border-2 border-brand-charcoal/10 dark:border-brand-charcoal/30 text-brand-charcoal dark:text-gray-200 rounded-full font-medium hover:bg-brand-highlight dark:hover:bg-brand-charcoal/50 hover:border-brand-primary/30 dark:hover:border-brand-primary/40 hover:-translate-y-0.5 transition-all shadow-soft text-center"
                >
                  Go Home
                </a>
              </div>

              <div className="mt-6 text-center text-sm text-brand-charcoal/60 dark:text-gray-400">
                <p>
                  If this problem persists, please{' '}
                  <a
                    href="/contact"
                    className="text-brand-primary dark:text-brand-accent underline hover:text-brand-primary/80 dark:hover:text-white"
                  >
                    contact support
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Wrapper component that provides location to ErrorBoundary
 * This enables automatic error state reset on route changes
 */
function ErrorBoundaryWithRouter(props) {
  const location = useLocation();
  return <ErrorBoundary location={location} {...props} />;
}

export default ErrorBoundaryWithRouter;
export { ErrorBoundary };
