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
      // In production, send to error tracking service
      // Example: Sentry.captureException(new Error(message), { extra: args });

      // For now, silently track errors without console pollution
      // You can replace this with your error tracking service
      if (window.__ERROR_TRACKER__) {
        window.__ERROR_TRACKER__.captureError(message, args);
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

export default logger;
export { LogLevel };
