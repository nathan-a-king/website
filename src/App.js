import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { CalendarDays } from "lucide-react";
import "./styles/fonts.css";
import "./styles/animations.css"; // Ensure you have the fadeIn animation defined here
import "./styles/globals.css"; // Global styles for the app
import "./styles/tailwind.css"; // Tailwind CSS styles
import "./styles/typography.css"; // Custom typography styles

const posts = [
  {
    title: "Let’s Move Beyond the Chatbot",
    date: "July 19, 2025",
    content: [
      "When ChatGPT first launched, the chat interface felt novel and even magical. You could type a question and receive a thoughtful answer in plain English. It was like talking to a super-intelligent friend who never slept.",
      "But over time, we’ve started to feel the limits of this format. Power users don’t just want to chat. They want to build, explore, and execute. Copying answers from chat into other tools is tedious. The future isn’t just smarter AI—it’s better interfaces for working alongside it.",
      "AI should enhance your workflow, not interrupt it. The next generation of AI tools won’t just answer questions—they’ll help you write, code, organize, design, and solve problems within the very context where those problems exist.",
      "That’s the leap we need to make: from chatbot to creative partner."
    ]
  },
  {
    title: "Designing for AI-First Workflows",
    date: "July 12, 2025",
    content: [
      "AI-first products demand a different approach. It’s not just about embedding a model—it’s about rethinking the entire user experience.",
      "We need tools that are context-aware, continuously learning, and deeply integrated into workflows. The magic happens when AI isn’t a feature, but a co-pilot.",
      "The best AI tools don’t feel like tools. They feel like extensions of your own thinking."
    ]
  },
  {
    title: "Why the Chat Interface Is Holding Us Back",
    date: "July 5, 2025",
    content: [
      "Chat interfaces are flexible, but they’re not always the right fit. Sometimes, you need structure. Tables, forms, timelines, canvases—these are how we organize thought.",
      "When we constrain AI to a text box, we limit its potential. The challenge now is to design interfaces that surface the full power of the model—without drowning the user in complexity."
    ]
  },
  ...Array.from({ length: 27 }, (_, i) => ({
    title: `Sample Blog Post #${i + 4}`,
    date: `June ${30 - (i % 30)}, 2025`,
    content: [
      "This is an example blog post to test the pagination system.",
      "Each post simulates realistic content structure and is part of a batch used to paginate over multiple pages.",
      `This is entry number ${i + 4} in the post list.`
    ]
  }))
];

const POSTS_PER_PAGE = 10;

export default function BlogPost() {
  const [currentPage, setCurrentPage] = useState(1);

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
          <div className="text-xl font-bold tracking-tight">Nathan A. King</div>
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
                <h1 className="text-4xl font-semibold mb-3 leading-snug tracking-tight text-gray-900">
                  {post.title}
                </h1>
                <div className="flex justify-center items-center text-sm text-gray-600 italic">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  <span>{post.date}</span>
                </div>
              </header>

              <Card className="border-none shadow-none">
                <CardContent className="prose prose-lg max-w-none text-gray-800 leading-[1.75] tracking-normal text-justify">
                  {post.content.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
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
