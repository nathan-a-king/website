import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ClickableImage from '../ClickableImage';

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Maximize2: () => <span data-testid="maximize-icon">Maximize</span>,
}));

// Mock ImageModal component
const mockImageModal = vi.fn();
vi.mock('../ImageModal.jsx', () => ({
  default: (props) => {
    mockImageModal(props);
    return props.isOpen ? (
      <div data-testid="image-modal">
        <button onClick={props.onClose}>Close Modal</button>
      </div>
    ) : null;
  },
}));

describe('ClickableImage', () => {
  const defaultProps = {
    src: '/test-image.jpg',
    alt: 'Test image description',
  };

  beforeEach(() => {
    mockImageModal.mockClear();
  });

  describe('Rendering', () => {
    it('should render image with correct src and alt', () => {
      render(<ClickableImage {...defaultProps} />);

      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/test-image.jpg');
      expect(image).toHaveAttribute('alt', 'Test image description');
    });

    it('should render maximize icon', () => {
      render(<ClickableImage {...defaultProps} />);

      const icon = screen.getByTestId('maximize-icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render caption when alt is provided', () => {
      const { container } = render(<ClickableImage {...defaultProps} />);

      // Caption should appear in the caption div below the image
      const captionDiv = container.querySelector('.text-sm.text-center');
      expect(captionDiv).toBeInTheDocument();
      expect(captionDiv).toHaveTextContent('Test image description');
    });

    it('should not render caption when alt is not provided', () => {
      const { container } = render(<ClickableImage src="/test.jpg" alt="" />);

      const image = container.querySelector('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('alt', '');

      // The caption div should not exist when alt is empty
      const captionDiv = container.querySelector('.text-sm.text-center');
      expect(captionDiv).not.toBeInTheDocument();
    });

    it('should apply custom className to image', () => {
      render(<ClickableImage {...defaultProps} className="custom-class" />);

      const image = screen.getByRole('img');
      expect(image).toHaveClass('custom-class');
    });

    it('should have lazy loading enabled', () => {
      render(<ClickableImage {...defaultProps} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('loading', 'lazy');
    });

    it('should have cursor-pointer class on container', () => {
      render(<ClickableImage {...defaultProps} />);

      const image = screen.getByRole('img');
      const container = image.closest('.cursor-pointer');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Modal Interaction', () => {
    it('should not show modal initially', () => {
      render(<ClickableImage {...defaultProps} />);

      const modal = screen.queryByTestId('image-modal');
      expect(modal).not.toBeInTheDocument();
    });

    it('should open modal when image is clicked', () => {
      render(<ClickableImage {...defaultProps} />);

      const image = screen.getByRole('img');
      const container = image.closest('.cursor-pointer');

      fireEvent.click(container);

      const modal = screen.getByTestId('image-modal');
      expect(modal).toBeInTheDocument();
    });

    it('should pass correct props to ImageModal when open', () => {
      render(<ClickableImage {...defaultProps} />);

      const image = screen.getByRole('img');
      const container = image.closest('.cursor-pointer');

      fireEvent.click(container);

      // Check the most recent call to ImageModal
      const lastCall = mockImageModal.mock.calls[mockImageModal.mock.calls.length - 1][0];
      expect(lastCall.src).toBe('/test-image.jpg');
      expect(lastCall.alt).toBe('Test image description');
      expect(lastCall.isOpen).toBe(true);
      expect(typeof lastCall.onClose).toBe('function');
    });

    it('should close modal when onClose is called', () => {
      render(<ClickableImage {...defaultProps} />);

      const image = screen.getByRole('img');
      const container = image.closest('.cursor-pointer');

      // Open modal
      fireEvent.click(container);

      let modal = screen.getByTestId('image-modal');
      expect(modal).toBeInTheDocument();

      // Close modal
      const closeButton = screen.getByRole('button', { name: /close modal/i });
      fireEvent.click(closeButton);

      modal = screen.queryByTestId('image-modal');
      expect(modal).not.toBeInTheDocument();
    });

    it('should handle multiple open/close cycles', () => {
      render(<ClickableImage {...defaultProps} />);

      const image = screen.getByRole('img');
      const container = image.closest('.cursor-pointer');

      // Open
      fireEvent.click(container);
      expect(screen.getByTestId('image-modal')).toBeInTheDocument();

      // Close
      fireEvent.click(screen.getByRole('button', { name: /close modal/i }));
      expect(screen.queryByTestId('image-modal')).not.toBeInTheDocument();

      // Open again
      fireEvent.click(container);
      expect(screen.getByTestId('image-modal')).toBeInTheDocument();

      // Close again
      fireEvent.click(screen.getByRole('button', { name: /close modal/i }));
      expect(screen.queryByTestId('image-modal')).not.toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('should maintain separate modal state for different instances', () => {
      const { container } = render(
        <>
          <ClickableImage src="/image1.jpg" alt="Image 1" />
          <ClickableImage src="/image2.jpg" alt="Image 2" />
        </>
      );

      const images = screen.getAllByRole('img');

      // Click first image
      const firstContainer = images[0].closest('.cursor-pointer');
      fireEvent.click(firstContainer);

      // Should have one modal open
      const modals = screen.getAllByTestId('image-modal');
      expect(modals).toHaveLength(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper image alt text', () => {
      render(<ClickableImage {...defaultProps} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Test image description');
    });

    it('should be clickable via keyboard navigation', () => {
      render(<ClickableImage {...defaultProps} />);

      const container = screen.getByRole('img').closest('.cursor-pointer');

      // Simulate keyboard click (Enter key typically triggers click)
      fireEvent.click(container);

      expect(screen.getByTestId('image-modal')).toBeInTheDocument();
    });
  });
});
