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
 * Format log message as JSON for production (easier parsing by log aggregators)
 * or as human-readable text for development
 */
const formatMessage = (level, message, meta = {}) => {
  const timestamp = getTimestamp();

  if (isDev) {
    // Human-readable format for development
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaStr}`;
  } else {
    // Structured JSON for production (log aggregation friendly)
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta
    });
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

module.exports = logger;
module.exports.LogLevel = LogLevel;
