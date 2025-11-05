/**
 * Client-side logging utility
 *
 * Provides environment-aware logging for browser/React code.
 * In production, errors can be sent to error tracking services (Sentry, LogRocket, etc.)
 */

const isDev = import.meta.env.MODE === 'development';

/**
 * Log levels
 */
const LogLevel = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

/**
 * Format timestamp for logs
 */
const getTimestamp = () => new Date().toISOString();

/**
 * Client-side logger
 */
const logger = {
  /**
   * Log error messages
   * In production, these should be sent to error tracking service
   */
  error: (message, ...args) => {
    if (isDev) {
      console.error(`[${getTimestamp()}] [ERROR]`, message, ...args);
    } else {
      // CRITICAL: In production, still log to console.error until error tracking is integrated
      // This ensures errors are not silently swallowed
      console.error(`[${getTimestamp()}] [ERROR]`, message, ...args);

      // Future: Send to error tracking service when integrated
      // Example integrations:
      if (window.Sentry) {
        window.Sentry.captureException(new Error(message), {
          extra: args[0] || {}
        });
      } else if (window.LogRocket) {
        window.LogRocket.captureException(new Error(message), {
          extra: args[0] || {}
        });
      }
    }
  },

  /**
   * Log warning messages
   * Only shown in development
   */
  warn: (message, ...args) => {
    if (isDev) {
      console.warn(`[${getTimestamp()}] [WARN]`, message, ...args);
    }
  },

  /**
   * Log info messages
   * Only shown in development
   */
  info: (message, ...args) => {
    if (isDev) {
      console.info(`[${getTimestamp()}] [INFO]`, message, ...args);
    }
  },

  /**
   * Log debug messages
   * Only shown in development
   */
  debug: (message, ...args) => {
    if (isDev) {
      console.log(`[${getTimestamp()}] [DEBUG]`, message, ...args);
    }
  }
};

/**
 * Helper function to format error objects consistently
 *
 * Usage:
 * logger.error('Failed to load data', formatError(err));
 * logger.error('Failed to load data', formatError(err, { userId: 123 }));
 */
const formatError = (error, additionalContext = {}) => {
  return {
    error: error?.message || error?.toString?.() || 'Unknown error',
    stack: error?.stack || 'No stack trace available',
    name: error?.name || 'Error',
    ...additionalContext
  };
};

export default logger;
export { LogLevel, formatError };
