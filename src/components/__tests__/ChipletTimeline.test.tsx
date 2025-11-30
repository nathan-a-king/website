import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChipletTimeline from '../ChipletTimeline';

// Mock ThemeContext
const mockUseTheme = vi.fn();
vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => mockUseTheme(),
}));

describe('ChipletTimeline', () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({ isDarkMode: false });
    vi.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('should render without crashing', () => {
      render(<ChipletTimeline />);

      expect(screen.getByText('Predictions vs Reality: The Chiplet Convergence Timeline')).toBeInTheDocument();
    });

    it('should render legend with prediction and reality labels', () => {
      render(<ChipletTimeline />);

      expect(screen.getByText('2023 Predictions')).toBeInTheDocument();
      expect(screen.getByText('What Actually Happened')).toBeInTheDocument();
    });

    it('should render SVG timeline', () => {
      render(<ChipletTimeline />);

      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 1400 700');
    });

    it('should have proper ARIA attributes', () => {
      render(<ChipletTimeline />);

      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('role', 'img');
      expect(svg).toHaveAttribute('aria-label');
      expect(svg).toHaveAttribute('aria-describedby', 'chiplet-timeline-description');
    });

    it('should have description element for screen readers', () => {
      render(<ChipletTimeline />);

      const desc = document.querySelector('desc#chiplet-timeline-description');
      expect(desc).toBeInTheDocument();
      expect(desc?.textContent).toContain('Timeline visualization');
    });

    it('should render timeline events', () => {
      render(<ChipletTimeline />);

      // Should have multiple event markers (rectangles for predictions, circles for reality)
      const rects = document.querySelectorAll('rect[rx="2"]'); // Prediction markers
      const circles = document.querySelectorAll('circle'); // Reality markers

      expect(rects.length).toBeGreaterThan(0);
      expect(circles.length).toBeGreaterThan(0);
    });

    it('should render year axis labels', () => {
      render(<ChipletTimeline />);

      // Check for year labels in the SVG
      const texts = Array.from(document.querySelectorAll('text'));
      const yearTexts = texts.filter(t => t.textContent?.match(/^20\d{2}$/));

      expect(yearTexts.length).toBeGreaterThan(0);
    });

    it('should render aria-live region for hover announcements', () => {
      render(<ChipletTimeline />);

      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
    });
  });

  describe('Hover Interaction', () => {
    it('should handle hover events on timeline events', () => {
      render(<ChipletTimeline />);

      const eventGroups = document.querySelectorAll('g[cursor="pointer"]');
      expect(eventGroups.length).toBeGreaterThan(0);

      // Hover over first event
      fireEvent.mouseEnter(eventGroups[0]);

      // Should update aria-live region (check it's not empty)
      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion?.textContent).toBeTruthy();
    });

    it('should clear hover state on mouse leave', () => {
      render(<ChipletTimeline />);

      const eventGroups = document.querySelectorAll('g[cursor="pointer"]');

      // Hover over and then leave
      fireEvent.mouseEnter(eventGroups[0]);
      fireEvent.mouseLeave(eventGroups[0]);

      // Live region should be empty
      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion?.textContent?.trim()).toBe('');
    });
  });

  describe('Dark Mode', () => {
    it('should use dark mode colors when dark mode is enabled', () => {
      mockUseTheme.mockReturnValue({ isDarkMode: true });
      render(<ChipletTimeline />);

      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();

      // Background should use dark mode color
      const background = document.querySelector('rect[rx="8"]');
      expect(background).toHaveAttribute('fill', '#1f2937');
    });

    it('should use light mode colors when dark mode is disabled', () => {
      mockUseTheme.mockReturnValue({ isDarkMode: false });
      render(<ChipletTimeline />);

      const background = document.querySelector('rect[rx="8"]');
      expect(background).toHaveAttribute('fill', '#f3f4f6');
    });
  });

  describe('Responsive Layout', () => {
    it('should have responsive SVG with preserveAspectRatio', () => {
      render(<ChipletTimeline />);

      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet');
    });

    it('should have overflow-x-auto wrapper for horizontal scrolling', () => {
      render(<ChipletTimeline />);

      const wrapper = document.querySelector('.overflow-x-auto');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper sr-only class for screen reader content', () => {
      render(<ChipletTimeline />);

      const srOnly = document.querySelector('.sr-only');
      expect(srOnly).toBeInTheDocument();
      expect(srOnly).toHaveAttribute('aria-live', 'polite');
    });

    it('should announce event information on hover for screen readers', () => {
      render(<ChipletTimeline />);

      const eventGroups = document.querySelectorAll('g[cursor="pointer"]');
      fireEvent.mouseEnter(eventGroups[0]);

      const liveRegion = document.querySelector('[aria-live="polite"]');
      const announcement = liveRegion?.textContent;

      // Should contain either "Prediction:" or "Actual event:"
      expect(announcement).toMatch(/(Prediction|Actual event):/);
    });
  });
});
