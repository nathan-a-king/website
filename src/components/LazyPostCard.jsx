import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card.jsx';
import { CalendarDays } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { usePreloadPost } from '../hooks/usePosts';

// Post card skeleton
const PostCardSkeleton = () => (
  <Card className="border border-brand-charcoal/10 dark:border-brand-charcoal/40 shadow-sm bg-white dark:bg-brand-ink/45 p-6">
    <CardContent className="p-0 animate-pulse">
      <div className="h-6 bg-brand-highlight/80 dark:bg-brand-charcoal/45 rounded mb-3"></div>
      <div className="h-4 bg-brand-highlight/80 dark:bg-brand-charcoal/45 rounded mb-2 w-24"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-brand-highlight/80 dark:bg-brand-charcoal/45 rounded"></div>
        <div className="h-4 bg-brand-highlight/80 dark:bg-brand-charcoal/45 rounded w-5/6"></div>
      </div>
      <div className="h-4 bg-brand-highlight/80 dark:bg-brand-charcoal/45 rounded w-20"></div>
    </CardContent>
  </Card>
);

// Actual post card content
const PostCardContent = ({ post, preloadPost }) => (
  <Card className="border border-brand-charcoal/10 dark:border-brand-charcoal/40 shadow-sm bg-white dark:bg-brand-ink/45 p-6 transition-colors">
    <CardContent className="p-0">
      <Link 
        to={`/blog/${post.slug}`} 
        className="block group"
        onMouseEnter={() => preloadPost(post.slug)}
        onFocus={() => preloadPost(post.slug)}
      >
        <h2 className="text-2xl font-semibold mb-3 text-brand-charcoal dark:text-white group-hover:text-brand-primary dark:group-hover:text-white transition-colors">
          {post.title}
        </h2>
        <div className="flex items-center text-sm text-brand-charcoal/70 dark:text-gray-200 mb-3">
          <CalendarDays className="w-4 h-4 mr-2" />
          <span>{post.date}</span>
        </div>
        <p className="text-brand-charcoal/80 dark:text-gray-200 leading-relaxed mb-4">
          {post.excerpt}
        </p>
        <span className="text-brand-primary dark:text-white text-sm font-medium group-hover:underline">
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
