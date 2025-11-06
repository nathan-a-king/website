import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LazyPostCard from '../LazyPostCard';

// Mock hooks
const mockPreloadPost = vi.fn();
vi.mock('../../hooks/usePosts', () => ({
  usePreloadPost: () => ({ preloadPost: mockPreloadPost }),
}));

const mockUseIntersectionObserver = vi.fn();
vi.mock('../../hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: (options) => mockUseIntersectionObserver(options),
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  CalendarDays: ({ className }) => (
    <div data-testid="calendar-icon" className={className}>Calendar</div>
  ),
}));

// Mock Card components
vi.mock('../ui/card.jsx', () => ({
  Card: ({ children, className }) => <div data-testid="card" className={className}>{children}</div>,
  CardContent: ({ children, className }) => <div data-testid="card-content" className={className}>{children}</div>,
}));

describe('LazyPostCard', () => {
  const mockPost = {
    slug: 'test-post',
    title: 'Test Post Title',
    date: 'January 1, 2024',
    excerpt: 'This is a test post excerpt',
  };

  const mockRef = { current: null };

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock for intersection observer - not intersected
    mockUseIntersectionObserver.mockReturnValue([mockRef, false, false]);
  });

  const renderPostCard = (post = mockPost, index = 0) => {
    return render(
      <BrowserRouter>
        <LazyPostCard post={post} index={index} />
      </BrowserRouter>
    );
  };

  describe('Lazy Loading Behavior', () => {
    it('should render skeleton when not intersected', () => {
      mockUseIntersectionObserver.mockReturnValue([mockRef, false, false]);

      renderPostCard();

      // Should show skeleton (animated)
      const card = screen.getByTestId('card');
      const content = screen.getByTestId('card-content');

      expect(content).toHaveClass('animate-pulse');
      expect(screen.queryByText('Test Post Title')).not.toBeInTheDocument();
    });

    it('should render post content when intersected', () => {
      mockUseIntersectionObserver.mockReturnValue([mockRef, true, true]);

      renderPostCard();

      expect(screen.getByText('Test Post Title')).toBeInTheDocument();
      expect(screen.getByText('This is a test post excerpt')).toBeInTheDocument();
    });

    it('should render content after hasIntersected is true', () => {
      mockUseIntersectionObserver.mockReturnValue([mockRef, false, true]);

      renderPostCard();

      // Even if not currently intersecting, should show content once it has intersected
      expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    });

    it('should use intersection observer with correct options', () => {
      renderPostCard();

      expect(mockUseIntersectionObserver).toHaveBeenCalledWith({
        threshold: 0.1,
        rootMargin: '100px',
      });
    });
  });

  describe('Post Content Rendering', () => {
    beforeEach(() => {
      mockUseIntersectionObserver.mockReturnValue([mockRef, true, true]);
    });

    it('should render post title', () => {
      renderPostCard();

      const title = screen.getByText('Test Post Title');
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H2');
    });

    it('should render post date', () => {
      renderPostCard();

      expect(screen.getByText('January 1, 2024')).toBeInTheDocument();
    });

    it('should render calendar icon', () => {
      renderPostCard();

      expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
    });

    it('should render post excerpt', () => {
      renderPostCard();

      expect(screen.getByText('This is a test post excerpt')).toBeInTheDocument();
    });

    it('should render "Read more" link', () => {
      renderPostCard();

      expect(screen.getByText('Read more →')).toBeInTheDocument();
    });

    it('should link to correct post URL', () => {
      renderPostCard();

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/blog/test-post');
    });
  });

  describe('Post Preloading', () => {
    beforeEach(() => {
      mockUseIntersectionObserver.mockReturnValue([mockRef, true, true]);
    });

    it('should preload post on mouse enter', async () => {
      renderPostCard();

      const link = screen.getByRole('link');
      fireEvent.mouseEnter(link);

      await waitFor(() => {
        expect(mockPreloadPost).toHaveBeenCalledWith('test-post');
      });
    });

    it('should preload post on focus', async () => {
      renderPostCard();

      const link = screen.getByRole('link');
      fireEvent.focus(link);

      await waitFor(() => {
        expect(mockPreloadPost).toHaveBeenCalledWith('test-post');
      });
    });

    it('should use correct post slug for preloading', async () => {
      const customPost = { ...mockPost, slug: 'custom-slug' };

      render(
        <BrowserRouter>
          <LazyPostCard post={customPost} index={0} />
        </BrowserRouter>
      );

      const link = screen.getByRole('link');
      fireEvent.mouseEnter(link);

      await waitFor(() => {
        expect(mockPreloadPost).toHaveBeenCalledWith('custom-slug');
      });
    });
  });

  describe('Animation Delay', () => {
    beforeEach(() => {
      mockUseIntersectionObserver.mockReturnValue([mockRef, false, false]);
    });

    it('should apply animation delay based on index', () => {
      const { container } = renderPostCard(mockPost, 0);
      const wrapper = container.firstChild;

      expect(wrapper).toHaveStyle({ animationDelay: '0ms' });
    });

    it('should increment animation delay for each index', () => {
      const { container: container1 } = renderPostCard(mockPost, 0);
      const { container: container2 } = renderPostCard(mockPost, 2);

      expect(container1.firstChild).toHaveStyle({ animationDelay: '0ms' });
      expect(container2.firstChild).toHaveStyle({ animationDelay: '200ms' });
    });

    it('should have animation classes', () => {
      const { container } = renderPostCard();
      const wrapper = container.firstChild;

      expect(wrapper).toHaveClass('animate-fadeIn');
      expect(wrapper).toHaveClass('opacity-0');
    });
  });

  describe('Styling', () => {
    beforeEach(() => {
      mockUseIntersectionObserver.mockReturnValue([mockRef, true, true]);
    });

    it('should have hover border styling on card', () => {
      renderPostCard();

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('hover:border-brand-terracotta/30');
      expect(card).toHaveClass('dark:hover:border-brand-terracotta/40');
    });

    it('should have group hover styling on title', () => {
      renderPostCard();

      const title = screen.getByText('Test Post Title');
      expect(title).toHaveClass('group-hover:text-brand-terracotta');
    });

    it('should have correct typography classes on title', () => {
      renderPostCard();

      const title = screen.getByText('Test Post Title');
      expect(title).toHaveClass('text-2xl');
      expect(title).toHaveClass('font-serif');
      expect(title).toHaveClass('font-normal');
    });
  });

  describe('Different Post Data', () => {
    beforeEach(() => {
      mockUseIntersectionObserver.mockReturnValue([mockRef, true, true]);
    });

    it('should handle posts with different titles', () => {
      const post = { ...mockPost, title: 'Another Post Title' };
      renderPostCard(post);

      expect(screen.getByText('Another Post Title')).toBeInTheDocument();
    });

    it('should handle posts with different dates', () => {
      const post = { ...mockPost, date: 'December 25, 2024' };
      renderPostCard(post);

      expect(screen.getByText('December 25, 2024')).toBeInTheDocument();
    });

    it('should handle posts with different excerpts', () => {
      const post = { ...mockPost, excerpt: 'A different excerpt' };
      renderPostCard(post);

      expect(screen.getByText('A different excerpt')).toBeInTheDocument();
    });

    it('should handle posts with different slugs', () => {
      const post = { ...mockPost, slug: 'different-slug' };
      renderPostCard(post);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/blog/different-slug');
    });
  });
});
