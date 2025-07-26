import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { CalendarDays } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { getAllPosts } from './utils/posts';
import "./styles/fonts.css";
import "./styles/animations.css"; // Ensure you have the fadeIn animation defined here
import "./styles/globals.css"; // Global styles for the app
import "./styles/tailwind.css"; // Tailwind CSS styles
import "./styles/typography.css"; // Custom typography styles

const POSTS_PER_PAGE = 10;

export default function BlogPost() {
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
    <div className="relative min-h-screen bg-white text-black font-avenir">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/70 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <img src="/mac-logo.png" alt="Nathan A. King" className="h-12 w-auto" />
          <ul className="flex space-x-6 text-md font-medium">
            <li><a href="#" className="hover:text-gray-700 transition">Home</a></li>
            <li><a href="#" className="hover:text-gray-700 transition">Blog</a></li>
            <li><a href="#" className="hover:text-gray-700 transition">About</a></li>
          </ul>
        </div>
      </nav>

      <div className="pt-28 px-6 py-12 md:px-24 lg:px-48">
        <div className="max-w-prose mx-auto space-y-20">
          {paginatedPosts.map((post, index) => (
            <div key={`page-${currentPage}-index-${index}`} className={`transition-opacity duration-500 ease-in-out opacity-0 animate-fadeIn`} style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}>
              <header className="mb-6 text-center">
                <h1 className="text-4xl mb-3 leading-snug tracking-tight text-gray-900">
                  {post.title}
                </h1>
                <div className="flex justify-center items-center text-sm text-gray-600 italic">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  <span>{post.date}</span>
                </div>
              </header>

              <Card className="border-none shadow-none">
                <CardContent className="prose prose-lg max-w-none text-gray-800 leading-[1.75] tracking-normal">
                  <ReactMarkdown 
                    components={{
                      // Custom styling for markdown elements
                      h1: ({children}) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
                      h2: ({children}) => <h2 className="text-2xl mt-6 mb-3">{children}</h2>,
                      h3: ({children}) => <h3 className="text-xl font-medium mt-4 mb-2">{children}</h3>,
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
                        <blockquote className="border-l-4 border-gray-300 pl-6 pr-4 my-4 italic text-lg bg-gray-50">
                          {children}
                        </blockquote>
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
                className="px-4 py-2 rounded-md border text-sm font-medium bg-white text-black border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>

              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-md border text-sm font-medium ${currentPage === page ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:bg-gray-100'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md border text-sm font-medium bg-white text-black border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="border-t border-gray-200 mt-20 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Nathan A. King. All rights reserved.
      </footer>
    </div>
  );
}
