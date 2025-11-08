// src/components/CodeBlock.tsx
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Copy } from "lucide-react";
import { customLightTheme, customDarkTheme } from "../styles/syntaxThemes";
import { useTheme } from "../contexts/ThemeContext";
import "./CodeBlock.css";

interface CodeBlockProps {
  language: string;
  value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const { isDarkMode } = useTheme();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lightTheme = customLightTheme;
  const darkTheme = customDarkTheme;

  return (
    <div className="relative rounded-lg overflow-hidden border border-brand-border bg-brand-surface my-4 code-block-container">
      <SyntaxHighlighter
        language={language}
        style={(isDarkMode ? darkTheme : lightTheme) as any}
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "transparent",
          fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
        }}
      >
        {value}
      </SyntaxHighlighter>
      <button
        onClick={handleCopy}
        aria-label="Copy code to clipboard"
        className="absolute top-2 right-2 p-2 rounded bg-brand-surface text-brand-text-tertiary hover:text-brand-text-primary hover:bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-terracotta/50 transition-all duration-200"
      >
        {copied ? (
          <span className="text-xs font-medium copy-feedback">Copied!</span>
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};

export default CodeBlock;
