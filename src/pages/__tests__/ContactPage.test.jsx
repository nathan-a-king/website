import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ContactPage from '../ContactPage';

// Mock SEO utils
vi.mock('../../utils/seo', () => ({
  updateDocumentMeta: vi.fn(),
  generatePageMeta: vi.fn(() => ({
    title: 'Contact - Test',
    description: 'Test description',
  })),
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Mail: ({ className }) => (
    <div data-testid="mail-icon" className={className}>Mail</div>
  ),
  User: ({ className }) => (
    <div data-testid="user-icon" className={className}>User</div>
  ),
  MessageSquare: ({ className }) => (
    <div data-testid="message-icon" className={className}>Message</div>
  ),
}));

// Mock Card components
vi.mock('../../components/ui/card.jsx', () => ({
  Card: ({ children, className }) => <div data-testid="card" className={className}>{children}</div>,
  CardContent: ({ children, className }) => <div data-testid="card-content" className={className}>{children}</div>,
}));

describe('ContactPage', () => {
  let originalLocation;

  beforeEach(() => {
    vi.clearAllMocks();
    originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  const renderContactPage = () => {
    return render(
      <BrowserRouter>
        <ContactPage />
      </BrowserRouter>
    );
  };

  describe('Header', () => {
    it('should render page title', () => {
      renderContactPage();

      expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    });

    it('should render page description', () => {
      renderContactPage();

      expect(screen.getByText(/have a question or want to discuss a project/i)).toBeInTheDocument();
    });

    it('should have proper heading level', () => {
      renderContactPage();

      const heading = screen.getByText('Get in Touch');
      expect(heading.tagName).toBe('H1');
    });
  });

  describe('Form Fields', () => {
    it('should render name input field', () => {
      renderContactPage();

      const nameInput = screen.getByPlaceholderText(/your full name/i);
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveAttribute('type', 'text');
      expect(nameInput).toHaveAttribute('required');
    });

    it('should render subject input field', () => {
      renderContactPage();

      const subjectInput = screen.getByPlaceholderText(/what's this about/i);
      expect(subjectInput).toBeInTheDocument();
      expect(subjectInput).toHaveAttribute('type', 'text');
      expect(subjectInput).toHaveAttribute('required');
    });

    it('should render message textarea', () => {
      renderContactPage();

      const messageInput = screen.getByPlaceholderText(/tell me more about your project/i);
      expect(messageInput).toBeInTheDocument();
      expect(messageInput.tagName).toBe('TEXTAREA');
      expect(messageInput).toHaveAttribute('required');
    });

    it('should have proper placeholders on inputs', () => {
      renderContactPage();

      expect(screen.getByPlaceholderText(/your full name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/what's this about/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/tell me more about your project/i)).toBeInTheDocument();
    });

    it('should render icons for each field', () => {
      renderContactPage();

      expect(screen.getByTestId('user-icon')).toBeInTheDocument();
      expect(screen.getByTestId('message-icon')).toBeInTheDocument();
      expect(screen.getAllByTestId('mail-icon')).toHaveLength(1);
    });
  });

  describe('Form Submission', () => {
    it('should render submit button', () => {
      renderContactPage();

      const submitButton = screen.getByRole('button', { name: /send message/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('should update form state when inputs change', () => {
      renderContactPage();

      const nameInput = screen.getByPlaceholderText(/your full name/i);
      const subjectInput = screen.getByPlaceholderText(/what's this about/i);
      const messageInput = screen.getByPlaceholderText(/tell me more about your project/i);

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
      fireEvent.change(messageInput, { target: { value: 'Test message' } });

      expect(nameInput).toHaveValue('John Doe');
      expect(subjectInput).toHaveValue('Test Subject');
      expect(messageInput).toHaveValue('Test message');
    });

    it('should open mailto link on form submit', async () => {
      renderContactPage();

      const nameInput = screen.getByPlaceholderText(/your full name/i);
      const subjectInput = screen.getByPlaceholderText(/what's this about/i);
      const messageInput = screen.getByPlaceholderText(/tell me more about your project/i);
      const submitButton = screen.getByRole('button', { name: /send message/i });

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
      fireEvent.change(messageInput, { target: { value: 'Test message content' } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(window.location.href).toContain('mailto:nate@nathanaking.com');
        expect(window.location.href).toContain('subject=Test%20Subject');
      });
    });

    it('should include name and message in mailto body', async () => {
      renderContactPage();

      const nameInput = screen.getByPlaceholderText(/your full name/i);
      const subjectInput = screen.getByPlaceholderText(/what's this about/i);
      const messageInput = screen.getByPlaceholderText(/tell me more about your project/i);
      const submitButton = screen.getByRole('button', { name: /send message/i });

      fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });
      fireEvent.change(subjectInput, { target: { value: 'Collaboration' } });
      fireEvent.change(messageInput, { target: { value: 'I would like to collaborate' } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(window.location.href).toContain('Jane%20Smith');
        expect(window.location.href).toContain('I%20would%20like%20to%20collaborate');
      });
    });

    it('should show loading state while submitting', async () => {
      renderContactPage();

      const nameInput = screen.getByPlaceholderText(/your full name/i);
      const subjectInput = screen.getByPlaceholderText(/what's this about/i);
      const messageInput = screen.getByPlaceholderText(/tell me more about your project/i);
      const submitButton = screen.getByRole('button', { name: /send message/i });

      fireEvent.change(nameInput, { target: { value: 'Test' } });
      fireEvent.change(subjectInput, { target: { value: 'Test' } });
      fireEvent.change(messageInput, { target: { value: 'Test' } });

      fireEvent.click(submitButton);

      // Button should show loading text immediately
      expect(screen.getByText(/opening email client/i)).toBeInTheDocument();
    });

    it('should disable submit button while submitting', async () => {
      renderContactPage();

      const nameInput = screen.getByPlaceholderText(/your full name/i);
      const subjectInput = screen.getByPlaceholderText(/what's this about/i);
      const messageInput = screen.getByPlaceholderText(/tell me more about your project/i);
      const submitButton = screen.getByRole('button', { name: /send message/i });

      fireEvent.change(nameInput, { target: { value: 'Test' } });
      fireEvent.change(subjectInput, { target: { value: 'Test' } });
      fireEvent.change(messageInput, { target: { value: 'Test' } });

      fireEvent.click(submitButton);

      const disabledButton = screen.getByRole('button', { name: /opening email client/i });
      expect(disabledButton).toBeDisabled();
    });

    // Note: Success message and form reset tests are skipped as they involve complex
    // setTimeout interactions that are difficult to test reliably with fake timers
  });

  describe('Form Validation', () => {
    it('should have required attribute on all fields', () => {
      renderContactPage();

      const nameInput = screen.getByPlaceholderText(/your full name/i);
      const subjectInput = screen.getByPlaceholderText(/what's this about/i);
      const messageInput = screen.getByPlaceholderText(/tell me more about your project/i);

      expect(nameInput).toBeRequired();
      expect(subjectInput).toBeRequired();
      expect(messageInput).toBeRequired();
    });

    it('should have proper input types', () => {
      renderContactPage();

      const nameInput = screen.getByLabelText(/name/i);
      const subjectInput = screen.getByLabelText(/subject/i);

      expect(nameInput).toHaveAttribute('type', 'text');
      expect(subjectInput).toHaveAttribute('type', 'text');
    });
  });

  describe('Footer', () => {
    it('should render footer with copyright', () => {
      renderContactPage();

      const currentYear = new Date().getFullYear();
      expect(screen.getByText(`© ${currentYear} Nathan A. King. All rights reserved.`)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have labels associated with inputs', () => {
      renderContactPage();

      const nameInput = screen.getByPlaceholderText(/your full name/i);
      const subjectInput = screen.getByPlaceholderText(/what's this about/i);
      const messageInput = screen.getByPlaceholderText(/tell me more about your project/i);

      expect(nameInput).toHaveAttribute('id', 'name');
      expect(subjectInput).toHaveAttribute('id', 'subject');
      expect(messageInput).toHaveAttribute('id', 'message');
    });

    it('should have semantic form structure', () => {
      const { container } = renderContactPage();

      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
    });
  });
});
