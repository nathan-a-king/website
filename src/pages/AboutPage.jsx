import React from "react";
import Skills from "../components/Skills";
import { updateDocumentMeta, generatePageMeta } from "../utils/seo";

export default function AboutPage() {
  // Update SEO meta tags
  const meta = React.useMemo(() => generatePageMeta('about'), []);

  React.useEffect(() => {
    updateDocumentMeta(meta);
  }, [meta]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-avenir transition-colors">
      {/* Header */}
      <header className="pt-32 pb-20 px-6 text-center opacity-0 animate-fadeIn" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
        <h1 className="text-5xl mb-4 text-gray-900 dark:text-gray-100">About</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Building bridges between human creativity and artificial intelligence.
        </p>
      </header>

      {/* Content */}
      <main className="px-6 pb-8 opacity-0 animate-fadeIn" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
        <div className="max-w-3xl mx-auto prose prose-lg prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300">
          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg mb-12 transition-colors">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 m-0">
              I'm Nate, a software engineer passionate about creating AI tools that feel
              like natural extensions of human creativity. My work focuses on designing interfaces 
              that make AI accessible, powerful, and genuinely helpful in real-world workflows.
            </p>
          </div>

          <h2 className="text-3xl mb-6 text-gray-900 dark:text-gray-100">My Focus</h2>
          
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            I believe the future of AI isn't just about smarter algorithms—it's about better interfaces 
            for human-AI collaboration. Too often, AI tools feel disconnected from how we actually work 
            and think. I'm interested in changing that.
          </p>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            My approach combines deep technical understanding with user-centered design principles. 
            I work on projects that push the boundaries of what's possible when AI and human 
            intelligence work together seamlessly.
          </p>

          <h2 className="text-3xl mb-6 text-gray-900 dark:text-gray-100">Current Work</h2>
          
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            Right now, I'm exploring how AI can be integrated into creative workflows without 
            disrupting the natural flow of human thought. This includes work on:
          </p>

          <ul className="list-disc list-inside mb-8 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Interface patterns that make AI feel collaborative rather than transactional</li>
            <li>Tools that adapt to different thinking styles and creative processes</li>
            <li>Systems that preserve human agency while leveraging AI capabilities</li>
            <li>Enhancing existing evaluations frameworks</li>
          </ul>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            My <a href="https://github.com/nathan-a-king" className="text-black dark:text-white font-medium hover:underline" target="_blank" rel="noopener noreferrer">GitHub profile</a> showcases some of my projects and experiments in this space.
          </p>

          <h2 className="text-3xl mb-6 text-gray-900 dark:text-gray-100">Let's Connect</h2>
          
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            I'm always interested in connecting with others who are thinking deeply about 
            the future of human-AI collaboration. Whether you're working on similar problems 
            or just curious about these ideas, I'd love to hear from you.
          </p>

          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg transition-colors">
            <p className="text-gray-700 dark:text-gray-300 m-0">
              You can find my latest thoughts on my{" "}
              <a href="/blog" className="text-black dark:text-white font-medium hover:underline">blog</a>, 
              or reach out directly if you'd like to discuss ideas or potential collaborations.
            </p>
          </div>
        </div>
      </main>

      <Skills />

      <footer className="border-t border-gray-200 dark:border-gray-700 mt-12 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Nathan A. King. All rights reserved.
      </footer>
    </div>
  );
}
