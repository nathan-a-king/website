import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BlogPage from '../BlogPage';

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
    title: 'Blog - Test',
    description: 'Test description',
  })),
}));

// Mock StructuredData
vi.mock('../../components/StructuredData', () => ({
  BlogListStructuredData: () => <div data-testid="structured-data">Structured Data</div>,
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
  ArrowRight: ({ className }) => (
    <div data-testid="arrow-icon" className={className}>Arrow</div>
  ),
  Search: ({ className }) => (
    <div data-testid="search-icon" className={className}>Search</div>
  ),
}));

// Mock Card components
vi.mock('../../components/ui/card.jsx', () => ({
  Card: ({ children, className }) => <div data-testid="card" className={className}>{children}</div>,
  CardContent: ({ children, className }) => <div data-testid="card-content" className={className}>{children}</div>,
}));

describe('BlogPage', () => {
  const mockPosts = [
    {
      slug: 'post-1',
      title: 'First Post',
      date: 'January 1, 2024',
      excerpt: 'This is the first post excerpt',
      categories: ['AI', 'Design'],
    },
    {
      slug: 'post-2',
      title: 'Second Post',
      date: 'January 2, 2024',
      excerpt: 'This is the second post excerpt',
      categories: ['Technology'],
    },
    {
      slug: 'post-3',
      title: 'Third Post',
      date: 'January 3, 2024',
      excerpt: 'This is the third post excerpt',
      categories: ['AI'],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePostsIndex.mockReturnValue({
      posts: mockPosts,
      loading: false,
      error: null,
    });
  });

  const renderBlogPage = () => {
    return render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>
    );
  };

  describe('Post List Rendering', () => {
    it('should render all posts', () => {
      renderBlogPage();

      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
      expect(screen.getByText('Third Post')).toBeInTheDocument();
    });

    it('should render post excerpts', () => {
      renderBlogPage();

      expect(screen.getByText('This is the first post excerpt')).toBeInTheDocument();
      expect(screen.getByText('This is the second post excerpt')).toBeInTheDocument();
      expect(screen.getByText('This is the third post excerpt')).toBeInTheDocument();
    });

    it('should render post dates', () => {
      renderBlogPage();

      expect(screen.getByText('January 1, 2024')).toBeInTheDocument();
      expect(screen.getByText('January 2, 2024')).toBeInTheDocument();
      expect(screen.getByText('January 3, 2024')).toBeInTheDocument();
    });

    it('should render posts as links', () => {
      renderBlogPage();

      const postLinks = screen.getAllByRole('link').filter(link =>
        link.getAttribute('href')?.startsWith('/blog/')
      );

      expect(postLinks.length).toBe(3);
      expect(postLinks[0]).toHaveAttribute('href', '/blog/post-1');
      expect(postLinks[1]).toHaveAttribute('href', '/blog/post-2');
      expect(postLinks[2]).toHaveAttribute('href', '/blog/post-3');
    });

    it('should render "Read more" text on each post', () => {
      renderBlogPage();

      const readMoreElements = screen.getAllByText(/read more/i);
      expect(readMoreElements.length).toBe(3);
    });
  });

  describe('Loading State', () => {
    it('should display loading message when posts are loading', () => {
      mockUsePostsIndex.mockReturnValue({
        posts: [],
        loading: true,
        error: null,
      });

      renderBlogPage();

      expect(screen.getByText('Loading posts...')).toBeInTheDocument();
    });

    it('should not render posts list while loading', () => {
      mockUsePostsIndex.mockReturnValue({
        posts: [],
        loading: true,
        error: null,
      });

      renderBlogPage();

      expect(screen.queryByText('First Post')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when there is an error', () => {
      mockUsePostsIndex.mockReturnValue({
        posts: [],
        loading: false,
        error: 'Failed to fetch posts',
      });

      renderBlogPage();

      expect(screen.getByText(/error loading posts/i)).toBeInTheDocument();
      expect(screen.getByText(/failed to fetch posts/i)).toBeInTheDocument();
    });

    it('should not render posts list when there is an error', () => {
      mockUsePostsIndex.mockReturnValue({
        posts: [],
        loading: false,
        error: 'Network error',
      });

      renderBlogPage();

      expect(screen.queryByText('First Post')).not.toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should render search input', () => {
      renderBlogPage();

      const searchInput = screen.getByPlaceholderText(/search posts/i);
      expect(searchInput).toBeInTheDocument();
    });

    it('should filter posts by title', () => {
      renderBlogPage();

      const searchInput = screen.getByPlaceholderText(/search posts/i);
      fireEvent.change(searchInput, { target: { value: 'First' } });

      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.queryByText('Second Post')).not.toBeInTheDocument();
      expect(screen.queryByText('Third Post')).not.toBeInTheDocument();
    });

    it('should filter posts by excerpt', () => {
      renderBlogPage();

      const searchInput = screen.getByPlaceholderText(/search posts/i);
      fireEvent.change(searchInput, { target: { value: 'second post excerpt' } });

      expect(screen.queryByText('First Post')).not.toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
      expect(screen.queryByText('Third Post')).not.toBeInTheDocument();
    });

    it('should display result count when searching', () => {
      renderBlogPage();

      const searchInput = screen.getByPlaceholderText(/search posts/i);
      fireEvent.change(searchInput, { target: { value: 'First' } });

      expect(screen.getByText(/found 1 post/i)).toBeInTheDocument();
    });

    it('should be case-insensitive', () => {
      renderBlogPage();

      const searchInput = screen.getByPlaceholderText(/search posts/i);
      fireEvent.change(searchInput, { target: { value: 'FIRST' } });

      expect(screen.getByText('First Post')).toBeInTheDocument();
    });
  });

  describe('Category Filtering', () => {
    it('should display category buttons', () => {
      renderBlogPage();

      expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'AI' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Design' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Technology' })).toBeInTheDocument();
    });

    it('should filter posts by category', () => {
      renderBlogPage();

      const aiButton = screen.getByRole('button', { name: 'AI' });
      fireEvent.click(aiButton);

      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.queryByText('Second Post')).not.toBeInTheDocument();
      expect(screen.getByText('Third Post')).toBeInTheDocument();
    });

    it('should show all posts when "All" is clicked', () => {
      renderBlogPage();

      // First filter by category
      const aiButton = screen.getByRole('button', { name: 'AI' });
      fireEvent.click(aiButton);

      // Then click All
      const allButton = screen.getByRole('button', { name: 'All' });
      fireEvent.click(allButton);

      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
      expect(screen.getByText('Third Post')).toBeInTheDocument();
    });

    it('should support multiple category selection', () => {
      renderBlogPage();

      const aiButton = screen.getByRole('button', { name: 'AI' });
      const designButton = screen.getByRole('button', { name: 'Design' });

      fireEvent.click(aiButton);
      fireEvent.click(designButton);

      // Should show only posts with BOTH AI and Design categories
      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.queryByText('Second Post')).not.toBeInTheDocument();
      expect(screen.queryByText('Third Post')).not.toBeInTheDocument();
    });

    it('should deselect category when clicked again', () => {
      renderBlogPage();

      const aiButton = screen.getByRole('button', { name: 'AI' });

      fireEvent.click(aiButton);
      expect(screen.queryByText('Second Post')).not.toBeInTheDocument();

      fireEvent.click(aiButton);
      expect(screen.getByText('Second Post')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no posts match search', () => {
      renderBlogPage();

      const searchInput = screen.getByPlaceholderText(/search posts/i);
      fireEvent.change(searchInput, { target: { value: 'nonexistent post' } });

      expect(screen.getByText(/no posts found matching your search/i)).toBeInTheDocument();
    });

    it('should show clear filters button in empty state', () => {
      renderBlogPage();

      const searchInput = screen.getByPlaceholderText(/search posts/i);
      fireEvent.change(searchInput, { target: { value: 'nonexistent post' } });

      const clearButton = screen.getByRole('button', { name: /clear filters/i });
      expect(clearButton).toBeInTheDocument();
    });

    it('should reset filters when clear button is clicked', () => {
      renderBlogPage();

      const searchInput = screen.getByPlaceholderText(/search posts/i);
      fireEvent.change(searchInput, { target: { value: 'nonexistent post' } });

      const clearButton = screen.getByRole('button', { name: /clear filters/i });
      fireEvent.click(clearButton);

      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
      expect(screen.getByText('Third Post')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      // Create 25 posts to test pagination
      const manyPosts = Array.from({ length: 25 }, (_, i) => ({
        slug: `post-${i + 1}`,
        title: `Post ${i + 1}`,
        date: 'January 1, 2024',
        excerpt: `Excerpt for post ${i + 1}`,
        categories: [],
      }));

      mockUsePostsIndex.mockReturnValue({
        posts: manyPosts,
        loading: false,
        error: null,
      });
    });

    it('should show pagination when there are more than 20 posts', () => {
      renderBlogPage();

      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    it('should disable previous button on first page', () => {
      renderBlogPage();

      const prevButton = screen.getByRole('button', { name: /previous/i });
      expect(prevButton).toBeDisabled();
    });

    it('should navigate to next page when next button is clicked', () => {
      renderBlogPage();

      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      // Should show posts 21-25 on page 2
      expect(screen.getByText('Post 21')).toBeInTheDocument();
      expect(screen.queryByText('Post 1')).not.toBeInTheDocument();
    });

    it('should show page number buttons', () => {
      renderBlogPage();

      const page1Button = screen.getByRole('button', { name: '1' });
      const page2Button = screen.getByRole('button', { name: '2' });

      expect(page1Button).toBeInTheDocument();
      expect(page2Button).toBeInTheDocument();
    });
  });

  describe('Post Preloading', () => {
    it('should preload post on mouse enter', async () => {
      renderBlogPage();

      const postLinks = screen.getAllByRole('link').filter(link =>
        link.getAttribute('href')?.startsWith('/blog/')
      );

      fireEvent.mouseEnter(postLinks[0]);

      await waitFor(() => {
        expect(mockPreloadPost).toHaveBeenCalledWith('post-1');
      });
    });

    it('should preload post on focus', async () => {
      renderBlogPage();

      const postLinks = screen.getAllByRole('link').filter(link =>
        link.getAttribute('href')?.startsWith('/blog/')
      );

      fireEvent.focus(postLinks[0]);

      await waitFor(() => {
        expect(mockPreloadPost).toHaveBeenCalledWith('post-1');
      });
    });
  });

  describe('Footer', () => {
    it('should render footer with copyright', () => {
      renderBlogPage();

      const currentYear = new Date().getFullYear();
      expect(screen.getByText(`© ${currentYear} Nathan A. King. All rights reserved.`)).toBeInTheDocument();
    });
  });
});
