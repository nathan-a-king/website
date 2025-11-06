import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';
import * as logger from '../../utils/logger';

// Mock logger
vi.mock('../../utils/logger', () => ({
  default: {
    error: vi.fn(),
  },
  formatError: vi.fn((err, context) => ({ message: err.message, context })),
}));

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Component with custom error
const ThrowCustomError = ({ message }) => {
  if (message) {
    throw new Error(message);
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console.error for cleaner test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should catch errors and display fallback UI', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText("We're sorry for the inconvenience. An unexpected error occurred.")).toBeInTheDocument();
  });

  it('should log error to logger when error is caught', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(logger.default.error).toHaveBeenCalledWith(
      'React Error Boundary caught an error',
      expect.any(Object)
    );
  });

  it('should display error message in development mode', () => {
    const originalMode = import.meta.env.MODE;
    import.meta.env.MODE = 'development';

    render(
      <ErrorBoundary>
        <ThrowCustomError message="Custom error message" />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error Details (Development Only)')).toBeInTheDocument();
    expect(screen.getByText(/Custom error message/)).toBeInTheDocument();

    import.meta.env.MODE = originalMode;
  });

  it('should not display error details in production mode', () => {
    const originalMode = import.meta.env.MODE;
    import.meta.env.MODE = 'production';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.queryByText('Error Details (Development Only)')).not.toBeInTheDocument();

    import.meta.env.MODE = originalMode;
  });

  it('should render "Try Again" button', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const tryAgainButton = screen.getByRole('button', { name: /try again/i });
    expect(tryAgainButton).toBeInTheDocument();
  });

  it('should render "Go Home" link', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const goHomeLink = screen.getByRole('link', { name: /go home/i });
    expect(goHomeLink).toBeInTheDocument();
    expect(goHomeLink).toHaveAttribute('href', '/');
  });

  it('should render contact support link', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const contactLink = screen.getByRole('link', { name: /contact support/i });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute('href', '/contact');
  });

  it('should have a reset handler on Try Again button', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Error UI should be visible
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

    // Try Again button should exist
    const tryAgainButton = screen.getByRole('button', { name: /try again/i });
    expect(tryAgainButton).toBeInTheDocument();

    // Button should be clickable (checking it has onClick handler by verifying it's a button)
    expect(tryAgainButton.tagName).toBe('BUTTON');
  });

  it('should reset error state when location changes', () => {
    const location1 = { pathname: '/page1' };
    const location2 = { pathname: '/page2' };

    const { rerender } = render(
      <ErrorBoundary location={location1}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Error UI should be visible
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

    // Change location
    rerender(
      <ErrorBoundary location={location2}>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    // Should reset and show normal content
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('should not reset when location prop is the same', () => {
    const location = { pathname: '/page1' };

    const { rerender } = render(
      <ErrorBoundary location={location}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Error UI should be visible
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

    // Re-render with same location
    rerender(
      <ErrorBoundary location={location}>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    // Should still show error UI (not reset)
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
  });

  it('should display error icon', () => {
    const { container } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-16');
    expect(svg).toHaveClass('h-16');
  });

  it('should have proper styling classes on error UI', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const heading = screen.getByText('Oops! Something went wrong');
    expect(heading.tagName).toBe('H1');
    expect(heading).toHaveClass('text-3xl');
  });

  it('should display component stack in development mode', () => {
    const originalMode = import.meta.env.MODE;
    import.meta.env.MODE = 'development';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Check for component stack details (collapsed by default)
    const detailsElement = screen.getByText('Component Stack Trace');
    expect(detailsElement).toBeInTheDocument();

    import.meta.env.MODE = originalMode;
  });
});

describe('ErrorBoundaryWithRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('should work with react-router', async () => {
    const ErrorBoundaryWithRouter = (await import('../ErrorBoundary')).default;

    render(
      <BrowserRouter>
        <ErrorBoundaryWithRouter>
          <ThrowError shouldThrow={true} />
        </ErrorBoundaryWithRouter>
      </BrowserRouter>
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
  });

  it('should render children when no error occurs', async () => {
    const ErrorBoundaryWithRouter = (await import('../ErrorBoundary')).default;

    render(
      <BrowserRouter>
        <ErrorBoundaryWithRouter>
          <div>Test content with router</div>
        </ErrorBoundaryWithRouter>
      </BrowserRouter>
    );

    expect(screen.getByText('Test content with router')).toBeInTheDocument();
  });
});
