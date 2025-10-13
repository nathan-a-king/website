const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 8080;

// Cache the base HTML file at startup to avoid blocking on every request
const htmlPath = path.join(__dirname, 'build', 'index.html');
let baseHtml;

try {
  baseHtml = fs.readFileSync(htmlPath, 'utf8');
  console.log('✓ Cached base HTML file');
} catch (error) {
  console.error('Failed to load base HTML file:', error);
  process.exit(1);
}

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// Helper function to escape HTML to prevent XSS attacks
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

// Helper function to inject meta tags into HTML
function injectMetaTags(html, meta) {
  // Escape all dynamic content to prevent XSS
  const escapedTitle = escapeHtml(meta.title);
  const escapedDescription = escapeHtml(meta.description);
  const escapedCanonical = escapeHtml(meta.canonical);
  const escapedType = escapeHtml(meta.type);
  const escapedOgImage = escapeHtml(meta.ogImage);

  // Remove existing title tag to prevent duplicates
  html = html.replace(/<title>.*?<\/title>/i, '');

  // Find the closing </head> tag and inject meta tags before it
  const metaTags = `
  <!-- Dynamic SEO Meta Tags (injected server-side) -->
  <meta property="og:title" content="${escapedTitle}" data-managed="server">
  <meta property="og:description" content="${escapedDescription}" data-managed="server">
  <meta property="og:url" content="${escapedCanonical}" data-managed="server">
  <meta property="og:type" content="${escapedType}" data-managed="server">
  <meta property="og:image" content="${escapedOgImage}" data-managed="server">
  <meta name="twitter:title" content="${escapedTitle}" data-managed="server">
  <meta name="twitter:description" content="${escapedDescription}" data-managed="server">
  <meta name="twitter:image" content="${escapedOgImage}" data-managed="server">
  <meta name="description" content="${escapedDescription}" data-managed="server">
  <link rel="canonical" href="${escapedCanonical}" data-managed="server">
  <title>${escapedTitle}</title>
`;

  return html.replace('</head>', `${metaTags}\n</head>`);
}

// Helper function to generate meta tags for a post
function generatePostMeta(post) {
  const baseUrl = 'https://www.nateking.dev';
  const postUrl = `${baseUrl}/blog/${post.slug}`;

  return {
    title: `${post.title} | Nathan A. King`,
    description: post.excerpt,
    canonical: postUrl,
    ogImage: post.firstImage || `${baseUrl}/og-image.jpg`,
    type: 'article'
  };
}

// Helper function to generate meta tags for pages
function generatePageMeta(pageName) {
  const baseUrl = 'https://www.nateking.dev';
  const descriptions = {
    home: 'Nathan A. King - AI Engineer & Designer exploring the intersection of AI, design, and human creativity.',
    blog: 'Read the latest thoughts and insights on AI, design, and technology by Nathan A. King.',
    about: 'Learn about Nathan A. King, an AI Engineer and Designer passionate about building intelligent interfaces.',
    contact: 'Get in touch with Nathan A. King for collaborations, consulting, or just to say hello.',
    resume: 'Resume and professional experience of Nathan A. King - AI Engineer & Designer.'
  };

  const titles = {
    home: 'Nathan A. King - AI Engineer & Designer',
    blog: 'Blog | Nathan A. King',
    about: 'About | Nathan A. King',
    contact: 'Contact | Nathan A. King',
    resume: 'Resume | Nathan A. King'
  };

  return {
    title: titles[pageName] || `${pageName} | Nathan A. King`,
    description: descriptions[pageName] || descriptions.home,
    canonical: pageName === 'home' ? baseUrl : `${baseUrl}/${pageName}`,
    ogImage: `${baseUrl}/og-image.jpg`,
    type: 'website'
  };
}

// Handle React routing - serve index.html with dynamic meta tags for non-asset requests
app.get('*', (req, res) => {
  // If it's a request for a static asset and it doesn't exist, return 404
  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    return res.status(404).send('File not found');
  }

  // Use the cached base HTML (no file I/O on every request)
  let html = baseHtml;

  // Check if this is a blog post route
  const blogPostMatch = req.path.match(/^\/blog\/([^/]+)$/);

  if (blogPostMatch) {
    const slug = blogPostMatch[1];

    // Validate slug to prevent path traversal attacks
    // Only allow alphanumeric characters, hyphens, and underscores
    if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
      // Invalid slug, serve default blog page meta
      const meta = generatePageMeta('blog');
      html = injectMetaTags(html, meta);
      return res.send(html);
    }

    const postPath = path.join(__dirname, 'build', 'api', 'posts', `${slug}.json`);

    // Try to load the post data
    if (fs.existsSync(postPath)) {
      try {
        const post = JSON.parse(fs.readFileSync(postPath, 'utf8'));
        const meta = generatePostMeta(post);
        html = injectMetaTags(html, meta);
      } catch (error) {
        console.error(`Error loading post ${slug}:`, error);
        // Fall back to default meta tags
        const meta = generatePageMeta('blog');
        html = injectMetaTags(html, meta);
      }
    } else {
      // Post not found, use blog page meta
      const meta = generatePageMeta('blog');
      html = injectMetaTags(html, meta);
    }
  } else if (req.path === '/' || req.path === '') {
    const meta = generatePageMeta('home');
    html = injectMetaTags(html, meta);
  } else if (req.path === '/blog') {
    const meta = generatePageMeta('blog');
    html = injectMetaTags(html, meta);
  } else if (req.path === '/about') {
    const meta = generatePageMeta('about');
    html = injectMetaTags(html, meta);
  } else if (req.path === '/contact') {
    const meta = generatePageMeta('contact');
    html = injectMetaTags(html, meta);
  } else if (req.path === '/resume') {
    const meta = generatePageMeta('resume');
    html = injectMetaTags(html, meta);
  } else {
    // Default meta tags for unknown routes
    const meta = generatePageMeta('home');
    html = injectMetaTags(html, meta);
  }

  res.send(html);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
