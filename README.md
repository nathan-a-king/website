# Personal Website

A modern personal website and blog built with React, Vite, and Tailwind CSS.

## Tech Stack

- **React 19** - Modern functional components with hooks
- **Vite** - Fast build tool with optimized chunk splitting
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling with dark mode
- **Express** - Production server with SPA routing
- **Markdown** - Blog content management

## Features

- 🌓 Dark mode with system preference detection
- 📝 Markdown-based blog with syntax highlighting
- 🚀 Optimized build with manual chunk splitting
- 📱 Fully responsive design
- 🔍 SEO-friendly with pre-rendered sitemap and meta tags
- ⚡ Client-side caching for improved performance
- 🎨 Claude.ai-inspired design system with warm aesthetics

## Design System

This project uses a comprehensive design system inspired by Claude.ai's visual aesthetic. Key features:

- **Warm Color Palette** - Cream backgrounds with terracotta accents
- **Dual Typography** - Serif headings (Georgia) + Sans UI (Avenir)
- **CSS Custom Properties** - Single source of truth for colors with automatic dark mode
- **Consistent Patterns** - Unified borders, shadows, and spacing
- **Accessibility** - WCAG AA compliant with proper focus states

**📖 See [DESIGN.md](DESIGN.md) for complete design system documentation**

Additional resources:
- [COLOR_SYSTEM.md](COLOR_SYSTEM.md) - Color architecture and usage guide
- [tailwind.config.js](tailwind.config.js) - Tailwind configuration
- [src/styles/globals.css](src/styles/globals.css) - CSS custom properties

## Development

```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview

# Start production server (port 8080)
npm start
```

## Project Structure

```
├── content/posts/        # Markdown blog posts
├── public/              # Static assets
├── scripts/             # Build scripts and plugins
├── src/
│   ├── components/      # React components
│   ├── contexts/        # React contexts (theme, etc.)
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Route-level components
│   ├── styles/         # CSS files
│   └── utils/          # Utility functions
├── server.js           # Production Express server
└── vite.config.js      # Vite configuration
```

## Adding Blog Posts

Create a new markdown file in `content/posts/`:

```bash
npm run new-post "Post Title" "Optional excerpt"
```

Or manually create `content/posts/my-post.md`:

```markdown
---
slug: my-post
title: "My Post Title"
date: December 15, 2024
excerpt: "Brief description for previews and SEO."
---

Your markdown content here...
```

## Build & Deployment

```bash
# Build with validation
npm run build:validate

# Analyze bundle size
npm run build:analyze

# Validate build output
npm run validate
```

The build process:
1. Processes markdown posts into JSON APIs
2. Generates optimized production bundles
3. Creates sitemap.xml and robots.txt
4. Pre-renders SEO meta tags

## Configuration

- **DESIGN.md** - Complete design system documentation
- **COLOR_SYSTEM.md** - Color architecture and migration guide
- **CLAUDE.md** - Instructions for Claude Code
- **vite.config.js** - Build configuration and plugins
- **tailwind.config.js** - Tailwind and dark mode settings
- **server.js** - Production server configuration

## License

MIT