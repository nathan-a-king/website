#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

function extractFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  return match ? match[1] : null;
}

function getPostContent(content) {
  return content.replace(/^---\s*\n[\s\S]*?\n---\n/, '');
}

function checkMarkdownSyntax(content) {
  const issues = [];
  const lines = content.split('\n');

  // Check heading hierarchy
  const headings = [];
  let previousLevel = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);

    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];

      headings.push({ level, text, line: i + 1 });

      // Check for skipped levels
      if (previousLevel > 0 && level > previousLevel + 1) {
        issues.push({
          type: 'warning',
          category: 'heading-hierarchy',
          line: i + 1,
          message: `Heading level skipped: H${previousLevel} → H${level}`
        });
      }

      previousLevel = level;
    }
  }

  // Check code blocks have language tags
  const codeBlockRegex = /```(\w*)\n/g;
  let match;
  let lineNum = 0;

  for (const line of lines) {
    lineNum++;
    if (line.startsWith('```')) {
      const lang = line.substring(3).trim();
      if (!lang && line === '```') {
        issues.push({
          type: 'warning',
          category: 'code-block',
          line: lineNum,
          message: 'Code block missing language tag for syntax highlighting'
        });
      }
    }
  }

  return issues;
}

function checkLinks(content, filepath) {
  const issues = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const linkText = match[1];
    const linkUrl = match[2];

    // Check for bad link text
    if (linkText.toLowerCase().includes('click here') ||
        linkText.toLowerCase() === 'here' ||
        linkText.toLowerCase().includes('read more')) {
      issues.push({
        type: 'warning',
        category: 'link-text',
        message: `Link text "${linkText}" is not descriptive. Use text that describes the destination.`
      });
    }

    // Check internal blog links
    if (linkUrl.startsWith('/blog/')) {
      const slug = linkUrl.replace('/blog/', '');
      const postPath = path.join(path.dirname(filepath), '..', `${slug}.md`);

      if (!fs.existsSync(postPath)) {
        issues.push({
          type: 'error',
          category: 'broken-link',
          message: `Internal link to "${linkUrl}" appears broken. Post file not found: ${slug}.md`
        });
      }
    }

    // Check for obvious URL typos
    if (linkUrl.includes('http') && !linkUrl.startsWith('http://') && !linkUrl.startsWith('https://')) {
      issues.push({
        type: 'error',
        category: 'malformed-url',
        message: `Malformed URL: "${linkUrl}"`
      });
    }
  }

  return issues;
}

function checkImages(content, projectRoot) {
  const issues = [];
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;

  while ((match = imageRegex.exec(content)) !== null) {
    const altText = match[1];
    const imagePath = match[2];

    // Check for missing alt text
    if (!altText || altText.trim().length === 0) {
      issues.push({
        type: 'error',
        category: 'accessibility',
        message: `Image "${imagePath}" missing alt text. All images must have descriptive alt text.`
      });
    }

    // Check for non-descriptive alt text
    if (altText && (
      altText.toLowerCase() === 'image' ||
      altText.toLowerCase() === 'screenshot' ||
      altText.toLowerCase() === 'picture' ||
      altText.endsWith('.png') ||
      altText.endsWith('.jpg') ||
      altText.endsWith('.jpeg')
    )) {
      issues.push({
        type: 'warning',
        category: 'accessibility',
        message: `Image alt text "${altText}" is not descriptive. Describe what the image shows.`
      });
    }

    // Check if image exists (for local paths)
    if (imagePath.startsWith('/images/')) {
      const fullImagePath = path.join(projectRoot, 'public', imagePath);
      if (!fs.existsSync(fullImagePath)) {
        issues.push({
          type: 'error',
          category: 'missing-file',
          message: `Image file not found: ${imagePath}`
        });
      } else {
        // Check file size
        const stats = fs.statSync(fullImagePath);
        const sizeKB = stats.size / 1024;
        if (sizeKB > 200) {
          issues.push({
            type: 'warning',
            category: 'performance',
            message: `Image "${imagePath}" is large (${sizeKB.toFixed(0)} KB). Consider optimizing.`
          });
        }
      }
    }
  }

  return issues;
}

function checkContentStandards(content) {
  const issues = [];
  const lines = content.split('\n');

  // Check for orphan headings (heading with no content after)
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].match(/^#{2,6}\s+/)) {
      const nextLine = lines[i + 1];
      const lineAfter = lines[i + 2];

      if (nextLine && nextLine.match(/^#{2,6}\s+/)) {
        issues.push({
          type: 'warning',
          category: 'content-structure',
          line: i + 1,
          message: 'Heading has no content. Add text between headings.'
        });
      }
    }
  }

  // Check word count
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;

  if (wordCount < 500) {
    issues.push({
      type: 'info',
      category: 'content-length',
      message: `Post is ${wordCount} words. Consider adding more content (recommended minimum: 500 words).`
    });
  } else if (wordCount > 3000) {
    issues.push({
      type: 'info',
      category: 'content-length',
      message: `Post is ${wordCount} words. Consider splitting into multiple posts for better readability.`
    });
  }

  // Check for first paragraph
  const firstPara = content.split('\n\n')[0];
  if (firstPara && firstPara.startsWith('#')) {
    issues.push({
      type: 'warning',
      category: 'content-structure',
      message: 'Post starts with a heading. Add an opening paragraph before the first heading.'
    });
  }

  return issues;
}

function checkPost(filepath) {
  const projectRoot = path.resolve(path.dirname(filepath), '../..');

  // Read file
  let content;
  try {
    content = fs.readFileSync(filepath, 'utf8');
  } catch (err) {
    return {
      valid: false,
      errors: [`Failed to read file: ${err.message}`]
    };
  }

  // Extract parts
  const frontmatter = extractFrontmatter(content);
  const postContent = getPostContent(content);

  if (!frontmatter) {
    return {
      valid: false,
      errors: ['No frontmatter found']
    };
  }

  // Run all checks
  const allIssues = [
    ...checkMarkdownSyntax(postContent),
    ...checkLinks(postContent, filepath),
    ...checkImages(postContent, projectRoot),
    ...checkContentStandards(postContent)
  ];

  // Categorize issues
  const errors = allIssues.filter(i => i.type === 'error');
  const warnings = allIssues.filter(i => i.type === 'warning');
  const info = allIssues.filter(i => i.type === 'info');

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    info,
    wordCount: postContent.split(/\s+/).filter(w => w.length > 0).length
  };
}

function formatResults(filepath, result) {
  const filename = path.basename(filepath);
  let output = '';

  if (result.valid && result.warnings.length === 0 && result.info.length === 0) {
    output += `✅ ${filename}: Passed all checks (${result.wordCount} words)\n`;
    return output;
  }

  const status = result.valid ? '⚠️' : '❌';
  output += `${status} ${filename}`;
  if (result.wordCount) {
    output += ` (${result.wordCount} words)`;
  }
  output += '\n';

  // Errors
  if (result.errors && result.errors.length > 0) {
    output += `\n  ❌ Errors (${result.errors.length}):\n`;
    for (const error of result.errors) {
      const location = error.line ? ` [line ${error.line}]` : '';
      output += `     ${error.message}${location}\n`;
    }
  }

  // Warnings
  if (result.warnings && result.warnings.length > 0) {
    output += `\n  ⚠️  Warnings (${result.warnings.length}):\n`;
    for (const warning of result.warnings) {
      const location = warning.line ? ` [line ${warning.line}]` : '';
      output += `     ${warning.message}${location}\n`;
    }
  }

  // Info
  if (result.info && result.info.length > 0) {
    output += `\n  ℹ️  Info (${result.info.length}):\n`;
    for (const item of result.info) {
      output += `     ${item.message}\n`;
    }
  }

  return output;
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node check-post.js <path-to-post.md>');
    process.exit(1);
  }

  const filepath = args[0];
  const result = checkPost(filepath);
  console.log(formatResults(filepath, result));

  process.exit(result.valid ? 0 : 1);
}

export { checkPost, formatResults };
