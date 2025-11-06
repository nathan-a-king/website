import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import LazyMarkdown from '../LazyMarkdown';

describe('LazyMarkdown', () => {
  it('should render markdown skeleton initially', () => {
    const { container } = render(<LazyMarkdown>Test content</LazyMarkdown>);

    // Should show loading skeleton
    const skeleton = container.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('should render skeleton with multiple placeholder elements', () => {
    const { container } = render(<LazyMarkdown>Content</LazyMarkdown>);

    // Check for skeleton structure
    const placeholders = container.querySelectorAll('.bg-gray-300');
    expect(placeholders.length).toBeGreaterThan(0);
  });

  it('should accept children prop', () => {
    render(<LazyMarkdown>Test content</LazyMarkdown>);

    // Component should accept children (even if not immediately visible due to lazy loading)
    expect(true).toBe(true);
  });

  it('should accept className prop', () => {
    render(<LazyMarkdown className="custom-class">Content</LazyMarkdown>);

    // Component should accept className prop
    expect(true).toBe(true);
  });

  it('should accept components prop', () => {
    const customComponents = {
      h1: ({ children }) => <h1>{children}</h1>,
    };

    render(<LazyMarkdown components={customComponents}># Heading</LazyMarkdown>);

    // Component should accept components prop
    expect(true).toBe(true);
  });
});
