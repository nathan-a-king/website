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

// Mock LazyMarkdown to render with components
vi.mock('../../components/LazyMarkdown.jsx', () => ({
  default: ({ children, components }) => {
    if (!components) {
      return <div data-testid="markdown-content">{children}</div>;
    }
    // Render using ReactMarkdown with the provided components
    const ReactMarkdown = require('react-markdown').default;
    return (
      <div data-testid="markdown-content">
        <ReactMarkdown components={components}>{children}</ReactMarkdown>
      </div>
    );
  },
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

  describe('Markdown Components', () => {
    describe('Headings', () => {
      it('should render h1 headings with custom styling', () => {
        const postWithHeading = {
          ...mockPost,
          content: '# Main Heading',
        };

        mockUsePost.mockReturnValue({
          post: postWithHeading,
          loading: false,
          error: null,
        });

        renderPostPage();

        const heading = screen.getByRole('heading', { level: 1, name: /main heading/i });
        expect(heading).toHaveClass('text-3xl');
        expect(heading).toHaveClass('font-serif');
      });

      it('should render h2 headings with custom styling', () => {
        const postWithHeading = {
          ...mockPost,
          content: '## Second Heading',
        };

        mockUsePost.mockReturnValue({
          post: postWithHeading,
          loading: false,
          error: null,
        });

        renderPostPage();

        const heading = screen.getByRole('heading', { level: 2, name: /second heading/i });
        expect(heading).toHaveClass('text-2xl');
        expect(heading).toHaveClass('font-serif');
      });

      it('should render h3 headings with custom styling', () => {
        const postWithHeading = {
          ...mockPost,
          content: '### Third Heading',
        };

        mockUsePost.mockReturnValue({
          post: postWithHeading,
          loading: false,
          error: null,
        });

        renderPostPage();

        const heading = screen.getByRole('heading', { level: 3, name: /third heading/i });
        expect(heading).toHaveClass('text-xl');
        expect(heading).toHaveClass('font-serif');
      });
    });

    describe('Links', () => {
      it('should render links with custom styling', () => {
        const postWithLink = {
          ...mockPost,
          content: '[Visit Example](https://example.com)',
        };

        mockUsePost.mockReturnValue({
          post: postWithLink,
          loading: false,
          error: null,
        });

        renderPostPage();

        const link = screen.getByRole('link', { name: /visit example/i });
        expect(link).toHaveAttribute('href', 'https://example.com');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        expect(link).toHaveClass('text-brand-terracotta');
      });
    });

    describe('Blockquotes', () => {
      it('should render blockquotes with custom styling', () => {
        const postWithBlockquote = {
          ...mockPost,
          content: '> This is a quote',
        };

        mockUsePost.mockReturnValue({
          post: postWithBlockquote,
          loading: false,
          error: null,
        });

        const { container } = renderPostPage();

        const blockquote = container.querySelector('blockquote');
        expect(blockquote).toBeInTheDocument();
        expect(blockquote).toHaveClass('border-l-4');
        expect(blockquote).toHaveClass('border-brand-terracotta');
        expect(blockquote).toHaveTextContent('This is a quote');
      });
    });

    describe('Horizontal Rules', () => {
      it('should render horizontal rules with custom styling', () => {
        const postWithHr = {
          ...mockPost,
          content: 'Before\n\n---\n\nAfter',
        };

        mockUsePost.mockReturnValue({
          post: postWithHr,
          loading: false,
          error: null,
        });

        const { container } = renderPostPage();

        const hr = container.querySelector('hr');
        expect(hr).toBeInTheDocument();
        expect(hr).toHaveClass('my-10');
        expect(hr).toHaveClass('border-brand-border');
      });
    });

    describe('Lists', () => {
      it('should render unordered lists with custom styling', () => {
        const postWithList = {
          ...mockPost,
          content: '- Item 1\n- Item 2\n- Item 3',
        };

        mockUsePost.mockReturnValue({
          post: postWithList,
          loading: false,
          error: null,
        });

        const { container } = renderPostPage();

        const ul = container.querySelector('ul');
        expect(ul).toBeInTheDocument();
        expect(ul).toHaveClass('list-disc');
        expect(ul).toHaveClass('list-inside');
      });

      it('should render ordered lists with custom styling', () => {
        const postWithList = {
          ...mockPost,
          content: '1. First\n2. Second\n3. Third',
        };

        mockUsePost.mockReturnValue({
          post: postWithList,
          loading: false,
          error: null,
        });

        const { container } = renderPostPage();

        const ol = container.querySelector('ol');
        expect(ol).toBeInTheDocument();
        expect(ol).toHaveClass('list-decimal');
        expect(ol).toHaveClass('list-inside');
      });

      it('should render list items with custom styling', () => {
        const postWithList = {
          ...mockPost,
          content: '- List item',
        };

        mockUsePost.mockReturnValue({
          post: postWithList,
          loading: false,
          error: null,
        });

        const { container } = renderPostPage();

        const li = container.querySelector('li');
        expect(li).toBeInTheDocument();
        expect(li).toHaveClass('mb-1');
      });
    });

    describe('Text Formatting', () => {
      it('should render strong/bold text', () => {
        const postWithBold = {
          ...mockPost,
          content: '**Bold text**',
        };

        mockUsePost.mockReturnValue({
          post: postWithBold,
          loading: false,
          error: null,
        });

        const { container } = renderPostPage();

        const strong = container.querySelector('strong');
        expect(strong).toBeInTheDocument();
        expect(strong).toHaveClass('font-semibold');
        expect(strong).toHaveTextContent('Bold text');
      });

      it('should render em/italic text', () => {
        const postWithItalic = {
          ...mockPost,
          content: '*Italic text*',
        };

        mockUsePost.mockReturnValue({
          post: postWithItalic,
          loading: false,
          error: null,
        });

        const { container } = renderPostPage();

        const em = container.querySelector('em');
        expect(em).toBeInTheDocument();
        expect(em).toHaveClass('italic');
        expect(em).toHaveTextContent('Italic text');
      });
    });

    describe('Code', () => {
      it('should render inline code with custom styling', () => {
        const postWithCode = {
          ...mockPost,
          content: 'This is `inline code` here',
        };

        mockUsePost.mockReturnValue({
          post: postWithCode,
          loading: false,
          error: null,
        });

        const { container } = renderPostPage();

        const code = container.querySelector('code');
        expect(code).toBeInTheDocument();
        expect(code).toHaveClass('bg-brand-surface');
        expect(code).toHaveClass('text-brand-text-primary');
        expect(code).toHaveTextContent('inline code');
      });
    });

    describe('Images', () => {
      it('should render regular images using ClickableImage component', () => {
        const postWithImage = {
          ...mockPost,
          content: '![Alt text](/image.jpg)',
        };

        mockUsePost.mockReturnValue({
          post: postWithImage,
          loading: false,
          error: null,
        });

        renderPostPage();

        const image = screen.getByTestId('clickable-image');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', '/image.jpg');
        expect(image).toHaveAttribute('alt', 'Alt text');
      });

      it('should render images consistently', () => {
        const postWithImage = {
          ...mockPost,
          content: '![Alt text](/image.jpg)',
        };

        mockUsePost.mockReturnValue({
          post: postWithImage,
          loading: false,
          error: null,
        });

        renderPostPage();

        // Image should render
        const image = screen.getByTestId('clickable-image');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', '/image.jpg');
      });

      it('should handle small images with special styling', () => {
        const postWithSmallImage = {
          ...mockPost,
          content: '![Small image](/image-small.jpg)',
        };

        mockUsePost.mockReturnValue({
          post: postWithSmallImage,
          loading: false,
          error: null,
        });

        const { container } = renderPostPage();

        // Small images use inline modal logic instead of ClickableImage
        const image = container.querySelector('img[alt="Small image"]');
        expect(image).toBeInTheDocument();
      });

      it('should handle small right-aligned images', () => {
        const postWithSmallRImage = {
          ...mockPost,
          content: '![Small right](/image-smallr.jpg)',
        };

        mockUsePost.mockReturnValue({
          post: postWithSmallRImage,
          loading: false,
          error: null,
        });

        const { container } = renderPostPage();

        const image = container.querySelector('img[alt="Small right"]');
        expect(image).toBeInTheDocument();
      });
    });

    describe('Paragraphs with Images', () => {
      it('should handle paragraphs with single images', () => {
        const postWithImageInPara = {
          ...mockPost,
          content: '![Image](/test.jpg)',
        };

        mockUsePost.mockReturnValue({
          post: postWithImageInPara,
          loading: false,
          error: null,
        });

        const { container } = renderPostPage();

        // Should render but not wrapped in <p> tag
        const image = screen.getByTestId('clickable-image');
        expect(image).toBeInTheDocument();
      });

      it('should handle regular paragraphs with text justification', () => {
        const postWithParagraph = {
          ...mockPost,
          content: 'This is a regular paragraph with some text.',
        };

        mockUsePost.mockReturnValue({
          post: postWithParagraph,
          loading: false,
          error: null,
        });

        const { container } = renderPostPage();

        const paragraph = container.querySelector('p');
        expect(paragraph).toBeInTheDocument();
        expect(paragraph).toHaveClass('text-justify');
      });
    });
  });
});
