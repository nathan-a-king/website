import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card.jsx';
import { CalendarDays } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { usePreloadPost } from '../hooks/usePosts';

// Post card skeleton
const PostCardSkeleton = () => (
  <Card className="border border-brand-border shadow-card bg-brand-bg p-6">
    <CardContent className="p-0 animate-pulse">
      <div className="h-6 bg-brand-soft dark:bg-white/5 rounded mb-3"></div>
      <div className="h-4 bg-brand-soft dark:bg-white/5 rounded mb-2 w-24"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-brand-soft dark:bg-white/5 rounded"></div>
        <div className="h-4 bg-brand-soft dark:bg-white/5 rounded w-5/6"></div>
      </div>
      <div className="h-4 bg-brand-soft dark:bg-white/5 rounded w-20"></div>
    </CardContent>
  </Card>
);

// Actual post card content
const PostCardContent = ({ post, preloadPost }) => (
  <Card className="border border-brand-border hover:border-brand-terracotta/30 dark:hover:border-brand-terracotta/40 shadow-card bg-brand-bg p-6 transition-all duration-200">
    <CardContent className="p-0">
      <Link
        to={`/blog/${post.slug}`}
        className="block group"
        onMouseEnter={() => preloadPost(post.slug)}
        onFocus={() => preloadPost(post.slug)}
      >
        <h2 className="text-2xl font-serif font-normal mb-3 text-brand-text-primary group-hover:text-brand-terracotta dark:group-hover:text-brand-terracotta transition-colors">
          {post.title}
        </h2>
        <div className="flex items-center text-sm text-brand-gray-light dark:text-brand-gray-light mb-3">
          <CalendarDays className="w-4 h-4 mr-2" />
          <span>{post.date}</span>
        </div>
        <p className="text-brand-text-secondary leading-relaxed mb-4">
          {post.excerpt}
        </p>
        <span className="text-brand-text-primary text-sm font-medium group-hover:text-brand-terracotta dark:group-hover:text-brand-terracotta transition-colors">
          Read more →
        </span>
      </Link>
    </CardContent>
  </Card>
);

export default function LazyPostCard({ post, index }) {
  const [ref, isIntersecting, hasIntersected] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  });
  const { preloadPost } = usePreloadPost();

  return (
    <div 
      ref={ref}
      className={`transition-opacity duration-500 ease-in-out opacity-0 animate-fadeIn`} 
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
    >
      {hasIntersected ? (
        <PostCardContent post={post} preloadPost={preloadPost} />
      ) : (
        <PostCardSkeleton />
      )}
    </div>
  );
}
