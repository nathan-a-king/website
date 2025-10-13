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
  const meta = React.useMemo(() => generatePageMeta('home'), []);

  React.useEffect(() => {
    updateDocumentMeta(meta);
  }, [meta]);

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-avenir transition-colors">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 opacity-0 animate-fadeIn" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Exploring the intersection of AI, design, and human creativity. 
            Building the next generation of intelligent interfaces.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              to="/blog"
              className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition font-medium"
            >
              Read My Blog
            </Link>
            <Link 
              to="/contact"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-black dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-800 opacity-0 animate-fadeIn transition-colors" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold mb-12 text-center text-gray-900 dark:text-gray-100">
            Latest Thoughts
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 animate-pulse">
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
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
                  <Card className="border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 shadow-md hover:shadow-2xl cursor-pointer h-full">
                    <CardContent className="px-8 pt-12 pb-10 h-full flex flex-col">
                      <article className="flex-1 flex flex-col">
                        <header className="mb-6 text-center">
                          <h3 className="text-2xl mb-4 text-gray-900 dark:text-gray-100 leading-tight">
                            {post.title}
                          </h3>
                          <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-300">
                            <CalendarDays className="w-4 h-4 mr-2" />
                            <time>{post.date}</time>
                          </div>
                        </header>

                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
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
      <section className="py-20 px-6 opacity-0 animate-fadeIn" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8 text-gray-900 dark:text-gray-100">
            Building the Future of Human-AI Collaboration
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
            I'm passionate about creating AI tools that feel like natural extensions of human creativity. 
            My work focuses on designing interfaces that make AI accessible, powerful, and genuinely helpful 
            in real-world workflows.
          </p>
          <Link 
            to="/about"
            className="inline-block px-6 py-3 border border-gray-300 dark:border-gray-600 text-black dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
          >
            Learn More About My Work
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-200 dark:border-gray-700 mt-20 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Nathan A. King. All rights reserved.
      </footer>
    </div>
  );
}
