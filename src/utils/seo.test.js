import { describe, it, expect, beforeEach } from 'vitest';
import { updateDocumentMeta, generatePostMeta, generatePageMeta } from './seo';

describe('updateDocumentMeta', () => {
  beforeEach(() => {
    // Clean up DOM before each test
    document.querySelectorAll('meta[data-managed="runtime"]').forEach(el => el.remove());
    document.querySelectorAll('link[data-managed="runtime"]').forEach(el => el.remove());
    document.title = '';
  });

  describe('Title Updates', () => {
    it('should update document title', () => {
      updateDocumentMeta({ title: 'Test Title' });
      expect(document.title).toBe('Test Title');
    });

    it('should handle empty title gracefully', () => {
      document.title = 'Original Title';
      updateDocumentMeta({ description: 'Test' });
      expect(document.title).toBe('Original Title');
    });
  });

  describe('Meta Tag Creation', () => {
    it('should create meta description tag with data-managed attribute', () => {
      updateDocumentMeta({ description: 'Test description' });

      const meta = document.querySelector('meta[name="description"]');
      expect(meta).toBeTruthy();
      expect(meta.getAttribute('content')).toBe('Test description');
      expect(meta.getAttribute('data-managed')).toBe('runtime');
    });

    it('should create Open Graph meta tags with data-managed attribute', () => {
      updateDocumentMeta({
        title: 'OG Test',
        description: 'OG Description',
        canonical: 'https://example.com',
        ogImage: 'https://example.com/image.jpg',
        type: 'article'
      });

      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const ogUrl = document.querySelector('meta[property="og:url"]');
      const ogType = document.querySelector('meta[property="og:type"]');
      const ogImage = document.querySelector('meta[property="og:image"]');

      expect(ogTitle.getAttribute('content')).toBe('OG Test');
      expect(ogTitle.getAttribute('data-managed')).toBe('runtime');

      expect(ogDescription.getAttribute('content')).toBe('OG Description');
      expect(ogDescription.getAttribute('data-managed')).toBe('runtime');

      expect(ogUrl.getAttribute('content')).toBe('https://example.com');
      expect(ogUrl.getAttribute('data-managed')).toBe('runtime');

      expect(ogType.getAttribute('content')).toBe('article');
      expect(ogType.getAttribute('data-managed')).toBe('runtime');

      expect(ogImage.getAttribute('content')).toBe('https://example.com/image.jpg');
      expect(ogImage.getAttribute('data-managed')).toBe('runtime');
    });

    it('should create Twitter Card meta tags with data-managed attribute', () => {
      updateDocumentMeta({
        title: 'Twitter Test',
        description: 'Twitter Description',
        ogImage: 'https://example.com/twitter.jpg'
      });

      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      const twitterImage = document.querySelector('meta[name="twitter:image"]');

      expect(twitterTitle.getAttribute('content')).toBe('Twitter Test');
      expect(twitterTitle.getAttribute('data-managed')).toBe('runtime');

      expect(twitterDescription.getAttribute('content')).toBe('Twitter Description');
      expect(twitterDescription.getAttribute('data-managed')).toBe('runtime');

      expect(twitterImage.getAttribute('content')).toBe('https://example.com/twitter.jpg');
      expect(twitterImage.getAttribute('data-managed')).toBe('runtime');
    });

    it('should create canonical link with data-managed attribute', () => {
      updateDocumentMeta({ canonical: 'https://example.com/page' });

      const link = document.querySelector('link[rel="canonical"]');
      expect(link).toBeTruthy();
      expect(link.getAttribute('href')).toBe('https://example.com/page');
      expect(link.getAttribute('data-managed')).toBe('runtime');
    });
  });

  describe('Idempotent Updates', () => {
    it('should update existing meta tags without creating duplicates', () => {
      updateDocumentMeta({ description: 'First description' });
      updateDocumentMeta({ description: 'Second description' });

      const metas = document.querySelectorAll('meta[name="description"]');
      expect(metas.length).toBe(1);
      expect(metas[0].getAttribute('content')).toBe('Second description');
      expect(metas[0].getAttribute('data-managed')).toBe('runtime');
    });

    it('should update canonical link without creating duplicates', () => {
      updateDocumentMeta({ canonical: 'https://example.com/first' });
      updateDocumentMeta({ canonical: 'https://example.com/second' });

      const links = document.querySelectorAll('link[rel="canonical"]');
      expect(links.length).toBe(1);
      expect(links[0].getAttribute('href')).toBe('https://example.com/second');
      expect(links[0].getAttribute('data-managed')).toBe('runtime');
    });

    it('should add data-managed to existing meta tags', () => {
      // Simulate a meta tag that exists in static HTML (without data-managed)
      const existingMeta = document.createElement('meta');
      existingMeta.setAttribute('name', 'description');
      existingMeta.setAttribute('content', 'Static content');
      document.head.appendChild(existingMeta);

      // Runtime update should add data-managed attribute
      updateDocumentMeta({ description: 'Updated content' });

      const meta = document.querySelector('meta[name="description"]');
      expect(meta.getAttribute('content')).toBe('Updated content');
      expect(meta.getAttribute('data-managed')).toBe('runtime');

      // Should not create a duplicate
      const metas = document.querySelectorAll('meta[name="description"]');
      expect(metas.length).toBe(1);
    });

    it('should add data-managed to existing canonical link', () => {
      // Simulate a canonical link that exists in static HTML
      const existingLink = document.createElement('link');
      existingLink.setAttribute('rel', 'canonical');
      existingLink.setAttribute('href', 'https://example.com/static');
      document.head.appendChild(existingLink);

      // Runtime update should add data-managed attribute
      updateDocumentMeta({ canonical: 'https://example.com/updated' });

      const link = document.querySelector('link[rel="canonical"]');
      expect(link.getAttribute('href')).toBe('https://example.com/updated');
      expect(link.getAttribute('data-managed')).toBe('runtime');

      // Should not create a duplicate
      const links = document.querySelectorAll('link[rel="canonical"]');
      expect(links.length).toBe(1);
    });

    it('should handle multiple consecutive updates correctly', () => {
      updateDocumentMeta({
        title: 'First',
        description: 'First desc',
        canonical: 'https://example.com/first'
      });

      updateDocumentMeta({
        title: 'Second',
        description: 'Second desc',
        canonical: 'https://example.com/second'
      });

      updateDocumentMeta({
        title: 'Third',
        description: 'Third desc',
        canonical: 'https://example.com/third'
      });

      expect(document.title).toBe('Third');
      expect(document.querySelectorAll('meta[name="description"]').length).toBe(1);
      expect(document.querySelectorAll('link[rel="canonical"]').length).toBe(1);
      expect(document.querySelector('meta[name="description"]').content).toBe('Third desc');
      expect(document.querySelector('link[rel="canonical"]').href).toBe('https://example.com/third');
    });
  });

  describe('Partial Updates', () => {
    it('should skip creating tags when content is undefined', () => {
      updateDocumentMeta({ title: 'Test' });

      expect(document.querySelector('meta[name="description"]')).toBeFalsy();
      expect(document.querySelector('link[rel="canonical"]')).toBeFalsy();
    });

    it('should skip creating tags when content is null', () => {
      updateDocumentMeta({ title: 'Test', description: null, canonical: null });

      expect(document.querySelector('meta[name="description"]')).toBeFalsy();
      expect(document.querySelector('link[rel="canonical"]')).toBeFalsy();
    });

    it('should skip creating tags when content is empty string', () => {
      updateDocumentMeta({ title: 'Test', description: '', canonical: '' });

      expect(document.querySelector('meta[name="description"]')).toBeFalsy();
      expect(document.querySelector('link[rel="canonical"]')).toBeFalsy();
    });
  });

  describe('Default Type Handling', () => {
    it('should default og:type to "website" when not specified', () => {
      updateDocumentMeta({ title: 'Test' });

      const ogType = document.querySelector('meta[property="og:type"]');
      expect(ogType.getAttribute('content')).toBe('website');
    });

    it('should use specified type when provided', () => {
      updateDocumentMeta({ title: 'Test', type: 'article' });

      const ogType = document.querySelector('meta[property="og:type"]');
      expect(ogType.getAttribute('content')).toBe('article');
    });
  });
});

describe('generatePostMeta', () => {
  it('should generate correct meta for blog post', () => {
    const post = {
      slug: 'test-post',
      title: 'Test Post Title',
      excerpt: 'This is a test excerpt'
    };

    const meta = generatePostMeta(post);

    expect(meta.title).toBe('Test Post Title | Nathan A. King');
    expect(meta.description).toBe('This is a test excerpt');
    expect(meta.canonical).toBe('https://www.nateking.dev/blog/test-post');
    expect(meta.ogImage).toBe('https://www.nateking.dev/og-image.jpg');
    expect(meta.type).toBe('article');
  });

  it('should use post firstImage when available', () => {
    const post = {
      slug: 'test-post',
      title: 'Test Post',
      excerpt: 'Test excerpt',
      firstImage: 'https://www.nateking.dev/images/custom-image.jpg'
    };

    const meta = generatePostMeta(post);

    expect(meta.ogImage).toBe('https://www.nateking.dev/images/custom-image.jpg');
  });

  it('should handle post with all fields', () => {
    const post = {
      slug: 'comprehensive-post',
      title: 'Comprehensive Post',
      excerpt: 'Detailed excerpt',
      date: 'January 1, 2024',
      firstImage: 'https://www.nateking.dev/images/post-image.jpg'
    };

    const meta = generatePostMeta(post);

    expect(meta).toEqual({
      title: 'Comprehensive Post | Nathan A. King',
      description: 'Detailed excerpt',
      canonical: 'https://www.nateking.dev/blog/comprehensive-post',
      ogImage: 'https://www.nateking.dev/images/post-image.jpg',
      type: 'article'
    });
  });
});

describe('generatePageMeta', () => {
  it('should generate correct meta for home page', () => {
    const meta = generatePageMeta('home');

    expect(meta.title).toBe('Nathan A. King - AI Engineer & Designer');
    expect(meta.description).toBe('Nathan A. King - AI Engineer & Designer exploring the intersection of AI, design, and human creativity.');
    expect(meta.canonical).toBe('https://www.nateking.dev');
    expect(meta.ogImage).toBe('https://www.nateking.dev/og-image.jpg');
    expect(meta.type).toBe('website');
  });

  it('should generate correct meta for blog page', () => {
    const meta = generatePageMeta('blog');

    expect(meta.title).toBe('Blog | Nathan A. King');
    expect(meta.description).toBe('Read the latest thoughts and insights on AI, design, and technology by Nathan A. King.');
    expect(meta.canonical).toBe('https://www.nateking.dev/blog');
    expect(meta.ogImage).toBe('https://www.nateking.dev/og-image.jpg');
    expect(meta.type).toBe('website');
  });

  it('should generate correct meta for about page', () => {
    const meta = generatePageMeta('about');

    expect(meta.title).toBe('About | Nathan A. King');
    expect(meta.description).toBe('Learn about Nathan A. King, an AI Engineer and Designer passionate about building intelligent interfaces.');
    expect(meta.canonical).toBe('https://www.nateking.dev/about');
  });

  it('should generate correct meta for contact page', () => {
    const meta = generatePageMeta('contact');

    expect(meta.title).toBe('Contact | Nathan A. King');
    expect(meta.description).toBe('Get in touch with Nathan A. King for collaborations, consulting, or just to say hello.');
    expect(meta.canonical).toBe('https://www.nateking.dev/contact');
  });

  it('should use custom description when provided', () => {
    const customDesc = 'Custom page description';
    const meta = generatePageMeta('blog', customDesc);

    expect(meta.description).toBe(customDesc);
  });

  it('should handle unknown page name with fallback', () => {
    const meta = generatePageMeta('unknown-page');

    expect(meta.title).toBe('unknown-page | Nathan A. King');
    expect(meta.description).toBe('Nathan A. King - AI Engineer & Designer exploring the intersection of AI, design, and human creativity.');
    expect(meta.canonical).toBe('https://www.nateking.dev/unknown-page');
  });

  it('should always return type website for page meta', () => {
    expect(generatePageMeta('home').type).toBe('website');
    expect(generatePageMeta('blog').type).toBe('website');
    expect(generatePageMeta('about').type).toBe('website');
  });
});

describe('Integration Tests', () => {
  it('should handle complete page meta flow', () => {
    const pageMeta = generatePageMeta('blog');
    updateDocumentMeta(pageMeta);

    expect(document.title).toBe('Blog | Nathan A. King');
    expect(document.querySelector('meta[name="description"]').content).toBe('Read the latest thoughts and insights on AI, design, and technology by Nathan A. King.');
    expect(document.querySelector('link[rel="canonical"]').href).toBe('https://www.nateking.dev/blog');
    expect(document.querySelector('meta[property="og:type"]').content).toBe('website');
  });

  it('should handle complete post meta flow', () => {
    const post = {
      slug: 'test-post',
      title: 'Integration Test Post',
      excerpt: 'Testing the full flow',
      firstImage: 'https://www.nateking.dev/images/test.jpg'
    };

    const postMeta = generatePostMeta(post);
    updateDocumentMeta(postMeta);

    expect(document.title).toBe('Integration Test Post | Nathan A. King');
    expect(document.querySelector('meta[property="og:type"]').content).toBe('article');
    expect(document.querySelector('meta[property="og:image"]').content).toBe('https://www.nateking.dev/images/test.jpg');
  });

  it('should handle route navigation (page to post to page)', () => {
    // Navigate to home
    const homeMeta = generatePageMeta('home');
    updateDocumentMeta(homeMeta);
    expect(document.querySelector('meta[property="og:type"]').content).toBe('website');

    // Navigate to post
    const postMeta = generatePostMeta({
      slug: 'test',
      title: 'Test',
      excerpt: 'Test'
    });
    updateDocumentMeta(postMeta);
    expect(document.querySelector('meta[property="og:type"]').content).toBe('article');
    expect(document.querySelectorAll('meta[property="og:type"]').length).toBe(1);

    // Navigate back to blog
    const blogMeta = generatePageMeta('blog');
    updateDocumentMeta(blogMeta);
    expect(document.querySelector('meta[property="og:type"]').content).toBe('website');
    expect(document.querySelectorAll('meta[property="og:type"]').length).toBe(1);
  });
});
