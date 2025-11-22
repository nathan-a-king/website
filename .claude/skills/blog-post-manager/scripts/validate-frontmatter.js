#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

const VALID_CATEGORIES = [
  'AI',
  'Engineering',
  'Design',
  'Product',
  'Writing',
  'Personal',
  'Strategy',
  'Leadership'
];

const MAX_EXCERPT_LENGTH = 160;

function extractFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return null;
  }
  return frontmatterMatch[1];
}

function validatePost(filepath) {
  const filename = path.basename(filepath);
  const errors = [];
  const warnings = [];

  // Read file
  let content;
  try {
    content = fs.readFileSync(filepath, 'utf8');
  } catch (err) {
    return {
      valid: false,
      errors: [`Failed to read file: ${err.message}`],
      warnings: []
    };
  }

  // Extract frontmatter
  const frontmatterText = extractFrontmatter(content);
  if (!frontmatterText) {
    return {
      valid: false,
      errors: ['No frontmatter found. Posts must have YAML frontmatter between --- markers.'],
      warnings: []
    };
  }

  // Parse YAML
  let frontmatter;
  try {
    frontmatter = yaml.parse(frontmatterText);
  } catch (err) {
    return {
      valid: false,
      errors: [`Invalid YAML syntax: ${err.message}`],
      warnings: []
    };
  }

  // Check required fields
  const requiredFields = ['slug', 'title', 'date', 'excerpt'];
  for (const field of requiredFields) {
    if (!frontmatter[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate slug matches filename
  if (frontmatter.slug) {
    const expectedFilename = `${frontmatter.slug}.md`;
    if (filename !== expectedFilename) {
      errors.push(`Slug "${frontmatter.slug}" doesn't match filename "${filename}". Expected "${expectedFilename}"`);
    }

    // Check slug format
    if (!/^[a-z0-9-]+$/.test(frontmatter.slug)) {
      errors.push(`Slug "${frontmatter.slug}" contains invalid characters. Use only lowercase letters, numbers, and hyphens.`);
    }
  }

  // Validate title
  if (frontmatter.title) {
    if (typeof frontmatter.title !== 'string') {
      errors.push('Title must be a string');
    } else if (frontmatter.title.length === 0) {
      errors.push('Title cannot be empty');
    }
  }

  // Validate date
  if (frontmatter.date) {
    const dateStr = String(frontmatter.date);
    const parsedDate = new Date(dateStr);
    if (isNaN(parsedDate.getTime())) {
      errors.push(`Invalid date format: "${frontmatter.date}". Use format like "November 17, 2025"`);
    }
  }

  // Validate excerpt
  if (frontmatter.excerpt) {
    if (typeof frontmatter.excerpt !== 'string') {
      errors.push('Excerpt must be a string');
    } else {
      const excerptLength = frontmatter.excerpt.length;
      if (excerptLength === 0) {
        warnings.push('Excerpt is empty');
      } else if (excerptLength > MAX_EXCERPT_LENGTH) {
        warnings.push(`Excerpt is ${excerptLength} characters (recommended max: ${MAX_EXCERPT_LENGTH} for SEO)`);
      }
    }
  }

  // Validate categories
  if (frontmatter.categories) {
    let categories = frontmatter.categories;

    // Handle both string and array formats
    if (typeof categories === 'string') {
      categories = [categories];
    }

    if (!Array.isArray(categories)) {
      errors.push('Categories must be a string or an array');
    } else {
      // Check each category
      for (const category of categories) {
        if (typeof category !== 'string') {
          errors.push(`Invalid category type: ${typeof category}. Categories must be strings.`);
        } else if (!VALID_CATEGORIES.includes(category)) {
          warnings.push(`Unknown category: "${category}". Valid categories: ${VALID_CATEGORIES.join(', ')}`);
        }
      }

      // Warn if too many categories
      if (categories.length > 3) {
        warnings.push(`Post has ${categories.length} categories. Consider limiting to 2-3 most relevant categories.`);
      }
    }
  } else {
    warnings.push('No categories specified. Consider adding relevant categories.');
  }

  // Check for common template placeholders
  const placeholders = [
    'your-post-slug',
    'Your Post Title',
    'A brief description'
  ];

  for (const placeholder of placeholders) {
    if (content.includes(placeholder)) {
      warnings.push(`Template placeholder detected: "${placeholder}". Update with actual content.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    frontmatter
  };
}

function formatResults(filepath, result) {
  const filename = path.basename(filepath);
  let output = '';

  if (result.valid && result.warnings.length === 0) {
    output += `✅ ${filename}: Valid\n`;
  } else if (result.valid && result.warnings.length > 0) {
    output += `⚠️  ${filename}: Valid with warnings\n`;
    for (const warning of result.warnings) {
      output += `   Warning: ${warning}\n`;
    }
  } else {
    output += `❌ ${filename}: Invalid\n`;
    for (const error of result.errors) {
      output += `   Error: ${error}\n`;
    }
    for (const warning of result.warnings) {
      output += `   Warning: ${warning}\n`;
    }
  }

  return output;
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node validate-frontmatter.js <path-to-post.md>');
    console.error('   or: node validate-frontmatter.js content/posts/*.md');
    process.exit(1);
  }

  let hasErrors = false;

  for (const filepath of args) {
    const result = validatePost(filepath);
    console.log(formatResults(filepath, result));

    if (!result.valid) {
      hasErrors = true;
    }
  }

  process.exit(hasErrors ? 1 : 0);
}

export { validatePost, extractFrontmatter };
