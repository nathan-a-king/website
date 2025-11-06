import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardContent } from '../card';

describe('Card Components', () => {
  describe('Card', () => {
    it('should render children', () => {
      render(<Card>Test content</Card>);

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>);

      const card = container.firstChild;
      expect(card).toHaveClass('custom-class');
    });

    it('should apply additional props', () => {
      const { container } = render(
        <Card data-testid="test-card" id="my-card">
          Content
        </Card>
      );

      const card = container.firstChild;
      expect(card).toHaveAttribute('data-testid', 'test-card');
      expect(card).toHaveAttribute('id', 'my-card');
    });

    it('should use empty string as default className', () => {
      const { container } = render(<Card>Content</Card>);

      const card = container.firstChild;
      expect(card.className).toBe('');
    });

    it('should render as a div element', () => {
      const { container } = render(<Card>Content</Card>);

      expect(container.firstChild.tagName).toBe('DIV');
    });
  });

  describe('CardContent', () => {
    it('should render children', () => {
      render(<CardContent>Content text</CardContent>);

      expect(screen.getByText('Content text')).toBeInTheDocument();
    });

    it('should have default padding classes', () => {
      const { container } = render(<CardContent>Content</CardContent>);

      const cardContent = container.firstChild;
      expect(cardContent).toHaveClass('p-6');
      expect(cardContent).toHaveClass('pt-0');
    });

    it('should apply custom className alongside default classes', () => {
      const { container } = render(<CardContent className="custom-class">Content</CardContent>);

      const cardContent = container.firstChild;
      expect(cardContent).toHaveClass('p-6');
      expect(cardContent).toHaveClass('pt-0');
      expect(cardContent).toHaveClass('custom-class');
    });

    it('should apply additional props', () => {
      const { container } = render(
        <CardContent data-testid="test-content" role="region">
          Content
        </CardContent>
      );

      const cardContent = container.firstChild;
      expect(cardContent).toHaveAttribute('data-testid', 'test-content');
      expect(cardContent).toHaveAttribute('role', 'region');
    });

    it('should render as a div element', () => {
      const { container } = render(<CardContent>Content</CardContent>);

      expect(container.firstChild.tagName).toBe('DIV');
    });
  });

  describe('Card with CardContent', () => {
    it('should render Card with CardContent as children', () => {
      render(
        <Card className="card-class">
          <CardContent className="content-class">
            Nested content
          </CardContent>
        </Card>
      );

      expect(screen.getByText('Nested content')).toBeInTheDocument();
    });

    it('should maintain proper structure', () => {
      const { container } = render(
        <Card>
          <CardContent>Content</CardContent>
        </Card>
      );

      const card = container.firstChild;
      const cardContent = card.firstChild;

      expect(card.tagName).toBe('DIV');
      expect(cardContent.tagName).toBe('DIV');
      expect(cardContent).toHaveClass('p-6');
    });
  });
});
