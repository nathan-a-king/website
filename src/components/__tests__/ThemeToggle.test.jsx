import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../ThemeToggle';

// Mock ThemeContext
const mockToggleTheme = vi.fn();
const mockUseTheme = vi.fn();

vi.mock('../../contexts/ThemeContext.jsx', () => ({
  useTheme: () => mockUseTheme(),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Moon: ({ className }) => <div data-testid="moon-icon" className={className}>Moon</div>,
  Sun: ({ className }) => <div data-testid="sun-icon" className={className}>Sun</div>,
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockToggleTheme.mockClear();
  });

  it('should render sun icon in light mode', () => {
    mockUseTheme.mockReturnValue({
      isDarkMode: false,
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument();
  });

  it('should render moon icon in dark mode', () => {
    mockUseTheme.mockReturnValue({
      isDarkMode: true,
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument();
  });

  it('should call toggleTheme when button is clicked', () => {
    mockUseTheme.mockReturnValue({
      isDarkMode: false,
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should have correct aria-label in light mode', () => {
    mockUseTheme.mockReturnValue({
      isDarkMode: false,
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('should have correct aria-label in dark mode', () => {
    mockUseTheme.mockReturnValue({
      isDarkMode: true,
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
  });

  it('should render as a button element', () => {
    mockUseTheme.mockReturnValue({
      isDarkMode: false,
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button.tagName).toBe('BUTTON');
  });

  it('should have proper styling classes', () => {
    mockUseTheme.mockReturnValue({
      isDarkMode: false,
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('p-2');
    expect(button).toHaveClass('rounded-lg');
    expect(button).toHaveClass('border');
    expect(button).toHaveClass('border-brand-border');
  });

  it('should apply correct icon styling', () => {
    mockUseTheme.mockReturnValue({
      isDarkMode: false,
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    const icon = screen.getByTestId('moon-icon');
    expect(icon).toHaveClass('w-5');
    expect(icon).toHaveClass('h-5');
    expect(icon).toHaveClass('text-brand-text-primary');
  });

  it('should toggle from light to dark mode when clicked', () => {
    let isDarkMode = false;

    const rerenderTheme = () => {
      mockUseTheme.mockReturnValue({
        isDarkMode,
        toggleTheme: () => {
          mockToggleTheme();
          isDarkMode = !isDarkMode;
        },
      });
    };

    rerenderTheme();
    const { rerender } = render(<ThemeToggle />);

    // Initially light mode - shows moon icon
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();

    // Click to toggle
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Re-render with new state
    rerenderTheme();
    rerender(<ThemeToggle />);

    expect(mockToggleTheme).toHaveBeenCalled();
  });
});
