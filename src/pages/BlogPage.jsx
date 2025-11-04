import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, ArrowRight, Search } from "lucide-react";
import { Card, CardContent } from "../components/ui/card.jsx";
import { usePostsIndex, usePreloadPost } from '../hooks/usePosts';
import { updateDocumentMeta, generatePageMeta } from '../utils/seo';
import { BlogListStructuredData } from '../components/StructuredData';
import BackgroundPattern from "../components/BackgroundPattern.jsx";

const POSTS_PER_PAGE = 20;

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const { posts, loading, error } = usePostsIndex();
  const { preloadPost } = usePreloadPost();

  // Extract all unique categories from posts
  const allCategories = React.useMemo(() => {
    const categorySet = new Set();
    posts.forEach(post => {
      if (post.categories && Array.isArray(post.categories)) {
        post.categories.forEach(cat => categorySet.add(cat));
      }
    });
    return Array.from(categorySet).sort();
  }, [posts]);

  // Update SEO meta tags
  useEffect(() => {
    const meta = generatePageMeta('blog');
    updateDocumentMeta(meta);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  // Reset to first page when search query or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories]);

  // Filter posts based on search query and categories
  const filteredPosts = posts.filter(post => {
    // Check search query
    const matchesSearch = !searchQuery || (() => {
      const query = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        (post.date && post.date.toLowerCase().includes(query))
      );
    })();

    // Check categories - post must have ALL selected categories
    const matchesCategories = selectedCategories.size === 0 ||
      (post.categories && Array.isArray(post.categories) &&
        Array.from(selectedCategories).every(cat => post.categories.includes(cat)));

    return matchesSearch && matchesCategories;
  });

  if (loading) {
    return (
      <div className="relative min-h-screen bg-brand-cream dark:bg-brand-ink text-brand-charcoal dark:text-brand-cream font-sans transition-colors">
        <main className="pt-36 px-6 sm:px-10 pb-14">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-brand-gray-medium dark:text-brand-gray-light">Loading posts...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen bg-brand-cream dark:bg-brand-ink text-brand-charcoal dark:text-brand-cream font-sans transition-colors">
        <main className="pt-36 px-6 sm:px-10 pb-14">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-red-600 dark:text-red-400">Error loading posts: {error}</p>
          </div>
        </main>
      </div>
    );
  }

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="relative min-h-screen bg-brand-cream dark:bg-brand-ink text-brand-charcoal dark:text-brand-cream font-sans transition-colors overflow-hidden">
      <BackgroundPattern variant="dots" className="text-brand-charcoal" />
      <BlogListStructuredData posts={posts} />
      <main className="pt-36 px-6 sm:px-10 pb-14 relative">
        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="mb-8 opacity-0 animate-fadeIn" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-gray-light pointer-events-none" />
              <input
                type="text"
                placeholder="Search posts by title, content, or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-brand-cream dark:bg-brand-ink border border-brand-gray-border dark:border-white/15 rounded-lg text-brand-charcoal dark:text-brand-cream placeholder-brand-gray-light dark:placeholder-brand-gray-light focus:outline-none focus:ring-2 focus:ring-brand-terracotta/40 focus:border-brand-terracotta/40 transition-all"
              />
            </div>

            {/* Category Pills */}
            {allCategories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <button
                  onClick={() => setSelectedCategories(new Set())}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategories.size === 0
                      ? "bg-brand-charcoal border-brand-charcoal text-brand-cream"
                      : "bg-brand-soft dark:bg-brand-ink/80 border border-brand-gray-border dark:border-white/15 text-brand-gray-medium dark:text-brand-gray-light hover:bg-brand-cream dark:hover:bg-white/5"
                  }`}
                >
                  All
                </button>
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      const newCategories = new Set(selectedCategories);
                      if (newCategories.has(category)) {
                        newCategories.delete(category);
                      } else {
                        newCategories.add(category);
                      }
                      setSelectedCategories(newCategories);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategories.has(category)
                        ? "bg-brand-charcoal border-brand-charcoal text-brand-cream"
                        : "bg-brand-soft dark:bg-brand-ink/80 border border-brand-gray-border dark:border-white/15 text-brand-gray-medium dark:text-brand-gray-light hover:bg-brand-cream dark:hover:bg-white/5"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            {(searchQuery || selectedCategories.size > 0) && (
              <div className="text-center mt-4 text-sm text-brand-gray-medium dark:text-brand-gray-light">
                Found {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
                {selectedCategories.size > 0 && ` with ${Array.from(selectedCategories).join(' + ')}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </div>
            )}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 opacity-0 animate-fadeIn border-0 outline-none shadow-none" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
              <p className="text-brand-gray-medium dark:text-brand-gray-light text-lg">
                No posts found matching your search.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategories(new Set());
                }}
                className="mt-4 text-brand-terracotta hover:text-brand-terracotta/80 underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-0 animate-fadeIn border-0 outline-none shadow-none" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
              {paginatedPosts.map((post, index) => (
              <Link
                key={`${searchQuery}-${Array.from(selectedCategories).join(',')}-${post.slug}`}
                to={`/blog/${post.slug}`}
                className="group block h-full"
                onMouseEnter={() => preloadPost(post.slug)}
                onFocus={() => preloadPost(post.slug)}
              >
                <Card
                  className="relative border border-brand-gray-border dark:border-white/10 hover:border-brand-terracotta/30 dark:hover:border-brand-terracotta/40 transition-all duration-200 cursor-pointer opacity-0 animate-fadeIn h-full bg-brand-cream dark:bg-brand-ink rounded-lg overflow-hidden"
                  style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
                >
                  <CardContent className="px-6 pt-8 pb-6 h-full flex flex-col">
                    <article className="flex-1 flex flex-col">
                      <header className="mb-4">
                        <h2 className="text-2xl font-serif font-normal mb-3 text-brand-charcoal dark:text-brand-cream leading-snug group-hover:text-brand-terracotta dark:group-hover:text-brand-terracotta transition-colors duration-200">
                          {post.title}
                        </h2>
                        <div className="flex items-center text-sm text-brand-gray-light dark:text-brand-gray-light">
                          <CalendarDays className="w-4 h-4 mr-2" />
                          <time>{post.date}</time>
                        </div>
                      </header>

                      <p className="text-brand-gray-medium dark:text-brand-gray-light leading-relaxed mb-4 text-sm">
                        {post.excerpt}
                      </p>

                      <div className="mt-auto pt-4 border-t border-brand-gray-border dark:border-white/10">
                        <span className="inline-flex items-center text-sm font-medium text-brand-charcoal dark:text-brand-cream group-hover:text-brand-terracotta dark:group-hover:text-brand-terracotta transition-all">
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
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-between items-center flex-wrap gap-4 pt-10">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-5 py-2 rounded-lg border text-sm font-medium bg-brand-cream dark:bg-brand-ink text-brand-charcoal dark:text-brand-cream border-brand-gray-border dark:border-white/15 hover:bg-brand-soft dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>

              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === page ? 'bg-brand-charcoal text-brand-cream' : 'bg-brand-soft dark:bg-brand-ink/80 text-brand-charcoal dark:text-brand-cream border border-brand-gray-border dark:border-white/15 hover:bg-brand-cream dark:hover:bg-white/5'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-5 py-2 rounded-lg border text-sm font-medium bg-brand-cream dark:bg-brand-ink text-brand-charcoal dark:text-brand-cream border-brand-gray-border dark:border-white/15 hover:bg-brand-soft dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-brand-gray-border dark:border-white/10 mt-20 py-6 text-center text-sm text-brand-gray-light dark:text-brand-gray-light">
        © {new Date().getFullYear()} Nathan A. King. All rights reserved.
      </footer>
    </div>
  );
}
