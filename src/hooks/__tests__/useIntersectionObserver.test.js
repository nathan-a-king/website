import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIntersectionObserver } from '../useIntersectionObserver';

describe('useIntersectionObserver', () => {
  let observeMock;
  let unobserveMock;
  let observerCallback;

  beforeEach(() => {
    // Mock IntersectionObserver
    observeMock = vi.fn();
    unobserveMock = vi.fn();

    global.IntersectionObserver = vi.fn((callback, options) => {
      observerCallback = callback;
      return {
        observe: observeMock,
        unobserve: unobserveMock,
        disconnect: vi.fn(),
      };
    });
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    const [targetRef, isIntersecting, hasIntersected] = result.current;

    expect(targetRef.current).toBe(null);
    expect(isIntersecting).toBe(false);
    expect(hasIntersected).toBe(false);
  });

  it('should create observer with default options', () => {
    const { result, rerender } = renderHook(() => useIntersectionObserver());

    // Set a ref to trigger observer creation
    const mockElement = document.createElement('div');
    act(() => {
      result.current[0].current = mockElement;
    });

    // Re-render to trigger effect
    rerender();

    expect(global.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        threshold: 0.1,
        rootMargin: '50px',
      })
    );
  });

  it('should accept custom options', () => {
    // This test verifies that custom options can be passed
    // We test this indirectly through the hook's behavior
    const customOptions = {
      threshold: 0.5,
    };

    const { result } = renderHook(() => useIntersectionObserver(customOptions));

    // Hook should return the expected structure regardless of options
    const [targetRef, isIntersecting, hasIntersected] = result.current;

    expect(targetRef.current).toBe(null);
    expect(isIntersecting).toBe(false);
    expect(hasIntersected).toBe(false);
  });

  it('should observe target element when ref is set', () => {
    const { result, rerender } = renderHook(() => useIntersectionObserver());

    const mockElement = document.createElement('div');
    result.current[0].current = mockElement;

    rerender();

    expect(observeMock).toHaveBeenCalledWith(mockElement);
  });

  it('should update isIntersecting when element intersects', () => {
    const { result, rerender } = renderHook(() => useIntersectionObserver());

    const mockElement = document.createElement('div');
    result.current[0].current = mockElement;

    rerender();

    // Simulate intersection
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    const [, isIntersecting, hasIntersected] = result.current;
    expect(isIntersecting).toBe(true);
    expect(hasIntersected).toBe(true);
  });

  it('should update isIntersecting when element exits viewport', () => {
    const { result, rerender } = renderHook(() => useIntersectionObserver());

    const mockElement = document.createElement('div');
    result.current[0].current = mockElement;

    rerender();

    // Simulate entering viewport
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    expect(result.current[1]).toBe(true);

    // Simulate leaving viewport
    act(() => {
      observerCallback([{ isIntersecting: false }]);
    });

    const [, isIntersecting, hasIntersected] = result.current;
    expect(isIntersecting).toBe(false);
    expect(hasIntersected).toBe(true); // Should remain true
  });

  it('should set hasIntersected to true only once', () => {
    const { result, rerender } = renderHook(() => useIntersectionObserver());

    const mockElement = document.createElement('div');
    result.current[0].current = mockElement;

    rerender();

    // First intersection
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    expect(result.current[2]).toBe(true);

    // Exit viewport
    act(() => {
      observerCallback([{ isIntersecting: false }]);
    });

    expect(result.current[2]).toBe(true);

    // Re-enter viewport
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    expect(result.current[2]).toBe(true); // Still true, not toggled
  });

  it('should unobserve element on unmount', () => {
    const { result, rerender, unmount } = renderHook(() => useIntersectionObserver());

    const mockElement = document.createElement('div');
    result.current[0].current = mockElement;

    rerender();

    expect(observeMock).toHaveBeenCalledWith(mockElement);

    unmount();

    expect(unobserveMock).toHaveBeenCalledWith(mockElement);
  });

  it('should not create observer if ref is not set', () => {
    renderHook(() => useIntersectionObserver());

    expect(observeMock).not.toHaveBeenCalled();
  });

  it('should handle ref changes', () => {
    const { result, rerender } = renderHook(() => useIntersectionObserver());

    const element1 = document.createElement('div');
    result.current[0].current = element1;

    rerender();

    expect(observeMock).toHaveBeenCalledWith(element1);

    // Change ref to new element
    const element2 = document.createElement('div');
    result.current[0].current = element2;

    rerender();

    // Should unobserve old element
    expect(unobserveMock).toHaveBeenCalledWith(element1);
    // Should observe new element
    expect(observeMock).toHaveBeenCalledWith(element2);
  });

  it('should support custom threshold values', () => {
    const { result, rerender } = renderHook(() =>
      useIntersectionObserver({ threshold: [0, 0.25, 0.5, 0.75, 1] })
    );

    const mockElement = document.createElement('div');
    act(() => {
      result.current[0].current = mockElement;
    });

    rerender();

    expect(global.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        threshold: [0, 0.25, 0.5, 0.75, 1],
      })
    );
  });

  it('should support custom rootMargin', () => {
    const { result, rerender } = renderHook(() =>
      useIntersectionObserver({ rootMargin: '100px 0px' })
    );

    const mockElement = document.createElement('div');
    act(() => {
      result.current[0].current = mockElement;
    });

    rerender();

    expect(global.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        rootMargin: '100px 0px',
      })
    );
  });
});
