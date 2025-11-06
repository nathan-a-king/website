import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ImageModal from '../ImageModal';

// Mock ThemeContext
vi.mock('../../contexts/ThemeContext.jsx', () => ({
  useTheme: vi.fn(() => ({ isDarkMode: false })),
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  X: () => <span data-testid="x-icon">X</span>,
}));

describe('ImageModal', () => {
  const mockOnClose = vi.fn();
  const defaultProps = {
    src: '/test-image.jpg',
    alt: 'Test image description',
    isOpen: true,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    mockOnClose.mockClear();
    // Reset body styles
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  });

  afterEach(() => {
    // Clean up any remaining event listeners
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  });

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(<ImageModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(<ImageModal {...defaultProps} />);

      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/test-image.jpg');
      expect(image).toHaveAttribute('alt', 'Test image description');
    });

    it('should render close button with aria-label', () => {
      render(<ImageModal {...defaultProps} />);

      const closeButton = screen.getByLabelText('Close image');
      expect(closeButton).toBeInTheDocument();
    });

    it('should render caption when alt text is provided', () => {
      const { container } = render(<ImageModal {...defaultProps} />);

      // Caption should appear in the caption div
      const captionDiv = container.querySelector('.fixed.bottom-8');
      expect(captionDiv).toBeInTheDocument();
      expect(captionDiv).toHaveTextContent('Test image description');
    });

    it('should not render caption when alt is not provided', () => {
      const { container } = render(<ImageModal {...defaultProps} alt="" />);

      // Caption div should not exist when alt is empty
      const captionDiv = container.querySelector('.fixed.bottom-8');
      expect(captionDiv).not.toBeInTheDocument();
    });
  });

  describe('Scroll Lock', () => {
    it('should lock scroll when modal opens', () => {
      render(<ImageModal {...defaultProps} />);

      expect(document.body.style.overflow).toBe('hidden');
      expect(document.documentElement.style.overflow).toBe('hidden');
    });

    it('should unlock scroll when modal closes', () => {
      const { rerender } = render(<ImageModal {...defaultProps} />);

      expect(document.body.style.overflow).toBe('hidden');

      rerender(<ImageModal {...defaultProps} isOpen={false} />);

      expect(document.body.style.overflow).toBe('');
      expect(document.documentElement.style.overflow).toBe('');
    });

    it('should restore scroll on unmount', () => {
      const { unmount } = render(<ImageModal {...defaultProps} />);

      expect(document.body.style.overflow).toBe('hidden');

      unmount();

      expect(document.body.style.overflow).toBe('');
      expect(document.documentElement.style.overflow).toBe('');
    });
  });

  describe('Close Interactions', () => {
    it('should call onClose when clicking backdrop', () => {
      render(<ImageModal {...defaultProps} />);

      // Click the backdrop (the outer div with fixed inset-0)
      const backdrop = screen.getByRole('img').closest('div').parentElement.parentElement;
      fireEvent.click(backdrop);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when clicking the image', () => {
      render(<ImageModal {...defaultProps} />);

      const image = screen.getByRole('img');
      fireEvent.click(image);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should call onClose when clicking close button', () => {
      render(<ImageModal {...defaultProps} />);

      const closeButton = screen.getByLabelText('Close image');
      fireEvent.click(closeButton);

      // Should be called at least once (may bubble to backdrop, so could be 2)
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when pressing Escape key', () => {
      render(<ImageModal {...defaultProps} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when pressing other keys', () => {
      render(<ImageModal {...defaultProps} />);

      fireEvent.keyDown(document, { key: 'Enter' });
      fireEvent.keyDown(document, { key: 'a' });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should not add event listener when isOpen is false', () => {
      render(<ImageModal {...defaultProps} isOpen={false} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Event Listener Cleanup', () => {
    it('should remove keydown event listener on unmount', () => {
      const { unmount } = render(<ImageModal {...defaultProps} />);

      unmount();

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should remove event listener when isOpen changes to false', () => {
      const { rerender } = render(<ImageModal {...defaultProps} />);

      rerender(<ImageModal {...defaultProps} isOpen={false} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible close button', () => {
      render(<ImageModal {...defaultProps} />);

      const closeButton = screen.getByLabelText('Close image');
      expect(closeButton).toHaveAttribute('aria-label', 'Close image');
    });

    it('should render image with alt text', () => {
      render(<ImageModal {...defaultProps} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Test image description');
    });
  });
});
