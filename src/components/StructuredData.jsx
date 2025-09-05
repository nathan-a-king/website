import { useEffect } from 'react';

export function BlogPostStructuredData({ post }) {
  useEffect(() => {
    if (!post) return;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "author": {
        "@type": "Person",
        "name": "Nathan A. King",
        "url": "https://www.nateking.dev"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Nathan A. King",
        "url": "https://www.nateking.dev"
      },
      "datePublished": new Date(post.date).toISOString(),
      "dateModified": new Date(post.date).toISOString(),
      "url": `https://www.nateking.dev/blog/${post.slug}`,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://www.nateking.dev/blog/${post.slug}`
      },
      "image": "https://www.nateking.dev/og-image.jpg"
    };

    // Remove existing structured data
    const existing = document.querySelector('script[type="application/ld+json"][data-post]');
    if (existing) {
      existing.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-post', 'true');
    script.textContent = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      const script = document.querySelector('script[type="application/ld+json"][data-post]');
      if (script) {
        script.remove();
      }
    };
  }, [post]);

  return null; // This component doesn't render anything
}

export function BlogListStructuredData({ posts }) {
  useEffect(() => {
    if (!posts || posts.length === 0) return;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Nathan A. King's Blog",
      "description": "Thoughts and insights on AI, design, and technology",
      "url": "https://www.nateking.dev/blog",
      "author": {
        "@type": "Person",
        "name": "Nathan A. King",
        "url": "https://www.nateking.dev"
      },
      "blogPost": posts.slice(0, 10).map(post => ({
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "url": `https://www.nateking.dev/blog/${post.slug}`,
        "datePublished": new Date(post.date).toISOString(),
        "author": {
          "@type": "Person",
          "name": "Nathan A. King"
        }
      }))
    };

    // Remove existing structured data
    const existing = document.querySelector('script[type="application/ld+json"][data-blog-list]');
    if (existing) {
      existing.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-blog-list', 'true');
    script.textContent = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      const script = document.querySelector('script[type="application/ld+json"][data-blog-list]');
      if (script) {
        script.remove();
      }
    };
  }, [posts]);

  return null; // This component doesn't render anything
}