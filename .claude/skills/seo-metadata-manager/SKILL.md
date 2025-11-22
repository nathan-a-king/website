---
name: seo-metadata-manager
description: Generate and validate SEO metadata, meta tags, structured data, social sharing tags. Use when optimizing SEO, creating meta descriptions, validating Open Graph tags, checking structured data, or improving social media sharing.
---

# SEO Metadata Manager

Specialized skill for managing SEO metadata, social sharing tags, and structured data for this React/Vite website.

## Quick Start

### SEO System Overview

This website uses a **dual-layer SEO system**:

1. **Static SEO tags** - Injected at build time by `scripts/prerender.js`
   - Site-wide tags (og:site_name, author, twitter:card)
   - JSON-LD structured data
   - Robots meta tags

2. **Dynamic SEO tags** - Managed at runtime by `src/utils/seo.js`
   - Page-specific titles and descriptions
   - Blog post metadata
   - Canonical URLs
   - og:image tags

### Key Files

- `src/utils/seo.js` - Runtime SEO utilities
- `scripts/prerender.js` - Build-time SEO generation
- `server.js` - Server-side meta tag injection for blog posts

## Runtime SEO

### Update Page Metadata

Used in React components via `src/utils/seo.js`:

```javascript
import { updateDocumentMeta, generatePageMeta } from '../utils/seo';

// For standard pages
const meta = generatePageMeta('blog', 'Custom description');
updateDocumentMeta(meta);

// For blog posts
const meta = generatePostMeta(post);
updateDocumentMeta(meta);
```

### Page Meta Generation

Standard pages (home, blog, about, contact, resume):

```javascript
generatePageMeta('home');
// Returns:
// {
//   title: "Nathan A. King",
//   description: "AI Engineer & Designer...",
//   canonical: "https://www.nateking.dev",
//   ogImage: "https://www.nateking.dev/og-image.jpg",
//   type: "website"
// }
```

### Post Meta Generation

Blog posts get dynamic metadata:

```javascript
generatePostMeta(post);
// Returns:
// {
//   title: "Post Title | Nathan A. King",
//   description: post.excerpt,
//   canonical: "https://www.nateking.dev/blog/post-slug",
//   ogImage: post.firstImage || default,
//   type: "article"
// }
```

## Build-Time SEO

### Sitemap Generation

Automatically generated during build (`npm run build`):

**Location**: `build/sitemap.xml`

**Includes**:
- Home page
- All static pages (blog, about, contact, resume)
- All blog posts with slugs

**Format**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.nateking.dev/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.nateking.dev/blog/post-slug</loc>
    <priority>0.8</priority>
  </url>
</urlset>
```

### Robots.txt

Generated at build time:

**Location**: `build/robots.txt`

```txt
User-agent: *
Allow: /

Sitemap: https://www.nateking.dev/sitemap.xml
```

### Structured Data (JSON-LD)

Injected into index.html at build time:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Nathan A. King",
  "url": "https://www.nateking.dev",
  "sameAs": [...]
}
```

## Server-Side SEO

### Dynamic Meta Injection

The Express server (`server.js`) injects post-specific meta tags:

**For blog posts** (`/blog/:slug`):
- Reads post data from JSON API
- Injects og:title, og:description, og:image
- Sets canonical URL
- Adds JSON-LD structured data for articles

**Advantage**: Social media crawlers see complete metadata without JavaScript.

## SEO Validation

### Validate Meta Tags

Check all required meta tags are present:

```bash
node .claude/skills/seo-metadata-manager/scripts/validate-meta.js
```

Validates:
- Title tags (length, format)
- Meta descriptions (length, uniqueness)
- Open Graph tags (og:title, og:description, og:image, og:url)
- Twitter Card tags
- Canonical URLs
- JSON-LD structured data

### Validate Structured Data

Check JSON-LD syntax and required fields:

```bash
node .claude/skills/seo-metadata-manager/scripts/validate-structured-data.js
```

### Check Individual Post SEO

```bash
node .claude/skills/seo-metadata-manager/scripts/check-post-seo.js content/posts/your-post.md
```

Checks:
- Title length (< 60 characters recommended)
- Excerpt length (< 160 characters for meta description)
- First image exists (for og:image)
- Categories present (for keywords)

## SEO Best Practices

### Title Tags

**Format**: `Post Title | Nathan A. King`

**Guidelines**:
- Keep under 60 characters (displays fully in search results)
- Include primary keyword
- Brand name at end
- Unique per page

**Good examples**:
- "Two Minds, One War | Nathan A. King"
- "AI Learning About You | Nathan A. King"

**Bad examples**:
- "Blog Post" (not descriptive)
- "The Complete Comprehensive Guide to Everything About AI and Machine Learning" (too long)

### Meta Descriptions

**Length**: 150-160 characters optimal

**Guidelines**:
- Compelling hook
- Include primary keyword
- Unique per page
- Action-oriented when appropriate

**Good example**:
```yaml
excerpt: "What do you do when the world demands an answer you don't have? A study of two Civil War leaders reveals profound lessons about leadership."
```

**Bad example**:
```yaml
excerpt: "This is a blog post about leadership and decision making."
```

### Canonical URLs

Always set canonical URLs to avoid duplicate content:

```javascript
canonical: "https://www.nateking.dev/blog/post-slug"
```

### Open Graph Images

**Requirements**:
- Minimum 1200x630 pixels
- Under 5 MB
- JPG or PNG format
- Descriptive alt text

**Location**: Use first image from post or default `/og-image.jpg`

### Structured Data

**Person schema** for home page:
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Nathan A. King",
  "jobTitle": "AI Engineer & Designer",
  "url": "https://www.nateking.dev"
}
```

**Article schema** for blog posts:
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Post Title",
  "datePublished": "2025-11-17",
  "author": {
    "@type": "Person",
    "name": "Nathan A. King"
  }
}
```

## Social Media Optimization

### Twitter Cards

Required tags:
- `twitter:card` - "summary_large_image"
- `twitter:title` - Post title
- `twitter:description` - Post excerpt
- `twitter:image` - Post image

### Facebook/Open Graph

Required tags:
- `og:title` - Post title
- `og:description` - Post excerpt
- `og:image` - Post image (1200x630)
- `og:url` - Canonical URL
- `og:type` - "article" for posts, "website" for pages

### LinkedIn

Uses Open Graph tags. Ensure:
- og:title is compelling
- og:description provides value
- og:image is professional quality

## Testing Tools

### Local Testing

```bash
# Build and check
npm run build
node scripts/validate-build.js

# Check specific post SEO
node .claude/skills/seo-metadata-manager/scripts/check-post-seo.js content/posts/post.md
```

### External Tools

**Google**:
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

**Social Media**:
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

**SEO Tools**:
- [Schema.org Validator](https://validator.schema.org/)
- Google Search Console
- Lighthouse in Chrome DevTools

## Common Issues

### Title Too Long

**Issue**: Title shows as "Post Title That Is Way Too Long And Gets Cut Of..."

**Fix**: Keep under 60 characters
```yaml
# Bad
title: "The Complete Comprehensive Guide to Understanding AI and Machine Learning"

# Good
title: "Understanding AI and Machine Learning"
```

### Missing og:image

**Issue**: Social media share shows no image

**Fix**: Add image early in post
```markdown
![Descriptive alt text](/images/hero-image.jpg)
```

### Duplicate Meta Descriptions

**Issue**: Multiple posts with same excerpt

**Fix**: Write unique excerpts for each post

### Broken Structured Data

**Issue**: JSON-LD syntax error

**Fix**: Validate JSON syntax in scripts/prerender.js

## Performance Considerations

### Prerendering

Build-time SEO generation is fast because:
- Runs once during build
- No runtime overhead
- Static files served directly

### Runtime SEO

Client-side meta updates are efficient:
- Minimal DOM manipulation
- Marked with `data-managed="runtime"` to avoid conflicts
- Cached in React component lifecycle

## SEO Checklist

Before publishing:

**Content**:
- [ ] Title under 60 characters
- [ ] Excerpt under 160 characters
- [ ] First image present for og:image
- [ ] Categories selected (for keywords)

**Meta Tags**:
- [ ] Title tag set
- [ ] Meta description set
- [ ] Canonical URL set
- [ ] og:image present

**Structured Data**:
- [ ] JSON-LD syntax valid
- [ ] Required fields present
- [ ] Article schema for posts

**Social Media**:
- [ ] Twitter card tags set
- [ ] Open Graph tags complete
- [ ] Image meets size requirements

**Technical**:
- [ ] Sitemap includes post
- [ ] Robots.txt allows indexing
- [ ] Page loads under 3 seconds

## Integration with Other Skills

- **blog-post-manager**: Validates SEO fields in frontmatter
- **content-quality-checker**: Ensures content supports SEO
- **build-validator**: Checks SEO tags in build output

## Files and References

- `src/utils/seo.js` - Runtime SEO utilities
- `scripts/prerender.js` - Build-time generation
- `server.js` - Server-side injection
- `scripts/validate-build.js` - Build validation
