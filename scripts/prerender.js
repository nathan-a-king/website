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
      '/resume', // Resume page
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

  // Check if meta tags have already been injected (idempotency check)
  if (html.includes('<!-- PRERENDER_META_INJECTED -->')) {
    console.log('✓ Static SEO meta tags already present, skipping injection');
    return;
  }

  // Minimal meta tags that won't conflict with runtime updates
  // Only include static, site-wide meta that doesn't change per route
  const metaTags = `
  <!-- PRERENDER_META_INJECTED -->
  <!-- Static Site-Wide Meta Tags (managed at build time) -->
  <meta name="author" content="Nathan A. King" data-managed="static">
  <meta name="robots" content="index, follow" data-managed="static">
  <meta property="og:site_name" content="Nathan A. King" data-managed="static">
  <meta name="twitter:card" content="summary_large_image" data-managed="static">

  <!-- Structured Data (Person/Author info - static across site) -->
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
  console.log('✓ Enhanced index.html with minimal static SEO meta tags');
  console.log('  (Route-specific meta will be managed by runtime SEO utilities)');
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
