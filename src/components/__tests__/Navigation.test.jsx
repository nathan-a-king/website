import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from '../Navigation';

// Mock ThemeContext
vi.mock('../../contexts/ThemeContext.jsx', () => ({
  useTheme: vi.fn(() => ({ isDarkMode: false })),
}));

// Mock ThemeToggle component
vi.mock('../ThemeToggle.jsx', () => ({
  default: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

// Mock react-router-dom's useLocation
const mockUseLocation = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => mockUseLocation(),
  };
});

describe('Navigation', () => {
  beforeEach(() => {
    mockUseLocation.mockReturnValue({ pathname: '/' });
  });

  const renderNavigation = () => {
    return render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );
  };

  describe('Desktop Navigation', () => {
    it('should render all navigation links', () => {
      renderNavigation();

      // Check all nav links are present
      const links = screen.getAllByRole('link');
      const linkTexts = links.map(link => link.textContent);

      expect(linkTexts).toContain('Home');
      expect(linkTexts).toContain('Blog');
      expect(linkTexts).toContain('About');
      expect(linkTexts).toContain('Resume');
    });

    it('should render logo with link to home', () => {
      renderNavigation();

      const logo = screen.getByAltText('Nathan A. King');
      expect(logo).toBeInTheDocument();
      expect(logo.tagName).toBe('IMG');

      // Logo should be inside a link to home
      const logoLink = logo.closest('a');
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('should highlight active link on home page', () => {
      mockUseLocation.mockReturnValue({ pathname: '/' });
      renderNavigation();

      const homeLinks = screen.getAllByText('Home');
      // Desktop nav link
      expect(homeLinks[0]).toHaveClass('text-brand-text-primary');
      expect(homeLinks[0]).toHaveClass('font-medium');
    });

    it('should highlight active link on blog page', () => {
      mockUseLocation.mockReturnValue({ pathname: '/blog' });
      renderNavigation();

      const blogLinks = screen.getAllByText('Blog');
      // Desktop nav link
      expect(blogLinks[0]).toHaveClass('text-brand-text-primary');
      expect(blogLinks[0]).toHaveClass('font-medium');
    });

    it('should highlight active link on about page', () => {
      mockUseLocation.mockReturnValue({ pathname: '/about' });
      renderNavigation();

      const aboutLinks = screen.getAllByText('About');
      expect(aboutLinks[0]).toHaveClass('text-brand-text-primary');
    });

    it('should highlight active link on resume page', () => {
      mockUseLocation.mockReturnValue({ pathname: '/resume' });
      renderNavigation();

      const resumeLinks = screen.getAllByText('Resume');
      expect(resumeLinks[0]).toHaveClass('text-brand-text-primary');
    });

    it('should render theme toggle', () => {
      renderNavigation();

      const themeToggles = screen.getAllByTestId('theme-toggle');
      expect(themeToggles.length).toBeGreaterThan(0);
    });
  });

  describe('Mobile Menu', () => {
    it('should render mobile menu button with correct aria attributes', () => {
      renderNavigation();

      const menuButton = screen.getByLabelText('Toggle mobile menu');
      expect(menuButton).toBeInTheDocument();
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should toggle mobile menu when button is clicked', () => {
      renderNavigation();

      const menuButton = screen.getByLabelText('Toggle mobile menu');

      // Initially, mobile menu should not be visible
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');

      // Click to open
      fireEvent.click(menuButton);

      expect(menuButton).toHaveAttribute('aria-expanded', 'true');

      // Mobile menu should now contain links
      const mobileLinks = screen.getAllByRole('link');
      expect(mobileLinks.length).toBeGreaterThan(4); // Desktop + mobile links
    });

    it('should close mobile menu when a link is clicked', () => {
      renderNavigation();

      const menuButton = screen.getByLabelText('Toggle mobile menu');

      // Open menu
      fireEvent.click(menuButton);
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');

      // Click a mobile menu link (get the last "About" link which should be in mobile menu)
      const aboutLinks = screen.getAllByText('About');
      fireEvent.click(aboutLinks[aboutLinks.length - 1]);

      // Menu should be closed
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should close mobile menu when logo is clicked', () => {
      renderNavigation();

      const menuButton = screen.getByLabelText('Toggle mobile menu');

      // Open menu
      fireEvent.click(menuButton);
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');

      // Click logo
      const logo = screen.getByAltText('Nathan A. King');
      fireEvent.click(logo);

      // Menu should be closed
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should highlight active link in mobile menu', () => {
      mockUseLocation.mockReturnValue({ pathname: '/blog' });
      renderNavigation();

      const menuButton = screen.getByLabelText('Toggle mobile menu');

      // Open menu
      fireEvent.click(menuButton);

      const blogLinks = screen.getAllByText('Blog');
      // Mobile nav link (last one)
      const mobileLink = blogLinks[blogLinks.length - 1];
      expect(mobileLink).toHaveClass('text-brand-text-primary');
      expect(mobileLink).toHaveClass('font-medium');
    });
  });

  describe('Dark Mode Integration', () => {
    it('should apply invert filter to logo in dark mode', async () => {
      const { useTheme } = await import('../../contexts/ThemeContext.jsx');
      useTheme.mockReturnValue({ isDarkMode: true });

      renderNavigation();

      const logo = screen.getByAltText('Nathan A. King');
      expect(logo).toHaveClass('invert');
      expect(logo).toHaveClass('brightness-0');
    });

    it('should not apply invert filter to logo in light mode', async () => {
      const { useTheme } = await import('../../contexts/ThemeContext.jsx');
      useTheme.mockReturnValue({ isDarkMode: false });

      renderNavigation();

      const logo = screen.getByAltText('Nathan A. King');
      expect(logo).not.toHaveClass('invert');
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label for mobile menu button', () => {
      renderNavigation();

      const menuButton = screen.getByLabelText('Toggle mobile menu');
      expect(menuButton).toHaveAttribute('aria-label', 'Toggle mobile menu');
    });

    it('should have proper aria-expanded state', () => {
      renderNavigation();

      const menuButton = screen.getByLabelText('Toggle mobile menu');

      expect(menuButton).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(menuButton);
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');

      fireEvent.click(menuButton);
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should have all links as proper anchor elements', () => {
      renderNavigation();

      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link.tagName).toBe('A');
      });
    });
  });
});
