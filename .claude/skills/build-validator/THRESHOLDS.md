# Bundle Size Thresholds

Recommended maximum sizes for JavaScript chunks and assets.

## JavaScript Chunks

Based on the manual chunk configuration in `vite.config.js`:

### Vendor Chunk (React + React DOM)
- **Target**: < 150 KB (gzipped)
- **Max**: < 200 KB (gzipped)
- **Description**: React core libraries
- **Note**: This is the foundation, should remain stable

### Router Chunk (React Router)
- **Target**: < 50 KB (gzipped)
- **Max**: < 100 KB (gzipped)
- **Description**: React Router DOM
- **Note**: Routing logic, relatively stable

### Markdown Chunk (react-markdown)
- **Target**: < 100 KB (gzipped)
- **Max**: < 150 KB (gzipped)
- **Description**: Markdown rendering
- **Note**: Includes markdown parser and renderer

### Syntax Highlighter Chunk
- **Target**: < 250 KB (gzipped)
- **Max**: < 300 KB (gzipped)
- **Description**: Code syntax highlighting
- **Note**: Largest chunk due to language support, consider lazy loading

### Icons Chunk (lucide-react)
- **Target**: < 30 KB (gzipped)
- **Max**: < 50 KB (gzipped)
- **Description**: Icon library
- **Note**: Only includes imported icons, not full library

## Total Bundle Size

- **Initial Load**: < 500 KB (gzipped) for critical path
- **Total (all chunks)**: < 800 KB (gzipped)
- **Initial Load Time (3G)**: < 3 seconds

## CSS Files

- **Main CSS**: < 50 KB (gzipped)
- **Tailwind CSS**: Should be purged in production
- **Total CSS**: < 75 KB (gzipped)

## Performance Budgets

### By Network Condition

**Fast 3G** (1.4 Mbps):
- Time to Interactive: < 5s
- First Contentful Paint: < 2s

**4G** (4 Mbps):
- Time to Interactive: < 3s
- First Contentful Paint: < 1s

**Desktop Broadband** (10+ Mbps):
- Time to Interactive: < 2s
- First Contentful Paint: < 0.5s

## Image Assets

### Per Image
- **Hero images**: < 200 KB
- **Thumbnail images**: < 50 KB
- **Icon images**: < 10 KB
- **Favicons**: < 5 KB

### Formats
- Prefer WebP over JPEG/PNG
- Use responsive images with srcset
- Lazy load images below the fold

## Monitoring Strategy

### When to Act

**Warning Threshold** (investigate):
- Any chunk grows > 10% from baseline
- Total bundle exceeds 600 KB

**Critical Threshold** (must fix):
- Any chunk exceeds max threshold
- Total bundle exceeds 800 KB
- Initial load > 500 KB

### Regular Checks

1. **Every build**: Track bundle sizes
2. **Before merge**: Compare to main branch
3. **Weekly**: Review size trends
4. **After dependency updates**: Check for size changes

## Optimization Strategies

### When Vendor Chunk is Too Large

1. Check if React is duplicated
2. Consider using Preact for smaller builds
3. Verify tree shaking is working
4. Check for inadvertent imports of dev builds

### When Markdown Chunk is Too Large

1. Lazy load markdown renderer on blog pages only
2. Consider lighter markdown library
3. Check if full library is imported vs components

### When Syntax Highlighter is Too Large

1. **Lazy load on code blocks**: Only load when code is present
2. **Limit languages**: Include only used languages
3. **Use lighter themes**: Reduce theme complexity
4. **Consider alternatives**: Use lighter syntax highlighting library

### When Icons Chunk is Too Large

1. Verify only used icons are imported
2. Check for full library import
3. Consider inline small icons as SVG
4. Use icon sprite sheet

## Historical Baseline

Record initial sizes to track changes:

```bash
# After first build, save baseline
node .claude/skills/build-validator/scripts/bundle-analysis.js --save-baseline
```

**Baseline (as of Jan 2025)**:
- Vendor: ~145 KB (gzipped)
- Router: ~45 KB (gzipped)
- Markdown: ~95 KB (gzipped)
- Syntax: ~280 KB (gzipped)
- Icons: ~25 KB (gzipped)
- **Total**: ~590 KB (gzipped)

## Acceptable Growth

- **Minor version updates**: +5% acceptable
- **Major features**: +10% acceptable with justification
- **New dependencies**: Require bundle analysis before adding

## Related Metrics

### Lighthouse Scores
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 95

### Core Web Vitals
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

### Network Timing
- TTFB (Time to First Byte): < 600ms
- FCP (First Contentful Paint): < 1.8s
- TTI (Time to Interactive): < 3.8s
