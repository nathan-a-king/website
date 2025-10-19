import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, ArrowRight, Search } from "lucide-react";
import { Card, CardContent } from "../components/ui/card.jsx";
import { usePostsIndex, usePreloadPost } from '../hooks/usePosts';
import { updateDocumentMeta, generatePageMeta } from '../utils/seo';
import { BlogListStructuredData } from '../components/StructuredData';

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
      <div className="relative min-h-screen bg-white dark:bg-brand-ink text-brand-charcoal dark:text-gray-200 font-avenir transition-colors">
        <main className="pt-36 px-6 sm:px-10 pb-14">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-brand-charcoal/70 dark:text-gray-200">Loading posts...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen bg-white dark:bg-brand-ink text-brand-charcoal dark:text-gray-200 font-avenir transition-colors">
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
    <div className="relative min-h-screen bg-white dark:bg-brand-ink text-brand-charcoal dark:text-gray-200 font-avenir transition-colors">
      <BlogListStructuredData posts={posts} />
      <main className="pt-36 px-6 sm:px-10 pb-14">
        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="mb-8 opacity-0 animate-fadeIn" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-charcoal/40 dark:text-gray-200 pointer-events-none" />
              <input
                type="text"
                placeholder="Search posts by title, content, or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/90 dark:bg-brand-ink/45 border border-brand-charcoal/10 dark:border-brand-charcoal/40 rounded-full text-brand-charcoal dark:text-gray-200 placeholder-brand-charcoal/50 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/60 dark:focus:ring-brand-primary/35 focus:border-transparent transition-all backdrop-blur-sm"
              />
            </div>

            {/* Category Pills */}
            {allCategories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <button
                  onClick={() => setSelectedCategories(new Set())}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    selectedCategories.size === 0
                      ? "bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20"
                      : "bg-white/80 dark:bg-brand-ink/45 border-brand-charcoal/15 dark:border-brand-charcoal/40 text-brand-charcoal/70 dark:text-gray-200 hover:bg-brand-highlight/70 dark:hover:bg-brand-charcoal/45"
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
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                      selectedCategories.has(category)
                        ? "bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20"
                        : "bg-white/80 dark:bg-brand-ink/45 border-brand-charcoal/15 dark:border-brand-charcoal/40 text-brand-charcoal/70 dark:text-gray-200 hover:bg-brand-highlight/70 dark:hover:bg-brand-charcoal/45"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            {(searchQuery || selectedCategories.size > 0) && (
              <div className="text-center mt-4 text-sm text-brand-charcoal/70 dark:text-gray-200">
                Found {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
                {selectedCategories.size > 0 && ` with ${Array.from(selectedCategories).join(' + ')}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </div>
            )}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 opacity-0 animate-fadeIn border-0 outline-none shadow-none" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
              <p className="text-brand-charcoal/60 dark:text-gray-200 text-lg">
                No posts found matching your search.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategories(new Set());
                }}
                className="mt-4 text-brand-primary dark:text-white hover:text-brand-primary/80 dark:hover:text-gray-100 underline"
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
                  className="border border-brand-charcoal/10 dark:border-brand-charcoal/40 hover:border-brand-primary/35 dark:hover:border-brand-primary/50 transition-all duration-300 shadow-lg hover:shadow-2xl cursor-pointer opacity-0 animate-fadeIn h-full bg-white/90 dark:bg-brand-ink/50 rounded-3xl"
                  style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
                >
                  <CardContent className="px-8 pt-12 pb-10 h-full flex flex-col">
                    <article className="flex-1 flex flex-col">
                      <header className="mb-6 text-center">
                        <h2 className="text-4xl mb-4 text-brand-charcoal dark:text-white leading-tight group-hover:text-brand-primary dark:group-hover:text-white transition-colors">
                          {post.title}
                        </h2>
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
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-between items-center flex-wrap gap-4 pt-10">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-full border text-sm font-medium bg-white/90 dark:bg-brand-ink/45 text-brand-charcoal dark:text-gray-200 border-brand-charcoal/15 dark:border-brand-charcoal/40 hover:bg-brand-highlight/70 dark:hover:bg-brand-charcoal/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${currentPage === page ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/15' : 'bg-white/90 dark:bg-brand-ink/45 text-brand-charcoal dark:text-gray-200 border-brand-charcoal/15 dark:border-brand-charcoal/40 hover:bg-brand-highlight/70 dark:hover:bg-brand-charcoal/40'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-full border text-sm font-medium bg-white/90 dark:bg-brand-ink/45 text-brand-charcoal dark:text-gray-200 border-brand-charcoal/15 dark:border-brand-charcoal/40 hover:bg-brand-highlight/70 dark:hover:bg-brand-charcoal/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-brand-charcoal/10 dark:border-brand-charcoal/45 mt-20 py-6 text-center text-sm text-brand-charcoal/60 dark:text-gray-200">
        © {new Date().getFullYear()} Nathan A. King. All rights reserved.
      </footer>
    </div>
  );
}
