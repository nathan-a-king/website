import React, { lazy, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import { CalendarDays, ArrowLeft, Maximize2 } from "lucide-react";
import LazyMarkdown from '../components/LazyMarkdown.jsx';
import { Card, CardContent } from "../components/ui/card.jsx";
import ClickableImage from '../components/ClickableImage.jsx';
import ImageModal from '../components/ImageModal.jsx';
import { usePost } from '../hooks/usePosts';
import { updateDocumentMeta, generatePostMeta } from '../utils/seo';
import { BlogPostStructuredData } from '../components/StructuredData';
import { useTheme } from '../contexts/ThemeContext';

const CodeBlock = lazy(() => import('../components/CodeBlock.tsx'));
const ElizaChatbot = lazy(() => import('../components/ElizaChatbot.jsx'));
const VectorStoreVisualizer = lazy(() => import('../components/VectorStoreVisualizer.tsx'));
const ELIZA_CHATBOT_MARKER = '[[ELIZA_CHATBOT]]';
const VECTOR_STORE_VIZ_MARKER = '[[VECTOR_STORE_VIZ]]';

export default function PostPage({ ElizaComponent = null }) {
  const ChatbotComponent = ElizaComponent ?? ElizaChatbot;
  const { slug } = useParams();
  const { post, loading, error } = usePost(slug);
  const { isDarkMode } = useTheme();
  const markdownComponents = React.useMemo(() => ({
    h1: ({ children }) => <h1 className="text-3xl font-serif font-light mt-8 mb-4 text-brand-text-primary">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-serif font-light mt-6 mb-3 text-brand-text-primary">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-serif font-normal mt-4 mb-2 text-brand-text-primary">{children}</h3>,
    a: ({ children, href }) => (
      <a
        href={href}
        className="text-brand-terracotta dark:text-brand-terracotta underline hover:text-brand-terracotta/80 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    p: ({ children, node, ...props }) => {
      // Check if this paragraph contains images
      const imgCount = node?.children?.filter((child) => child.tagName === 'img').length || 0;

      if (imgCount > 1) {
        // Multiple images - display in a row
        return (
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {React.Children.map(children, (child) => {
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
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-brand-terracotta pl-6 my-6 italic text-lg text-brand-text-secondary">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-10 border-brand-border" />,
    img: ({ src, alt }) => {
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
                  <div className="bg-brand-cream/90 dark:bg-brand-ink/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
                    <Maximize2 className="w-5 h-5 text-brand-text-primary" />
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
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <CodeBlock
          language={match[1]}
          value={String(children).replace(/\n$/, '')}
        />
      ) : (
        <code className="bg-brand-surface text-brand-text-primary px-1 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    },
    ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
    li: ({ children }) => <li className="mb-1">{children}</li>,
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  }), [isDarkMode]);
  const postSegments = React.useMemo(() => {
    if (!post?.content) {
      return [];
    }
    // Split by both markers, preserving which marker was used
    let content = post.content;

    // Escape special regex characters in markers
    const escapeRegex = (str) => str.replace(/[[\]]/g, '\\$&');

    // Replace markers with unique identifiers we can split on
    content = content.replace(new RegExp(escapeRegex(ELIZA_CHATBOT_MARKER), 'g'), '||ELIZA||');
    content = content.replace(new RegExp(escapeRegex(VECTOR_STORE_VIZ_MARKER), 'g'), '||VECTOR||');

    const parts = content.split(/(\|\|ELIZA\|\||\|\|VECTOR\|\|)/);

    return parts.map(part => {
      if (part === '||ELIZA||') return { type: 'eliza', content: '' };
      if (part === '||VECTOR||') return { type: 'vector', content: '' };
      return { type: 'markdown', content: part };
    }).filter(segment => segment.type !== 'markdown' || segment.content.trim().length > 0);
  }, [post?.content]);

  // Update SEO meta tags when post loads
  React.useEffect(() => {
    if (post) {
      const meta = generatePostMeta(post);
      updateDocumentMeta(meta);
    }
  }, [post]);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-brand-bg text-brand-text-primary font-sans transition-colors">
        <main className="pt-36 px-6 sm:px-10 pb-14">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-brand-text-secondary">Loading post...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || (!loading && !post)) {
    return (
      <div className="relative min-h-screen bg-brand-bg text-brand-text-primary font-sans transition-colors">
        <main className="pt-36 px-6 sm:px-10 pb-14">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-serif font-light mb-4 text-brand-text-primary">Post Not Found</h1>
            {error && <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>}
            <Link to="/blog" className="text-brand-terracotta hover:underline">
              ← Back to Blog
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-brand-bg text-brand-text-primary font-sans transition-colors">
      <BlogPostStructuredData post={post} />
      <main className="pt-36 px-6 sm:px-10 pb-14">
        <div className="max-w-3xl mx-auto">
          {/* Back to Blog Link */}
          <Link
            to="/blog"
            className="inline-flex items-center text-brand-text-secondary hover:text-brand-charcoal dark:hover:text-brand-cream transition mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          {/* Post Header */}
          <header className="mb-8 text-center opacity-0 animate-fadeIn" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
            <h1 className="text-4xl font-serif font-light mb-4 text-brand-text-primary leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center justify-center text-sm text-brand-text-tertiary">
              <CalendarDays className="w-4 h-4 mr-2" />
              <span>{post.date}</span>
            </div>
          </header>

          {/* Post Content */}
          <Card className="border-none shadow-none bg-transparent dark:bg-transparent">
            <CardContent className="text-brand-text-secondary leading-[1.75] tracking-normal">
              {postSegments.length > 0 && postSegments.map((segment, index) => {
                return (
                  <React.Fragment key={`post-segment-${index}`}>
                    {segment.type === 'markdown' && (
                      <LazyMarkdown components={markdownComponents}>
                        {segment.content}
                      </LazyMarkdown>
                    )}
                    {segment.type === 'eliza' && (
                      <div className="my-10 flex justify-center">
                        <Suspense fallback={<div className="text-sm text-brand-text-tertiary">Loading ELIZA…</div>}>
                          <ChatbotComponent />
                        </Suspense>
                      </div>
                    )}
                    {segment.type === 'vector' && (
                      <div className="my-10">
                        <Suspense fallback={<div className="text-sm text-brand-text-tertiary text-center">Loading visualization…</div>}>
                          <VectorStoreVisualizer />
                        </Suspense>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-brand-border mt-20 py-6 text-center text-sm text-brand-text-tertiary">
        © {new Date().getFullYear()} Nathan A. King. All rights reserved.
      </footer>
    </div>
  );
}
