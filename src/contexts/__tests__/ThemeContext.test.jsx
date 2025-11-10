import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, useTheme } from '../ThemeContext';
import * as logger from '../../utils/logger';

// Mock logger
vi.mock('../../utils/logger', () => ({
  default: {
    warn: vi.fn(),
  },
}));

describe('ThemeContext', () => {
  let localStorageMock;
  let matchMediaMock;
  let mediaQueryListeners;

  beforeEach(() => {
    // Reset DOM
    document.documentElement.className = '';
    document.documentElement.style.cssText = '';
    document.head.innerHTML = '';

    // Mock localStorage
    localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    // Mock matchMedia
    mediaQueryListeners = [];
    matchMediaMock = vi.fn((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn((event, handler) => {
        mediaQueryListeners.push({ event, handler });
      }),
      removeEventListener: vi.fn((event, handler) => {
        mediaQueryListeners = mediaQueryListeners.filter(
          (listener) => listener.handler !== handler
        );
      }),
    }));
    Object.defineProperty(window, 'matchMedia', {
      value: matchMediaMock,
      writable: true,
    });

    // Mock Image for favicon loading
    global.Image = class {
      constructor() {
        setTimeout(() => {
          this.onload && this.onload();
        }, 0);
      }
      src = '';
      onload = null;
      onerror = null;
    };

    // Mock Canvas for favicon generation
    const originalCreateElement = document.createElement.bind(document);
    const mockContext = {
      drawImage: vi.fn(),
      filter: undefined,
    };
    const mockCanvas = {
      getContext: vi.fn(() => mockContext),
      toDataURL: vi.fn(() => 'data:image/png;base64,mock'),
      width: 0,
      height: 0,
    };

    document.createElement = vi.fn((tagName) => {
      if (tagName === 'canvas') return mockCanvas;
      return originalCreateElement(tagName);
    });

    vi.clearAllMocks();
  });

  const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

  describe('useTheme hook', () => {
    it('should throw error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleError = console.error;
      console.error = vi.fn();

      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within a ThemeProvider');

      console.error = consoleError;
    });

    it('should return theme context when used within ThemeProvider', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current).toHaveProperty('isDarkMode');
      expect(result.current).toHaveProperty('toggleTheme');
      expect(result.current).toHaveProperty('resetToSystemPreference');
      expect(result.current).toHaveProperty('useSystemPreference');
    });
  });

  describe('ThemeProvider initialization', () => {
    it('should initialize with light mode when no saved theme and system prefers light', () => {
      localStorageMock.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() });

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.isDarkMode).toBe(false);
      expect(result.current.useSystemPreference).toBe(true);
    });

    it('should initialize with dark mode when no saved theme and system prefers dark', () => {
      localStorageMock.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() });

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.isDarkMode).toBe(true);
      expect(result.current.useSystemPreference).toBe(true);
    });

    it('should initialize with saved dark theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.isDarkMode).toBe(true);
      expect(result.current.useSystemPreference).toBe(false);
    });

    it('should initialize with saved light theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('light');

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.isDarkMode).toBe(false);
      expect(result.current.useSystemPreference).toBe(false);
    });

    it('should use system preference when saved theme is "system"', () => {
      localStorageMock.getItem.mockReturnValue('system');
      matchMediaMock.mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() });

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.isDarkMode).toBe(true);
      expect(result.current.useSystemPreference).toBe(true);
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark mode', () => {
      localStorageMock.getItem.mockReturnValue('light');

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.isDarkMode).toBe(false);

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.isDarkMode).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('should toggle from dark to light mode', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.isDarkMode).toBe(true);

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.isDarkMode).toBe(false);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    it('should disable system preference when toggling', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.useSystemPreference).toBe(true);

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.useSystemPreference).toBe(false);
    });
  });

  describe('resetToSystemPreference', () => {
    it('should reset to system dark preference', () => {
      localStorageMock.getItem.mockReturnValue('light');
      matchMediaMock.mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() });

      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.resetToSystemPreference();
      });

      expect(result.current.isDarkMode).toBe(true);
      expect(result.current.useSystemPreference).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'system');
    });

    it('should reset to system light preference', () => {
      localStorageMock.getItem.mockReturnValue('dark');
      matchMediaMock.mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() });

      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.resetToSystemPreference();
      });

      expect(result.current.isDarkMode).toBe(false);
      expect(result.current.useSystemPreference).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'system');
    });
  });

  describe('DOM updates', () => {
    it('should add dark class to document element in dark mode', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      renderHook(() => useTheme(), { wrapper });

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should remove dark class from document element in light mode', () => {
      localStorageMock.getItem.mockReturnValue('light');
      document.documentElement.classList.add('dark');

      renderHook(() => useTheme(), { wrapper });

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should set color-scheme CSS property for dark mode', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      renderHook(() => useTheme(), { wrapper });

      expect(document.documentElement.style.getPropertyValue('color-scheme')).toBe('dark');
    });

    it('should set color-scheme CSS property for light mode', () => {
      localStorageMock.getItem.mockReturnValue('light');

      renderHook(() => useTheme(), { wrapper });

      expect(document.documentElement.style.getPropertyValue('color-scheme')).toBe('light');
    });

    it('should create meta theme-color tag for dark mode', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      renderHook(() => useTheme(), { wrapper });

      const meta = document.querySelector('meta[name="theme-color"]');
      expect(meta).toBeTruthy();
      expect(meta.content).toBe('#252522');
    });

    it('should create meta theme-color tag for light mode', () => {
      localStorageMock.getItem.mockReturnValue('light');

      renderHook(() => useTheme(), { wrapper });

      const meta = document.querySelector('meta[name="theme-color"]');
      expect(meta).toBeTruthy();
      expect(meta.content).toBe('#FAF9F5');
    });

    it('should remove existing theme-color meta tag before creating new one', () => {
      const originalCreateElement = document.createElement.bind(document);
      const existingMeta = originalCreateElement('meta');
      existingMeta.name = 'theme-color';
      existingMeta.content = '#000000';
      document.head.appendChild(existingMeta);

      localStorageMock.getItem.mockReturnValue('dark');

      renderHook(() => useTheme(), { wrapper });

      const allThemeMetas = document.querySelectorAll('meta[name="theme-color"]');
      expect(allThemeMetas.length).toBe(1);
      expect(allThemeMetas[0].content).toBe('#252522');
    });
  });

  describe('system preference changes', () => {
    it('should listen to system preference changes when useSystemPreference is true', () => {
      localStorageMock.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      });

      renderHook(() => useTheme(), { wrapper });

      expect(matchMediaMock).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
      expect(matchMediaMock().addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should update theme when system preference changes', () => {
      let changeHandler;
      matchMediaMock.mockReturnValue({
        matches: false,
        addEventListener: vi.fn((event, handler) => {
          changeHandler = handler;
        }),
        removeEventListener: vi.fn(),
      });
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.isDarkMode).toBe(false);

      // Simulate system preference change to dark
      act(() => {
        changeHandler({ matches: true });
      });

      expect(result.current.isDarkMode).toBe(true);
    });

    it('should not add listener when manual theme is set', () => {
      const addEventListener = vi.fn();
      matchMediaMock.mockReturnValue({
        matches: false,
        addEventListener,
        removeEventListener: vi.fn(),
      });
      localStorageMock.getItem.mockReturnValue('light');

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.isDarkMode).toBe(false);
      expect(result.current.useSystemPreference).toBe(false);

      // Should not add event listener when not using system preference
      expect(addEventListener).not.toHaveBeenCalled();
    });

    it('should cleanup system preference listener on unmount', () => {
      const removeEventListener = vi.fn();
      matchMediaMock.mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener,
      });

      const { unmount } = renderHook(() => useTheme(), { wrapper });

      unmount();

      expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });
  });

  describe('localStorage integration', () => {
    it('should not save to localStorage when using system preference initially', () => {
      localStorageMock.getItem.mockReturnValue(null);

      renderHook(() => useTheme(), { wrapper });

      // Should not call setItem on initial render with system preference
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('should save to localStorage when toggling theme', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.toggleTheme();
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', expect.any(String));
    });

    it('should save "system" to localStorage when resetting to system preference', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.resetToSystemPreference();
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'system');
    });
  });

  describe('favicon updates', () => {
    it('should update favicon for dark mode', async () => {
      const originalCreateElement = document.createElement.bind(document);
      const mockFavicon = originalCreateElement('link');
      mockFavicon.rel = 'icon';
      mockFavicon.href = '';
      document.head.appendChild(mockFavicon);

      localStorageMock.getItem.mockReturnValue('dark');

      renderHook(() => useTheme(), { wrapper });

      // Wait for async favicon update
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Favicon href should be updated to data URL
      expect(mockFavicon.href).toContain('data:image/png;base64');
    });

    it('should update favicon for light mode', async () => {
      const originalCreateElement = document.createElement.bind(document);
      const mockFavicon = originalCreateElement('link');
      mockFavicon.rel = 'icon';
      mockFavicon.href = '';
      document.head.appendChild(mockFavicon);

      localStorageMock.getItem.mockReturnValue('light');

      renderHook(() => useTheme(), { wrapper });

      // Wait for async favicon update
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Favicon href should be updated to data URL
      expect(mockFavicon.href).toContain('data:image/png;base64');
    });

    it('should handle favicon load errors gracefully', async () => {
      global.Image = class {
        constructor() {
          setTimeout(() => {
            this.onerror && this.onerror();
          }, 0);
        }
        src = '';
        onload = null;
        onerror = null;
      };

      const originalCreateElement = document.createElement.bind(document);
      const mockFavicon = originalCreateElement('link');
      mockFavicon.rel = 'icon';
      document.head.appendChild(mockFavicon);

      localStorageMock.getItem.mockReturnValue('dark');

      renderHook(() => useTheme(), { wrapper });

      // Wait for async error handling
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(logger.default.warn).toHaveBeenCalled();
    });

    it('should apply invert filter to canvas context for dark mode', async () => {
      const originalCreateElement = document.createElement.bind(document);

      // Create a fresh mock context for this test
      const mockContext = {
        drawImage: vi.fn(),
        filter: undefined,
      };
      const mockCanvas = {
        getContext: vi.fn(() => mockContext),
        toDataURL: vi.fn(() => 'data:image/png;base64,mock'),
        width: 0,
        height: 0,
      };

      // Override createElement for this test
      const originalCreateElementFn = document.createElement;
      document.createElement = vi.fn((tagName) => {
        if (tagName === 'canvas') return mockCanvas;
        return originalCreateElement(tagName);
      });

      const mockFavicon = originalCreateElement('link');
      mockFavicon.rel = 'icon';
      mockFavicon.href = '';
      document.head.appendChild(mockFavicon);

      localStorageMock.getItem.mockReturnValue('dark');

      renderHook(() => useTheme(), { wrapper });

      // Wait for async favicon update
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Verify filter was applied
      expect(mockContext.filter).toBe('invert(1)');
      expect(mockContext.drawImage).toHaveBeenCalled();

      // Restore original createElement
      document.createElement = originalCreateElementFn;
    });

    it('should not apply filter to canvas context for light mode', async () => {
      const originalCreateElement = document.createElement.bind(document);

      // Create a fresh mock context for this test
      const mockContext = {
        drawImage: vi.fn(),
        filter: undefined,
      };
      const mockCanvas = {
        getContext: vi.fn(() => mockContext),
        toDataURL: vi.fn(() => 'data:image/png;base64,mock'),
        width: 0,
        height: 0,
      };

      // Override createElement for this test
      const originalCreateElementFn = document.createElement;
      document.createElement = vi.fn((tagName) => {
        if (tagName === 'canvas') return mockCanvas;
        return originalCreateElement(tagName);
      });

      const mockFavicon = originalCreateElement('link');
      mockFavicon.rel = 'icon';
      mockFavicon.href = '';
      document.head.appendChild(mockFavicon);

      localStorageMock.getItem.mockReturnValue('light');

      renderHook(() => useTheme(), { wrapper });

      // Wait for async favicon update
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Verify filter was NOT applied
      expect(mockContext.filter).toBeUndefined();
      expect(mockContext.drawImage).toHaveBeenCalled();

      // Restore original createElement
      document.createElement = originalCreateElementFn;
    });
  });
});
