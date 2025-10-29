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
    <div className="relative min-h-screen bg-white dark:bg-brand-ink text-brand-charcoal dark:text-gray-200 font-avenir transition-colors overflow-hidden">
      <BackgroundPattern variant="dots" className="text-brand-charcoal" />

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-64 bg-brand-highlight rounded-b-[48px] dark:bg-brand-charcoal/35 -z-10 shadow-soft-lg"
      />

      {/* Hero Section */}
      <section className="relative pt-44 pb-28 px-6 sm:px-10 opacity-0 animate-fadeIn" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 rounded-full bg-white/90 dark:bg-brand-ink/60 border border-brand-primary/20 dark:border-brand-primary/30 backdrop-blur-sm text-xs uppercase tracking-[0.35em] font-semibold text-brand-charcoal/70 dark:text-gray-200 shadow-soft">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary dark:text-brand-accent" />
            <span>Strategist. Designer. Engineer.</span>
          </div>
          <p className="text-xl sm:text-2xl text-brand-charcoal/80 dark:text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Exploring the intersection of AI, design, and human creativity.
            Building the next generation of intelligent interfaces.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/blog"
              className="group relative px-7 py-3.5 bg-brand-primary text-white rounded-full border-2 border-brand-primary shadow-primary hover:shadow-primary-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60 transition-all duration-200 font-medium"
            >
              <span className="relative z-10">Read My Blog</span>
            </Link>
            <Link
              to="/contact"
              className="px-7 py-3.5 border-2 border-brand-charcoal/15 dark:border-brand-charcoal/40 text-brand-charcoal dark:text-white rounded-full hover:bg-brand-highlight dark:hover:bg-brand-charcoal/60 hover:border-brand-primary/30 dark:hover:border-brand-primary/40 hover:-translate-y-0.5 transition-all duration-200 font-medium shadow-soft hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="relative py-24 px-6 sm:px-10 bg-brand-highlight/70 dark:bg-brand-charcoal/45 opacity-0 animate-fadeIn transition-colors" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
        <BackgroundPattern variant="grid" className="text-brand-charcoal" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-brand-charcoal dark:text-white inline-block relative">
              Latest Thoughts
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-brand-primary/30 dark:bg-brand-primary/40 rounded-full"></div>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white/90 dark:bg-brand-ink/45 p-6 rounded-2xl shadow-soft-lg border border-brand-charcoal/10 dark:border-brand-charcoal/30 animate-pulse">
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
                  className="group block h-full"
                  onMouseEnter={() => preloadPost(post.slug)}
                  onFocus={() => preloadPost(post.slug)}
                >
                  <Card className="relative border-2 border-brand-charcoal/10 dark:border-brand-charcoal/40 hover:border-brand-primary/40 dark:hover:border-brand-primary/50 transition-all duration-300 shadow-soft-lg hover:shadow-soft-xl hover:-translate-y-1 cursor-pointer h-full bg-white/95 dark:bg-brand-ink/60 rounded-3xl overflow-hidden">
                    <CardContent className="px-8 pt-12 pb-10 h-full flex flex-col">
                      <article className="flex-1 flex flex-col">
                        <header className="mb-6 text-center">
                          <h3 className="text-2xl mb-4 text-brand-charcoal dark:text-white leading-tight group-hover:text-brand-primary dark:group-hover:text-brand-accent transition-colors duration-200">
                            {post.title}
                          </h3>
                          <div className="flex items-center justify-center text-sm text-brand-charcoal/70 dark:text-gray-200">
                            <CalendarDays className="w-4 h-4 mr-2 group-hover:text-brand-primary dark:group-hover:text-brand-accent transition-colors" />
                            <time>{post.date}</time>
                          </div>
                        </header>

                        <p className="text-brand-charcoal/80 dark:text-gray-200 leading-relaxed mb-6">
                          {post.excerpt}
                        </p>

                        <div className="mt-auto pt-4 border-t border-brand-charcoal/5 dark:border-brand-charcoal/20">
                          <span className="inline-flex items-center text-sm font-medium text-brand-primary dark:text-brand-accent group-hover:gap-2 transition-all">
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
          <div className="relative bg-white/60 dark:bg-brand-ink/40 backdrop-blur-sm rounded-3xl border-2 border-brand-charcoal/10 dark:border-brand-charcoal/30 p-10 sm:p-12 shadow-soft-lg">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-12 h-12 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-full flex items-center justify-center border-2 border-white dark:border-brand-ink shadow-soft">
                <Sparkles className="w-6 h-6 text-brand-primary dark:text-brand-accent" />
              </div>
            </div>
            <div className="text-center space-y-6">
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
                className="inline-block px-7 py-3.5 border-2 border-brand-charcoal/15 dark:border-brand-charcoal/40 text-brand-charcoal dark:text-white rounded-full hover:bg-brand-highlight dark:hover:bg-brand-charcoal/60 hover:border-brand-primary/30 dark:hover:border-brand-primary/40 hover:-translate-y-0.5 transition-all duration-200 font-medium shadow-soft hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40"
              >
                Learn More About My Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-brand-charcoal/10 dark:border-brand-charcoal/45 mt-20 py-8 text-center">
        <div className="text-sm text-brand-charcoal/60 dark:text-gray-200">
          © {new Date().getFullYear()} Nathan A. King. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
