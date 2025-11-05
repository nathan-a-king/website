// src/components/CodeBlock.tsx
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { 
  // Only import the themes you're actually using
  oneLight,
  vscDarkPlus
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "../contexts/ThemeContext";
import "./CodeBlock.css";

interface CodeBlockProps {
  language: string;
  value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const { isDarkMode } = useTheme();
  const handleCopy = () => navigator.clipboard.writeText(value);

  // Easy theme configuration - change these to experiment!
  const lightTheme = oneLight;     // Try: prism, ghcolors, vs, oneLight
  const darkTheme = vscDarkPlus;    // Try: dracula, oneDark, vscDarkPlus, atomDark, tomorrow, nord

  return (
    <div className="relative rounded-lg overflow-hidden border border-brand-border bg-brand-soft dark:bg-gray-800 my-4 code-block-container">
      <SyntaxHighlighter
        language={language}
        style={isDarkMode ? darkTheme : lightTheme}
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
        className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-brand-cream dark:bg-gray-700 text-brand-charcoal dark:text-gray-200 hover:bg-brand-soft dark:hover:bg-gray-600 border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-terracotta/50 transition-all duration-200"
      >
        Copy
      </button>
    </div>
  );
};

export default CodeBlock;
