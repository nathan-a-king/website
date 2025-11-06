import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import SkillBar from '../SkillBar';

describe('SkillBar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const defaultProps = {
    name: 'JavaScript',
    level: 90,
    delay: 0,
  };

  describe('Rendering', () => {
    it('should render skill name', () => {
      render(<SkillBar {...defaultProps} />);

      expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });

    it('should render skill level percentage', () => {
      render(<SkillBar {...defaultProps} />);

      expect(screen.getByText('90%')).toBeInTheDocument();
    });

    it('should render progress bar container', () => {
      const { container } = render(<SkillBar {...defaultProps} />);

      const progressContainer = container.querySelector('.bg-brand-surface.rounded-full');
      expect(progressContainer).toBeInTheDocument();
    });

    it('should render progress bar fill', () => {
      const { container } = render(<SkillBar {...defaultProps} />);

      const progressBar = container.querySelector('.bg-brand-terracotta');
      expect(progressBar).toBeInTheDocument();
    });

    it('should display different skill names and levels', () => {
      const { rerender } = render(<SkillBar name="React" level={85} delay={0} />);

      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();

      rerender(<SkillBar name="Python" level={75} delay={0} />);

      expect(screen.getByText('Python')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
    });
  });

  describe('Animation', () => {
    it('should start with 0% width', () => {
      const { container } = render(<SkillBar {...defaultProps} />);

      const progressBar = container.querySelector('.bg-brand-terracotta');
      expect(progressBar).toHaveStyle({ width: '0%' });
    });

    it('should animate to correct width after delay', () => {
      const { container } = render(<SkillBar name="JavaScript" level={90} delay={100} />);

      const progressBar = container.querySelector('.bg-brand-terracotta');

      // Initially should be 0%
      expect(progressBar).toHaveStyle({ width: '0%' });

      // Fast-forward time by the delay
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // Should now be at the target width
      expect(progressBar).toHaveStyle({ width: '90%' });
    });

    it('should animate immediately when delay is 0', () => {
      const { container } = render(<SkillBar {...defaultProps} />);

      const progressBar = container.querySelector('.bg-brand-terracotta');

      // Initially should be 0%
      expect(progressBar).toHaveStyle({ width: '0%' });

      // Fast-forward past delay (use 1ms to trigger the timeout)
      act(() => {
        vi.advanceTimersByTime(1);
      });

      // Should now be at target width
      expect(progressBar).toHaveStyle({ width: '90%' });
    });

    it('should handle different delay values', () => {
      const { container } = render(<SkillBar name="React" level={85} delay={500} />);

      const progressBar = container.querySelector('.bg-brand-terracotta');

      // Initially should be 0%
      expect(progressBar).toHaveStyle({ width: '0%' });

      // Advance time partway
      act(() => {
        vi.advanceTimersByTime(250);
      });
      expect(progressBar).toHaveStyle({ width: '0%' });

      // Advance time to completion
      act(() => {
        vi.advanceTimersByTime(250);
      });
      expect(progressBar).toHaveStyle({ width: '85%' });
    });

    it('should update animation when level prop changes', () => {
      const { container, rerender } = render(<SkillBar name="JavaScript" level={50} delay={0} />);

      const progressBar = container.querySelector('.bg-brand-terracotta');

      // Advance past initial delay
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(progressBar).toHaveStyle({ width: '50%' });

      // Change level
      rerender(<SkillBar name="JavaScript" level={90} delay={0} />);

      // Should reset and animate to new value
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(progressBar).toHaveStyle({ width: '90%' });
    });
  });

  describe('Cleanup', () => {
    it('should cleanup timeout on unmount', () => {
      const { unmount } = render(<SkillBar name="JavaScript" level={90} delay={1000} />);

      // Unmount before timeout completes
      unmount();

      // This should not throw an error
      act(() => {
        vi.advanceTimersByTime(1000);
      });
    });

    it('should cleanup timeout when delay changes', () => {
      const { container, rerender } = render(<SkillBar name="JavaScript" level={90} delay={1000} />);

      const progressBar = container.querySelector('.bg-brand-terracotta');

      // Should be at 0%
      expect(progressBar).toHaveStyle({ width: '0%' });

      // Change delay before first timeout completes
      rerender(<SkillBar name="JavaScript" level={90} delay={500} />);

      // Fast-forward to original delay time
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Should animate with new delay
      expect(progressBar).toHaveStyle({ width: '90%' });
    });

    it('should cleanup timeout when level changes', () => {
      const { container, rerender } = render(<SkillBar name="JavaScript" level={50} delay={1000} />);

      const progressBar = container.querySelector('.bg-brand-terracotta');

      // Change level before timeout completes
      rerender(<SkillBar name="JavaScript" level={90} delay={1000} />);

      // Fast-forward to delay
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // Should animate to new level
      expect(progressBar).toHaveStyle({ width: '90%' });
    });
  });

  describe('Edge Cases', () => {
    it('should handle 0% level', () => {
      const { container } = render(<SkillBar name="Beginner Skill" level={0} delay={0} />);

      const progressBar = container.querySelector('.bg-brand-terracotta');

      act(() => {
        vi.advanceTimersByTime(1);
      });

      expect(progressBar).toHaveStyle({ width: '0%' });
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should handle 100% level', () => {
      const { container } = render(<SkillBar name="Expert Skill" level={100} delay={0} />);

      const progressBar = container.querySelector('.bg-brand-terracotta');

      act(() => {
        vi.advanceTimersByTime(1);
      });

      expect(progressBar).toHaveStyle({ width: '100%' });
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('should use default delay of 0 when not provided', () => {
      const { container } = render(<SkillBar name="JavaScript" level={90} />);

      const progressBar = container.querySelector('.bg-brand-terracotta');

      expect(progressBar).toHaveStyle({ width: '0%' });

      act(() => {
        vi.advanceTimersByTime(1);
      });

      expect(progressBar).toHaveStyle({ width: '90%' });
    });
  });

  describe('Styling', () => {
    it('should have transition classes on progress bar', () => {
      const { container } = render(<SkillBar {...defaultProps} />);

      const progressBar = container.querySelector('.bg-brand-terracotta');
      expect(progressBar).toHaveClass('transition-all');
      expect(progressBar).toHaveClass('duration-1000');
      expect(progressBar).toHaveClass('ease-out');
    });

    it('should have proper height classes', () => {
      const { container } = render(<SkillBar {...defaultProps} />);

      const progressContainer = container.querySelector('.bg-brand-surface.rounded-full');
      expect(progressContainer).toHaveClass('h-2');

      const progressBar = container.querySelector('.bg-brand-terracotta');
      expect(progressBar).toHaveClass('h-2');
    });

    it('should have rounded corners', () => {
      const { container } = render(<SkillBar {...defaultProps} />);

      const progressContainer = container.querySelector('.bg-brand-surface');
      expect(progressContainer).toHaveClass('rounded-full');

      const progressBar = container.querySelector('.bg-brand-terracotta');
      expect(progressBar).toHaveClass('rounded-full');
    });
  });

  describe('Accessibility', () => {
    it('should display skill level as text', () => {
      render(<SkillBar name="JavaScript" level={90} delay={0} />);

      // Level is displayed as text, making it accessible to screen readers
      expect(screen.getByText('90%')).toBeInTheDocument();
    });

    it('should display skill name as text', () => {
      render(<SkillBar name="JavaScript" level={90} delay={0} />);

      // Name is displayed as text
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });
  });
});
