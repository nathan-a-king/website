---
name: blog-post-manager
description: Create, validate, and enhance blog posts. Use when creating new blog posts, validating frontmatter, checking post structure, suggesting categories, extracting images for social sharing, or managing blog content. Handles markdown posts with YAML frontmatter.
---

# Blog Post Manager

Specialized skill for managing blog posts in this React/Vite-based personal website. Posts are markdown files with YAML frontmatter, processed at build time into JSON API endpoints.

## Quick Start

### Creating a New Post

Use the existing npm script for post creation:

```bash
npm run new-post "Your Post Title" "Optional excerpt"
```

This automatically:
- Generates a slug from the title
- Creates the file in `content/posts/`
- Uses the template from `scripts/post-template.md`
- Adds current date in the format "Month Day, Year"

### Frontmatter Structure

All posts require YAML frontmatter with these fields:

```yaml
---
slug: your-post-slug
title: "Your Post Title"
date: November 17, 2025
excerpt: "Brief description for previews and SEO. Keep under 160 characters."
categories: ["Category1", "Category2"]
---
```

**Field Requirements:**
- `slug`: Must match filename (without .md), lowercase with hyphens
- `title`: Quoted string, can contain special characters
- `date`: Full format like "November 17, 2025" or "December 15, 2024"
- `excerpt`: Quoted string, under 160 characters for optimal SEO
- `categories`: Array of strings (can also be a single string for one category)

### Valid Categories

Based on existing posts, these categories are used:
- **AI** - Artificial intelligence, machine learning, LLMs
- **Engineering** - Software engineering, development practices
- **Design** - Product design, UI/UX, visual design
- **Product** - Product strategy, product management
- **Writing** - Writing craft, content creation
- **Personal** - Personal reflections, life experiences
- **Strategy** - Strategic thinking, business strategy
- **Leadership** - Leadership principles, management

For the complete list, see [CATEGORIES.md](CATEGORIES.md).

## Validation

### Validate Frontmatter

To validate a post's frontmatter structure:

```bash
node .claude/skills/blog-post-manager/scripts/validate-frontmatter.js content/posts/your-post.md
```

This checks:
- YAML syntax validity
- Required fields present
- Slug matches filename
- Excerpt length (warns if > 160 characters)
- Categories are valid
- Date format is readable

### Validate All Posts

```bash
for file in content/posts/*.md; do
  node .claude/skills/blog-post-manager/scripts/validate-frontmatter.js "$file"
done
```

## Content Enhancement

### Auto-Generate Excerpts

If a post is missing an excerpt or has a placeholder, you can auto-generate one from the first paragraph:

1. Read the first substantial paragraph (skip headings and short lines)
2. Trim to under 160 characters
3. Ensure it ends on a complete word
4. Update the frontmatter

### Extract First Image

For social sharing (og:image), extract the first image from markdown content:

```bash
node scripts/extract-first-image.js content/posts/your-post.md
```

This is already integrated into the build process via `scripts/vite-plugin-markdown-posts.js`.

### Suggest Internal Links

Analyze post content and suggest links to related posts:

```bash
node .claude/skills/blog-post-manager/scripts/suggest-links.js content/posts/your-post.md
```

This analyzes:
- Similar categories
- Keyword overlap in titles and excerpts
- Semantic similarity in content
- Manual references to other posts

## Best Practices

### Frontmatter Guidelines

1. **Slug**: Use kebab-case, keep under 60 characters, be descriptive
   - Good: `ai-learning-about-you`, `two-minds-one-war`
   - Bad: `post1`, `my-thoughts`, `untitled`

2. **Title**: Be specific and compelling
   - Good: "Two Minds, One War", "The Mispricing of Understanding"
   - Bad: "Thoughts on Leadership", "AI Update"

3. **Excerpt**: Hook the reader, tease the insight
   - Good: "What do you do when the world demands an answer you don't have?"
   - Bad: "This post is about leadership."

4. **Categories**: Use 1-3 categories, prioritize the primary category first
   - Good: `["AI", "Engineering"]`, `["Strategy", "Leadership"]`
   - Bad: `["AI", "Engineering", "Design", "Product", "Writing"]`

### Content Guidelines

1. **Images**: Place in `public/images/`, reference as `/images/filename.jpg`
2. **Code blocks**: Always specify language for syntax highlighting
3. **Internal links**: Use relative URLs: `/blog/other-post-slug`
4. **Headings**: Use `##` for main sections, `###` for subsections
5. **First image**: Place early in post for better social sharing

### File Naming

- Filename must match the slug in frontmatter
- Use `.md` extension
- Keep in `content/posts/` directory
- Example: `two-minds-one-war.md` with `slug: two-minds-one-war`

## Integration with Build Process

Posts are processed at build time by `scripts/vite-plugin-markdown-posts.js`:

1. **Index Generation**: Creates `/public/api/posts-index.json` with all post metadata
2. **Individual Posts**: Creates `/public/api/posts/{slug}.json` for each post
3. **Category Normalization**: Handles both string and array category formats
4. **Image Extraction**: Finds first image for social sharing
5. **Date Sorting**: Orders posts newest first

### Hot Reload

During development (`npm run dev`), markdown file changes trigger rebuild and hot reload automatically.

## Troubleshooting

### Post Not Appearing

1. Check frontmatter syntax with validator
2. Ensure slug matches filename
3. Restart dev server (`npm run dev`)
4. Check for JavaScript errors in browser console

### Build Errors

1. Validate all posts: `scripts/validate-frontmatter.js`
2. Check for malformed YAML
3. Look for unescaped quotes in title/excerpt
4. Verify all image paths exist

### SEO Issues

1. Keep excerpt under 160 characters
2. Ensure first image exists for og:image
3. Use descriptive, unique titles
4. Include relevant categories

## Advanced Usage

### Batch Operations

Create multiple posts from a list:

```javascript
const titles = [
  "First Post Title",
  "Second Post Title",
  "Third Post Title"
];

titles.forEach(title => {
  // Run npm run new-post for each
});
```

### Category Management

To see category distribution:

```bash
rg "^categories:" content/posts/ | sort | uniq -c | sort -rn
```

### Find Posts Without Excerpts

```bash
rg "excerpt: \"\"" content/posts/
```

## Files and Scripts

- `scripts/new-post.js` - Creates new posts with template
- `scripts/post-template.md` - Template for new posts
- `scripts/vite-plugin-markdown-posts.js` - Build-time processor
- `scripts/extract-first-image.js` - Image extraction utility
- `.claude/skills/blog-post-manager/scripts/validate-frontmatter.js` - Validation script
- `.claude/skills/blog-post-manager/scripts/suggest-links.js` - Link suggestion script
- `.claude/skills/blog-post-manager/CATEGORIES.md` - Category reference

## Related Skills

- **seo-metadata-manager**: For generating and validating SEO metadata
- **content-quality-checker**: For validating markdown, links, and images
- **build-validator**: For checking build output and deployment readiness
