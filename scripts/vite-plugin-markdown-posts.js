import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';

function markdownPostsPlugin() {
  let config;
  let isDev = false;

  async function generatePostsData() {
    const postsDir = path.join(process.cwd(), 'content/posts');
    const publicDir = path.join(process.cwd(), 'public');
    const apiDir = path.join(publicDir, 'api');
    const postsApiDir = path.join(apiDir, 'posts');

    // Create directories if they don't exist
    if (!fs.existsSync(apiDir)) {
      fs.mkdirSync(apiDir, { recursive: true });
    }
    if (!fs.existsSync(postsApiDir)) {
      fs.mkdirSync(postsApiDir, { recursive: true });
    }

    // Find all markdown files
    const files = await glob('content/posts/*.md');
    
    const posts = [];
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const { data: frontmatter, content: markdownContent } = matter(content);
      
      const slug = frontmatter.slug || path.basename(file, '.md');
      
      // Create post metadata for index
      const postMeta = {
        slug,
        title: frontmatter.title,
        date: frontmatter.date,
        excerpt: frontmatter.excerpt
      };
      
      posts.push(postMeta);
      
      // Create individual post JSON file
      const postData = {
        ...postMeta,
        content: markdownContent
      };
      
      fs.writeFileSync(
        path.join(postsApiDir, `${slug}.json`),
        JSON.stringify(postData, null, 2)
      );
    }
    
    // Sort posts by date (newest first)
    posts.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
    
    // Write posts index
    fs.writeFileSync(
      path.join(apiDir, 'posts-index.json'),
      JSON.stringify(posts, null, 2)
    );
    
    console.log(`✓ Generated ${posts.length} blog posts`);
    return posts;
  }

  return {
    name: 'vite-plugin-markdown-posts',
    
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      isDev = config.command === 'serve';
    },
    
    async buildStart() {
      // Generate posts data on build start
      await generatePostsData();
      
      if (isDev) {
        // Watch content directory for changes
        const contentDir = path.join(process.cwd(), 'content/posts');
        this.addWatchFile(contentDir);
        
        // Watch all markdown files
        const files = await glob('content/posts/*.md');
        files.forEach(file => {
          this.addWatchFile(path.resolve(file));
        });
      }
    },
    
    async handleHotUpdate({ file, server }) {
      // Regenerate posts data when markdown files change
      if (file.includes('content/posts') && file.endsWith('.md')) {
        console.log('Markdown file changed, regenerating posts...');
        await generatePostsData();
        
        // Trigger full reload to update the app
        server.ws.send({
          type: 'full-reload'
        });
      }
    }
  };
}

export default markdownPostsPlugin;