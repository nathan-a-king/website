import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { BlogPostStructuredData, BlogListStructuredData } from '../StructuredData';

describe('BlogPostStructuredData', () => {
  beforeEach(() => {
    // Clean up any existing structured data scripts
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());
  });

  afterEach(() => {
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());
  });

  const mockPost = {
    slug: 'test-post',
    title: 'Test Post Title',
    excerpt: 'This is a test post excerpt',
    date: 'January 1, 2024',
  };

  it('should not render any visible content', () => {
    const { container } = render(<BlogPostStructuredData post={mockPost} />);

    expect(container.firstChild).toBeNull();
  });

  it('should inject JSON-LD script into document head', () => {
    render(<BlogPostStructuredData post={mockPost} />);

    const script = document.querySelector('script[type="application/ld+json"][data-post]');
    expect(script).toBeInTheDocument();
  });

  it('should generate correct BlogPosting schema', () => {
    render(<BlogPostStructuredData post={mockPost} />);

    const script = document.querySelector('script[type="application/ld+json"][data-post]');
    const structuredData = JSON.parse(script.textContent);

    expect(structuredData['@context']).toBe('https://schema.org');
    expect(structuredData['@type']).toBe('BlogPosting');
    expect(structuredData.headline).toBe('Test Post Title');
    expect(structuredData.description).toBe('This is a test post excerpt');
  });

  it('should include author information', () => {
    render(<BlogPostStructuredData post={mockPost} />);

    const script = document.querySelector('script[type="application/ld+json"][data-post]');
    const structuredData = JSON.parse(script.textContent);

    expect(structuredData.author).toEqual({
      '@type': 'Person',
      name: 'Nathan A. King',
      url: 'https://www.nateking.dev',
    });
  });

  it('should include publisher information', () => {
    render(<BlogPostStructuredData post={mockPost} />);

    const script = document.querySelector('script[type="application/ld+json"][data-post]');
    const structuredData = JSON.parse(script.textContent);

    expect(structuredData.publisher).toEqual({
      '@type': 'Organization',
      name: 'Nathan A. King',
      url: 'https://www.nateking.dev',
    });
  });

  it('should include correct URL', () => {
    render(<BlogPostStructuredData post={mockPost} />);

    const script = document.querySelector('script[type="application/ld+json"][data-post]');
    const structuredData = JSON.parse(script.textContent);

    expect(structuredData.url).toBe('https://www.nateking.dev/blog/test-post');
    expect(structuredData.mainEntityOfPage).toEqual({
      '@type': 'WebPage',
      '@id': 'https://www.nateking.dev/blog/test-post',
    });
  });

  it('should include date information in ISO format', () => {
    render(<BlogPostStructuredData post={mockPost} />);

    const script = document.querySelector('script[type="application/ld+json"][data-post]');
    const structuredData = JSON.parse(script.textContent);

    expect(structuredData.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(structuredData.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('should include image', () => {
    render(<BlogPostStructuredData post={mockPost} />);

    const script = document.querySelector('script[type="application/ld+json"][data-post]');
    const structuredData = JSON.parse(script.textContent);

    expect(structuredData.image).toBe('https://www.nateking.dev/og-image.jpg');
  });

  it('should remove existing structured data before adding new', () => {
    const { rerender } = render(<BlogPostStructuredData post={mockPost} />);

    expect(document.querySelectorAll('script[type="application/ld+json"][data-post]').length).toBe(1);

    const newPost = { ...mockPost, title: 'New Title' };
    rerender(<BlogPostStructuredData post={newPost} />);

    expect(document.querySelectorAll('script[type="application/ld+json"][data-post]').length).toBe(1);

    const script = document.querySelector('script[type="application/ld+json"][data-post]');
    const structuredData = JSON.parse(script.textContent);
    expect(structuredData.headline).toBe('New Title');
  });

  it('should cleanup script on unmount', () => {
    const { unmount } = render(<BlogPostStructuredData post={mockPost} />);

    expect(document.querySelector('script[type="application/ld+json"][data-post]')).toBeInTheDocument();

    unmount();

    expect(document.querySelector('script[type="application/ld+json"][data-post]')).not.toBeInTheDocument();
  });

  it('should not render script when post is null', () => {
    render(<BlogPostStructuredData post={null} />);

    expect(document.querySelector('script[type="application/ld+json"][data-post]')).not.toBeInTheDocument();
  });

  it('should not render script when post is undefined', () => {
    render(<BlogPostStructuredData />);

    expect(document.querySelector('script[type="application/ld+json"][data-post]')).not.toBeInTheDocument();
  });
});

describe('BlogListStructuredData', () => {
  beforeEach(() => {
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());
  });

  afterEach(() => {
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());
  });

  const mockPosts = [
    {
      slug: 'post-1',
      title: 'Post 1',
      excerpt: 'Excerpt 1',
      date: 'January 1, 2024',
    },
    {
      slug: 'post-2',
      title: 'Post 2',
      excerpt: 'Excerpt 2',
      date: 'January 2, 2024',
    },
    {
      slug: 'post-3',
      title: 'Post 3',
      excerpt: 'Excerpt 3',
      date: 'January 3, 2024',
    },
  ];

  it('should not render any visible content', () => {
    const { container } = render(<BlogListStructuredData posts={mockPosts} />);

    expect(container.firstChild).toBeNull();
  });

  it('should inject JSON-LD script into document head', () => {
    render(<BlogListStructuredData posts={mockPosts} />);

    const script = document.querySelector('script[type="application/ld+json"][data-blog-list]');
    expect(script).toBeInTheDocument();
  });

  it('should generate correct Blog schema', () => {
    render(<BlogListStructuredData posts={mockPosts} />);

    const script = document.querySelector('script[type="application/ld+json"][data-blog-list]');
    const structuredData = JSON.parse(script.textContent);

    expect(structuredData['@context']).toBe('https://schema.org');
    expect(structuredData['@type']).toBe('Blog');
    expect(structuredData.name).toBe("Nathan A. King's Blog");
    expect(structuredData.description).toBe('Thoughts and insights on AI, design, and technology');
    expect(structuredData.url).toBe('https://www.nateking.dev/blog');
  });

  it('should include author information', () => {
    render(<BlogListStructuredData posts={mockPosts} />);

    const script = document.querySelector('script[type="application/ld+json"][data-blog-list]');
    const structuredData = JSON.parse(script.textContent);

    expect(structuredData.author).toEqual({
      '@type': 'Person',
      name: 'Nathan A. King',
      url: 'https://www.nateking.dev',
    });
  });

  it('should include blog posts', () => {
    render(<BlogListStructuredData posts={mockPosts} />);

    const script = document.querySelector('script[type="application/ld+json"][data-blog-list]');
    const structuredData = JSON.parse(script.textContent);

    expect(structuredData.blogPost).toHaveLength(3);
    expect(structuredData.blogPost[0]['@type']).toBe('BlogPosting');
    expect(structuredData.blogPost[0].headline).toBe('Post 1');
    expect(structuredData.blogPost[0].description).toBe('Excerpt 1');
  });

  it('should limit to 10 posts maximum', () => {
    const manyPosts = Array.from({ length: 15 }, (_, i) => ({
      slug: `post-${i}`,
      title: `Post ${i}`,
      excerpt: `Excerpt ${i}`,
      date: 'January 1, 2024',
    }));

    render(<BlogListStructuredData posts={manyPosts} />);

    const script = document.querySelector('script[type="application/ld+json"][data-blog-list]');
    const structuredData = JSON.parse(script.textContent);

    expect(structuredData.blogPost).toHaveLength(10);
  });

  it('should include correct URLs for each post', () => {
    render(<BlogListStructuredData posts={mockPosts} />);

    const script = document.querySelector('script[type="application/ld+json"][data-blog-list]');
    const structuredData = JSON.parse(script.textContent);

    expect(structuredData.blogPost[0].url).toBe('https://www.nateking.dev/blog/post-1');
    expect(structuredData.blogPost[1].url).toBe('https://www.nateking.dev/blog/post-2');
  });

  it('should convert dates to ISO format', () => {
    render(<BlogListStructuredData posts={mockPosts} />);

    const script = document.querySelector('script[type="application/ld+json"][data-blog-list]');
    const structuredData = JSON.parse(script.textContent);

    expect(structuredData.blogPost[0].datePublished).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('should cleanup script on unmount', () => {
    const { unmount } = render(<BlogListStructuredData posts={mockPosts} />);

    expect(document.querySelector('script[type="application/ld+json"][data-blog-list]')).toBeInTheDocument();

    unmount();

    expect(document.querySelector('script[type="application/ld+json"][data-blog-list]')).not.toBeInTheDocument();
  });

  it('should not render script when posts is null', () => {
    render(<BlogListStructuredData posts={null} />);

    expect(document.querySelector('script[type="application/ld+json"][data-blog-list]')).not.toBeInTheDocument();
  });

  it('should not render script when posts is empty array', () => {
    render(<BlogListStructuredData posts={[]} />);

    expect(document.querySelector('script[type="application/ld+json"][data-blog-list]')).not.toBeInTheDocument();
  });

  it('should remove existing structured data before adding new', () => {
    const { rerender } = render(<BlogListStructuredData posts={mockPosts} />);

    expect(document.querySelectorAll('script[type="application/ld+json"][data-blog-list]').length).toBe(1);

    const newPosts = [{ ...mockPosts[0], title: 'Updated Post 1' }];
    rerender(<BlogListStructuredData posts={newPosts} />);

    expect(document.querySelectorAll('script[type="application/ld+json"][data-blog-list]').length).toBe(1);

    const script = document.querySelector('script[type="application/ld+json"][data-blog-list]');
    const structuredData = JSON.parse(script.textContent);
    expect(structuredData.blogPost[0].headline).toBe('Updated Post 1');
  });
});
