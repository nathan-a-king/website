import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PostPage from '../PostPage';

// Mock hooks
const mockUsePost = vi.fn();
const mockUseParams = vi.fn();

vi.mock('../../hooks/usePosts', () => ({
  usePost: (slug) => mockUsePost(slug),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => mockUseParams(),
  };
});

// Mock theme context
vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: vi.fn(() => ({ isDarkMode: false })),
}));

// Mock SEO utils
vi.mock('../../utils/seo', () => ({
  updateDocumentMeta: vi.fn(),
  generatePostMeta: vi.fn(() => ({
    title: 'Post Title - Test',
    description: 'Test description',
  })),
}));

// Mock StructuredData
vi.mock('../../components/StructuredData', () => ({
  BlogPostStructuredData: () => <div data-testid="structured-data">Structured Data</div>,
}));

// Mock LazyMarkdown
vi.mock('../../components/LazyMarkdown.jsx', () => ({
  default: ({ children }) => <div data-testid="markdown-content">{children}</div>,
}));

// Mock ElizaChatbot
vi.mock('../../components/ElizaChatbot.jsx', () => ({
  default: () => <div data-testid="eliza-chatbot">Chatbot</div>,
}));

// Mock ClickableImage
vi.mock('../../components/ClickableImage.jsx', () => ({
  default: ({ src, alt }) => <img src={src} alt={alt} data-testid="clickable-image" />,
}));

// Mock ImageModal
vi.mock('../../components/ImageModal.jsx', () => ({
  default: () => <div data-testid="image-modal">Modal</div>,
}));

// Mock CodeBlock (lazy loaded)
vi.mock('../../components/CodeBlock.tsx', () => ({
  default: ({ language, value }) => (
    <pre data-testid="code-block" data-language={language}>
      <code>{value}</code>
    </pre>
  ),
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  CalendarDays: ({ className }) => (
    <div data-testid="calendar-icon" className={className}>Calendar</div>
  ),
  ArrowLeft: ({ className }) => (
    <div data-testid="arrow-left-icon" className={className}>Arrow Left</div>
  ),
  Maximize2: ({ className }) => (
    <div data-testid="maximize-icon" className={className}>Maximize</div>
  ),
}));

// Mock Card components
vi.mock('../../components/ui/card.jsx', () => ({
  Card: ({ children, className }) => <div data-testid="card" className={className}>{children}</div>,
  CardContent: ({ children, className }) => <div data-testid="card-content" className={className}>{children}</div>,
}));

describe('PostPage', () => {
  const mockPost = {
    slug: 'test-post',
    title: 'Test Post Title',
    date: 'January 1, 2024',
    excerpt: 'This is a test post excerpt',
    content: '# Heading\n\nThis is the post content.',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ slug: 'test-post' });
    mockUsePost.mockReturnValue({
      post: mockPost,
      loading: false,
      error: null,
    });
  });

  const renderPostPage = () => {
    return render(
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<PostPage />} />
        </Routes>
      </BrowserRouter>
    );
  };

  describe('Post Rendering', () => {
    it('should render post title', () => {
      renderPostPage();

      expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    });

    it('should render post date', () => {
      renderPostPage();

      expect(screen.getByText('January 1, 2024')).toBeInTheDocument();
    });

    it('should render post content', () => {
      renderPostPage();

      expect(screen.getByTestId('markdown-content')).toBeInTheDocument();
    });

    it('should render calendar icon', () => {
      renderPostPage();

      expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
    });

    it('should render back to blog link', () => {
      renderPostPage();

      const backLink = screen.getByRole('link', { name: /back to blog/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', '/blog');
    });
  });

  describe('Loading State', () => {
    it('should display loading message when post is loading', () => {
      mockUsePost.mockReturnValue({
        post: null,
        loading: true,
        error: null,
      });

      renderPostPage();

      expect(screen.getByText('Loading post...')).toBeInTheDocument();
    });

    it('should not render post content while loading', () => {
      mockUsePost.mockReturnValue({
        post: null,
        loading: true,
        error: null,
      });

      renderPostPage();

      expect(screen.queryByText('Test Post Title')).not.toBeInTheDocument();
    });
  });

  describe('404 Error Handling', () => {
    it('should display "Post Not Found" when post does not exist', () => {
      mockUsePost.mockReturnValue({
        post: null,
        loading: false,
        error: null,
      });

      renderPostPage();

      expect(screen.getByText('Post Not Found')).toBeInTheDocument();
    });

    it('should display back to blog link on 404', () => {
      mockUsePost.mockReturnValue({
        post: null,
        loading: false,
        error: null,
      });

      renderPostPage();

      const backLink = screen.getByRole('link', { name: /back to blog/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', '/blog');
    });

    it('should display error message when there is an error', () => {
      mockUsePost.mockReturnValue({
        post: null,
        loading: false,
        error: 'Failed to load post',
      });

      renderPostPage();

      expect(screen.getByText('Post Not Found')).toBeInTheDocument();
      expect(screen.getByText('Failed to load post')).toBeInTheDocument();
    });
  });

  describe('Post Header', () => {
    it('should render header with proper heading level', () => {
      renderPostPage();

      const heading = screen.getByText('Test Post Title');
      expect(heading.tagName).toBe('H1');
    });

    it('should have proper styling classes on header', () => {
      renderPostPage();

      const heading = screen.getByText('Test Post Title');
      expect(heading).toHaveClass('text-4xl');
      expect(heading).toHaveClass('font-serif');
      expect(heading).toHaveClass('font-light');
    });
  });

  describe('Structured Data', () => {
    it('should include BlogPostStructuredData component', () => {
      renderPostPage();

      expect(screen.getByTestId('structured-data')).toBeInTheDocument();
    });

    it('should not render structured data when post is not loaded', () => {
      mockUsePost.mockReturnValue({
        post: null,
        loading: true,
        error: null,
      });

      renderPostPage();

      expect(screen.queryByTestId('structured-data')).not.toBeInTheDocument();
    });
  });

  describe('Footer', () => {
    it('should render footer with copyright', () => {
      renderPostPage();

      const currentYear = new Date().getFullYear();
      expect(screen.getByText(`© ${currentYear} Nathan A. King. All rights reserved.`)).toBeInTheDocument();
    });
  });

  describe('ELIZA Chatbot Integration', () => {
    it('should not render chatbot when marker is not present', () => {
      renderPostPage();

      expect(screen.queryByTestId('eliza-chatbot')).not.toBeInTheDocument();
    });

    it('should render chatbot when marker is present in content', () => {
      const postWithChatbot = {
        ...mockPost,
        content: 'Content before\n[[ELIZA_CHATBOT]]\nContent after',
      };

      mockUsePost.mockReturnValue({
        post: postWithChatbot,
        loading: false,
        error: null,
      });

      renderPostPage();

      expect(screen.getByTestId('eliza-chatbot')).toBeInTheDocument();
    });

    it('should split content around chatbot marker', () => {
      const postWithChatbot = {
        ...mockPost,
        content: 'Content before\n[[ELIZA_CHATBOT]]\nContent after',
      };

      mockUsePost.mockReturnValue({
        post: postWithChatbot,
        loading: false,
        error: null,
      });

      renderPostPage();

      const markdownElements = screen.getAllByTestId('markdown-content');
      expect(markdownElements.length).toBe(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle post with no content', () => {
      const postWithoutContent = {
        ...mockPost,
        content: '',
      };

      mockUsePost.mockReturnValue({
        post: postWithoutContent,
        loading: false,
        error: null,
      });

      renderPostPage();

      expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    });

    it('should pass correct slug to usePost hook', () => {
      mockUseParams.mockReturnValue({ slug: 'custom-slug' });

      renderPostPage();

      expect(mockUsePost).toHaveBeenCalledWith('custom-slug');
    });
  });

  describe('Navigation', () => {
    it('should render arrow icon in back link', () => {
      renderPostPage();

      expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument();
    });

    it('should have proper accessibility on back link', () => {
      renderPostPage();

      const backLink = screen.getByRole('link', { name: /back to blog/i });
      expect(backLink.tagName).toBe('A');
    });
  });
});
