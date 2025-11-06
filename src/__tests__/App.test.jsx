import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mock react-router-dom to use MemoryRouter instead of BrowserRouter
let testLocation = '/';
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }) => (
      <actual.MemoryRouter initialEntries={[testLocation]}>
        {children}
      </actual.MemoryRouter>
    ),
  };
});

// Mock all page components
vi.mock('../pages/HomePage.jsx', () => ({
  default: () => <div data-testid="home-page">Home Page</div>
}));

vi.mock('../pages/BlogPage.jsx', () => ({
  default: () => <div data-testid="blog-page">Blog Page</div>
}));

vi.mock('../pages/PostPage.jsx', () => ({
  default: () => <div data-testid="post-page">Post Page</div>
}));

vi.mock('../pages/AboutPage.jsx', () => ({
  default: () => <div data-testid="about-page">About Page</div>
}));

vi.mock('../pages/ContactPage.jsx', () => ({
  default: () => <div data-testid="contact-page">Contact Page</div>
}));

vi.mock('../pages/ResumePage.jsx', () => ({
  default: () => <div data-testid="resume-page">Resume Page</div>
}));

// Mock Navigation component
vi.mock('../components/Navigation.jsx', () => ({
  default: () => <nav data-testid="navigation">Navigation</nav>
}));

// Mock ScrollToTop component
vi.mock('../components/ScrollToTop.jsx', () => ({
  default: () => null
}));

// Mock ErrorBoundary component
vi.mock('../components/ErrorBoundary.jsx', () => ({
  default: ({ children }) => <div data-testid="error-boundary">{children}</div>
}));

// Mock ThemeProvider
vi.mock('../contexts/ThemeContext.jsx', () => ({
  ThemeProvider: ({ children }) => <div data-testid="theme-provider">{children}</div>
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Routing', () => {
    it('should render home page at root path', async () => {
      testLocation = '/';
      const { unmount } = render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });

      unmount();
    });

    it('should render blog page at /blog path', async () => {
      testLocation = '/blog';
      const { unmount } = render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('blog-page')).toBeInTheDocument();
      });

      unmount();
    });

    it('should render post page at /blog/:slug path', async () => {
      testLocation = '/blog/test-post';
      const { unmount } = render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('post-page')).toBeInTheDocument();
      });

      unmount();
    });

    it('should render about page at /about path', async () => {
      testLocation = '/about';
      const { unmount } = render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('about-page')).toBeInTheDocument();
      });

      unmount();
    });

    it('should render resume page at /resume path', async () => {
      testLocation = '/resume';
      const { unmount } = render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('resume-page')).toBeInTheDocument();
      });

      unmount();
    });

    it('should render contact page at /contact path', async () => {
      testLocation = '/contact';
      const { unmount } = render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('contact-page')).toBeInTheDocument();
      });

      unmount();
    });
  });

  describe('Context Providers', () => {
    it('should wrap app in ThemeProvider', () => {
      testLocation = '/';
      const { unmount } = render(<App />);

      expect(screen.getByTestId('theme-provider')).toBeInTheDocument();

      unmount();
    });

    it('should wrap app in ErrorBoundary', () => {
      testLocation = '/';
      const { unmount } = render(<App />);

      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();

      unmount();
    });
  });

  describe('Navigation', () => {
    it('should render Navigation component', () => {
      testLocation = '/';
      const { unmount } = render(<App />);

      expect(screen.getByTestId('navigation')).toBeInTheDocument();

      unmount();
    });

    it('should render Navigation on all routes', async () => {
      const routes = ['/', '/blog', '/about', '/resume', '/contact'];

      for (const route of routes) {
        testLocation = route;
        const { unmount } = render(<App />);

        expect(screen.getByTestId('navigation')).toBeInTheDocument();

        unmount();
      }
    });
  });

  describe('Layout', () => {
    it('should have proper container classes', () => {
      testLocation = '/';
      const { container, unmount } = render(<App />);

      const mainContainer = container.querySelector('.min-h-screen');
      expect(mainContainer).toBeInTheDocument();
      expect(mainContainer).toHaveClass('bg-brand-bg');
      expect(mainContainer).toHaveClass('text-brand-text-primary');

      unmount();
    });

    it('should have transition classes for theme switching', () => {
      testLocation = '/';
      const { container, unmount } = render(<App />);

      const mainContainer = container.querySelector('.min-h-screen');
      expect(mainContainer).toHaveClass('transition-colors');

      unmount();
    });
  });

  describe('Provider Hierarchy', () => {
    it('should have correct provider nesting order', () => {
      testLocation = '/';
      const { container, unmount } = render(<App />);

      // ThemeProvider should be outermost
      const themeProvider = container.querySelector('[data-testid="theme-provider"]');
      expect(themeProvider).toBeInTheDocument();

      // ErrorBoundary should be inside ThemeProvider
      const errorBoundary = themeProvider.querySelector('[data-testid="error-boundary"]');
      expect(errorBoundary).toBeInTheDocument();

      // Navigation should be inside ErrorBoundary
      const navigation = errorBoundary.querySelector('[data-testid="navigation"]');
      expect(navigation).toBeInTheDocument();

      unmount();
    });
  });

  describe('Route Matching', () => {
    it('should handle dynamic blog post slugs', async () => {
      const slugs = ['test-post', 'another-post', 'post-with-dashes'];

      for (const slug of slugs) {
        testLocation = `/blog/${slug}`;
        const { unmount } = render(<App />);

        await waitFor(() => {
          expect(screen.getByTestId('post-page')).toBeInTheDocument();
        });

        unmount();
      }
    });

    it('should not render multiple pages simultaneously', async () => {
      testLocation = '/';
      const { unmount } = render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });

      // Other pages should not be rendered
      expect(screen.queryByTestId('blog-page')).not.toBeInTheDocument();
      expect(screen.queryByTestId('about-page')).not.toBeInTheDocument();
      expect(screen.queryByTestId('contact-page')).not.toBeInTheDocument();

      unmount();
    });
  });

  describe('Integration', () => {
    it('should render all components together', () => {
      testLocation = '/';
      const { unmount } = render(<App />);

      // All key components should be present
      expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      expect(screen.getByTestId('navigation')).toBeInTheDocument();
      expect(screen.getByTestId('home-page')).toBeInTheDocument();

      unmount();
    });

    it('should maintain structure across route changes', async () => {
      testLocation = '/';
      let { unmount } = render(<App />);

      // Check initial route
      expect(screen.getByTestId('navigation')).toBeInTheDocument();
      expect(screen.getByTestId('home-page')).toBeInTheDocument();

      unmount();

      // Change route
      testLocation = '/about';
      unmount = render(<App />).unmount;

      // Navigation should still be present
      expect(screen.getByTestId('navigation')).toBeInTheDocument();
      // New page should be rendered
      await waitFor(() => {
        expect(screen.getByTestId('about-page')).toBeInTheDocument();
      });

      unmount();
    });
  });
});
