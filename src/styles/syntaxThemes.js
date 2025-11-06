/**
 * Custom syntax highlighting themes aligned with brand color system
 * These themes use colors defined in src/styles/globals.css
 */

// Light mode theme using brand colors
export const customLightTheme = {
  'code[class*="language-"]': {
    color: '#141413', // text-primary
    fontFamily: 'var(--font-mono)',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    color: '#141413', // text-primary
    fontFamily: 'var(--font-mono)',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
    padding: '1em',
    margin: '0.5em 0',
    overflow: 'auto',
  },
  comment: {
    color: '#73726C', // text-tertiary
    fontStyle: 'italic',
  },
  prolog: {
    color: '#73726C',
  },
  doctype: {
    color: '#73726C',
  },
  cdata: {
    color: '#73726C',
  },
  punctuation: {
    color: '#3D3D3A', // text-secondary
  },
  property: {
    color: '#CC6B4A', // accent-terracotta
  },
  tag: {
    color: '#CC6B4A',
  },
  boolean: {
    color: '#9B8FD6', // accent-purple
  },
  number: {
    color: '#9B8FD6',
  },
  constant: {
    color: '#9B8FD6',
  },
  symbol: {
    color: '#9B8FD6',
  },
  deleted: {
    color: '#CC6B4A',
  },
  selector: {
    color: '#2E5A91', // accent-blue
  },
  'attr-name': {
    color: '#2E5A91',
  },
  string: {
    color: '#2E5A91',
  },
  char: {
    color: '#2E5A91',
  },
  builtin: {
    color: '#2E5A91',
  },
  inserted: {
    color: '#2E5A91',
  },
  operator: {
    color: '#3D3D3A', // text-secondary
  },
  entity: {
    color: '#3D3D3A',
    cursor: 'help',
  },
  url: {
    color: '#2E5A91',
  },
  '.language-css .token.string': {
    color: '#2E5A91',
  },
  '.style .token.string': {
    color: '#2E5A91',
  },
  variable: {
    color: '#141413', // text-primary
  },
  atrule: {
    color: '#CC6B4A',
  },
  'attr-value': {
    color: '#2E5A91',
  },
  function: {
    color: '#2E5A91',
  },
  'class-name': {
    color: '#CC6B4A',
  },
  keyword: {
    color: '#CC6B4A',
  },
  regex: {
    color: '#9B8FD6',
  },
  important: {
    color: '#CC6B4A',
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  namespace: {
    opacity: 0.7,
  },
};

// Dark mode theme using brand colors
export const customDarkTheme = {
  'code[class*="language-"]': {
    color: '#FFFFFF', // text-primary (dark)
    fontFamily: 'var(--font-mono)',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    color: '#FFFFFF', // text-primary (dark)
    fontFamily: 'var(--font-mono)',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
    padding: '1em',
    margin: '0.5em 0',
    overflow: 'auto',
  },
  comment: {
    color: '#B5B4B0', // text-tertiary (dark)
    fontStyle: 'italic',
  },
  prolog: {
    color: '#B5B4B0',
  },
  doctype: {
    color: '#B5B4B0',
  },
  cdata: {
    color: '#B5B4B0',
  },
  punctuation: {
    color: '#E5E4E0', // text-secondary (dark)
  },
  property: {
    color: '#CC6B4A', // accent-terracotta
  },
  tag: {
    color: '#CC6B4A',
  },
  boolean: {
    color: '#9B8FD6', // accent-purple
  },
  number: {
    color: '#9B8FD6',
  },
  constant: {
    color: '#9B8FD6',
  },
  symbol: {
    color: '#9B8FD6',
  },
  deleted: {
    color: '#CC6B4A',
  },
  selector: {
    color: '#2E5A91', // accent-blue
  },
  'attr-name': {
    color: '#2E5A91',
  },
  string: {
    color: '#2E5A91',
  },
  char: {
    color: '#2E5A91',
  },
  builtin: {
    color: '#2E5A91',
  },
  inserted: {
    color: '#2E5A91',
  },
  operator: {
    color: '#E5E4E0', // text-secondary (dark)
  },
  entity: {
    color: '#E5E4E0',
    cursor: 'help',
  },
  url: {
    color: '#2E5A91',
  },
  '.language-css .token.string': {
    color: '#2E5A91',
  },
  '.style .token.string': {
    color: '#2E5A91',
  },
  variable: {
    color: '#FFFFFF', // text-primary (dark)
  },
  atrule: {
    color: '#CC6B4A',
  },
  'attr-value': {
    color: '#2E5A91',
  },
  function: {
    color: '#2E5A91',
  },
  'class-name': {
    color: '#CC6B4A',
  },
  keyword: {
    color: '#CC6B4A',
  },
  regex: {
    color: '#9B8FD6',
  },
  important: {
    color: '#CC6B4A',
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  namespace: {
    opacity: '0.7',
  },
};
