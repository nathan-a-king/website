import React from "react";
import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { Card, CardContent } from "../components/ui/card.jsx";
import { usePostsIndex, usePreloadPost } from "../hooks/usePosts";
import { updateDocumentMeta, generatePageMeta } from "../utils/seo";

export default function HomePage() {
  const { posts, loading } = usePostsIndex();
  const { preloadPost } = usePreloadPost();

  // Get latest 3 posts
  const latestPosts = posts.slice(0, 3);

  // Update SEO meta tags
  React.useEffect(() => {
    updateDocumentMeta(generatePageMeta('home'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-screen bg-white dark:bg-brand-ink text-brand-charcoal dark:text-gray-200 font-avenir transition-colors">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-64 bg-brand-highlight rounded-b-[48px] dark:bg-brand-charcoal/35 -z-10"
      />
      {/* Hero Section */}
      <section className="relative pt-44 pb-28 px-6 sm:px-10 opacity-0 animate-fadeIn" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 rounded-full bg-white/80 dark:bg-brand-ink/45 border border-brand-charcoal/10 dark:border-brand-charcoal/35 backdrop-blur-sm text-xs uppercase tracking-[0.35em] font-semibold text-brand-charcoal/70 dark:text-gray-200">
            <span>Strategist. Designer. Engineer.</span>
          </div>
          <p className="text-xl sm:text-2xl text-brand-charcoal/80 dark:text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Exploring the intersection of AI, design, and human creativity. 
            Building the next generation of intelligent interfaces.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              to="/blog"
              className="px-6 py-3 bg-brand-primary text-white rounded-full border border-brand-primary/80 shadow-md shadow-brand-primary/20 hover:bg-brand-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60 transition font-medium"
            >
              Read My Blog
            </Link>
            <Link 
              to="/contact"
              className="px-6 py-3 border border-brand-charcoal/20 dark:border-brand-charcoal/50 text-brand-charcoal dark:text-white rounded-full hover:bg-brand-highlight dark:hover:bg-brand-charcoal/60 transition font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-24 px-6 sm:px-10 bg-brand-highlight/70 dark:bg-brand-charcoal/45 opacity-0 animate-fadeIn transition-colors" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold mb-12 text-center text-brand-charcoal dark:text-white">
            Latest Thoughts
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white/90 dark:bg-brand-ink/45 p-6 rounded-2xl shadow-lg border border-brand-charcoal/10 dark:border-brand-charcoal/30 animate-pulse">
                  <div className="h-6 bg-brand-highlight/70 dark:bg-brand-charcoal/55 rounded mb-3"></div>
                  <div className="h-4 bg-brand-highlight/80 dark:bg-brand-charcoal/55 rounded mb-2"></div>
                  <div className="h-4 bg-brand-highlight/80 dark:bg-brand-charcoal/55 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-brand-highlight/90 dark:bg-brand-charcoal/55 rounded w-20"></div>
                </div>
              ))
            ) : (
              latestPosts.map((post, index) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="block h-full"
                  onMouseEnter={() => preloadPost(post.slug)}
                  onFocus={() => preloadPost(post.slug)}
                >
                  <Card className="border border-brand-charcoal/10 dark:border-brand-charcoal/45 hover:border-brand-primary/35 dark:hover:border-brand-primary/55 transition-all duration-300 shadow-lg hover:shadow-2xl cursor-pointer h-full bg-white/90 dark:bg-brand-ink/50 rounded-3xl">
                    <CardContent className="px-8 pt-12 pb-10 h-full flex flex-col">
                      <article className="flex-1 flex flex-col">
                        <header className="mb-6 text-center">
                          <h3 className="text-2xl mb-4 text-brand-charcoal dark:text-white leading-tight">
                            {post.title}
                          </h3>
                          <div className="flex items-center justify-center text-sm text-brand-charcoal/70 dark:text-gray-200">
                            <CalendarDays className="w-4 h-4 mr-2" />
                            <time>{post.date}</time>
                          </div>
                        </header>

                        <p className="text-brand-charcoal/80 dark:text-gray-200 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </article>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 px-6 sm:px-10 opacity-0 animate-fadeIn" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-semibold text-brand-charcoal dark:text-white">
            Building the Future of Human-AI Collaboration
          </h2>
          <p className="text-lg text-brand-charcoal/80 dark:text-gray-200 leading-relaxed">
            I'm passionate about creating AI tools that feel like natural extensions of human creativity. 
            My work focuses on designing interfaces that make AI accessible, powerful, and genuinely helpful 
            in real-world workflows.
          </p>
          <Link 
            to="/about"
            className="inline-block px-6 py-3 border border-brand-charcoal/20 dark:border-brand-charcoal/45 text-brand-charcoal dark:text-white rounded-full hover:bg-brand-highlight dark:hover:bg-brand-charcoal/45 transition font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40"
          >
            Learn More About My Work
          </Link>
        </div>
      </section>

      <footer className="border-t border-brand-charcoal/10 dark:border-brand-charcoal/45 mt-20 py-6 text-center text-sm text-brand-charcoal/60 dark:text-gray-200">
        © {new Date().getFullYear()} Nathan A. King. All rights reserved.
      </footer>
    </div>
  );
}
