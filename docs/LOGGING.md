# Logging & Error Tracking

This document describes the logging and error tracking infrastructure for the React portfolio website.

## Overview

The application implements **structured logging** with environment-aware behavior:

- **Development**: Full logging to console with timestamps and context
- **Production**: Silent operation with errors sent to error tracking service

## Architecture

### Client-Side Logger (`src/utils/logger.js`)

Browser-based logging for React components, hooks, and utilities.

**Log Levels:**
- `error` - Critical errors (sent to error tracking in production)
- `warn` - Warning messages (development only)
- `info` - Informational messages (development only)
- `debug` - Debug information (development only)

**Usage:**

```javascript
import logger from '../utils/logger';

// Error logging (works in both dev and production)
try {
  // risky operation
} catch (err) {
  logger.error('Operation failed', {
    error: err.message,
    stack: err.stack,
    userId: currentUser.id
  });
}

// Debug logging (development only)
logger.debug('Component mounted', { props });

// Info logging (development only)
logger.info('Data loaded', { count: data.length });

// Warning logging (development only)
logger.warn('Deprecated API used', { endpoint });
```

**Development Output:**
```
[2024-01-15T10:30:45.123Z] [ERROR] Operation failed { error: "...", stack: "..." }
[2024-01-15T10:30:45.234Z] [DEBUG] Component mounted { props: {...} }
```

**Production Behavior:**
- Only errors are logged
- Errors are sent to error tracking service (configure `window.__ERROR_TRACKER__`)
- No console pollution

### Server-Side Logger (`utils/logger.js`)

Node.js/Express logging for server operations.

**Log Levels:**
- `error` - Errors sent to stderr
- `warn` - Warnings sent to stderr
- `info` - Info sent to stdout
- `debug` - Debug info (development only)

**Usage:**

```javascript
const logger = require('./utils/logger');

// Error logging
logger.error('Database connection failed', {
  host: dbHost,
  error: err.message
});

// Info logging
logger.info('Server started', { port: 8080, env: 'production' });

// Warning logging
logger.warn('Rate limit exceeded', { ip: req.ip, attempts: 5 });

// Debug logging (development only)
logger.debug('Cache hit', { key: cacheKey });
```

**Development Output (Human-Readable):**
```
[2024-01-15T10:30:45.123Z] [ERROR] Database connection failed {"host":"localhost","error":"..."}
[2024-01-15T10:30:45.234Z] [INFO] Server started
```

**Production Output (Structured JSON):**
```json
{"timestamp":"2024-01-15T10:30:45.123Z","level":"ERROR","message":"Database connection failed","host":"localhost","error":"..."}
{"timestamp":"2024-01-15T10:30:45.234Z","level":"INFO","message":"Server started","port":8080,"env":"production"}
```

## Error Boundary

**Component:** `src/components/ErrorBoundary.jsx`

Catches React component errors and prevents app crashes.

**Features:**
- Graceful error UI with retry functionality
- Automatic error logging via client logger
- Development mode shows error details
- Production mode hides technical details

**Usage:**

```javascript
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <YourApp />
    </ErrorBoundary>
  );
}
```

**Error UI:**
- User-friendly error message
- "Try Again" button to reset error state
- "Go Home" button to navigate away
- Contact support link
- Development: Shows error stack traces

## Integration with Error Tracking Services

### Sentry Integration (Recommended)

**Installation:**
```bash
npm install @sentry/react
```

**Setup (`src/index.jsx`):**
```javascript
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: "YOUR_SENTRY_DSN",
    environment: import.meta.env.MODE,
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay()
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
```

**Update Client Logger:**
```javascript
// src/utils/logger.js
error: (message, ...args) => {
  if (isDev) {
    console.error(`[${getTimestamp()}] [ERROR]`, message, ...args);
  } else {
    // Send to Sentry
    if (window.Sentry) {
      Sentry.captureException(new Error(message), {
        extra: args[0]
      });
    }
  }
}
```

**Update Error Boundary:**
```javascript
// src/components/ErrorBoundary.jsx
componentDidCatch(error, errorInfo) {
  logger.error('React Error Boundary caught an error', {
    error: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack
  });

  // Send to Sentry
  if (window.Sentry) {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack
        }
      }
    });
  }
}
```

### LogRocket Integration (Alternative)

**Installation:**
```bash
npm install logrocket
npm install logrocket-react
```

**Setup:**
```javascript
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';

if (import.meta.env.PROD) {
  LogRocket.init('YOUR_APP_ID');
  setupLogRocketReact(LogRocket);
}
```

**Update Client Logger:**
```javascript
error: (message, ...args) => {
  if (!isDev && window.LogRocket) {
    LogRocket.captureException(new Error(message), {
      extra: args[0]
    });
  }
}
```

## Environment Variables

Create `.env` file for configuration:

```bash
# Development
VITE_LOG_LEVEL=debug
VITE_SENTRY_DSN=
VITE_LOGROCKET_APP_ID=

# Production
VITE_LOG_LEVEL=error
VITE_SENTRY_DSN=https://your-sentry-dsn
VITE_LOGROCKET_APP_ID=your-app-id
```

## Log Aggregation (Production)

For server logs, use log aggregation services:

### CloudWatch Logs (AWS)
```bash
# Install AWS CloudWatch agent on server
# Logs automatically streamed to CloudWatch
```

### Datadog
```bash
# Install Datadog agent
DD_API_KEY=your-key DD_SITE=datadoghq.com bash -c "$(curl -L https://s.datadoghq.com/scripts/install_script.sh)"
```

### Loggly
```javascript
// Add to server.js
const winston = require('winston');
const { Loggly } = require('winston-loggly-bulk');

winston.add(new Loggly({
  token: process.env.LOGGLY_TOKEN,
  subdomain: process.env.LOGGLY_SUBDOMAIN,
  tags: ["nodejs"],
  json: true
}));
```

## Monitoring & Alerts

Set up alerts for critical errors:

**Sentry Alerts:**
1. Go to Sentry Project Settings
2. Alerts → New Alert Rule
3. Configure: "When an event is seen"
4. Set conditions: `level:error`
5. Action: Email/Slack notification

**CloudWatch Alarms:**
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name high-error-rate \
  --alarm-description "Alert when error rate exceeds threshold" \
  --metric-name Errors \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --period 300
```

## Best Practices

### DO ✅

- **Use structured logging** with context objects
- **Log errors with full context** (user ID, request ID, etc.)
- **Use appropriate log levels**
- **Include timestamps** in all logs
- **Test error boundaries** in development
- **Monitor error rates** in production
- **Set up alerts** for critical errors

### DON'T ❌

- **Don't log sensitive data** (passwords, tokens, PII)
- **Don't use console.log in production** code
- **Don't ignore errors** silently
- **Don't log excessive debug info** in production
- **Don't expose error details** to end users
- **Don't forget to test** error scenarios

## Testing Logging

### Test Error Boundary

Create a test component that throws an error:

```javascript
// src/components/ErrorTest.jsx
function ErrorTest() {
  throw new Error('Test error for Error Boundary');
}

// Navigate to /error-test (add route in development only)
```

### Test Logger Levels

```javascript
// In development console
import logger from './src/utils/logger';

logger.debug('Debug test');
logger.info('Info test');
logger.warn('Warn test');
logger.error('Error test', { context: 'test' });
```

### Test Server Logging

```bash
# Development
npm run dev
# Check console for formatted logs

# Production
NODE_ENV=production npm start
# Check logs are in JSON format
```

## Troubleshooting

**Logs not appearing in development:**
- Check `import.meta.env.MODE` is 'development'
- Verify logger is imported correctly
- Check browser console filters

**Errors not sent to Sentry:**
- Verify Sentry DSN is correct
- Check `import.meta.env.PROD` is true
- Verify network requests to Sentry
- Check Sentry project dashboard

**Server logs not structured:**
- Verify `NODE_ENV=production`
- Check logger is imported correctly
- Verify stdout/stderr output

## Migration Guide

If you previously used `console.log` directly:

**Before:**
```javascript
console.log('User logged in:', userId);
console.error('Failed to save:', error);
```

**After:**
```javascript
import logger from '../utils/logger';

logger.info('User logged in', { userId });
logger.error('Failed to save', { error: error.message, stack: error.stack });
```

## Performance Considerations

- **Development**: Logging has minimal performance impact
- **Production**: Only errors are logged (negligible impact)
- **Error tracking**: Async, non-blocking
- **Structured JSON**: Efficient parsing by log aggregators

## Security Considerations

- **PII Sanitization**: Never log passwords, tokens, credit cards
- **Stack Traces**: Safe to log in error tracking, sanitize before showing users
- **User Context**: Log user IDs, not names/emails
- **Rate Limiting**: Error tracking services may rate-limit excessive errors

---

**Last Updated**: January 2025
**Maintained by**: Nathan A. King
