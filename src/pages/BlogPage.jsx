import React, { useState, useEffect } from "react";
import { CalendarDays, Maximize2 } from "lucide-react";
import { Card, CardContent } from "../components/ui/card.jsx";
import LazyMarkdown from '../components/LazyMarkdown.jsx';
import ClickableImage from '../components/ClickableImage.jsx';
import ImageModal from '../components/ImageModal.jsx';
import CodeBlock from '../components/CodeBlock.tsx';
import { usePageTitle } from '../hooks/usePageTitle';
import { useFullPosts } from '../hooks/usePosts';
import { updateDocumentMeta, generatePageMeta } from '../utils/seo';
import { BlogListStructuredData } from '../components/StructuredData';

const POSTS_PER_PAGE = 10;

export default function BlogPage() {
  usePageTitle("Blog");
  const [currentPage, setCurrentPage] = useState(1);
  const { posts, loading, error } = useFullPosts();

  // Update SEO meta tags
  useEffect(() => {
    const meta = generatePageMeta('blog');
    updateDocumentMeta(meta);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-avenir transition-colors">
        <main className="pt-28 px-6 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 dark:text-gray-300">Loading posts...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-avenir transition-colors">
        <main className="pt-28 px-6 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-red-600 dark:text-red-400">Error loading posts: {error}</p>
          </div>
        </main>
      </div>
    );
  }

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginatedPosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-avenir transition-colors">
      <BlogListStructuredData posts={posts} />
      <main className="pt-28 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {paginatedPosts.map((post, index) => (
            <div key={`page-${currentPage}-index-${index}`}>
              <article className="mb-16">
                {/* Post Header - matching PostPage exactly */}
                <header className="mb-8 text-center">
                  <h1 className="text-4xl mb-4 text-gray-900 dark:text-gray-100 leading-tight">
                    {post.title}
                  </h1>
                  <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-300">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    <span>{post.date}</span>
                  </div>
                </header>
                
                {/* Post Content - matching PostPage Card wrapper */}
                <Card className="border-none shadow-none bg-transparent dark:bg-transparent">
                  <CardContent className="text-gray-800 dark:text-gray-200 leading-[1.75] tracking-normal">
                    <LazyMarkdown 
                      components={{
                        h1: ({children}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100">{children}</h1>,
                        h2: ({children}) => <h2 className="text-2xl mt-6 mb-3 text-gray-900 dark:text-gray-100">{children}</h2>,
                        h3: ({children}) => <h3 className="text-xl font-medium mt-4 mb-2 text-gray-900 dark:text-gray-100">{children}</h3>,
                        a: ({children, href}) => (
                          <a 
                            href={href} 
                            className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {children}
                          </a>
                        ),
                        p: ({children, node, ...props}) => {
                          // Check if this paragraph contains images
                          const imgCount = node?.children?.filter(child => child.tagName === 'img').length || 0;
                          
                          if (imgCount > 1) {
                            // Multiple images - display in a row
                            return (
                              <div className="flex gap-2 mb-4 overflow-x-auto">
                                {React.Children.map(children, (child, index) => {
                                  // Wrap each image in a flex container
                                  if (child?.type?.name === 'img' || child?.props?.src) {
                                    return <div className="flex-1 min-w-0">{child}</div>;
                                  }
                                  return child;
                                })}
                              </div>
                            );
                          } else if (imgCount === 1) {
                            // Single image - return without p tag wrapper
                            return <div className="mb-4">{children}</div>;
                          }
                          
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
                        img: ({src, alt}) => {
                          // Special layout for small images (ending with -small or -smallr before extension)
                          const smallMatch = src.match(/-small\.\w+$/);
                          const smallRightMatch = src.match(/-smallr\.\w+$/);
                          
                          if (smallMatch || smallRightMatch) {
                            const [isModalOpen, setIsModalOpen] = React.useState(false);
                            const floatClass = smallRightMatch ? "float-right w-1/3 ml-6 mb-4" : "float-left w-1/3 mr-6 mb-4";
                            
                            return (
                              <>
                                <div className={`${floatClass} group cursor-pointer`} onClick={() => setIsModalOpen(true)}>
                                  <div className="relative overflow-hidden rounded-lg">
                                    <img 
                                      src={src} 
                                      alt={alt} 
                                      className="w-full rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-[1.02]"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                                      <div className="bg-white dark:bg-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
                                        <Maximize2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <ImageModal 
                                  src={src}
                                  alt={alt}
                                  isOpen={isModalOpen}
                                  onClose={() => setIsModalOpen(false)}
                                />
                              </>
                            );
                          }
                          return <ClickableImage src={src} alt={alt} />;
                        },
                        code: ({node, inline, className, children, ...props}) => {
                          const match = /language-(\w+)/.exec(className || '');
                          const language = match ? match[1] : '';
                          const value = String(children).replace(/\n$/, '');
                          
                          if (!inline && match) {
                            return <CodeBlock language={language} value={value} />;
                          }
                          
                          return (
                            <code className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                              {children}
                            </code>
                          );
                        },
                        ul: ({children}) => <ul className="mb-4 pl-6 space-y-1">{children}</ul>,
                        ol: ({children}) => <ol className="mb-4 pl-6 space-y-1">{children}</ol>,
                        li: ({children}) => <li className="list-disc marker:text-gray-400 dark:marker:text-gray-500">{children}</li>,
                        strong: ({children}) => <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>,
                        em: ({children}) => <em className="italic">{children}</em>,
                        hr: () => null // Remove any markdown-generated horizontal rules
                      }}
                    >
                      {post.content}
                    </LazyMarkdown>
                  </CardContent>
                </Card>
              </article>
              
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
