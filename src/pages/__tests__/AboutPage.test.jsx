import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AboutPage from '../AboutPage';

// Mock SEO utils
vi.mock('../../utils/seo', () => ({
  updateDocumentMeta: vi.fn(),
  generatePageMeta: vi.fn(() => ({
    title: 'About - Test',
    description: 'Test description',
  })),
}));

// Mock Skills component
vi.mock('../../components/Skills', () => ({
  default: () => <div data-testid="skills-component">Skills Component</div>,
}));

describe('AboutPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderAboutPage = () => {
    return render(
      <BrowserRouter>
        <AboutPage />
      </BrowserRouter>
    );
  };

  describe('Header', () => {
    it('should render page title', () => {
      renderAboutPage();

      const heading = screen.getByRole('heading', { name: /about/i });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H1');
    });

    it('should render subtitle', () => {
      renderAboutPage();

      expect(screen.getByText(/building bridges between human creativity and artificial intelligence/i)).toBeInTheDocument();
    });

    it('should have proper styling on heading', () => {
      renderAboutPage();

      const heading = screen.getByRole('heading', { name: /about/i });
      expect(heading).toHaveClass('text-5xl');
      expect(heading).toHaveClass('font-serif');
    });
  });

  describe('Introduction Section', () => {
    it('should render introduction text', () => {
      renderAboutPage();

      expect(screen.getByText(/I'm Nate, a software engineer passionate about creating AI tools/i)).toBeInTheDocument();
    });

    it('should have introduction in a styled container', () => {
      renderAboutPage();

      const intro = screen.getByText(/I'm Nate, a software engineer passionate about creating AI tools/i);
      const container = intro.closest('div');

      expect(container).toHaveClass('bg-brand-surface');
      expect(container).toHaveClass('border');
    });
  });

  describe('Content Sections', () => {
    it('should render "My Focus" section', () => {
      renderAboutPage();

      expect(screen.getByRole('heading', { name: /my focus/i })).toBeInTheDocument();
    });

    it('should render "Current Work" section', () => {
      renderAboutPage();

      expect(screen.getByRole('heading', { name: /current work/i })).toBeInTheDocument();
    });

    it('should render "Let\'s Connect" section', () => {
      renderAboutPage();

      expect(screen.getByRole('heading', { name: /let's connect/i })).toBeInTheDocument();
    });

    it('should render content about AI-human collaboration', () => {
      renderAboutPage();

      expect(screen.getByText(/the future of AI isn't just about smarter algorithms/i)).toBeInTheDocument();
    });

    it('should render current work description', () => {
      renderAboutPage();

      expect(screen.getByText(/Right now, I'm exploring how AI can be integrated into creative workflows/i)).toBeInTheDocument();
    });
  });

  describe('Current Work List', () => {
    it('should render list of work items', () => {
      renderAboutPage();

      expect(screen.getByText(/interface patterns that make AI feel collaborative/i)).toBeInTheDocument();
      expect(screen.getByText(/tools that adapt to different thinking styles/i)).toBeInTheDocument();
      expect(screen.getByText(/systems that preserve human agency/i)).toBeInTheDocument();
      expect(screen.getByText(/enhancing existing evaluations frameworks/i)).toBeInTheDocument();
    });

    it('should render work items in a list', () => {
      const { container } = renderAboutPage();

      const listItems = container.querySelectorAll('ul li');
      expect(listItems.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('External Links', () => {
    it('should render GitHub profile link', () => {
      renderAboutPage();

      const githubLink = screen.getByRole('link', { name: /github profile/i });
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute('href', 'https://github.com/nathan-a-king');
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should render blog link', () => {
      renderAboutPage();

      const blogLink = screen.getByRole('link', { name: 'blog' });
      expect(blogLink).toBeInTheDocument();
      expect(blogLink).toHaveAttribute('href', '/blog');
    });

    it('should style external links with brand color', () => {
      renderAboutPage();

      const githubLink = screen.getByRole('link', { name: /github profile/i });
      expect(githubLink).toHaveClass('text-brand-terracotta');
    });
  });

  describe('Skills Component', () => {
    it('should render Skills component', () => {
      renderAboutPage();

      expect(screen.getByTestId('skills-component')).toBeInTheDocument();
    });
  });

  describe('Footer', () => {
    it('should render footer with copyright', () => {
      renderAboutPage();

      const currentYear = new Date().getFullYear();
      expect(screen.getByText(`© ${currentYear} Nathan A. King. All rights reserved.`)).toBeInTheDocument();
    });

    it('should have border on footer', () => {
      const { container } = renderAboutPage();

      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('border-t');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderAboutPage();

      const h1 = screen.getByRole('heading', { level: 1, name: /about/i });
      const h2s = screen.getAllByRole('heading', { level: 2 });

      expect(h1).toBeInTheDocument();
      expect(h2s.length).toBeGreaterThanOrEqual(3);
    });

    it('should have semantic HTML structure', () => {
      const { container } = renderAboutPage();

      const header = container.querySelector('header');
      const main = container.querySelector('main');
      const footer = container.querySelector('footer');

      expect(header).toBeInTheDocument();
      expect(main).toBeInTheDocument();
      expect(footer).toBeInTheDocument();
    });
  });

  describe('Content Blocks', () => {
    it('should render connection callout box', () => {
      renderAboutPage();

      expect(screen.getByText(/you can find my latest thoughts on my/i)).toBeInTheDocument();
    });

    it('should have proper styling on content blocks', () => {
      const { container } = renderAboutPage();

      const contentBlocks = container.querySelectorAll('.bg-brand-surface');
      expect(contentBlocks.length).toBeGreaterThanOrEqual(2);
    });
  });
});
