import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePageTitle } from '../usePageTitle';
import * as seo from '../../utils/seo';

// Mock the SEO utility functions
vi.mock('../../utils/seo', () => ({
  updateDocumentMeta: vi.fn(),
  generatePageMeta: vi.fn((pageName) => ({
    title: `${pageName} - Test Site`,
    description: `Description for ${pageName}`,
  })),
}));

describe('usePageTitle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update document meta on mount', () => {
    renderHook(() => usePageTitle('About'));

    expect(seo.generatePageMeta).toHaveBeenCalledWith('about');
    expect(seo.updateDocumentMeta).toHaveBeenCalledWith({
      title: 'about - Test Site',
      description: 'Description for about',
    });
  });

  it('should update document meta when page name changes', () => {
    const { rerender } = renderHook(
      ({ pageName }) => usePageTitle(pageName),
      { initialProps: { pageName: 'About' } }
    );

    expect(seo.generatePageMeta).toHaveBeenCalledWith('about');
    expect(seo.updateDocumentMeta).toHaveBeenCalledTimes(1);

    // Change page name
    rerender({ pageName: 'Contact' });

    expect(seo.generatePageMeta).toHaveBeenCalledWith('contact');
    expect(seo.updateDocumentMeta).toHaveBeenCalledTimes(2);
    expect(seo.updateDocumentMeta).toHaveBeenLastCalledWith({
      title: 'contact - Test Site',
      description: 'Description for contact',
    });
  });

  it('should convert page name to lowercase', () => {
    renderHook(() => usePageTitle('BLOG'));

    expect(seo.generatePageMeta).toHaveBeenCalledWith('blog');
  });

  it('should handle mixed case page names', () => {
    renderHook(() => usePageTitle('About Me'));

    expect(seo.generatePageMeta).toHaveBeenCalledWith('about me');
  });

  it('should not update when page name does not change', () => {
    const { rerender } = renderHook(
      ({ pageName }) => usePageTitle(pageName),
      { initialProps: { pageName: 'Home' } }
    );

    expect(seo.updateDocumentMeta).toHaveBeenCalledTimes(1);

    // Re-render with same page name
    rerender({ pageName: 'Home' });

    // Should still only be called once (React effect dependency optimization)
    expect(seo.updateDocumentMeta).toHaveBeenCalledTimes(1);
  });

  it('should handle empty string page name', () => {
    renderHook(() => usePageTitle(''));

    expect(seo.generatePageMeta).toHaveBeenCalledWith('');
    expect(seo.updateDocumentMeta).toHaveBeenCalled();
  });

  it('should cleanup properly on unmount', () => {
    const { unmount } = renderHook(() => usePageTitle('Test'));

    expect(seo.updateDocumentMeta).toHaveBeenCalledTimes(1);

    unmount();

    // Should not call updateDocumentMeta again on unmount
    expect(seo.updateDocumentMeta).toHaveBeenCalledTimes(1);
  });
});
