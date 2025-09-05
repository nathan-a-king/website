import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function generateStaticRoutes() {
  try {
    // Read the posts index to get all post slugs
    const postsIndexPath = path.join(projectRoot, 'public/api/posts-index.json');
    
    if (!fs.existsSync(postsIndexPath)) {
      console.error('Posts index not found. Make sure to run the markdown plugin first.');
      return [];
    }

    const postsIndex = JSON.parse(fs.readFileSync(postsIndexPath, 'utf8'));
    
    // Generate routes
    const routes = [
      '/', // Home page
      '/blog', // Blog listing page
      '/about', // About page
      '/contact', // Contact page
      ...postsIndex.map(post => `/blog/${post.slug}`) // Individual post pages
    ];
    
    return routes;
  } catch (error) {
    console.error('Error generating routes:', error);
    return [];
  }
}

async function generateSitemap(routes, buildDir) {
  const baseUrl = 'https://www.nateking.dev'; // Update with actual domain
  const now = new Date().toISOString();
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${route === '/' ? 'weekly' : route.startsWith('/blog/') ? 'monthly' : 'monthly'}</changefreq>
    <priority>${route === '/' ? '1.0' : route.startsWith('/blog/') ? '0.8' : '0.6'}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(buildDir, 'sitemap.xml'), sitemap);
  console.log('✓ Generated sitemap.xml');
}

async function generateRobotsTxt(buildDir) {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://www.nateking.dev/sitemap.xml`;

  fs.writeFileSync(path.join(buildDir, 'robots.txt'), robotsTxt);
  console.log('✓ Generated robots.txt');
}

async function injectMetaTags() {
  const indexHtmlPath = path.join(projectRoot, 'build/index.html');
  
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('build/index.html not found. Make sure to run the build first.');
    return;
  }

  let html = fs.readFileSync(indexHtmlPath, 'utf8');
  
  // Enhanced meta tags for SEO
  const metaTags = `
  <!-- SEO Meta Tags -->
  <meta name="description" content="Nathan A. King - AI Engineer, Designer, and Developer exploring the intersection of AI, design, and human creativity.">
  <meta name="keywords" content="AI, Machine Learning, Design, Development, Software Engineering, Technology Blog">
  <meta name="author" content="Nathan A. King">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://www.nateking.dev/">
  
  <!-- Open Graph Meta Tags -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Nathan A. King - AI Engineer & Designer">
  <meta property="og:description" content="Exploring the intersection of AI, design, and human creativity. Building the next generation of intelligent interfaces.">
  <meta property="og:url" content="https://www.nateking.dev/">
  <meta property="og:site_name" content="Nathan A. King">
  <meta property="og:image" content="https://www.nateking.dev/og-image.jpg">
  
  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Nathan A. King - AI Engineer & Designer">
  <meta name="twitter:description" content="Exploring the intersection of AI, design, and human creativity.">
  <meta name="twitter:image" content="https://www.nateking.dev/og-image.jpg">
  
  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Nathan A. King",
    "url": "https://www.nateking.dev",
    "sameAs": [
      "https://github.com/nateking-dev",
      "https://linkedin.com/in/nateking-dev"
    ],
    "jobTitle": "AI Engineer & Designer",
    "worksFor": {
      "@type": "Organization",
      "name": "Independent"
    }
  }
  </script>`;

  // Inject meta tags before the closing </head> tag
  html = html.replace('</head>', `${metaTags}\n</head>`);
  
  fs.writeFileSync(indexHtmlPath, html);
  console.log('✓ Enhanced index.html with SEO meta tags');
}

async function prerender() {
  console.log('🚀 Starting pre-rendering process...');
  
  const buildDir = path.join(projectRoot, 'build');
  
  if (!fs.existsSync(buildDir)) {
    console.error('Build directory not found. Run npm run build first.');
    process.exit(1);
  }
  
  try {
    // Generate routes
    const routes = await generateStaticRoutes();
    console.log(`✓ Found ${routes.length} routes to pre-render`);
    
    // Generate sitemap
    await generateSitemap(routes, buildDir);
    
    // Generate robots.txt
    await generateRobotsTxt(buildDir);
    
    // Inject meta tags
    await injectMetaTags();
    
    console.log('✅ Pre-rendering completed successfully!');
    
  } catch (error) {
    console.error('❌ Pre-rendering failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  prerender();
}

export { prerender, generateStaticRoutes };