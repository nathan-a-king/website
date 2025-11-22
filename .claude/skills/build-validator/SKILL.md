---
name: build-validator
description: Validate production builds, check bundle sizes, verify deployment readiness. Use when building for production, validating build output, checking bundle optimization, testing production server, or preparing for deployment.
---

# Build Validator

Specialized skill for validating production builds of this React/Vite-based website. Ensures builds are complete, optimized, and ready for deployment.

## Quick Start

### Build and Validate

Run the complete build and validation process:

```bash
npm run build:validate
```

This runs:
1. `npm run build` - Production build with Vite
2. `npm run validate` - Validates build output

### Build Only

```bash
npm run build
```

Output goes to `build/` directory (not `dist/`).

### Validate Existing Build

```bash
npm run validate
```

or directly:

```bash
node scripts/validate-build.js
```

## Build Configuration

### Vite Configuration

Build is configured in `vite.config.js` with:

**Manual chunk splitting**:
- `vendor` - React, React DOM
- `router` - React Router
- `markdown` - react-markdown
- `syntax` - react-syntax-highlighter
- `icons` - lucide-react

**Asset organization**:
- CSS → `assets/css/`
- Images → `assets/images/`
- JS → `assets/`

**Optimization**:
- Minification: Terser
- Drop console.log in production
- CSS code splitting enabled
- Chunk size warning limit: 1MB

### Build Output Structure

```
build/
├── index.html              # Main HTML with static SEO tags
├── sitemap.xml             # Auto-generated sitemap
├── robots.txt              # Auto-generated robots.txt
├── api/
│   ├── posts-index.json    # All posts metadata
│   └── posts/
│       └── {slug}.json     # Individual post content
└── assets/
    ├── css/                # Stylesheet chunks
    ├── images/             # Image assets
    └── *.js                # JavaScript chunks
```

## Validation Checks

The existing validator (`scripts/validate-build.js`) checks:

### Required Files
- ✅ `index.html` - Main HTML file
- ✅ `sitemap.xml` - Sitemap for SEO
- ✅ `robots.txt` - Robots file
- ✅ `api/posts-index.json` - Posts API

### Required Directories
- ✅ `assets/` - Asset directory
- ✅ `api/` - API directory
- ✅ `api/posts/` - Individual post files

### SEO Meta Tags
- ✅ Twitter card meta tag
- ✅ Structured data (JSON-LD)
- ✅ Open Graph site name
- ✅ Author meta tag

### Structured Data Validation
- ✅ Valid JSON-LD syntax
- ✅ Required `@context` field
- ✅ Required `@type` field

### Post Files
- ✅ Counts JSON files in `api/posts/`
- ✅ Verifies posts were generated

### Sitemap
- ✅ Validates sitemap exists
- ✅ Counts URLs in sitemap

## Bundle Analysis

### Analyze Bundle Size

Build with bundle analysis:

```bash
npm run build:analyze
```

This runs Vite build with `ANALYZE=true` environment variable. If you have rollup-plugin-visualizer configured, it will generate a bundle visualization.

### Manual Bundle Check

Use the bundled script to track bundle sizes:

```bash
node .claude/skills/build-validator/scripts/bundle-analysis.js
```

This script:
- Scans `build/assets/` directory
- Measures file sizes for each chunk
- Compares to historical baselines (if available)
- Flags size regressions
- Generates a size report

### Bundle Size Thresholds

See [THRESHOLDS.md](THRESHOLDS.md) for recommended limits:
- Vendor chunk: < 200 KB
- Router chunk: < 100 KB
- Markdown chunk: < 150 KB
- Syntax highlighter: < 300 KB (largest due to language support)
- Icons chunk: < 50 KB

## Production Server Testing

### Start Production Server

```bash
npm start
```

Runs `server.js` on port 8080 (or `PORT` env var).

### Health Check

Use the health check script to test server endpoints:

```bash
node .claude/skills/build-validator/scripts/health-check.js
```

This checks:
- ✅ Server responds on configured port
- ✅ Home page (`/`) returns 200
- ✅ Blog page (`/blog`) returns 200
- ✅ About page (`/about`) returns 200
- ✅ API endpoints (`/api/posts-index.json`) return valid JSON
- ✅ SPA routing works (404s fallback to index.html)
- ✅ Static assets load correctly

### Manual Server Testing

```bash
# Start server in one terminal
npm start

# In another terminal, test endpoints
curl http://localhost:8080/
curl http://localhost:8080/blog
curl http://localhost:8080/api/posts-index.json
curl http://localhost:8080/blog/some-post-slug
```

## Preview Build Locally

Preview the production build before deploying:

```bash
npm run preview
```

This uses Vite's preview server on port 3000.

## Build Pipeline

### Full Build Pipeline

```bash
# 1. Build production version
npm run build

# 2. Validate build output
npm run validate

# 3. Test production server
npm start

# 4. Health check (in separate terminal)
node .claude/skills/build-validator/scripts/health-check.js
```

Or use the combined command:

```bash
npm run build:validate
```

### CI/CD Integration

For automated deployments, ensure all checks pass:

```bash
#!/bin/bash
set -e  # Exit on error

echo "Running build and validation..."
npm run build
npm run validate

echo "Starting server for health checks..."
npm start &
SERVER_PID=$!

# Wait for server to start
sleep 3

echo "Running health checks..."
node .claude/skills/build-validator/scripts/health-check.js

# Stop server
kill $SERVER_PID

echo "✅ All checks passed! Ready to deploy."
```

## Troubleshooting

### Build Fails

1. **Check for TypeScript/JavaScript errors**:
   ```bash
   # Clear cache and rebuild
   rm -rf node_modules/.vite
   npm run build
   ```

2. **Check markdown processing**:
   - Validate all post frontmatter
   - Ensure no malformed YAML
   - Check for syntax errors in markdown

3. **Check for missing dependencies**:
   ```bash
   npm install
   npm run build
   ```

### Validation Fails

1. **Missing files**: Check Vite plugins are configured:
   - `markdownPostsPlugin()` for post processing
   - `prerenderPlugin()` for sitemap/robots.txt

2. **Missing SEO tags**: Check `scripts/prerender.js` is running correctly

3. **Structured data invalid**: Validate JSON-LD in `index.html`

### Bundle Too Large

1. **Identify large chunks**:
   ```bash
   npm run build:analyze
   ```

2. **Check for duplicate dependencies**:
   ```bash
   npm ls
   ```

3. **Consider code splitting**: Add more manual chunks in `vite.config.js`

4. **Lazy load heavy components**: Use React.lazy() for large components

### Server Won't Start

1. **Check port availability**:
   ```bash
   lsof -i :8080
   ```

2. **Try different port**:
   ```bash
   PORT=3000 npm start
   ```

3. **Check build exists**:
   ```bash
   ls -la build/
   ```

## Performance Optimization

### Recommended Optimizations

1. **Image optimization**: Use WebP format, responsive images
2. **Font loading**: Preload critical fonts, use font-display: swap
3. **CSS optimization**: Remove unused CSS, critical CSS inline
4. **JavaScript**: Tree shaking, code splitting, lazy loading
5. **Caching**: Leverage browser caching with versioned assets

### Core Web Vitals Targets

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Bundle Size Best Practices

- Keep vendor chunk under 200 KB
- Lazy load syntax highlighter on code blocks
- Use dynamic imports for heavy features
- Monitor bundle size trends over time

## Scripts Reference

### NPM Scripts

- `npm run build` - Production build
- `npm run build:analyze` - Build with analysis
- `npm run build:validate` - Build + validate
- `npm run validate` - Validate existing build
- `npm start` - Start production server
- `npm run preview` - Preview build locally

### Custom Scripts

- `scripts/validate-build.js` - Core validation logic
- `.claude/skills/build-validator/scripts/bundle-analysis.js` - Bundle size tracking
- `.claude/skills/build-validator/scripts/health-check.js` - Server health checks

## Integration with Other Skills

- **content-quality-checker**: Validate content before building
- **seo-metadata-manager**: Ensure SEO tags are correct
- **blog-post-manager**: Validate posts before build
- **performance-monitor**: Track Core Web Vitals

## Files and References

- `vite.config.js` - Build configuration
- `server.js` - Production Express server
- `scripts/validate-build.js` - Build validation
- `scripts/prerender.js` - Sitemap and SEO generation
- `scripts/vite-plugin-markdown-posts.js` - Markdown processor
- `scripts/vite-plugin-prerender.js` - Prerender plugin
- `.claude/skills/build-validator/THRESHOLDS.md` - Size thresholds
