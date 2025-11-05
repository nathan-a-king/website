/**
 * Server-side logging utility
 *
 * Provides structured logging for Node.js/Express server.
 * Outputs to stdout/stderr with proper formatting for log aggregation.
 */

const isDev = process.env.NODE_ENV !== 'production';

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
 * Safely serialize metadata to JSON, handling circular references
 */
const safeStringify = (obj) => {
  try {
    return JSON.stringify(obj);
  } catch (err) {
    // Handle circular references or other stringify errors
    try {
      // Attempt to stringify with a simple replacer that skips circular refs
      const seen = new WeakSet();
      return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return '[Circular]';
          }
          seen.add(value);
        }
        return value;
      });
    } catch (innerErr) {
      return JSON.stringify({ error: 'Failed to serialize metadata', reason: innerErr.message });
    }
  }
};

/**
 * Format log message as JSON for production (easier parsing by log aggregators)
 * or as human-readable text for development
 */
const formatMessage = (level, message, meta = {}) => {
  const timestamp = getTimestamp();

  if (isDev) {
    // Human-readable format for development
    const metaStr = Object.keys(meta).length > 0 ? ` ${safeStringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaStr}`;
  } else {
    // Structured JSON for production (log aggregation friendly)
    // Use safeStringify to handle circular references
    try {
      return safeStringify({
        timestamp,
        level,
        message,
        ...meta
      });
    } catch (err) {
      // Fallback if even safeStringify fails
      return safeStringify({
        timestamp,
        level,
        message,
        error: 'Failed to serialize metadata'
      });
    }
  }
};

/**
 * Server-side logger
 */
const logger = {
  /**
   * Log error messages to stderr
   * These should be monitored in production
   */
  error: (message, meta = {}) => {
    const formatted = formatMessage(LogLevel.ERROR, message, meta);
    process.stderr.write(formatted + '\n');
  },

  /**
   * Log warning messages to stderr
   */
  warn: (message, meta = {}) => {
    const formatted = formatMessage(LogLevel.WARN, message, meta);
    process.stderr.write(formatted + '\n');
  },

  /**
   * Log info messages to stdout
   */
  info: (message, meta = {}) => {
    const formatted = formatMessage(LogLevel.INFO, message, meta);
    process.stdout.write(formatted + '\n');
  },

  /**
   * Log debug messages to stdout (only in development)
   */
  debug: (message, meta = {}) => {
    if (isDev) {
      const formatted = formatMessage(LogLevel.DEBUG, message, meta);
      process.stdout.write(formatted + '\n');
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

module.exports = logger;
module.exports.LogLevel = LogLevel;
module.exports.formatError = formatError;
