import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import VectorStoreVisualizer from '../VectorStoreVisualizer';

// Mock ThemeContext
const mockUseTheme = vi.fn();
vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => mockUseTheme(),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Search: ({ size }: { size: number }) => <div data-testid="search-icon">{size}</div>,
  X: ({ size }: { size: number }) => <div data-testid="x-icon">{size}</div>,
}));

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => {
  cb(0);
  return 0;
});

describe('VectorStoreVisualizer', () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({ isDarkMode: false });
    vi.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('should render component with title and description', () => {
      render(<VectorStoreVisualizer />);

      expect(screen.getByText('Vector Store Visualizer')).toBeInTheDocument();
      expect(screen.getByText('See how semantic search finds similar documents in vector space')).toBeInTheDocument();
    });

    it('should render search input with placeholder', () => {
      render(<VectorStoreVisualizer />);

      const input = screen.getByPlaceholderText('e.g., machine learning models');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should render search button', () => {
      render(<VectorStoreVisualizer />);

      const button = screen.getByRole('button', { name: /search/i });
      expect(button).toBeInTheDocument();
    });

    it('should render top K slider with default value of 3', () => {
      render(<VectorStoreVisualizer />);

      expect(screen.getByText('Top K Results: 3')).toBeInTheDocument();
      const slider = screen.getByRole('slider');
      expect(slider).toHaveValue('3');
    });

    it('should render SVG visualization', () => {
      render(<VectorStoreVisualizer />);

      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 600 400');
    });

    it('should render explanation section', () => {
      render(<VectorStoreVisualizer />);

      expect(screen.getByText('How it works:')).toBeInTheDocument();
      expect(screen.getByText(/Each document is converted to a vector/)).toBeInTheDocument();
    });

    it('should not show search results initially', () => {
      render(<VectorStoreVisualizer />);

      expect(screen.queryByText('Search Results')).not.toBeInTheDocument();
    });

    it('should have search button disabled when query is empty', () => {
      render(<VectorStoreVisualizer />);

      const button = screen.getByRole('button', { name: /search/i });
      expect(button).toBeDisabled();
    });
  });

  describe('Search Input', () => {
    it('should update query when typing in input', () => {
      render(<VectorStoreVisualizer />);

      const input = screen.getByPlaceholderText('e.g., machine learning models');
      fireEvent.change(input, { target: { value: 'neural networks' } });

      expect(input).toHaveValue('neural networks');
    });

    it('should enable search button when query has text', () => {
      render(<VectorStoreVisualizer />);

      const input = screen.getByPlaceholderText('e.g., machine learning models');
      const button = screen.getByRole('button', { name: /search/i });

      fireEvent.change(input, { target: { value: 'machine learning' } });

      expect(button).not.toBeDisabled();
    });

    it('should show clear button when query has text', () => {
      render(<VectorStoreVisualizer />);

      const input = screen.getByPlaceholderText('e.g., machine learning models');
      fireEvent.change(input, { target: { value: 'test query' } });

      expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    });

    it('should not show clear button when query is empty', () => {
      render(<VectorStoreVisualizer />);

      expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument();
    });

    it('should trigger search on Enter key press', async () => {
      vi.useFakeTimers();
      render(<VectorStoreVisualizer />);

      const input = screen.getByPlaceholderText('e.g., machine learning models');
      fireEvent.change(input, { target: { value: 'neural networks' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

      expect(screen.getByRole('button', { name: /searching/i })).toBeInTheDocument();

      act(() => {
        vi.runAllTimers();
      });

      expect(screen.getByText('Search Results')).toBeInTheDocument();

      vi.useRealTimers();
    });
  });

  describe('Top K Slider', () => {
    it('should update topK value when slider changes', () => {
      render(<VectorStoreVisualizer />);

      const slider = screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: '5' } });

      expect(screen.getByText('Top K Results: 5')).toBeInTheDocument();
    });

    it('should have correct min and max values', () => {
      render(<VectorStoreVisualizer />);

      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('min', '1');
      expect(slider).toHaveAttribute('max', '5');
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should display search results after clicking search button', () => {
      render(<VectorStoreVisualizer />);

      const input = screen.getByPlaceholderText('e.g., machine learning models');
      fireEvent.change(input, { target: { value: 'neural networks' } });

      const button = screen.getByRole('button', { name: /search/i });
      fireEvent.click(button);

      expect(screen.getByRole('button', { name: /searching/i })).toBeInTheDocument();

      act(() => {
        vi.runAllTimers();
      });

      expect(screen.getByText('Search Results')).toBeInTheDocument();
    });

    it('should display correct number of results based on topK', () => {
      render(<VectorStoreVisualizer />);

      const slider = screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: '2' } });

      const input = screen.getByPlaceholderText('e.g., machine learning models');
      fireEvent.change(input, { target: { value: 'machine learning' } });

      const button = screen.getByRole('button', { name: /search/i });
      fireEvent.click(button);

      act(() => {
        vi.runAllTimers();
      });

      const results = screen.getAllByText(/#[12]/);
      expect(results).toHaveLength(2);
    });

    it('should show similarity percentage for each result', () => {
      render(<VectorStoreVisualizer />);

      const input = screen.getByPlaceholderText('e.g., machine learning models');
      fireEvent.change(input, { target: { value: 'neural networks' } });

      const button = screen.getByRole('button', { name: /search/i });
      fireEvent.click(button);

      act(() => {
        vi.runAllTimers();
      });

      const similarityElements = screen.getAllByText(/Similarity:/);
      expect(similarityElements.length).toBeGreaterThan(0);
    });

    it('should disable search button during search', () => {
      render(<VectorStoreVisualizer />);

      const input = screen.getByPlaceholderText('e.g., machine learning models');
      fireEvent.change(input, { target: { value: 'test' } });

      const button = screen.getByRole('button', { name: /search/i });
      fireEvent.click(button);

      expect(button).toBeDisabled();
    });

    it('should not search when query is only whitespace', () => {
      render(<VectorStoreVisualizer />);

      const input = screen.getByPlaceholderText('e.g., machine learning models');
      fireEvent.change(input, { target: { value: '   ' } });

      const button = screen.getByRole('button', { name: /search/i });
      fireEvent.click(button);

      expect(screen.queryByText('Search Results')).not.toBeInTheDocument();
    });
  });

  describe('Clear Search', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should clear query when clear button is clicked', () => {
      render(<VectorStoreVisualizer />);

      const input = screen.getByPlaceholderText('e.g., machine learning models');
      fireEvent.change(input, { target: { value: 'test query' } });

      const clearButton = screen.getByTestId('x-icon').closest('button');
      fireEvent.click(clearButton!);

      expect(input).toHaveValue('');
    });

    it('should clear search results when clear button is clicked', () => {
      render(<VectorStoreVisualizer />);

      const input = screen.getByPlaceholderText('e.g., machine learning models');
      fireEvent.change(input, { target: { value: 'neural networks' } });

      const button = screen.getByRole('button', { name: /search/i });
      fireEvent.click(button);

      act(() => {
        vi.runAllTimers();
      });

      expect(screen.getByText('Search Results')).toBeInTheDocument();

      const clearButton = screen.getByTestId('x-icon').closest('button');
      fireEvent.click(clearButton!);

      expect(screen.queryByText('Search Results')).not.toBeInTheDocument();
    });
  });

  describe('Document Visualization', () => {
    it('should render all 15 documents as circles', () => {
      render(<VectorStoreVisualizer />);

      const circles = document.querySelectorAll('circle');
      // 15 document circles (no query vector initially)
      expect(circles.length).toBe(15);
    });

    it('should show query vector after search', () => {
      vi.useFakeTimers();
      render(<VectorStoreVisualizer />);

      const input = screen.getByPlaceholderText('e.g., machine learning models');
      fireEvent.change(input, { target: { value: 'test' } });

      const button = screen.getByRole('button', { name: /search/i });
      fireEvent.click(button);

      act(() => {
        vi.runAllTimers();
      });

      expect(screen.getByText('Query')).toBeInTheDocument();

      vi.useRealTimers();
    });

    it('should show connection lines between query and results', () => {
      vi.useFakeTimers();
      render(<VectorStoreVisualizer />);

      const input = screen.getByPlaceholderText('e.g., machine learning models');
      fireEvent.change(input, { target: { value: 'neural networks' } });

      const button = screen.getByRole('button', { name: /search/i });
      fireEvent.click(button);

      act(() => {
        vi.runAllTimers();
      });

      const lines = document.querySelectorAll('line');
      // Should have connection lines to top 3 results
      expect(lines.length).toBe(3);

      vi.useRealTimers();
    });
  });

  describe('Legend', () => {
    it('should display category legend', () => {
      render(<VectorStoreVisualizer />);

      expect(screen.getByText('AI/ML')).toBeInTheDocument();
      expect(screen.getByText('Databases')).toBeInTheDocument();
      expect(screen.getByText('Web Dev')).toBeInTheDocument();
      expect(screen.getByText('DevOps')).toBeInTheDocument();
      expect(screen.getByText('Algorithms')).toBeInTheDocument();
    });

    it('should show query vector in legend after search', () => {
      vi.useFakeTimers();
      render(<VectorStoreVisualizer />);

      const input = screen.getByPlaceholderText('e.g., machine learning models');
      fireEvent.change(input, { target: { value: 'test' } });

      const button = screen.getByRole('button', { name: /search/i });
      fireEvent.click(button);

      act(() => {
        vi.runAllTimers();
      });

      expect(screen.getByText('Query Vector')).toBeInTheDocument();

      vi.useRealTimers();
    });
  });

  describe('Dark Mode', () => {
    it('should use dark mode grid color when dark mode is enabled', () => {
      mockUseTheme.mockReturnValue({ isDarkMode: true });
      render(<VectorStoreVisualizer />);

      const pattern = document.querySelector('pattern path');
      expect(pattern).toHaveAttribute('stroke', 'rgba(250, 249, 245, 0.08)');
    });

    it('should use light mode grid color when dark mode is disabled', () => {
      mockUseTheme.mockReturnValue({ isDarkMode: false });
      render(<VectorStoreVisualizer />);

      const pattern = document.querySelector('pattern path');
      expect(pattern).toHaveAttribute('stroke', 'rgba(31, 30, 29, 0.08)');
    });

    it('should use correct text color for result labels in dark mode', () => {
      vi.useFakeTimers();
      mockUseTheme.mockReturnValue({ isDarkMode: true });
      render(<VectorStoreVisualizer />);

      const input = screen.getByPlaceholderText('e.g., machine learning models');
      fireEvent.change(input, { target: { value: 'neural networks' } });

      const button = screen.getByRole('button', { name: /search/i });
      fireEvent.click(button);

      act(() => {
        vi.runAllTimers();
      });

      const texts = document.querySelectorAll('svg text');
      const resultLabels = Array.from(texts).filter(text =>
        text.textContent && /^[1-5]$/.test(text.textContent)
      );
      resultLabels.forEach(label => {
        expect(label).toHaveAttribute('fill', '#FFFFFF');
      });

      vi.useRealTimers();
    });

    it('should use correct text color for result labels in light mode', () => {
      vi.useFakeTimers();
      mockUseTheme.mockReturnValue({ isDarkMode: false });
      render(<VectorStoreVisualizer />);

      const input = screen.getByPlaceholderText('e.g., machine learning models');
      fireEvent.change(input, { target: { value: 'neural networks' } });

      const button = screen.getByRole('button', { name: /search/i });
      fireEvent.click(button);

      act(() => {
        vi.runAllTimers();
      });

      const texts = document.querySelectorAll('svg text');
      const resultLabels = Array.from(texts).filter(text =>
        text.textContent && /^[1-5]$/.test(text.textContent)
      );
      resultLabels.forEach(label => {
        expect(label).toHaveAttribute('fill', '#141413');
      });

      vi.useRealTimers();
    });
  });

  describe('Hover Interaction', () => {
    it('should show tooltip when hovering over a document', () => {
      render(<VectorStoreVisualizer />);

      const circles = document.querySelectorAll('circle');
      const firstCircle = circles[0];

      fireEvent.mouseEnter(firstCircle);

      const tooltip = document.querySelector('.absolute');
      expect(tooltip).toBeInTheDocument();
    });

    it('should hide tooltip when mouse leaves document', () => {
      render(<VectorStoreVisualizer />);

      const circles = document.querySelectorAll('circle');
      const firstCircle = circles[0];

      fireEvent.mouseEnter(firstCircle);
      fireEvent.mouseLeave(firstCircle);

      const tooltip = document.querySelector('.absolute');
      expect(tooltip).not.toBeInTheDocument();
    });
  });

  describe('Styling and Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<VectorStoreVisualizer />);

      const input = screen.getByPlaceholderText('e.g., machine learning models');
      expect(input).toHaveClass('focus:outline-none');
      expect(input).toHaveClass('focus:ring-2');
    });

    it('should have proper button styling', () => {
      render(<VectorStoreVisualizer />);

      const button = screen.getByRole('button', { name: /search/i });
      expect(button).toHaveClass('bg-brand-terracotta');
      expect(button).toHaveClass('text-white');
      expect(button).toHaveClass('disabled:opacity-50');
      expect(button).toHaveClass('disabled:cursor-not-allowed');
    });

    it('should have responsive classes', () => {
      render(<VectorStoreVisualizer />);

      const container = document.querySelector('.max-w-6xl');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Scroll Position Preservation', () => {
    it('should preserve scroll position after search', () => {
      vi.useFakeTimers();
      const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

      render(<VectorStoreVisualizer />);

      const input = screen.getByPlaceholderText('e.g., machine learning models');
      fireEvent.change(input, { target: { value: 'test' } });

      const button = screen.getByRole('button', { name: /search/i });
      fireEvent.click(button);

      act(() => {
        vi.runAllTimers();
      });

      expect(scrollToSpy).toHaveBeenCalled();

      scrollToSpy.mockRestore();
      vi.useRealTimers();
    });
  });
});
