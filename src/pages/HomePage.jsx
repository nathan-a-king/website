import React from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Sparkles } from "lucide-react";
import { Card, CardContent } from "../components/ui/card.jsx";
import { usePostsIndex, usePreloadPost } from "../hooks/usePosts";
import { updateDocumentMeta, generatePageMeta } from "../utils/seo";
import BackgroundPattern from "../components/BackgroundPattern.jsx";

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
    <div className="relative min-h-screen bg-brand-bg text-brand-text-primary font-sans transition-colors overflow-hidden">
      <BackgroundPattern variant="dots" className="text-brand-charcoal" />

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-64 bg-brand-terracotta/10 dark:bg-brand-charcoal/20 -z-10"
      />

      {/* Hero Section */}
      <section className="relative pt-44 pb-28 px-6 sm:px-10 opacity-0 animate-fadeIn" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 rounded-lg bg-brand-soft dark:bg-brand-ink/80 border border-brand-border text-xs uppercase tracking-[0.35em] font-medium text-brand-text-secondary">
            <span>Strategist. Designer. Engineer.</span>
          </div>
          <p className="text-xl sm:text-2xl text-brand-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
            Exploring the intersection of AI, design, and human creativity.
            Building the next generation of intelligent interfaces.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/blog"
              className="group relative px-6 py-3 bg-brand-charcoal text-brand-cream rounded-lg hover:bg-brand-charcoal/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta/60 transition-all duration-200 font-medium text-sm"
            >
              <span className="relative z-10">Read My Blog</span>
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 border border-brand-border text-brand-text-primary rounded-lg hover:bg-brand-soft dark:hover:bg-white/5 transition-all duration-200 font-medium text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta/40"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="relative py-24 px-6 sm:px-10 bg-brand-surface opacity-0 animate-fadeIn transition-colors" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
        <BackgroundPattern variant="grid" className="text-brand-charcoal" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-light text-brand-text-primary inline-block relative">
              Latest Thoughts
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-brand-bg p-6 rounded-lg border border-brand-border animate-pulse">
                  <div className="h-6 bg-brand-soft dark:bg-white/5 rounded mb-3"></div>
                  <div className="h-4 bg-brand-soft dark:bg-white/5 rounded mb-2"></div>
                  <div className="h-4 bg-brand-soft dark:bg-white/5 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-brand-soft dark:bg-white/5 rounded w-20"></div>
                </div>
              ))
            ) : (
              latestPosts.map((post, index) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group block h-full"
                  onMouseEnter={() => preloadPost(post.slug)}
                  onFocus={() => preloadPost(post.slug)}
                >
                  <Card className="relative border border-brand-border hover:border-brand-terracotta/30 dark:hover:border-brand-terracotta/40 transition-all duration-200 cursor-pointer h-full bg-brand-bg rounded-lg overflow-hidden">
                    <CardContent className="px-6 pt-8 pb-6 h-full flex flex-col">
                      <article className="flex-1 flex flex-col">
                        <header className="mb-4">
                          <h3 className="text-xl font-serif font-normal mb-3 text-brand-text-primary leading-snug group-hover:text-brand-terracotta dark:group-hover:text-brand-terracotta transition-colors duration-200">
                            {post.title}
                          </h3>
                          <div className="flex items-center text-sm text-brand-text-tertiary">
                            <CalendarDays className="w-4 h-4 mr-2" />
                            <time>{post.date}</time>
                          </div>
                        </header>

                        <p className="text-brand-text-secondary leading-relaxed mb-4 text-sm">
                          {post.excerpt}
                        </p>

                        <div className="mt-auto pt-4 border-t border-brand-border">
                          <span className="inline-flex items-center text-sm font-medium text-brand-text-primary group-hover:text-brand-terracotta dark:group-hover:text-brand-terracotta transition-all">
                            Read more
                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
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
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-brand-surface rounded-lg border border-brand-border p-10 sm:p-12">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-serif font-light text-brand-text-primary">
                Building the Future of Human-AI Collaboration
              </h2>
              <p className="text-lg text-brand-text-secondary leading-relaxed">
                I'm passionate about creating AI tools that feel like natural extensions of human creativity.
                My work focuses on designing interfaces that make AI accessible, powerful, and genuinely helpful
                in real-world workflows.
              </p>
              <Link
                to="/about"
                className="inline-block px-6 py-3 border border-brand-border text-brand-text-primary rounded-lg hover:bg-brand-cream dark:hover:bg-white/5 transition-all duration-200 font-medium text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta/40"
              >
                Learn More About My Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-brand-border mt-20 py-8 text-center">
        <div className="text-sm text-brand-text-tertiary">
          © {new Date().getFullYear()} Nathan A. King. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
