import React from "react";
import { useParams, Link } from "react-router-dom";
import { CalendarDays, ArrowLeft, Maximize2 } from "lucide-react";
import LazyMarkdown from '../components/LazyMarkdown.jsx';
import { Card, CardContent } from "../components/ui/card.jsx";
import ClickableImage from '../components/ClickableImage.jsx';
import ImageModal from '../components/ImageModal.jsx';
import CodeBlock from '../components/CodeBlock.tsx';
import { usePageTitle } from '../hooks/usePageTitle';
import { usePost } from '../hooks/usePosts';
import { updateDocumentMeta, generatePostMeta } from '../utils/seo';
import { BlogPostStructuredData } from '../components/StructuredData';
import { useTheme } from '../contexts/ThemeContext';

export default function PostPage() {
  const { slug } = useParams();
  const { post, loading, error } = usePost(slug);
  const { isDarkMode } = useTheme();

  usePageTitle(post ? post.title : "Post");

  // Update SEO meta tags when post loads
  React.useEffect(() => {
    if (post) {
      const meta = generatePostMeta(post);
      updateDocumentMeta(meta);
    }
  }, [post]);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-avenir transition-colors">
        <main className="pt-28 px-6 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 dark:text-gray-300">Loading post...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || (!loading && !post)) {
    return (
      <div className="relative min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-avenir transition-colors">
        <main className="pt-28 px-6 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Post Not Found</h1>
            {error && <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>}
            <Link to="/blog" className="text-black dark:text-white hover:underline">
              ← Back to Blog
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-avenir transition-colors">
      <BlogPostStructuredData post={post} />
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
                    // Check if this is a light mode image with a corresponding dark mode version
                    // Dark mode images should have -dark- in the name (e.g., prose-dark-smallr.png)
                    const [displaySrc, setDisplaySrc] = React.useState(src);
                    
                    React.useEffect(() => {
                      // Extract filename parts
                      const pathParts = src.split('/');
                      const filename = pathParts[pathParts.length - 1];
                      const directory = pathParts.slice(0, -1).join('/');
                      
                      if (isDarkMode) {
                        // Check if this is already a dark image
                        if (!filename.includes('-dark-')) {
                          // Convert to dark version by inserting -dark- after the first part
                          // e.g., prose-smallr.png -> prose-dark-smallr.png
                          const filenameParts = filename.split('-');
                          if (filenameParts.length > 1) {
                            // Insert -dark- after the first part
                            filenameParts.splice(1, 0, 'dark');
                            const darkFilename = filenameParts.join('-');
                            const darkSrc = directory ? `${directory}/${darkFilename}` : darkFilename;
                            
                            // Check if dark version exists by trying to load it
                            const img = new Image();
                            img.onload = () => {
                              // Dark version exists, use it
                              setDisplaySrc(darkSrc);
                            };
                            img.onerror = () => {
                              // Dark version doesn't exist, fallback to original
                              setDisplaySrc(src);
                            };
                            img.src = darkSrc;
                          } else {
                            setDisplaySrc(src);
                          }
                        } else {
                          setDisplaySrc(src);
                        }
                      } else {
                        // In light mode, remove -dark- if present
                        if (filename.includes('-dark-')) {
                          const lightFilename = filename.replace('-dark-', '-');
                          setDisplaySrc(directory ? `${directory}/${lightFilename}` : lightFilename);
                        } else {
                          setDisplaySrc(src);
                        }
                      }
                    }, [src, isDarkMode]);
                    
                    // Special layout for small images (containing -small or -smallr)
                    const smallMatch = displaySrc.includes('-small');
                    const smallRightMatch = displaySrc.includes('-smallr');
                    
                    if (smallMatch || smallRightMatch) {
                      const [isModalOpen, setIsModalOpen] = React.useState(false);
                      const floatClass = smallRightMatch ? "float-right w-1/3 ml-6 mb-4" : "float-left w-1/3 mr-6 mb-4";
                      
                      return (
                        <>
                          <div className={`${floatClass} group cursor-pointer`} onClick={() => setIsModalOpen(true)}>
                            <div className="relative overflow-hidden rounded-lg">
                              <img 
                                src={displaySrc} 
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
                            src={displaySrc}
                            alt={alt}
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                          />
                        </>
                      );
                    }
                    return <ClickableImage src={displaySrc} alt={alt} />;
                  },
                  code: ({node, inline, className, children, ...props}) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <CodeBlock
                        language={match[1]}
                        value={String(children).replace(/\n$/, '')}
                      />
                    ) : (
                      <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                        {children}
                      </code>
                    );
                  },
                  ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
                  li: ({children}) => <li className="mb-1">{children}</li>,
                  strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                  em: ({children}) => <em className="italic">{children}</em>,
                }}
              >
                {post.content}
              </LazyMarkdown>
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
