import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ArchitectureEvolution from '../ArchitectureEvolution';

// Mock ThemeContext
const mockUseTheme = vi.fn();
vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => mockUseTheme(),
}));

describe('ArchitectureEvolution', () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({ isDarkMode: false });
    vi.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('should render without crashing', () => {
      render(<ArchitectureEvolution />);

      expect(screen.getByText('The Architecture Evolution: From Monolithic to Modular')).toBeInTheDocument();
    });

    it('should render SVG diagram', () => {
      render(<ArchitectureEvolution />);

      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 1600 700');
    });

    it('should have proper ARIA attributes', () => {
      render(<ArchitectureEvolution />);

      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('role', 'img');
      expect(svg).toHaveAttribute('aria-label');
      expect(svg).toHaveAttribute('aria-describedby', 'architecture-evolution-description');
    });

    it('should have description element for screen readers', () => {
      render(<ArchitectureEvolution />);

      const desc = document.querySelector('desc#architecture-evolution-description');
      expect(desc).toBeInTheDocument();
      expect(desc?.textContent).toContain('Three-panel comparison');
    });

    it('should render M1 Ultra section title', () => {
      render(<ArchitectureEvolution />);

      expect(screen.getByText('2022: Apple M1 Ultra')).toBeInTheDocument();
      expect(screen.getByText('(UltraFusion - Two Complete SoCs)')).toBeInTheDocument();
    });

    it('should render AMD EPYC section title', () => {
      render(<ArchitectureEvolution />);

      expect(screen.getByText('2024: AMD EPYC')).toBeInTheDocument();
      expect(screen.getByText('(True Chiplet Architecture)')).toBeInTheDocument();
    });

    it('should render Apple M5 section title', () => {
      render(<ArchitectureEvolution />);

      expect(screen.getByText('2026?: Apple M5 (Rumored)')).toBeInTheDocument();
      expect(screen.getByText('(SoIC - True Chiplet)')).toBeInTheDocument();
    });

    it('should render advantage/challenge labels for each section', () => {
      render(<ArchitectureEvolution />);

      // Should have multiple "Advantage:" and "Challenge:" labels
      const texts = Array.from(document.querySelectorAll('text'));
      const advantageLabels = texts.filter(t => t.textContent?.includes('Advantage:'));
      const challengeLabels = texts.filter(t => t.textContent?.includes('Challenge:'));

      expect(advantageLabels.length).toBe(3); // One for each architecture
      expect(challengeLabels.length).toBe(3);
    });

    it('should render bottom convergence note', () => {
      render(<ArchitectureEvolution />);

      expect(screen.getByText(/The industry converges/)).toBeInTheDocument();
    });

    it('should render aria-live region for hover announcements', () => {
      render(<ArchitectureEvolution />);

      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
    });
  });

  describe('M1 Ultra Architecture', () => {
    it('should render two M1 Max chips', () => {
      render(<ArchitectureEvolution />);

      const texts = Array.from(document.querySelectorAll('text'));
      const m1MaxLabels = texts.filter(t => t.textContent === 'M1 Max');

      expect(m1MaxLabels.length).toBe(2); // Two chips
    });

    it('should render interposer connection', () => {
      render(<ArchitectureEvolution />);

      expect(screen.getByText('Interposer')).toBeInTheDocument();
      expect(screen.getByText('(10K Signals)')).toBeInTheDocument();
    });

    it('should show complete integration advantage', () => {
      render(<ArchitectureEvolution />);

      expect(screen.getByText('Advantage: Complete integration')).toBeInTheDocument();
      expect(screen.getByText('Challenge: Yield drops with size')).toBeInTheDocument();
    });
  });

  describe('AMD EPYC Architecture', () => {
    it('should render four CPU chiplets', () => {
      render(<ArchitectureEvolution />);

      const texts = Array.from(document.querySelectorAll('text'));
      const cpuLabels = texts.filter(t => t.textContent === 'CPU');

      expect(cpuLabels.length).toBeGreaterThanOrEqual(4); // At least four CPU chiplets (M5 also has CPU)
    });

    it('should render I/O die', () => {
      render(<ArchitectureEvolution />);

      expect(screen.getByText('I/O')).toBeInTheDocument();
      expect(screen.getByText('Die')).toBeInTheDocument();
    });

    it('should show mix process nodes advantage', () => {
      render(<ArchitectureEvolution />);

      expect(screen.getByText('Advantage: Mix process nodes')).toBeInTheDocument();
      expect(screen.getByText('Challenge: Interconnect latency')).toBeInTheDocument();
    });
  });

  describe('Apple M5 Architecture', () => {
    it('should render CPU and GPU tiles', () => {
      render(<ArchitectureEvolution />);

      // Use getAllByText since "CPU" appears in multiple architectures
      const cpuLabels = screen.getAllByText('CPU');
      expect(cpuLabels.length).toBeGreaterThan(0);

      expect(screen.getByText('GPU')).toBeInTheDocument();
    });

    it('should render controllers', () => {
      render(<ArchitectureEvolution />);

      expect(screen.getByText('Controllers')).toBeInTheDocument();
    });

    it('should show best of both advantage', () => {
      render(<ArchitectureEvolution />);

      expect(screen.getByText('Advantage: Best of both?')).toBeInTheDocument();
      expect(screen.getByText('Challenge: Complexity')).toBeInTheDocument();
    });
  });

  describe('Hover Interaction', () => {
    it('should handle hover events on sections', () => {
      render(<ArchitectureEvolution />);

      const sectionGroups = document.querySelectorAll('g[cursor="pointer"]');
      expect(sectionGroups.length).toBe(3); // Three architecture sections

      // Hover over first section
      fireEvent.mouseEnter(sectionGroups[0]);

      // Should update aria-live region
      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion?.textContent).toBeTruthy();
    });

    it('should clear hover state on mouse leave', () => {
      render(<ArchitectureEvolution />);

      const sectionGroups = document.querySelectorAll('g[cursor="pointer"]');

      // Hover over and then leave
      fireEvent.mouseEnter(sectionGroups[0]);
      fireEvent.mouseLeave(sectionGroups[0]);

      // Live region should be empty
      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion?.textContent?.trim()).toBe('');
    });

    it('should announce architecture information on hover for M1 Ultra', () => {
      render(<ArchitectureEvolution />);

      const sectionGroups = document.querySelectorAll('g[cursor="pointer"]');
      fireEvent.mouseEnter(sectionGroups[0]); // First section is M1 Ultra

      const liveRegion = document.querySelector('[aria-live="polite"]');
      const announcement = liveRegion?.textContent;

      expect(announcement).toContain('Apple M1 Ultra');
      expect(announcement).toContain('interposer');
    });

    it('should announce architecture information on hover for AMD', () => {
      render(<ArchitectureEvolution />);

      const sectionGroups = document.querySelectorAll('g[cursor="pointer"]');
      fireEvent.mouseEnter(sectionGroups[1]); // Second section is AMD

      const liveRegion = document.querySelector('[aria-live="polite"]');
      const announcement = liveRegion?.textContent;

      expect(announcement).toContain('AMD EPYC');
      expect(announcement).toContain('chiplet');
    });

    it('should announce architecture information on hover for M5', () => {
      render(<ArchitectureEvolution />);

      const sectionGroups = document.querySelectorAll('g[cursor="pointer"]');
      fireEvent.mouseEnter(sectionGroups[2]); // Third section is M5

      const liveRegion = document.querySelector('[aria-live="polite"]');
      const announcement = liveRegion?.textContent;

      expect(announcement).toContain('Apple M5');
      expect(announcement).toContain('rumored');
    });
  });

  describe('Dark Mode', () => {
    it('should use dark mode colors when dark mode is enabled', () => {
      mockUseTheme.mockReturnValue({ isDarkMode: true });
      render(<ArchitectureEvolution />);

      const background = document.querySelector('rect[rx="8"]');
      expect(background).toHaveAttribute('fill', '#1f2937');
    });

    it('should use light mode colors when dark mode is disabled', () => {
      mockUseTheme.mockReturnValue({ isDarkMode: false });
      render(<ArchitectureEvolution />);

      const background = document.querySelector('rect[rx="8"]');
      expect(background).toHaveAttribute('fill', '#f3f4f6');
    });
  });

  describe('Responsive Layout', () => {
    it('should have responsive SVG with preserveAspectRatio', () => {
      render(<ArchitectureEvolution />);

      const svg = document.querySelector('svg');
      expect(svg).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet');
    });

    it('should have overflow-x-auto wrapper for horizontal scrolling', () => {
      render(<ArchitectureEvolution />);

      const wrapper = document.querySelector('.overflow-x-auto');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper sr-only class for screen reader content', () => {
      render(<ArchitectureEvolution />);

      const srOnly = document.querySelector('.sr-only');
      expect(srOnly).toBeInTheDocument();
      expect(srOnly).toHaveAttribute('aria-live', 'polite');
    });

    it('should use distinct brand colors for different architectures', () => {
      render(<ArchitectureEvolution />);

      // Should use blue for Apple, terracotta for AMD
      const rects = document.querySelectorAll('rect');
      const fillColors = new Set(Array.from(rects).map(r => r.getAttribute('fill')));

      expect(fillColors.has('#2E5A91')).toBe(true); // Apple blue
      expect(fillColors.has('#CC6B4A')).toBe(true); // AMD terracotta
    });
  });

  describe('Visual Elements', () => {
    it('should render rectangles for chip components', () => {
      render(<ArchitectureEvolution />);

      const rects = document.querySelectorAll('rect');
      expect(rects.length).toBeGreaterThan(10); // Multiple chip components
    });

    it('should render connection lines for interposer', () => {
      render(<ArchitectureEvolution />);

      const lines = document.querySelectorAll('line');
      expect(lines.length).toBeGreaterThan(0);
    });

    it('should render warning box at bottom', () => {
      render(<ArchitectureEvolution />);

      // Check for yellow warning box
      const yellowRects = Array.from(document.querySelectorAll('rect')).filter(
        r => r.getAttribute('fill') === '#fef3c7'
      );

      expect(yellowRects.length).toBeGreaterThan(0);
    });
  });
});
