#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../..');

function extractFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return null;
  }
  return yaml.parse(frontmatterMatch[1]);
}

function getPostContent(content) {
  // Remove frontmatter and return just content
  return content.replace(/^---\s*\n[\s\S]*?\n---\n/, '');
}

function getKeywords(text) {
  // Extract meaningful keywords (simplified version)
  // Remove common words and get unique terms
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i',
    'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'when',
    'where', 'why', 'how'
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word));

  // Count occurrences
  const wordCounts = {};
  for (const word of words) {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  }

  // Return top keywords by frequency
  return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
}

function calculateSimilarity(keywords1, keywords2) {
  const set1 = new Set(keywords1);
  const set2 = new Set(keywords2);
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}

function categoriesOverlap(categories1, categories2) {
  if (!categories1 || !categories2) return 0;

  const cats1 = Array.isArray(categories1) ? categories1 : [categories1];
  const cats2 = Array.isArray(categories2) ? categories2 : [categories2];

  const set1 = new Set(cats1);
  const set2 = new Set(cats2);
  const intersection = new Set([...set1].filter(x => set2.has(x)));

  return intersection.size;
}

function getAllPosts(postsDir) {
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  const posts = [];

  for (const file of files) {
    const filepath = path.join(postsDir, file);
    const content = fs.readFileSync(filepath, 'utf8');
    const frontmatter = extractFrontmatter(content);

    if (frontmatter) {
      const postContent = getPostContent(content);
      const keywords = getKeywords(postContent);

      posts.push({
        filename: file,
        slug: frontmatter.slug,
        title: frontmatter.title,
        excerpt: frontmatter.excerpt,
        categories: frontmatter.categories,
        keywords,
        content: postContent
      });
    }
  }

  return posts;
}

function suggestLinks(targetPost, allPosts, maxSuggestions = 5) {
  const suggestions = [];

  for (const post of allPosts) {
    // Skip self
    if (post.slug === targetPost.slug) continue;

    let score = 0;
    const reasons = [];

    // Category overlap (high weight)
    const categoryMatch = categoriesOverlap(targetPost.categories, post.categories);
    if (categoryMatch > 0) {
      score += categoryMatch * 3;
      reasons.push(`${categoryMatch} shared categor${categoryMatch > 1 ? 'ies' : 'y'}`);
    }

    // Keyword similarity (medium weight)
    const keywordSimilarity = calculateSimilarity(targetPost.keywords, post.keywords);
    if (keywordSimilarity > 0.1) {
      score += keywordSimilarity * 2;
      reasons.push(`${Math.round(keywordSimilarity * 100)}% keyword overlap`);
    }

    // Check for explicit mentions in content
    const mentionsTitle = targetPost.content.toLowerCase().includes(post.title.toLowerCase());
    const mentionsSlug = targetPost.content.includes(post.slug);

    if (mentionsTitle || mentionsSlug) {
      score += 5;
      reasons.push('explicitly mentioned');
    }

    if (score > 0) {
      suggestions.push({
        post,
        score,
        reasons
      });
    }
  }

  // Sort by score and return top suggestions
  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSuggestions);
}

function formatSuggestions(targetFilename, suggestions) {
  let output = `\n📎 Link suggestions for "${targetFilename}":\n\n`;

  if (suggestions.length === 0) {
    output += '  No related posts found.\n';
    return output;
  }

  for (let i = 0; i < suggestions.length; i++) {
    const { post, score, reasons } = suggestions[i];
    output += `${i + 1}. "${post.title}" (/blog/${post.slug})\n`;
    output += `   Score: ${score.toFixed(2)} - ${reasons.join(', ')}\n`;
    output += `   Categories: ${Array.isArray(post.categories) ? post.categories.join(', ') : post.categories}\n`;
    output += `   Link: [${post.title}](/blog/${post.slug})\n\n`;
  }

  return output;
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node suggest-links.js <path-to-post.md>');
    process.exit(1);
  }

  const targetPath = args[0];
  const postsDir = path.join(projectRoot, 'content/posts');

  // Read target post
  const targetContent = fs.readFileSync(targetPath, 'utf8');
  const targetFrontmatter = extractFrontmatter(targetContent);

  if (!targetFrontmatter) {
    console.error('❌ No frontmatter found in target post');
    process.exit(1);
  }

  const targetPost = {
    slug: targetFrontmatter.slug,
    title: targetFrontmatter.title,
    excerpt: targetFrontmatter.excerpt,
    categories: targetFrontmatter.categories,
    keywords: getKeywords(getPostContent(targetContent)),
    content: getPostContent(targetContent)
  };

  // Get all posts
  const allPosts = getAllPosts(postsDir);

  // Generate suggestions
  const suggestions = suggestLinks(targetPost, allPosts);

  // Format and display
  console.log(formatSuggestions(path.basename(targetPath), suggestions));
}

export { suggestLinks, getAllPosts, extractFrontmatter };
