// SEO utilities for dynamic meta tag generation

export function updateDocumentMeta({ title, description, canonical, ogImage, type = 'website' }) {
  // Update document title
  if (title) {
    document.title = title;
  }

  // Helper function to update or create meta tags
  const setMetaTag = (property, content, useProperty = false) => {
    if (!content) return;
    
    const attribute = useProperty ? 'property' : 'name';
    let meta = document.querySelector(`meta[${attribute}="${property}"]`);
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, property);
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  };

  // Update meta description
  setMetaTag('description', description);

  // Update canonical URL
  if (canonical) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);
  }

  // Update Open Graph tags
  setMetaTag('og:title', title, true);
  setMetaTag('og:description', description, true);
  setMetaTag('og:url', canonical, true);
  setMetaTag('og:type', type, true);
  setMetaTag('og:image', ogImage, true);

  // Update Twitter Card tags
  setMetaTag('twitter:title', title);
  setMetaTag('twitter:description', description);
  setMetaTag('twitter:image', ogImage);
}

export function generatePostMeta(post) {
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

export function generatePageMeta(pageName, customDescription) {
  const baseUrl = 'https://www.nateking.dev';
  const descriptions = {
    home: 'Nathan A. King - AI Engineer & Designer exploring the intersection of AI, design, and human creativity.',
    blog: 'Read the latest thoughts and insights on AI, design, and technology by Nathan A. King.',
    about: 'Learn about Nathan A. King, an AI Engineer and Designer passionate about building intelligent interfaces.',
    contact: 'Get in touch with Nathan A. King for collaborations, consulting, or just to say hello.'
  };

  const titles = {
    home: 'Nathan A. King - AI Engineer & Designer',
    blog: 'Blog | Nathan A. King',
    about: 'About | Nathan A. King', 
    contact: 'Contact | Nathan A. King'
  };

  return {
    title: titles[pageName] || `${pageName} | Nathan A. King`,
    description: customDescription || descriptions[pageName] || descriptions.home,
    canonical: pageName === 'home' ? baseUrl : `${baseUrl}/${pageName}`,
    ogImage: `${baseUrl}/og-image.jpg`,
    type: 'website'
  };
}