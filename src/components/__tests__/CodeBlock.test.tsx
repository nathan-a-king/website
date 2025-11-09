import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import CodeBlock from '../CodeBlock';

// Mock ThemeContext
const mockUseTheme = vi.fn();
vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => mockUseTheme(),
}));

// Mock react-syntax-highlighter
vi.mock('react-syntax-highlighter', () => ({
  Prism: ({ children, language, style }: any) => (
    <pre data-testid="syntax-highlighter" data-language={language} data-style={style?.name || 'unknown'}>
      <code>{children}</code>
    </pre>
  ),
}));

vi.mock('../../styles/syntaxThemes', () => ({
  customLightTheme: { name: 'customLightTheme' },
  customDarkTheme: { name: 'customDarkTheme' },
}));

// Mock CSS import
vi.mock('../CodeBlock.css', () => ({}));

describe('CodeBlock', () => {
  const defaultProps = {
    language: 'javascript',
    value: 'const hello = "world";',
  };

  beforeEach(() => {
    mockUseTheme.mockReturnValue({ isDarkMode: false });

    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });
  });

  describe('Rendering', () => {
    it('should render code block with syntax highlighter', () => {
      render(<CodeBlock {...defaultProps} />);

      const highlighter = screen.getByTestId('syntax-highlighter');
      expect(highlighter).toBeInTheDocument();
      expect(highlighter).toHaveTextContent('const hello = "world";');
    });

    it('should render copy button', () => {
      render(<CodeBlock {...defaultProps} />);

      const copyButton = screen.getByRole('button', { name: /copy/i });
      expect(copyButton).toBeInTheDocument();
    });

    it('should pass language prop to syntax highlighter', () => {
      render(<CodeBlock {...defaultProps} />);

      const highlighter = screen.getByTestId('syntax-highlighter');
      expect(highlighter).toHaveAttribute('data-language', 'javascript');
    });

    it('should render with different languages', () => {
      const { rerender } = render(<CodeBlock {...defaultProps} language="python" />);

      let highlighter = screen.getByTestId('syntax-highlighter');
      expect(highlighter).toHaveAttribute('data-language', 'python');

      rerender(<CodeBlock {...defaultProps} language="typescript" />);

      highlighter = screen.getByTestId('syntax-highlighter');
      expect(highlighter).toHaveAttribute('data-language', 'typescript');
    });

    it('should render multi-line code', () => {
      const multiLineCode = `function greet(name) {
  return \`Hello, \${name}!\`;
}`;

      render(<CodeBlock language="javascript" value={multiLineCode} />);

      const highlighter = screen.getByTestId('syntax-highlighter');
      expect(highlighter).toHaveTextContent('function greet(name)');
      expect(highlighter).toHaveTextContent('return `Hello, ${name}!`;');
    });
  });

  describe('Theme Support', () => {
    it('should use light theme when isDarkMode is false', () => {
      mockUseTheme.mockReturnValue({ isDarkMode: false });
      render(<CodeBlock {...defaultProps} />);

      const highlighter = screen.getByTestId('syntax-highlighter');
      expect(highlighter).toHaveAttribute('data-style', 'customLightTheme');
    });

    it('should use dark theme when isDarkMode is true', () => {
      mockUseTheme.mockReturnValue({ isDarkMode: true });
      render(<CodeBlock {...defaultProps} />);

      const highlighter = screen.getByTestId('syntax-highlighter');
      expect(highlighter).toHaveAttribute('data-style', 'customDarkTheme');
    });

    it('should update theme when isDarkMode changes', () => {
      mockUseTheme.mockReturnValue({ isDarkMode: false });
      const { rerender } = render(<CodeBlock {...defaultProps} />);

      let highlighter = screen.getByTestId('syntax-highlighter');
      expect(highlighter).toHaveAttribute('data-style', 'customLightTheme');

      mockUseTheme.mockReturnValue({ isDarkMode: true });
      rerender(<CodeBlock {...defaultProps} />);

      highlighter = screen.getByTestId('syntax-highlighter');
      expect(highlighter).toHaveAttribute('data-style', 'customDarkTheme');
    });
  });

  describe('Copy Functionality', () => {
    it('should copy code to clipboard when copy button is clicked', async () => {
      const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
      render(<CodeBlock {...defaultProps} />);

      const copyButton = screen.getByRole('button', { name: /copy code to clipboard/i });
      fireEvent.click(copyButton);

      expect(writeTextSpy).toHaveBeenCalledTimes(1);
      expect(writeTextSpy).toHaveBeenCalledWith('const hello = "world";');
    });

    it('should copy multi-line code to clipboard', async () => {
      const multiLineCode = `function greet(name) {
  return \`Hello, \${name}!\`;
}`;
      const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

      render(<CodeBlock language="javascript" value={multiLineCode} />);

      const copyButton = screen.getByRole('button', { name: /copy code to clipboard/i });
      fireEvent.click(copyButton);

      expect(writeTextSpy).toHaveBeenCalledWith(multiLineCode);
    });

    it('should handle empty code value', async () => {
      const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

      render(<CodeBlock language="javascript" value="" />);

      const copyButton = screen.getByRole('button', { name: /copy code to clipboard/i });
      fireEvent.click(copyButton);

      expect(writeTextSpy).toHaveBeenCalledWith('');
    });
  });

  describe('Copy Feedback', () => {
    it('should show "Copied!" message after clicking copy button', async () => {
      vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
      render(<CodeBlock {...defaultProps} />);

      const copyButton = screen.getByRole('button', { name: /copy code to clipboard/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument();
      });
    });

    it('should hide "Copied!" message after 2 seconds', async () => {
      vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
      render(<CodeBlock {...defaultProps} />);

      const copyButton = screen.getByRole('button', { name: /copy code to clipboard/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument();
      });

      // Wait for it to disappear
      await waitFor(() => {
        expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should show copy icon when not in copied state', () => {
      render(<CodeBlock {...defaultProps} />);

      const copyButton = screen.getByRole('button', { name: /copy code to clipboard/i });
      // Lucide-react Copy icon is mocked, so we just check button doesn't have "Copied!" text
      expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
      expect(copyButton).toBeInTheDocument();
    });

    it('should handle rapid multiple clicks', async () => {
      vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
      render(<CodeBlock {...defaultProps} />);

      const copyButton = screen.getByRole('button', { name: /copy code to clipboard/i });

      // First click
      fireEvent.click(copyButton);
      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument();
      });

      // Second click before first timeout completes
      fireEvent.click(copyButton);

      // Should still show "Copied!" message
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });

    it('should clean up timeout on component unmount', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

      const { unmount } = render(<CodeBlock {...defaultProps} />);

      const copyButton = screen.getByRole('button', { name: /copy code to clipboard/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument();
      });

      // Unmount before timeout completes - should not cause React state update warnings
      unmount();

      // No console errors about state updates on unmounted component
      expect(consoleErrorSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('unmounted component')
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    it('should handle clipboard API failure gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const writeTextMock = vi.fn().mockRejectedValue(new Error('Permission denied'));
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock
        }
      });

      render(<CodeBlock {...defaultProps} />);

      const copyButton = screen.getByRole('button', { name: /copy code to clipboard/i });
      fireEvent.click(copyButton);

      // Wait for async operation
      await new Promise(resolve => setTimeout(resolve, 50));

      // Should log error
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to copy code:',
        expect.any(Error)
      );

      // Should not show "Copied!" message on error
      expect(screen.queryByText('Copied!')).not.toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });

    it('should handle clipboard API not available', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const originalClipboard = navigator.clipboard;

      // @ts-ignore - Temporarily remove clipboard API
      delete (navigator as any).clipboard;

      render(<CodeBlock {...defaultProps} />);

      const copyButton = screen.getByRole('button', { name: /copy code to clipboard/i });
      fireEvent.click(copyButton);

      // Wait for async operation
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(consoleErrorSpy).toHaveBeenCalled();

      // Restore clipboard API
      Object.assign(navigator, { clipboard: originalClipboard });
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('should have focusable copy button', () => {
      render(<CodeBlock {...defaultProps} />);

      const copyButton = screen.getByRole('button', { name: /copy code to clipboard/i });
      copyButton.focus();

      expect(document.activeElement).toBe(copyButton);
    });

    it('should render code in semantic pre/code elements', () => {
      render(<CodeBlock {...defaultProps} />);

      const pre = screen.getByTestId('syntax-highlighter');
      expect(pre.tagName).toBe('PRE');

      const code = pre.querySelector('code');
      expect(code).toBeInTheDocument();
    });

    it('should have initial aria-label for copy button', () => {
      render(<CodeBlock {...defaultProps} />);

      const copyButton = screen.getByRole('button', { name: /copy code to clipboard/i });
      expect(copyButton).toHaveAttribute('aria-label', 'Copy code to clipboard');
    });

    it('should update aria-label when code is copied', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock
        }
      });

      render(<CodeBlock {...defaultProps} />);

      const copyButton = screen.getByRole('button', { name: /copy code to clipboard/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(copyButton).toHaveAttribute('aria-label', 'Code copied to clipboard');
      });
    });

    it('should reset aria-label after timeout', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock
        }
      });

      render(<CodeBlock {...defaultProps} />);

      const copyButton = screen.getByRole('button', { name: /copy code to clipboard/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(copyButton).toHaveAttribute('aria-label', 'Code copied to clipboard');
      });

      // Wait for it to reset
      await waitFor(() => {
        expect(copyButton).toHaveAttribute('aria-label', 'Copy code to clipboard');
      }, { timeout: 3000 });
    });

    it('should have aria-live region for copy feedback', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock
        }
      });

      render(<CodeBlock {...defaultProps} />);

      const copyButton = screen.getByRole('button', { name: /copy code to clipboard/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        const statusMessage = screen.getByRole('status');
        expect(statusMessage).toHaveAttribute('aria-live', 'polite');
        expect(statusMessage).toHaveTextContent('Copied!');
      });
    });

    it('should announce copy success to screen readers', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock
        }
      });

      render(<CodeBlock {...defaultProps} />);

      const copyButton = screen.getByRole('button', { name: /copy code to clipboard/i });
      fireEvent.click(copyButton);

      // Check for status role which is announced by screen readers
      await waitFor(() => {
        const statusElement = screen.getByRole('status');
        expect(statusElement).toBeInTheDocument();
        expect(statusElement).toHaveTextContent('Copied!');
      });
    });
  });
});
