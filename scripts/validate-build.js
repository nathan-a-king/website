import fs from 'fs';
import path from 'path';

const buildDir = path.join(process.cwd(), 'build');

function validateBuild() {
  console.log('🔍 Validating build output...');
  
  const requiredFiles = [
    'index.html',
    'sitemap.xml', 
    'robots.txt',
    'api/posts-index.json'
  ];
  
  const requiredDirs = [
    'assets',
    'api',
    'api/posts'
  ];
  
  // Check required files
  for (const file of requiredFiles) {
    const filePath = path.join(buildDir, file);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Missing required file: ${file}`);
      process.exit(1);
    }
    console.log(`✅ Found: ${file}`);
  }
  
  // Check required directories
  for (const dir of requiredDirs) {
    const dirPath = path.join(buildDir, dir);
    if (!fs.existsSync(dirPath) || !fs.lstatSync(dirPath).isDirectory()) {
      console.error(`❌ Missing required directory: ${dir}`);
      process.exit(1);
    }
    console.log(`✅ Directory exists: ${dir}`);
  }
  
  // Check posts
  const postsDir = path.join(buildDir, 'api/posts');
  const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.json'));
  console.log(`✅ Found ${postFiles.length} post files`);
  
  // Validate index.html has static SEO tags
  // Note: Route-specific tags (og:title, og:description, canonical, etc.)
  // are managed by runtime SEO utilities
  const indexPath = path.join(buildDir, 'index.html');
  const indexContent = fs.readFileSync(indexPath, 'utf8');

  const staticSeoChecks = [
    { check: 'twitter:card', description: 'Twitter Card type' },
    { check: 'application/ld+json', description: 'Structured data' },
    { check: 'og:site_name', description: 'Open Graph site name' },
    { check: 'name="author"', description: 'Author meta tag' }
  ];

  for (const { check, description } of staticSeoChecks) {
    if (!indexContent.includes(check)) {
      console.error(`❌ Missing static SEO element: ${description} (${check})`);
      process.exit(1);
    }
  }
  console.log('✅ Static SEO meta tags present');
  console.log('   (Route-specific meta managed by runtime)');
  
  // Check sitemap
  const sitemapPath = path.join(buildDir, 'sitemap.xml');
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  const urlCount = (sitemapContent.match(/<loc>/g) || []).length;
  console.log(`✅ Sitemap contains ${urlCount} URLs`);
  
  console.log('🎉 Build validation completed successfully!');
}

// Run validation
validateBuild();