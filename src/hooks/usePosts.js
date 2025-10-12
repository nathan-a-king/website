import { useState, useEffect, useCallback } from 'react';

// Simple in-memory cache for posts
const postCache = new Map();
const indexCache = { data: null, timestamp: null };
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function usePostsIndex() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check cache first
        const now = Date.now();
        if (indexCache.data && indexCache.timestamp && (now - indexCache.timestamp) < CACHE_DURATION) {
          setPosts(indexCache.data);
          setLoading(false);
          return;
        }

        const response = await fetch('/api/posts-index.json');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const postsData = await response.json();
        
        // Update cache
        indexCache.data = postsData;
        indexCache.timestamp = now;
        
        setPosts(postsData);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
}

export function usePost(slug) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPost = useCallback(async (postSlug) => {
    if (!postSlug) return;

    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cacheKey = postSlug;
      const cachedPost = postCache.get(cacheKey);
      const now = Date.now();
      
      if (cachedPost && (now - cachedPost.timestamp) < CACHE_DURATION) {
        setPost(cachedPost.data);
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/posts/${postSlug}.json`);
      if (!response.ok) {
        throw new Error(response.status === 404 ? 'Post not found' : 'Failed to fetch post');
      }
      
      const postData = await response.json();
      
      // Update cache
      postCache.set(cacheKey, {
        data: postData,
        timestamp: now
      });
      
      setPost(postData);
    } catch (err) {
      console.error('Error fetching post:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (slug) {
      fetchPost(slug);
    }
  }, [slug, fetchPost]);

  return { post, loading, error, refetch: () => fetchPost(slug) };
}

// Hook for preloading posts (useful for hover states)
export function usePreloadPost() {
  const preloadPost = useCallback(async (slug) => {
    if (!slug) return;
    
    // Check if already cached
    const cachedPost = postCache.get(slug);
    const now = Date.now();
    
    if (cachedPost && (now - cachedPost.timestamp) < CACHE_DURATION) {
      return; // Already cached
    }

    try {
      const response = await fetch(`/api/posts/${slug}.json`);
      if (response.ok) {
        const postData = await response.json();
        postCache.set(slug, {
          data: postData,
          timestamp: now
        });
      }
    } catch (err) {
      // Silently fail for preloading
      console.debug('Preload failed for:', slug, err);
    }
  }, []);

  return { preloadPost };
}