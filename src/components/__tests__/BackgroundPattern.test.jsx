import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import BackgroundPattern from '../BackgroundPattern';

describe('BackgroundPattern', () => {
  describe('Dots Variant', () => {
    it('should render dots pattern by default', () => {
      const { container } = render(<BackgroundPattern />);

      const pattern = container.querySelector('div');
      expect(pattern).toBeInTheDocument();
      expect(pattern).toHaveStyle({
        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      });
    });

    it('should render dots pattern when variant is "dots"', () => {
      const { container } = render(<BackgroundPattern variant="dots" />);

      const pattern = container.querySelector('div');
      expect(pattern).toHaveStyle({
        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      });
    });

    it('should have correct classes for dots variant', () => {
      const { container } = render(<BackgroundPattern variant="dots" />);

      const pattern = container.querySelector('div');
      expect(pattern).toHaveClass('absolute');
      expect(pattern).toHaveClass('inset-0');
      expect(pattern).toHaveClass('opacity-[0.03]');
      expect(pattern).toHaveClass('dark:opacity-[0.02]');
      expect(pattern).toHaveClass('pointer-events-none');
    });

    it('should apply custom className to dots variant', () => {
      const { container } = render(<BackgroundPattern variant="dots" className="custom-class" />);

      const pattern = container.querySelector('div');
      expect(pattern).toHaveClass('custom-class');
      expect(pattern).toHaveClass('absolute'); // Should retain default classes
    });
  });

  describe('Grid Variant', () => {
    it('should render grid pattern when variant is "grid"', () => {
      const { container } = render(<BackgroundPattern variant="grid" />);

      const pattern = container.querySelector('div');
      expect(pattern).toBeInTheDocument();

      const backgroundImage = pattern.style.backgroundImage;
      expect(backgroundImage).toContain('linear-gradient');
      expect(backgroundImage).toContain('90deg');

      expect(pattern).toHaveStyle({
        backgroundSize: '48px 48px',
      });
    });

    it('should have correct classes for grid variant', () => {
      const { container } = render(<BackgroundPattern variant="grid" />);

      const pattern = container.querySelector('div');
      expect(pattern).toHaveClass('absolute');
      expect(pattern).toHaveClass('inset-0');
      expect(pattern).toHaveClass('opacity-[0.025]');
      expect(pattern).toHaveClass('dark:opacity-[0.015]');
      expect(pattern).toHaveClass('pointer-events-none');
    });

    it('should apply custom className to grid variant', () => {
      const { container } = render(<BackgroundPattern variant="grid" className="custom-grid" />);

      const pattern = container.querySelector('div');
      expect(pattern).toHaveClass('custom-grid');
      expect(pattern).toHaveClass('absolute'); // Should retain default classes
    });

    it('should have different opacity than dots variant', () => {
      const { container: dotsContainer } = render(<BackgroundPattern variant="dots" />);
      const { container: gridContainer } = render(<BackgroundPattern variant="grid" />);

      const dotsPattern = dotsContainer.querySelector('div');
      const gridPattern = gridContainer.querySelector('div');

      expect(dotsPattern).toHaveClass('opacity-[0.03]');
      expect(gridPattern).toHaveClass('opacity-[0.025]');
    });
  });

  describe('Invalid Variant', () => {
    it('should return null for unknown variant', () => {
      const { container } = render(<BackgroundPattern variant="unknown" />);

      expect(container.firstChild).toBeNull();
    });

    it('should return null for empty variant', () => {
      const { container } = render(<BackgroundPattern variant="" />);

      expect(container.firstChild).toBeNull();
    });

    it('should not render anything for null variant', () => {
      const { container } = render(<BackgroundPattern variant={null} />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-hidden for dots variant', () => {
      const { container } = render(<BackgroundPattern variant="dots" />);

      const pattern = container.querySelector('div');
      expect(pattern).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have aria-hidden for grid variant', () => {
      const { container } = render(<BackgroundPattern variant="grid" />);

      const pattern = container.querySelector('div');
      expect(pattern).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have pointer-events-none for dots variant', () => {
      const { container } = render(<BackgroundPattern variant="dots" />);

      const pattern = container.querySelector('div');
      expect(pattern).toHaveClass('pointer-events-none');
    });

    it('should have pointer-events-none for grid variant', () => {
      const { container } = render(<BackgroundPattern variant="grid" />);

      const pattern = container.querySelector('div');
      expect(pattern).toHaveClass('pointer-events-none');
    });
  });

  describe('Styling', () => {
    it('should have absolute positioning for dots', () => {
      const { container } = render(<BackgroundPattern variant="dots" />);

      const pattern = container.querySelector('div');
      expect(pattern).toHaveClass('absolute');
      expect(pattern).toHaveClass('inset-0');
    });

    it('should have absolute positioning for grid', () => {
      const { container } = render(<BackgroundPattern variant="grid" />);

      const pattern = container.querySelector('div');
      expect(pattern).toHaveClass('absolute');
      expect(pattern).toHaveClass('inset-0');
    });

    it('should have different background sizes for variants', () => {
      const { container: dotsContainer } = render(<BackgroundPattern variant="dots" />);
      const { container: gridContainer } = render(<BackgroundPattern variant="grid" />);

      const dotsPattern = dotsContainer.querySelector('div');
      const gridPattern = gridContainer.querySelector('div');

      expect(dotsPattern).toHaveStyle({ backgroundSize: '24px 24px' });
      expect(gridPattern).toHaveStyle({ backgroundSize: '48px 48px' });
    });
  });

  describe('ClassName Prop', () => {
    it('should use empty string as default className', () => {
      const { container } = render(<BackgroundPattern variant="dots" />);

      const pattern = container.querySelector('div');
      // Should have default classes but no extra custom classes
      expect(pattern.className).toContain('absolute');
      expect(pattern.className).toContain('inset-0');
    });

    it('should append custom className without overriding defaults', () => {
      const { container } = render(
        <BackgroundPattern variant="dots" className="z-10 bg-red-500" />
      );

      const pattern = container.querySelector('div');
      expect(pattern).toHaveClass('z-10');
      expect(pattern).toHaveClass('bg-red-500');
      expect(pattern).toHaveClass('absolute'); // Default class still present
      expect(pattern).toHaveClass('inset-0'); // Default class still present
    });

    it('should handle multiple custom classes', () => {
      const { container } = render(
        <BackgroundPattern variant="grid" className="custom-1 custom-2 custom-3" />
      );

      const pattern = container.querySelector('div');
      expect(pattern).toHaveClass('custom-1');
      expect(pattern).toHaveClass('custom-2');
      expect(pattern).toHaveClass('custom-3');
    });
  });
});
