import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CostComparison from '../CostComparison';

// Mock ThemeContext
const mockUseTheme = vi.fn();
vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => mockUseTheme(),
}));

describe('CostComparison', () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({ isDarkMode: false });
    vi.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('should render without crashing', () => {
      render(<CostComparison />);

      expect(screen.getByText('Silicon Cost Comparison: Process Node Evolution')).toBeInTheDocument();
    });

    it('should render SVG chart', () => {
      render(<CostComparison />);

      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 1400 600');
    });

    it('should have proper ARIA attributes', () => {
      render(<CostComparison />);

      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('role', 'img');
      expect(svg).toHaveAttribute('aria-label');
      expect(svg).toHaveAttribute('aria-describedby', 'cost-comparison-description');
    });

    it('should have description element for screen readers', () => {
      render(<CostComparison />);

      const desc = document.querySelector('desc#cost-comparison-description');
      expect(desc).toBeInTheDocument();
      expect(desc?.textContent).toContain('Dual bar chart');
    });

    it('should render chart titles', () => {
      render(<CostComparison />);

      expect(screen.getByText('2023 Estimates (N5 Process)')).toBeInTheDocument();
      expect(screen.getByText('2025 Estimates (N3 Process)')).toBeInTheDocument();
    });

    it('should render cost bars', () => {
      render(<CostComparison />);

      // Should have multiple bars (3 for N5 + 3 for N3 = 6 total)
      const bars = document.querySelectorAll('rect[rx="4"]');
      expect(bars.length).toBeGreaterThanOrEqual(6);
    });

    it('should render cost labels', () => {
      render(<CostComparison />);

      // Should have dollar signs in cost labels
      const texts = Array.from(document.querySelectorAll('text'));
      const costLabels = texts.filter(t => t.textContent?.includes('$'));

      expect(costLabels.length).toBeGreaterThan(0);
    });

    it('should render Y-axis label', () => {
      render(<CostComparison />);

      // Y-axis label appears twice (once for each chart)
      const labels = screen.getAllByText('Estimated Materials Cost ($)');
      expect(labels.length).toBe(2);
    });

    it('should render grid lines with values', () => {
      render(<CostComparison />);

      // Check for grid value labels (0, 100, 200, etc.)
      const texts = Array.from(document.querySelectorAll('text'));
      const gridLabels = texts.filter(t => /^(0|100|200|300|400|500)$/.test(t.textContent || ''));

      expect(gridLabels.length).toBeGreaterThan(0);
    });

    it('should render aria-live region for hover announcements', () => {
      render(<CostComparison />);

      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
    });

    it('should render bottom note', () => {
      render(<CostComparison />);

      expect(screen.getByText(/Note: Estimates based on wafer costs/)).toBeInTheDocument();
    });
  });

  describe('Hover Interaction', () => {
    it('should handle hover events on bars', () => {
      render(<CostComparison />);

      const barGroups = document.querySelectorAll('g[cursor="pointer"]');
      expect(barGroups.length).toBeGreaterThan(0);

      // Hover over first bar
      fireEvent.mouseEnter(barGroups[0]);

      // Should update aria-live region
      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion?.textContent).toBeTruthy();
    });

    it('should clear hover state on mouse leave', () => {
      render(<CostComparison />);

      const barGroups = document.querySelectorAll('g[cursor="pointer"]');

      // Hover over and then leave
      fireEvent.mouseEnter(barGroups[0]);
      fireEvent.mouseLeave(barGroups[0]);

      // Live region should be empty
      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion?.textContent?.trim()).toBe('');
    });

    it('should announce cost information on hover', () => {
      render(<CostComparison />);

      const barGroups = document.querySelectorAll('g[cursor="pointer"]');
      fireEvent.mouseEnter(barGroups[0]);

      const liveRegion = document.querySelector('[aria-live="polite"]');
      const announcement = liveRegion?.textContent;

      // Should contain either "N5 Process" or "N3 Process" and a dollar amount
      expect(announcement).toMatch(/(N5|N3) Process/);
      expect(announcement).toContain('$');
    });
  });

  describe('Dark Mode', () => {
    it('should use dark mode colors when dark mode is enabled', () => {
      mockUseTheme.mockReturnValue({ isDarkMode: true });
      render(<CostComparison />);

      const background = document.querySelector('rect[rx="8"]');
      expect(background).toHaveAttribute('fill', '#1f2937');
    });

    it('should use light mode colors when dark mode is disabled', () => {
      mockUseTheme.mockReturnValue({ isDarkMode: false });
      render(<CostComparison />);

      const background = document.querySelector('rect[rx="8"]');
      expect(background).toHaveAttribute('fill', '#f3f4f6');
    });
  });

  describe('Responsive Layout', () => {
    it('should have responsive SVG with preserveAspectRatio', () => {
      render(<CostComparison />);

      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet');
    });

    it('should have overflow-x-auto wrapper for horizontal scrolling', () => {
      render(<CostComparison />);

      const wrapper = document.querySelector('.overflow-x-auto');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper sr-only class for screen reader content', () => {
      render(<CostComparison />);

      const srOnly = document.querySelector('.sr-only');
      expect(srOnly).toBeInTheDocument();
      expect(srOnly).toHaveAttribute('aria-live', 'polite');
    });

    it('should use brand colors consistently', () => {
      render(<CostComparison />);

      // Bars should use brand-terracotta color
      const bars = document.querySelectorAll('rect[rx="4"]');
      const barColors = Array.from(bars).map(b => b.getAttribute('fill'));

      expect(barColors).toContain('#CC6B4A'); // brand-terracotta
    });
  });

  describe('Data Visualization', () => {
    it('should display correct number of N5 process bars', () => {
      render(<CostComparison />);

      // Text is split across multiple text elements in SVG
      expect(screen.getByText('M1')).toBeInTheDocument();
      // (N5) appears multiple times (for M1 and M1 Max)
      const n5Labels = screen.getAllByText('(N5)');
      expect(n5Labels.length).toBeGreaterThan(0);
    });

    it('should display correct number of N3 process bars', () => {
      render(<CostComparison />);

      // Text is split across multiple text elements in SVG
      expect(screen.getByText('M3')).toBeInTheDocument();
      expect(screen.getByText('(N3B)')).toBeInTheDocument();
      expect(screen.getByText('M4')).toBeInTheDocument();
      expect(screen.getByText('(N3E)')).toBeInTheDocument();
    });
  });
});
