import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card.jsx';
import { CalendarDays } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { usePreloadPost } from '../hooks/usePosts';

// Post card skeleton
const PostCardSkeleton = () => (
  <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 p-6">
    <CardContent className="p-0 animate-pulse">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-24"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
      </div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
    </CardContent>
  </Card>
);

// Actual post card content
const PostCardContent = ({ post, preloadPost }) => (
  <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 p-6">
    <CardContent className="p-0">
      <Link 
        to={`/blog/${post.slug}`} 
        className="block group"
        onMouseEnter={() => preloadPost(post.slug)}
        onFocus={() => preloadPost(post.slug)}
      >
        <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {post.title}
        </h2>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-3">
          <CalendarDays className="w-4 h-4 mr-2" />
          <span>{post.date}</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          {post.excerpt}
        </p>
        <span className="text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:underline">
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