import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import YieldImpact from '../YieldImpact';

// Mock ThemeContext
const mockUseTheme = vi.fn();
vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => mockUseTheme(),
}));

describe('YieldImpact', () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({ isDarkMode: false });
    vi.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('should render without crashing', () => {
      render(<YieldImpact />);

      expect(screen.getByText('Why Smaller Dies Win: Yield vs Die Size')).toBeInTheDocument();
    });

    it('should render SVG chart', () => {
      render(<YieldImpact />);

      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 1400 660');
    });

    it('should have proper ARIA attributes', () => {
      render(<YieldImpact />);

      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('role', 'img');
      expect(svg).toHaveAttribute('aria-label');
      expect(svg).toHaveAttribute('aria-describedby', 'yield-impact-description');
    });

    it('should have description element for screen readers', () => {
      render(<YieldImpact />);

      const desc = document.querySelector('desc#yield-impact-description');
      expect(desc).toBeInTheDocument();
      expect(desc?.textContent).toContain('Chart demonstrating');
    });

    it('should render callout box', () => {
      render(<YieldImpact />);

      expect(screen.getByText(/Doubling die size cuts good dies/)).toBeInTheDocument();
    });

    it('should render legend', () => {
      render(<YieldImpact />);

      expect(screen.getByText('Yield (%)')).toBeInTheDocument();
      expect(screen.getByText('Good Dies per Wafer')).toBeInTheDocument();
    });

    it('should render grouped bars (yield and dies)', () => {
      render(<YieldImpact />);

      // Should have bars for 4 die sizes × 2 metrics = 8 bars minimum
      const bars = document.querySelectorAll('rect[rx="4"]');
      expect(bars.length).toBeGreaterThanOrEqual(8);
    });

    it('should render die size labels', () => {
      render(<YieldImpact />);

      // Check for die sizes in mm²
      expect(screen.getByText('(119mm²)')).toBeInTheDocument();
      expect(screen.getByText('(440mm²)')).toBeInTheDocument();
    });

    it('should render axis labels', () => {
      render(<YieldImpact />);

      expect(screen.getByText('Die Size')).toBeInTheDocument();
      expect(screen.getByText('Value')).toBeInTheDocument();
    });

    it('should render aria-live region for hover announcements', () => {
      render(<YieldImpact />);

      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
    });
  });

  describe('Hover Interaction', () => {
    it('should handle hover events on bars', () => {
      render(<YieldImpact />);

      const barGroups = document.querySelectorAll('g[cursor="pointer"]');
      expect(barGroups.length).toBeGreaterThan(0);

      // Hover over first bar
      fireEvent.mouseEnter(barGroups[0]);

      // Should update aria-live region
      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion?.textContent).toBeTruthy();
    });

    it('should clear hover state on mouse leave', () => {
      render(<YieldImpact />);

      const barGroups = document.querySelectorAll('g[cursor="pointer"]');

      // Hover over and then leave
      fireEvent.mouseEnter(barGroups[0]);
      fireEvent.mouseLeave(barGroups[0]);

      // Live region should be empty
      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion?.textContent?.trim()).toBe('');
    });

    it('should announce yield or dies information on hover', () => {
      render(<YieldImpact />);

      const barGroups = document.querySelectorAll('g[cursor="pointer"]');
      fireEvent.mouseEnter(barGroups[0]);

      const liveRegion = document.querySelector('[aria-live="polite"]');
      const announcement = liveRegion?.textContent;

      // Should contain either "Yield" with % or "dies per wafer"
      const hasYieldInfo = announcement?.includes('Yield') && announcement?.includes('%');
      const hasDiesInfo = announcement?.includes('dies per wafer');

      expect(hasYieldInfo || hasDiesInfo).toBe(true);
    });
  });

  describe('Dark Mode', () => {
    it('should use dark mode colors when dark mode is enabled', () => {
      mockUseTheme.mockReturnValue({ isDarkMode: true });
      render(<YieldImpact />);

      const background = document.querySelector('rect[rx="8"]');
      expect(background).toHaveAttribute('fill', '#1f2937');
    });

    it('should use light mode colors when dark mode is disabled', () => {
      mockUseTheme.mockReturnValue({ isDarkMode: false });
      render(<YieldImpact />);

      const background = document.querySelector('rect[rx="8"]');
      expect(background).toHaveAttribute('fill', '#f3f4f6');
    });
  });

  describe('Responsive Layout', () => {
    it('should have responsive SVG with preserveAspectRatio', () => {
      render(<YieldImpact />);

      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet');
    });

    it('should have overflow-x-auto wrapper for horizontal scrolling', () => {
      render(<YieldImpact />);

      const wrapper = document.querySelector('.overflow-x-auto');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper sr-only class for screen reader content', () => {
      render(<YieldImpact />);

      const srOnly = document.querySelector('.sr-only');
      expect(srOnly).toBeInTheDocument();
      expect(srOnly).toHaveAttribute('aria-live', 'polite');
    });

    it('should use distinct colors for yield vs dies bars', () => {
      render(<YieldImpact />);

      // Yield bars should be blue (#2E5A91)
      // Dies bars should be terracotta (#CC6B4A)
      const bars = document.querySelectorAll('rect[rx="4"]');
      const barColors = new Set(Array.from(bars).map(b => b.getAttribute('fill')));

      expect(barColors.has('#2E5A91')).toBe(true); // yield color
      expect(barColors.has('#CC6B4A')).toBe(true); // dies color
    });
  });

  describe('Data Visualization', () => {
    it('should display M1 die data', () => {
      render(<YieldImpact />);

      expect(screen.getByText('M1')).toBeInTheDocument();
      expect(screen.getByText('(119mm²)')).toBeInTheDocument();
    });

    it('should display M1 Max die data', () => {
      render(<YieldImpact />);

      expect(screen.getByText('M1 Max')).toBeInTheDocument();
      expect(screen.getByText('(440mm²)')).toBeInTheDocument();
    });

    it('should display hypothetical large SoC data', () => {
      render(<YieldImpact />);

      // Text is split across multiple lines in SVG
      expect(screen.getByText('Hypothetical')).toBeInTheDocument();
      expect(screen.getByText('Large SoC')).toBeInTheDocument();
      expect(screen.getByText('(600mm²)')).toBeInTheDocument();
    });

    it('should show percentage values for yield', () => {
      render(<YieldImpact />);

      const texts = Array.from(document.querySelectorAll('text'));
      const percentages = texts.filter(t => /\d+\.?\d*%/.test(t.textContent || ''));

      expect(percentages.length).toBeGreaterThan(0);
    });

    it('should show numeric values for good dies', () => {
      render(<YieldImpact />);

      const texts = Array.from(document.querySelectorAll('text'));
      const numbers = texts.filter(t => {
        const num = parseInt(t.textContent || '');
        return !isNaN(num) && num > 20 && num < 500;
      });

      expect(numbers.length).toBeGreaterThan(0);
    });
  });

  describe('Grid and Axes', () => {
    it('should render grid lines', () => {
      render(<YieldImpact />);

      const gridLines = document.querySelectorAll('line[stroke-dasharray="4,4"]');
      expect(gridLines.length).toBeGreaterThan(0);
    });

    it('should render axis lines', () => {
      render(<YieldImpact />);

      const axisLines = document.querySelectorAll('line[stroke-width="2"]');
      expect(axisLines.length).toBeGreaterThan(0);
    });

    it('should render grid value labels', () => {
      render(<YieldImpact />);

      // Should have labels for 0, 100, 200, 300, 400
      const texts = Array.from(document.querySelectorAll('text'));
      const gridLabels = texts.filter(t => /^(0|100|200|300|400)$/.test(t.textContent || ''));

      expect(gridLabels.length).toBeGreaterThan(0);
    });
  });
});
