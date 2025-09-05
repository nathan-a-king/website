import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function createNewPost(title, excerpt) {
  if (!title) {
    console.error('❌ Please provide a post title');
    console.log('Usage: npm run new-post "Your Post Title" "Optional excerpt"');
    process.exit(1);
  }

  const slug = slugify(title);
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  });

  const defaultExcerpt = excerpt || `A new post about ${title.toLowerCase()}.`;
  
  // Read template and replace placeholders
  const templatePath = path.join(__dirname, 'post-template.md');
  let content = fs.readFileSync(templatePath, 'utf8');
  
  // Replace template placeholders
  content = content
    .replace('your-post-slug', slug)
    .replace('Your Post Title', title)
    .replace('December 15, 2024', date)
    .replace('A brief description of your post content for previews and SEO. Keep it under 160 characters for optimal SEO.', defaultExcerpt);

  const filename = `${slug}.md`;
  const filepath = path.join(projectRoot, 'content/posts', filename);
  
  // Check if file already exists
  if (fs.existsSync(filepath)) {
    console.error(`❌ Post with slug "${slug}" already exists`);
    process.exit(1);
  }

  // Create the file
  fs.writeFileSync(filepath, content);
  
  console.log(`✅ Created new post: ${filename}`);
  console.log(`📝 Edit the file at: content/posts/${filename}`);
  console.log(`🚀 Start dev server: npm run dev`);
  console.log(`🔗 URL will be: /blog/${slug}`);
}

// Get command line arguments
const args = process.argv.slice(2);
const title = args[0];
const excerpt = args[1];

createNewPost(title, excerpt);