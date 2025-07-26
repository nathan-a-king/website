import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CalendarDays, ArrowLeft } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from "../components/ui/card";
import ClickableImage from '../components/ClickableImage';
import { getPostBySlug } from '../utils/posts';

export default function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundPost = getPostBySlug(slug);
    setPost(foundPost);
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-white text-black font-avenir">
        <main className="pt-28 px-6 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600">Loading post...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="relative min-h-screen bg-white text-black font-avenir">
        <main className="pt-28 px-6 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
            <Link to="/blog" className="text-black hover:underline">
              ← Back to Blog
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-avenir transition-colors">
      <main className="pt-28 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Back to Blog Link */}
          <Link 
            to="/blog" 
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          {/* Post Header */}
          <header className="mb-8 text-center opacity-0 animate-fadeIn" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
            <h1 className="text-4xl mb-4 text-gray-900 dark:text-gray-100 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-300">
              <CalendarDays className="w-4 h-4 mr-2" />
              <span>{post.date}</span>
            </div>
          </header>

          {/* Post Content */}
          <Card className="border-none shadow-none bg-transparent dark:bg-transparent opacity-0 animate-fadeIn" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            <CardContent className="text-gray-800 dark:text-gray-200 leading-[1.75] tracking-normal">
              <ReactMarkdown 
                components={{
                  h1: ({children}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100">{children}</h1>,
                  h2: ({children}) => <h2 className="text-2xl mt-6 mb-3 text-gray-900 dark:text-gray-100">{children}</h2>,
                  h3: ({children}) => <h3 className="text-xl font-medium mt-4 mb-2 text-gray-900 dark:text-gray-100">{children}</h3>,
                  p: ({children, ...props}) => {
                    const isInBlockquote = props.node?.parent?.tagName === 'blockquote';
                    return (
                      <p className={isInBlockquote ? "text-justify" : "mb-4 text-justify"}>
                        {children}
                      </p>
                    );
                  },
                  blockquote: ({children}) => (
                    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-6 pr-4 my-4 italic text-lg bg-gray-50 dark:bg-gray-800">
                      {children}
                    </blockquote>
                  ),
                  img: ({src, alt}) => (
                    <ClickableImage src={src} alt={alt} />
                  ),
                  ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
                  li: ({children}) => <li className="mb-1">{children}</li>,
                  strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                  em: ({children}) => <em className="italic">{children}</em>,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 mt-20 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Nathan A. King. All rights reserved.
      </footer>
    </div>
  );
}
