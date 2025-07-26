import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { CalendarDays } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import ClickableImage from '../components/ClickableImage';
import { getAllPosts } from '../utils/posts';

const POSTS_PER_PAGE = 10;

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Load posts when component mounts
    const allPosts = getAllPosts();
    setPosts(allPosts);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginatedPosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-avenir transition-colors">
      <main className="pt-28 px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-20">
          {paginatedPosts.map((post, index) => (
            <div key={`page-${currentPage}-index-${index}`} className={`transition-opacity duration-500 ease-in-out opacity-0 animate-fadeIn`} style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}>
              <header className="mb-6 text-center">
                <h1 className="text-4xl mb-3 leading-snug tracking-tight text-gray-900 dark:text-gray-100">
                  {post.title}
                </h1>
                <div className="flex justify-center items-center text-sm text-gray-600 dark:text-gray-300 italic">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  <span>{post.date}</span>
                </div>
              </header>

              <Card className="border-none shadow-none bg-transparent dark:bg-transparent">
                <CardContent className="text-gray-800 dark:text-gray-200 leading-[1.75] tracking-normal">
                  <ReactMarkdown 
                    components={{
                      // Custom styling for markdown elements
                      h1: ({children}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100">{children}</h1>,
                      h2: ({children}) => <h2 className="text-2xl mt-6 mb-3 text-gray-900 dark:text-gray-100">{children}</h2>,
                      h3: ({children}) => <h3 className="text-xl font-medium mt-4 mb-2 text-gray-900 dark:text-gray-100">{children}</h3>,
                      p: ({children, ...props}) => {
                        // Check if this paragraph is inside a blockquote
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
          ))}

          {totalPages > 1 && (
            <div className="flex justify-between items-center flex-wrap gap-4 pt-10">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md border text-sm font-medium bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Previous
              </button>

              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-md border text-sm font-medium ${currentPage === page ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md border text-sm font-medium bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 mt-20 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Nathan A. King. All rights reserved.
      </footer>
    </div>
  );
}
