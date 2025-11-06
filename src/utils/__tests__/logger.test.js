import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import logger, { LogLevel, formatError } from '../logger';

describe('Logger', () => {
  let consoleErrorSpy;
  let consoleWarnSpy;
  let consoleInfoSpy;
  let consoleLogSpy;
  const currentMode = import.meta.env.MODE;
  const isDev = currentMode === 'development';

  beforeEach(() => {
    // Spy on console methods
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console methods
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleInfoSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  describe('LogLevel', () => {
    it('should export log level constants', () => {
      expect(LogLevel.ERROR).toBe('ERROR');
      expect(LogLevel.WARN).toBe('WARN');
      expect(LogLevel.INFO).toBe('INFO');
      expect(LogLevel.DEBUG).toBe('DEBUG');
    });
  });

  describe('logger.error', () => {
    it('should log errors in all modes', () => {
      logger.error('Test error message');

      expect(consoleErrorSpy).toHaveBeenCalled();
      const callArgs = consoleErrorSpy.mock.calls[0];
      expect(callArgs[1]).toBe('Test error message');
      expect(callArgs[0]).toContain('[ERROR]');
    });

    it('should include additional arguments', () => {
      logger.error('Error with data', { userId: 123 });

      expect(consoleErrorSpy).toHaveBeenCalled();
      const callArgs = consoleErrorSpy.mock.calls[0];
      expect(callArgs[2]).toEqual({ userId: 123 });
    });

    it('should support error tracking integration', () => {
      // Test that the error method can handle external tracking services
      const mockSentry = {
        captureException: vi.fn()
      };
      window.Sentry = mockSentry;

      logger.error('Integration test', { extra: 'data' });

      // Should always log to console
      expect(consoleErrorSpy).toHaveBeenCalled();

      delete window.Sentry;
    });
  });

  describe('logger.warn', () => {
    it('should log warnings only in development mode', () => {
      logger.warn('Test warning');

      if (isDev) {
        expect(consoleWarnSpy).toHaveBeenCalled();
        const callArgs = consoleWarnSpy.mock.calls[0];
        expect(callArgs[1]).toBe('Test warning');
        expect(callArgs[0]).toContain('[WARN]');
      } else {
        expect(consoleWarnSpy).not.toHaveBeenCalled();
      }
    });

    it('should include additional arguments in development', () => {
      logger.warn('Warning with data', { code: 'W001' });

      if (isDev) {
        expect(consoleWarnSpy).toHaveBeenCalled();
        const callArgs = consoleWarnSpy.mock.calls[0];
        expect(callArgs[2]).toEqual({ code: 'W001' });
      } else {
        expect(consoleWarnSpy).not.toHaveBeenCalled();
      }
    });
  });

  describe('logger.info', () => {
    it('should log info only in development mode', () => {
      logger.info('Test info');

      if (isDev) {
        expect(consoleInfoSpy).toHaveBeenCalled();
        const callArgs = consoleInfoSpy.mock.calls[0];
        expect(callArgs[1]).toBe('Test info');
        expect(callArgs[0]).toContain('[INFO]');
      } else {
        expect(consoleInfoSpy).not.toHaveBeenCalled();
      }
    });

    it('should include additional arguments in development', () => {
      logger.info('Info with data', { status: 'ok' });

      if (isDev) {
        expect(consoleInfoSpy).toHaveBeenCalled();
        const callArgs = consoleInfoSpy.mock.calls[0];
        expect(callArgs[2]).toEqual({ status: 'ok' });
      } else {
        expect(consoleInfoSpy).not.toHaveBeenCalled();
      }
    });
  });

  describe('logger.debug', () => {
    it('should log debug only in development mode', () => {
      logger.debug('Test debug');

      if (isDev) {
        expect(consoleLogSpy).toHaveBeenCalled();
        const callArgs = consoleLogSpy.mock.calls[0];
        expect(callArgs[1]).toBe('Test debug');
        expect(callArgs[0]).toContain('[DEBUG]');
      } else {
        expect(consoleLogSpy).not.toHaveBeenCalled();
      }
    });

    it('should include additional arguments in development', () => {
      logger.debug('Debug with data', { trace: 'stack' });

      if (isDev) {
        expect(consoleLogSpy).toHaveBeenCalled();
        const callArgs = consoleLogSpy.mock.calls[0];
        expect(callArgs[2]).toEqual({ trace: 'stack' });
      } else {
        expect(consoleLogSpy).not.toHaveBeenCalled();
      }
    });
  });

  describe('formatError', () => {
    it('should format Error objects correctly', () => {
      const error = new Error('Test error message');
      error.stack = 'Test stack trace';

      const formatted = formatError(error);

      expect(formatted.error).toBe('Test error message');
      expect(formatted.stack).toBe('Test stack trace');
      expect(formatted.name).toBe('Error');
    });

    it('should include additional context', () => {
      const error = new Error('Test error');
      const context = { userId: 123, action: 'fetchData' };

      const formatted = formatError(error, context);

      expect(formatted.error).toBe('Test error');
      expect(formatted.userId).toBe(123);
      expect(formatted.action).toBe('fetchData');
    });

    it('should handle errors without message', () => {
      const error = {};

      const formatted = formatError(error);

      expect(formatted.error).toBe('[object Object]');
      expect(formatted.stack).toBe('No stack trace available');
      expect(formatted.name).toBe('Error');
    });

    it('should handle string errors', () => {
      const formatted = formatError('String error');

      expect(formatted.error).toBe('String error');
      expect(formatted.stack).toBe('No stack trace available');
    });

    it('should handle null/undefined errors', () => {
      const formatted = formatError(null);

      expect(formatted.error).toBe('Unknown error');
      expect(formatted.stack).toBe('No stack trace available');
    });

    it('should preserve custom error properties', () => {
      const error = new Error('Custom error');
      error.code = 'E001';

      const formatted = formatError(error, { requestId: 'abc123' });

      expect(formatted.error).toBe('Custom error');
      expect(formatted.requestId).toBe('abc123');
    });
  });

  describe('Timestamps', () => {
    it('should include ISO timestamp in error logs', () => {
      logger.error('Timestamp test');

      const callArgs = consoleErrorSpy.mock.calls[0];
      const timestamp = callArgs[0];

      // Should contain a timestamp in ISO format
      expect(timestamp).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
    });

    it('should include timestamp in all log levels when in development', () => {
      logger.error('Error');
      logger.warn('Warning');
      logger.info('Info');
      logger.debug('Debug');

      expect(consoleErrorSpy.mock.calls[0][0]).toMatch(/\d{4}-\d{2}-\d{2}T/);

      if (isDev) {
        expect(consoleWarnSpy.mock.calls[0][0]).toMatch(/\d{4}-\d{2}-\d{2}T/);
        expect(consoleInfoSpy.mock.calls[0][0]).toMatch(/\d{4}-\d{2}-\d{2}T/);
        expect(consoleLogSpy.mock.calls[0][0]).toMatch(/\d{4}-\d{2}-\d{2}T/);
      }
    });
  });
});
