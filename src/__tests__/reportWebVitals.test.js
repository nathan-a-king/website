import { describe, it, expect, vi, beforeEach } from 'vitest';

const metrics = {
  getCLS: vi.fn(),
  getFID: vi.fn(),
  getFCP: vi.fn(),
  getLCP: vi.fn(),
  getTTFB: vi.fn(),
};

vi.mock('web-vitals', () => metrics);

import reportWebVitals from '../reportWebVitals';

describe('reportWebVitals', () => {
  beforeEach(() => {
    Object.values(metrics).forEach((fn) => fn.mockClear());
  });

  it('does nothing when no callback is provided', async () => {
    reportWebVitals();
    await new Promise((resolve) => setTimeout(resolve, 0));

    Object.values(metrics).forEach((fn) => {
      expect(fn).not.toHaveBeenCalled();
    });
  });

  it('invokes each web-vital helper with the provided callback', async () => {
    const callback = vi.fn();
    reportWebVitals(callback);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(metrics.getCLS).toHaveBeenCalledWith(callback);
    expect(metrics.getFID).toHaveBeenCalledWith(callback);
    expect(metrics.getFCP).toHaveBeenCalledWith(callback);
    expect(metrics.getLCP).toHaveBeenCalledWith(callback);
    expect(metrics.getTTFB).toHaveBeenCalledWith(callback);
  });
});
