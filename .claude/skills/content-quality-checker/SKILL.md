---
name: content-quality-checker
description: Validate markdown content quality, check links, verify images, ensure accessibility. Use when checking blog post quality, validating markdown syntax, checking for broken links, verifying image paths and alt text, or ensuring content standards compliance.
---

# Content Quality Checker

Specialized skill for validating the quality of markdown blog posts. Ensures content meets standards for formatting, accessibility, and user experience.

## Quick Start

### Check a Single Post

```bash
node .claude/skills/content-quality-checker/scripts/check-post.js content/posts/your-post.md
```

### Check All Posts

```bash
for file in content/posts/*.md; do
  echo "Checking $file..."
  node .claude/skills/content-quality-checker/scripts/check-post.js "$file"
done
```

or use the batch script:

```bash
node .claude/skills/content-quality-checker/scripts/check-all.js
```

## Validation Checks

### Markdown Syntax

Validates:
- ✅ Proper heading hierarchy (no skipped levels)
- ✅ Code blocks have language tags for syntax highlighting
- ✅ Lists are properly formatted
- ✅ Links are properly formed
- ✅ Images have proper syntax

### Links

Checks all links in markdown content:

**Internal Links** (`/blog/...`, `/about`, etc.):
- ✅ Referenced files exist
- ✅ Blog post slugs are valid
- ✅ No broken internal references

**External Links** (`https://...`):
- ✅ URLs are properly formatted
- ✅ Links are accessible (optional, requires network check)
- ✅ No obvious typos in URLs

### Images

Validates images in markdown:
- ✅ Image paths exist in `public/images/`
- ✅ All images have alt text
- ✅ Alt text is descriptive (not just filename)
- ✅ Image format is web-optimized (WebP, JPEG, PNG)
- ✅ Large images flagged for optimization

### Content Standards

Checks against content guidelines:
- ✅ First paragraph provides context
- ✅ Headings are descriptive
- ✅ Code blocks under 50 lines (readability)
- ✅ No orphan headings (heading with no content)
- ✅ Reasonable post length (not too short/long)

## Link Checking

### Internal Link Validation

The link checker validates internal links by:

1. **Blog post links**: Checks if `/blog/{slug}` references an existing post
2. **Page links**: Verifies routes defined in `src/App.jsx` exist
3. **Asset links**: Ensures images and files exist in `public/`

```bash
node .claude/skills/content-quality-checker/scripts/link-checker.js content/posts/your-post.md
```

### External Link Validation (Optional)

Check external links are accessible:

```bash
node .claude/skills/content-quality-checker/scripts/link-checker.js content/posts/your-post.md --check-external
```

⚠️ **Warning**: External link checking makes network requests and can be slow.

### Link Report

Generate a comprehensive link report for all posts:

```bash
node .claude/skills/content-quality-checker/scripts/link-checker.js --report
```

This creates a report of:
- All internal links and their targets
- All external links and domains
- Broken links (if any)
- Link frequency statistics

## Image Validation

### Image Path Checking

Verify all image paths exist:

```bash
node .claude/skills/content-quality-checker/scripts/image-validator.js content/posts/your-post.md
```

Checks:
- Image file exists in `public/images/`
- Image format is web-optimized
- File size is reasonable

### Alt Text Validation

Ensures all images have proper alt text:

```bash
node .claude/skills/content-quality-checker/scripts/image-validator.js content/posts/your-post.md --check-alt
```

Validates:
- Alt text is present
- Alt text is not just the filename
- Alt text is descriptive (> 10 characters)

### Image Optimization Check

Flag images that could be optimized:

```bash
node .claude/skills/content-quality-checker/scripts/image-validator.js content/posts/your-post.md --check-size
```

Flags:
- Images > 200 KB (consider compression)
- JPEG/PNG that could be WebP
- Non-responsive images

## Content Standards

### Writing Guidelines

See [CONTENT_STANDARDS.md](CONTENT_STANDARDS.md) for full guidelines:

**Structure**:
- Start with frontmatter
- Clear opening paragraph
- Logical heading hierarchy
- Conclusion or call to action

**Style**:
- Active voice preferred
- Clear, concise sentences
- Technical accuracy
- Proper grammar and spelling

**Code Examples**:
- Always specify language for syntax highlighting
- Keep examples focused and minimal
- Include comments for complex code
- Test code examples work

**Images**:
- Place early in post for social sharing
- Use descriptive alt text
- Optimize file sizes
- Consider dark mode variants

## Batch Operations

### Check All Posts for Issues

```bash
node .claude/skills/content-quality-checker/scripts/check-all.js
```

Generates a report of all issues across all posts.

### Generate Quality Report

```bash
node .claude/skills/content-quality-checker/scripts/quality-report.js
```

Creates a comprehensive quality report:
- Posts with broken links
- Posts missing images
- Posts with accessibility issues
- Posts with formatting problems
- Overall quality score per post

## Integration with Workflow

### Pre-Publish Checklist

Before publishing a new post:

1. **Validate frontmatter**:
   ```bash
   node .claude/skills/blog-post-manager/scripts/validate-frontmatter.js content/posts/new-post.md
   ```

2. **Check content quality**:
   ```bash
   node .claude/skills/content-quality-checker/scripts/check-post.js content/posts/new-post.md
   ```

3. **Validate links**:
   ```bash
   node .claude/skills/content-quality-checker/scripts/link-checker.js content/posts/new-post.md
   ```

4. **Check images**:
   ```bash
   node .claude/skills/content-quality-checker/scripts/image-validator.js content/posts/new-post.md
   ```

5. **Preview locally**:
   ```bash
   npm run dev
   # Visit http://localhost:3000/blog/new-post
   ```

### CI/CD Integration

Add content quality checks to your CI pipeline:

```yaml
# .github/workflows/content-quality.yml
- name: Check content quality
  run: node .claude/skills/content-quality-checker/scripts/check-all.js
```

## Common Issues and Fixes

### Broken Internal Links

**Issue**: Link to `/blog/old-slug` but post was renamed

**Fix**:
1. Find the current slug for that post
2. Update all references
3. Or create a redirect in `server.js`

### Missing Images

**Issue**: Markdown references `/images/missing.jpg` but file doesn't exist

**Fix**:
1. Check if image is in different location
2. Update markdown path
3. Or add the missing image to `public/images/`

### Missing Alt Text

**Issue**: Image has no alt text or alt text is just filename

**Fix**:
```markdown
<!-- Bad -->
![screenshot.png](/images/screenshot.png)

<!-- Good -->
![Dashboard showing user metrics with three charts](/images/dashboard-metrics.png)
```

### Code Blocks Without Language

**Issue**: Code block has no syntax highlighting

**Fix**:
````markdown
<!-- Bad -->
```
function hello() {
  console.log("Hello");
}
```

<!-- Good -->
```javascript
function hello() {
  console.log("Hello");
}
```
````

### Large Images

**Issue**: Image is 2 MB JPEG file

**Fix**:
1. Convert to WebP format
2. Compress image
3. Use responsive images with multiple sizes

## Accessibility Checks

### Alt Text Requirements

From WCAG 2.1 AA standards:
- All images must have alt text
- Alt text should describe image content
- Decorative images can use empty alt (`alt=""`)
- Complex images should have detailed descriptions

### Heading Hierarchy

- Don't skip heading levels (H2 → H4)
- Use only one H1 per page (handled by template)
- Headings should be descriptive

### Link Text

- Avoid "click here" or "read more"
- Link text should describe destination
- Don't use URL as link text

## Scripts Reference

### Main Scripts

- `check-post.js` - Comprehensive check for single post
- `check-all.js` - Check all posts, generate report
- `link-checker.js` - Validate all links
- `image-validator.js` - Validate images and alt text
- `quality-report.js` - Generate quality score report

### Usage Examples

```bash
# Quick check
node .claude/skills/content-quality-checker/scripts/check-post.js content/posts/my-post.md

# With all optional checks
node .claude/skills/content-quality-checker/scripts/check-post.js content/posts/my-post.md --check-external --check-size

# Generate report
node .claude/skills/content-quality-checker/scripts/quality-report.js > quality-report.txt
```

## Integration with Other Skills

- **blog-post-manager**: Validates frontmatter before quality check
- **seo-metadata-manager**: Checks content impacts SEO score
- **build-validator**: Ensures all content builds correctly

## Files and References

- `CONTENT_STANDARDS.md` - Writing and formatting guidelines
- `scripts/check-post.js` - Main validation script
- `scripts/link-checker.js` - Link validation
- `scripts/image-validator.js` - Image validation
- `scripts/quality-report.js` - Quality reporting

## Related Tools

- **Markdown linters**: markdownlint, remark-lint
- **Link checkers**: markdown-link-check
- **Accessibility**: pa11y, axe-core
- **Image optimization**: sharp, imagemin
