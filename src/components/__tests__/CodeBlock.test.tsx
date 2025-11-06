import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

vi.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  oneLight: { name: 'oneLight' },
  vscDarkPlus: { name: 'vscDarkPlus' },
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
      expect(highlighter).toHaveAttribute('data-style', 'oneLight');
    });

    it('should use dark theme when isDarkMode is true', () => {
      mockUseTheme.mockReturnValue({ isDarkMode: true });
      render(<CodeBlock {...defaultProps} />);

      const highlighter = screen.getByTestId('syntax-highlighter');
      expect(highlighter).toHaveAttribute('data-style', 'vscDarkPlus');
    });

    it('should update theme when isDarkMode changes', () => {
      mockUseTheme.mockReturnValue({ isDarkMode: false });
      const { rerender } = render(<CodeBlock {...defaultProps} />);

      let highlighter = screen.getByTestId('syntax-highlighter');
      expect(highlighter).toHaveAttribute('data-style', 'oneLight');

      mockUseTheme.mockReturnValue({ isDarkMode: true });
      rerender(<CodeBlock {...defaultProps} />);

      highlighter = screen.getByTestId('syntax-highlighter');
      expect(highlighter).toHaveAttribute('data-style', 'vscDarkPlus');
    });
  });

  describe('Copy Functionality', () => {
    it('should copy code to clipboard when copy button is clicked', async () => {
      const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText');
      render(<CodeBlock {...defaultProps} />);

      const copyButton = screen.getByRole('button', { name: /copy/i });
      fireEvent.click(copyButton);

      expect(writeTextSpy).toHaveBeenCalledTimes(1);
      expect(writeTextSpy).toHaveBeenCalledWith('const hello = "world";');
    });

    it('should copy multi-line code to clipboard', async () => {
      const multiLineCode = `function greet(name) {
  return \`Hello, \${name}!\`;
}`;
      const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText');

      render(<CodeBlock language="javascript" value={multiLineCode} />);

      const copyButton = screen.getByRole('button', { name: /copy/i });
      fireEvent.click(copyButton);

      expect(writeTextSpy).toHaveBeenCalledWith(multiLineCode);
    });

    it('should handle empty code value', async () => {
      const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText');

      render(<CodeBlock language="javascript" value="" />);

      const copyButton = screen.getByRole('button', { name: /copy/i });
      fireEvent.click(copyButton);

      expect(writeTextSpy).toHaveBeenCalledWith('');
    });
  });

  describe('Accessibility', () => {
    it('should have focusable copy button', () => {
      render(<CodeBlock {...defaultProps} />);

      const copyButton = screen.getByRole('button', { name: /copy/i });
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
  });
});
