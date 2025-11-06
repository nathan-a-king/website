import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ResumePage from '../ResumePage';

// Mock SEO utils
vi.mock('../../utils/seo', () => ({
  updateDocumentMeta: vi.fn(),
  generatePageMeta: vi.fn(() => ({
    title: 'Resume - Test',
    description: 'Test description',
  })),
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Mail: ({ className }) => (
    <div data-testid="mail-icon" className={className}>Mail</div>
  ),
  MapPin: ({ className }) => (
    <div data-testid="mappin-icon" className={className}>MapPin</div>
  ),
  Globe: ({ className }) => (
    <div data-testid="globe-icon" className={className}>Globe</div>
  ),
  Award: ({ className }) => (
    <div data-testid="award-icon" className={className}>Award</div>
  ),
}));

describe('ResumePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderResumePage = () => {
    return render(
      <BrowserRouter>
        <ResumePage />
      </BrowserRouter>
    );
  };

  describe('Header', () => {
    it('should render page title', () => {
      renderResumePage();

      const heading = screen.getByRole('heading', { name: /resume/i });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H1');
    });

    it('should render tagline', () => {
      renderResumePage();

      expect(screen.getByText(/software engineer · ai tools designer/i)).toBeInTheDocument();
    });

    it('should have proper styling on heading', () => {
      renderResumePage();

      const heading = screen.getByRole('heading', { name: /resume/i });
      expect(heading).toHaveClass('text-5xl');
      expect(heading).toHaveClass('font-serif');
    });
  });

  describe('Contact Information', () => {
    it('should display email', () => {
      renderResumePage();

      expect(screen.getByText('me@nateking.dev')).toBeInTheDocument();
      expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
    });

    it('should display location', () => {
      renderResumePage();

      expect(screen.getByText('Omaha, NE')).toBeInTheDocument();
      expect(screen.getByTestId('mappin-icon')).toBeInTheDocument();
    });

    it('should display portfolio URL', () => {
      renderResumePage();

      expect(screen.getByText('nateking.dev')).toBeInTheDocument();
      expect(screen.getByTestId('globe-icon')).toBeInTheDocument();
    });

    it('should display years of experience', () => {
      renderResumePage();

      expect(screen.getByText('7+ Years')).toBeInTheDocument();
      expect(screen.getByTestId('award-icon')).toBeInTheDocument();
    });

    it('should render contact section labels', () => {
      renderResumePage();

      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
      expect(screen.getByText('Portfolio')).toBeInTheDocument();
      // 'Experience' appears twice (in contact section and as heading), so we check it exists
      const experienceElements = screen.getAllByText('Experience');
      expect(experienceElements.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Professional Summary', () => {
    it('should render professional summary section', () => {
      renderResumePage();

      expect(screen.getByRole('heading', { name: /professional summary/i })).toBeInTheDocument();
    });

    it('should display summary content', () => {
      renderResumePage();

      expect(screen.getByText(/experienced software engineer specializing in ai-human interaction design/i)).toBeInTheDocument();
    });
  });

  describe('Experience Section', () => {
    it('should render experience section heading', () => {
      renderResumePage();

      expect(screen.getByRole('heading', { name: /^experience$/i })).toBeInTheDocument();
    });

    it('should display current position', () => {
      renderResumePage();

      expect(screen.getByText(/senior software engineer, generative ai/i)).toBeInTheDocument();
      expect(screen.getByText('2025 - Present')).toBeInTheDocument();
    });

    it('should display previous positions', () => {
      renderResumePage();

      expect(screen.getByText(/lead software engineer, salesforce/i)).toBeInTheDocument();
      expect(screen.getByText('2019 - 2025')).toBeInTheDocument();

      expect(screen.getByText(/senior system administrator/i)).toBeInTheDocument();
      expect(screen.getByText('2017 - 2019')).toBeInTheDocument();
    });

    it('should display company names', () => {
      renderResumePage();

      const fnboTexts = screen.getAllByText(/fnbo/i);
      expect(fnboTexts.length).toBeGreaterThanOrEqual(3);
    });

    it('should display job responsibilities', () => {
      renderResumePage();

      expect(screen.getByText(/led development of ai-human collaboration interfaces/i)).toBeInTheDocument();
      expect(screen.getByText(/developed responsive lightning web components/i)).toBeInTheDocument();
    });
  });

  describe('Technical Skills Section', () => {
    it('should render technical skills section', () => {
      renderResumePage();

      expect(screen.getByRole('heading', { name: /technical skills/i })).toBeInTheDocument();
    });

    it('should display skill categories', () => {
      renderResumePage();

      expect(screen.getByText('Frontend')).toBeInTheDocument();
      expect(screen.getByText('Backend')).toBeInTheDocument();
      expect(screen.getByText('AI/ML')).toBeInTheDocument();
      expect(screen.getByText('Tools & Other')).toBeInTheDocument();
    });

    it('should display frontend skills', () => {
      renderResumePage();

      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Tailwind CSS')).toBeInTheDocument();
    });

    it('should display backend skills', () => {
      renderResumePage();

      expect(screen.getByText('Node.js')).toBeInTheDocument();
      // Python, Flask, PostgreSQL appear in both Backend and Projects sections
      const pythonElements = screen.getAllByText('Python');
      expect(pythonElements.length).toBeGreaterThanOrEqual(1);
      const postgresqlElements = screen.getAllByText('PostgreSQL');
      expect(postgresqlElements.length).toBeGreaterThanOrEqual(1);
      const flaskElements = screen.getAllByText('Flask');
      expect(flaskElements.length).toBeGreaterThanOrEqual(1);
    });

    it('should display AI/ML skills', () => {
      renderResumePage();

      expect(screen.getByText('TensorFlow')).toBeInTheDocument();
      expect(screen.getByText('PyTorch')).toBeInTheDocument();
      expect(screen.getByText('OpenAI API')).toBeInTheDocument();
    });

    it('should display tools and other skills', () => {
      renderResumePage();

      expect(screen.getByText('Git')).toBeInTheDocument();
      // Docker appears in both Tools and Projects sections
      const dockerElements = screen.getAllByText('Docker');
      expect(dockerElements.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Vite')).toBeInTheDocument();
    });
  });

  describe('Notable Projects Section', () => {
    it('should render notable projects section', () => {
      renderResumePage();

      expect(screen.getByRole('heading', { name: /notable projects/i })).toBeInTheDocument();
    });

    it('should display GrindLab project', () => {
      renderResumePage();

      expect(screen.getByText('GrindLab')).toBeInTheDocument();
      expect(screen.getByText(/built an ios\/swiftui app that analyzes coffee grind consistency/i)).toBeInTheDocument();
    });

    it('should display iOS AI Assistant project', () => {
      renderResumePage();

      expect(screen.getByText(/interactive ios ai assistant app/i)).toBeInTheDocument();
      expect(screen.getByText(/developed a modern, swiftui-powered chat assistant/i)).toBeInTheDocument();
    });

    it('should display Smart Code Review project', () => {
      renderResumePage();

      expect(screen.getByText(/smart code review tool/i)).toBeInTheDocument();
      expect(screen.getByText(/built an ai-powered code review system/i)).toBeInTheDocument();
    });

    it('should display project technologies', () => {
      renderResumePage();

      // SwiftUI appears in multiple projects
      const swiftuiElements = screen.getAllByText('SwiftUI');
      expect(swiftuiElements.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Amazon Bedrock')).toBeInTheDocument();
      expect(screen.getByText('GitHub API')).toBeInTheDocument();
    });
  });

  describe('Tagline', () => {
    it('should display inspirational tagline', () => {
      renderResumePage();

      expect(screen.getByText(/designing ai tools that feel less like software and more like conversation/i)).toBeInTheDocument();
    });

    it('should render tagline in italic style', () => {
      const { container } = renderResumePage();

      const tagline = screen.getByText(/designing ai tools that feel less like software and more like conversation/i);
      expect(tagline).toHaveClass('italic');
    });
  });

  describe('Footer', () => {
    it('should render footer with copyright', () => {
      renderResumePage();

      const currentYear = new Date().getFullYear();
      expect(screen.getByText(`© ${currentYear} Nathan A. King. All rights reserved.`)).toBeInTheDocument();
    });

    it('should have border on footer', () => {
      const { container } = renderResumePage();

      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('border-t');
    });
  });

  describe('Layout Structure', () => {
    it('should have semantic HTML structure', () => {
      const { container } = renderResumePage();

      const header = container.querySelector('header');
      const main = container.querySelector('main');
      const footer = container.querySelector('footer');

      expect(header).toBeInTheDocument();
      expect(main).toBeInTheDocument();
      expect(footer).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      renderResumePage();

      const h1 = screen.getByRole('heading', { level: 1 });
      const h2s = screen.getAllByRole('heading', { level: 2 });
      const h3s = screen.getAllByRole('heading', { level: 3 });

      expect(h1).toBeInTheDocument();
      expect(h2s.length).toBeGreaterThanOrEqual(4);
      expect(h3s.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe('Styling', () => {
    it('should have border styling on job entries', () => {
      const { container } = renderResumePage();

      const jobEntries = container.querySelectorAll('.border-l-4.border-brand-terracotta');
      expect(jobEntries.length).toBeGreaterThanOrEqual(3);
    });

    it('should have grid layout for skills', () => {
      const { container } = renderResumePage();

      const skillsGrid = container.querySelector('.grid.md\\:grid-cols-2');
      expect(skillsGrid).toBeInTheDocument();
    });

    it('should have styled containers for content sections', () => {
      const { container } = renderResumePage();

      const contentContainers = container.querySelectorAll('.bg-brand-surface');
      expect(contentContainers.length).toBeGreaterThanOrEqual(8);
    });
  });

  describe('Content Organization', () => {
    it('should render all main sections', () => {
      renderResumePage();

      expect(screen.getByRole('heading', { name: /professional summary/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /^experience$/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /technical skills/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /notable projects/i })).toBeInTheDocument();
    });

    it('should have lists for job responsibilities', () => {
      const { container } = renderResumePage();

      const lists = container.querySelectorAll('ul');
      expect(lists.length).toBeGreaterThanOrEqual(3);
    });
  });
});
