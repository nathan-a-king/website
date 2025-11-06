import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../HomePage';

// Mock hooks
const mockPreloadPost = vi.fn();
const mockUsePostsIndex = vi.fn();

vi.mock('../../hooks/usePosts', () => ({
  usePostsIndex: () => mockUsePostsIndex(),
  usePreloadPost: () => ({ preloadPost: mockPreloadPost }),
}));

// Mock SEO utils
vi.mock('../../utils/seo', () => ({
  updateDocumentMeta: vi.fn(),
  generatePageMeta: vi.fn(() => ({
    title: 'Home - Test',
    description: 'Test description',
  })),
}));

// Mock BackgroundPattern
vi.mock('../../components/BackgroundPattern.jsx', () => ({
  default: () => <div data-testid="background-pattern">Background</div>,
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  CalendarDays: ({ className }) => (
    <div data-testid="calendar-icon" className={className}>Calendar</div>
  ),
  Sparkles: ({ className }) => (
    <div data-testid="sparkles-icon" className={className}>Sparkles</div>
  ),
}));

// Mock Card components
vi.mock('../../components/ui/card.jsx', () => ({
  Card: ({ children, className }) => <div data-testid="card" className={className}>{children}</div>,
  CardContent: ({ children, className }) => <div data-testid="card-content" className={className}>{children}</div>,
}));

describe('HomePage', () => {
  const mockPosts = [
    {
      slug: 'post-1',
      title: 'First Post',
      date: 'January 1, 2024',
      excerpt: 'This is the first post excerpt',
    },
    {
      slug: 'post-2',
      title: 'Second Post',
      date: 'January 2, 2024',
      excerpt: 'This is the second post excerpt',
    },
    {
      slug: 'post-3',
      title: 'Third Post',
      date: 'January 3, 2024',
      excerpt: 'This is the third post excerpt',
    },
    {
      slug: 'post-4',
      title: 'Fourth Post',
      date: 'January 4, 2024',
      excerpt: 'This is the fourth post excerpt',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePostsIndex.mockReturnValue({
      posts: mockPosts,
      loading: false,
    });
  });

  const renderHomePage = () => {
    return render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
  };

  describe('Hero Section', () => {
    it('should render hero section with tagline', () => {
      renderHomePage();

      expect(screen.getByText('Strategist. Designer. Engineer.')).toBeInTheDocument();
    });

    it('should render hero description', () => {
      renderHomePage();

      expect(screen.getByText(/Exploring the intersection of AI, design, and human creativity/)).toBeInTheDocument();
    });

    it('should render "Read My Blog" CTA button', () => {
      renderHomePage();

      const blogButton = screen.getByRole('link', { name: /read my blog/i });
      expect(blogButton).toBeInTheDocument();
      expect(blogButton).toHaveAttribute('href', '/blog');
    });

    it('should render "Get in Touch" CTA button', () => {
      renderHomePage();

      const contactButton = screen.getByRole('link', { name: /get in touch/i });
      expect(contactButton).toBeInTheDocument();
      expect(contactButton).toHaveAttribute('href', '/contact');
    });
  });

  describe('Latest Posts Section', () => {
    it('should render "Latest Thoughts" heading', () => {
      renderHomePage();

      expect(screen.getByText('Latest Thoughts')).toBeInTheDocument();
    });

    it('should display only latest 3 posts', () => {
      renderHomePage();

      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
      expect(screen.getByText('Third Post')).toBeInTheDocument();
      expect(screen.queryByText('Fourth Post')).not.toBeInTheDocument();
    });

    it('should render post titles as links', () => {
      renderHomePage();

      const postLinks = screen.getAllByRole('link').filter(link =>
        link.getAttribute('href')?.startsWith('/blog/')
      );

      expect(postLinks.length).toBe(3);
      expect(postLinks[0]).toHaveAttribute('href', '/blog/post-1');
    });

    it('should display post dates', () => {
      renderHomePage();

      expect(screen.getByText('January 1, 2024')).toBeInTheDocument();
      expect(screen.getByText('January 2, 2024')).toBeInTheDocument();
      expect(screen.getByText('January 3, 2024')).toBeInTheDocument();
    });

    it('should display post excerpts', () => {
      renderHomePage();

      expect(screen.getByText('This is the first post excerpt')).toBeInTheDocument();
      expect(screen.getByText('This is the second post excerpt')).toBeInTheDocument();
      expect(screen.getByText('This is the third post excerpt')).toBeInTheDocument();
    });

    it('should preload post on mouse enter', async () => {
      renderHomePage();

      const postLinks = screen.getAllByRole('link').filter(link =>
        link.getAttribute('href')?.startsWith('/blog/')
      );

      fireEvent.mouseEnter(postLinks[0]);

      await waitFor(() => {
        expect(mockPreloadPost).toHaveBeenCalledWith('post-1');
      });
    });

    it('should preload post on focus', async () => {
      renderHomePage();

      const postLinks = screen.getAllByRole('link').filter(link =>
        link.getAttribute('href')?.startsWith('/blog/')
      );

      fireEvent.focus(postLinks[0]);

      await waitFor(() => {
        expect(mockPreloadPost).toHaveBeenCalledWith('post-1');
      });
    });
  });

  describe('Loading State', () => {
    it('should display loading skeleton when posts are loading', () => {
      mockUsePostsIndex.mockReturnValue({
        posts: [],
        loading: true,
      });

      const { container } = renderHomePage();

      const pulseElements = container.querySelectorAll('.animate-pulse');
      expect(pulseElements.length).toBeGreaterThanOrEqual(3);
    });

    it('should show 3 skeleton cards while loading', () => {
      mockUsePostsIndex.mockReturnValue({
        posts: [],
        loading: true,
      });

      const { container } = renderHomePage();
      const pulseElements = container.querySelectorAll('.animate-pulse');

      // Should have loading skeletons
      expect(pulseElements.length).toBeGreaterThan(0);
    });
  });

  describe('About Preview Section', () => {
    it('should render about preview heading', () => {
      renderHomePage();

      expect(screen.getByText('Building the Future of Human-AI Collaboration')).toBeInTheDocument();
    });

    it('should render about preview description', () => {
      renderHomePage();

      expect(screen.getByText(/I'm passionate about creating AI tools/)).toBeInTheDocument();
    });

    it('should render "Learn More About My Work" link', () => {
      renderHomePage();

      const aboutLink = screen.getByRole('link', { name: /learn more about my work/i });
      expect(aboutLink).toBeInTheDocument();
      expect(aboutLink).toHaveAttribute('href', '/about');
    });
  });

  describe('Footer', () => {
    it('should render footer with copyright', () => {
      renderHomePage();

      const currentYear = new Date().getFullYear();
      expect(screen.getByText(`© ${currentYear} Nathan A. King. All rights reserved.`)).toBeInTheDocument();
    });
  });

  describe('Post Cards', () => {
    it('should render "Read more" links on post cards', () => {
      renderHomePage();

      const readMoreElements = screen.getAllByText(/read more/i);
      expect(readMoreElements.length).toBe(3);
    });

    it('should render calendar icons for post dates', () => {
      renderHomePage();

      const calendarIcons = screen.getAllByTestId('calendar-icon');
      expect(calendarIcons.length).toBe(3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty posts array', () => {
      mockUsePostsIndex.mockReturnValue({
        posts: [],
        loading: false,
      });

      renderHomePage();

      // Should still render hero and about sections
      expect(screen.getByText('Strategist. Designer. Engineer.')).toBeInTheDocument();
      expect(screen.getByText('Building the Future of Human-AI Collaboration')).toBeInTheDocument();
    });

    it('should handle less than 3 posts', () => {
      mockUsePostsIndex.mockReturnValue({
        posts: [mockPosts[0], mockPosts[1]],
        loading: false,
      });

      renderHomePage();

      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
      expect(screen.queryByText('Third Post')).not.toBeInTheDocument();
    });
  });
});
