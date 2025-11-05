import React from "react";
import { Mail, MapPin, Globe, Award } from "lucide-react";
import { updateDocumentMeta, generatePageMeta } from "../utils/seo";

export default function ResumePage() {
  // Update SEO meta tags
  React.useEffect(() => {
    updateDocumentMeta(generatePageMeta('resume'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-primary font-sans transition-colors">
      {/* Header */}
      <header className="pt-40 pb-24 px-6 sm:px-10 text-center opacity-0 animate-fadeIn" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
        <h1 className="text-5xl font-serif font-light mb-6 text-brand-text-primary">Resume</h1>
        <p className="text-xl text-brand-text-secondary max-w-2xl mx-auto leading-relaxed">
          Software Engineer · AI Tools Designer
        </p>
      </header>

      {/* Content */}
      <main className="px-6 sm:px-10 pb-12 opacity-0 animate-fadeIn" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
        <div className="max-w-4xl mx-auto">

      {/* Contact Info */}
      <div className="bg-brand-surface border border-brand-border p-8 rounded-lg mb-12 transition-colors">
        <div
          className="flex flex-wrap justify-center gap-12 text-brand-text-secondary opacity-0 animate-fadeIn"
          style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}
        >
          <div className="text-center">
            <Mail className="mx-auto mb-2 text-brand-terracotta" />
            <div className="font-semibold tracking-wide uppercase text-xs text-brand-gray-light">Email</div>
            <div>me@nateking.dev</div>
          </div>
          <div className="text-center">
            <MapPin className="mx-auto mb-2 text-brand-terracotta" />
            <div className="font-semibold tracking-wide uppercase text-xs text-brand-gray-light">Location</div>
            <div>Omaha, NE</div>
          </div>
          <div className="text-center">
            <Globe className="mx-auto mb-2 text-brand-terracotta" />
            <div className="font-semibold tracking-wide uppercase text-xs text-brand-gray-light">Portfolio</div>
            <div>nateking.dev</div>
          </div>
          <div className="text-center">
            <Award className="mx-auto mb-2 text-brand-terracotta" />
            <div className="font-semibold tracking-wide uppercase text-xs text-brand-gray-light">Experience</div>
            <div>7+ Years</div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="my-6 w-3/4 mx-auto h-px bg-brand-gray-border dark:bg-white/10 origin-center scale-x-0 animate-drawLine"
          style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
        />

        {/* Tagline */}
        <p
          className="text-center italic text-brand-text-secondary opacity-0 animate-fadeUp"
          style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
        >
          "Designing AI tools that feel less like software and more like conversation."
        </p>
      </div>

          {/* Professional Summary */}
          <section className="mb-12">
            <h2 className="text-3xl font-serif font-light mb-6 text-brand-text-primary">Professional Summary</h2>
            <div className="bg-brand-surface border border-brand-border p-6 rounded-lg transition-colors">
              <p className="text-brand-text-secondary leading-relaxed">
                Experienced software engineer specializing in AI-human interaction design and
                full-stack development. Passionate about creating intuitive interfaces that bridge the gap
                between artificial intelligence and human creativity. Proven track record of delivering
                scalable solutions and leading cross-functional teams in fast-paced environments.
              </p>
            </div>
          </section>

          {/* Experience */}
          <section className="mb-12">
            <h2 className="text-3xl font-serif font-light mb-6 text-brand-text-primary">Experience</h2>

            <div className="space-y-8">
              {/* Job 1 */}
              <div className="border-l-4 border-brand-terracotta pl-6">
                <div className="flex flex-wrap justify-between items-start mb-2">
                  <h3 className="text-xl font-serif font-normal text-brand-text-primary">Senior Software Engineer, Generative AI</h3>
                  <span className="text-brand-gray-light">2025 - Present</span>
                </div>
                <div className="text-brand-gray-light mb-3">FNBO · Omaha, NE</div>
                <ul className="list-disc list-inside space-y-2 text-brand-text-secondary">
                  <li>Led development of AI-human collaboration interfaces used throughout the enterprise</li>
                  <li>Architected and built scalable React applications with focus on real-time AI interactions</li>
                  <li>Designed evaluation frameworks for measuring AI assistant effectiveness</li>
                </ul>
              </div>

              {/* Job 2 */}
              <div className="border-l-4 border-brand-terracotta pl-6">
                <div className="flex flex-wrap justify-between items-start mb-2">
                  <h3 className="text-xl font-serif font-normal text-brand-text-primary">Lead Software Engineer, Salesforce</h3>
                  <span className="text-brand-gray-light">2019 - 2025</span>
                </div>
                <div className="text-brand-gray-light mb-3">FNBO · Omaha, NE</div>
                <ul className="list-disc list-inside space-y-2 text-brand-text-secondary">
                  <li>Developed responsive Lightning Web Components (LWCs) with integrated AI capabilities</li>
                  <li>Designed and optimized custom ETL pipelines to ensure timely, accurate data availability</li>
                  <li>Optimized existing Salesforce workflows for improved efficiency</li>
                  <li>Integrated third-party APIs into commercial lending applications</li>
                  <li>Created RESTful APIs and microservices, integrating custom capabilities to extend platform functionality</li>
                  <li>Mentored junior engineers and established code quality standards</li>
                </ul>
              </div>

              {/* Job 3 */}
              <div className="border-l-4 border-brand-terracotta pl-6">
                <div className="flex flex-wrap justify-between items-start mb-2">
                  <h3 className="text-xl font-serif font-normal text-brand-text-primary">Senior System Administrator</h3>
                  <span className="text-brand-gray-light">2017 - 2019</span>
                </div>
                <div className="text-brand-gray-light mb-3">FNBO · Omaha, NE</div>
                <ul className="list-disc list-inside space-y-2 text-brand-text-secondary">
                  <li>Contributed to the design and rollout of online checking and savings account opening capabilities</li>
                  <li>Partnered with business units to translate requirements into technical solutions</li>
                  <li>Served as subject matter expert (SME) on Salesforce capabilities, advising leadership on platform strategy.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Technical Skills */}
          <section className="mb-12">
            <h2 className="text-3xl font-serif font-light mb-6 text-brand-text-primary">Technical Skills</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-brand-surface border border-brand-border p-6 rounded-lg transition-colors">
                <h3 className="text-lg font-serif font-normal text-brand-text-primary mb-3">Frontend</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Vue.js', 'Next.js'].map(skill => (
                    <span key={skill} className="bg-brand-bg border border-brand-border px-3 py-1 rounded-lg text-sm text-brand-text-primary">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-brand-surface border border-brand-border p-6 rounded-lg transition-colors">
                <h3 className="text-lg font-serif font-normal text-brand-text-primary mb-3">Backend</h3>
                <div className="flex flex-wrap gap-2">
                  {['Node.js', 'Python', 'Flask', 'Django', 'PostgreSQL', 'MongoDB', 'Redis', 'AWS'].map(skill => (
                    <span key={skill} className="bg-brand-bg border border-brand-border px-3 py-1 rounded-lg text-sm text-brand-text-primary">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-brand-surface border border-brand-border p-6 rounded-lg transition-colors">
                <h3 className="text-lg font-serif font-normal text-brand-text-primary mb-3">AI/ML</h3>
                <div className="flex flex-wrap gap-2">
                  {['TensorFlow', 'PyTorch', 'OpenAI API', 'Transformers', 'Scikit-learn', 'Pandas', 'NumPy'].map(skill => (
                    <span key={skill} className="bg-brand-bg border border-brand-border px-3 py-1 rounded-lg text-sm text-brand-text-primary">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-brand-surface border border-brand-border p-6 rounded-lg transition-colors">
                <h3 className="text-lg font-serif font-normal text-brand-text-primary mb-3">Tools & Other</h3>
                <div className="flex flex-wrap gap-2">
                  {['Git', 'Docker', 'Jest', 'Cypress', 'Figma', 'Webpack', 'Vite', 'CI/CD'].map(skill => (
                    <span key={skill} className="bg-brand-bg border border-brand-border px-3 py-1 rounded-lg text-sm text-brand-text-primary">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Notable Projects */}
          <section className="mb-12">
            <h2 className="text-3xl font-serif font-light mb-6 text-brand-text-primary">Notable Projects</h2>
            <div className="space-y-6">
              <div className="bg-brand-surface border border-brand-border p-6 rounded-lg transition-colors">
                <h3 className="text-xl font-serif font-normal text-brand-text-primary mb-2">GrindLab</h3>
                <p className="text-brand-text-secondary mb-3">
                  Built an iOS/SwiftUI app that analyzes coffee grind consistency using computer vision. The app uses the device camera to capture images of coffee grounds and provides detailed analysis including particle size distribution, uniformity metrics, and brewing recommendations.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['SwiftUI'].map(tech => (
                    <span key={tech} className="bg-brand-bg border border-brand-border px-2 py-1 rounded text-xs text-brand-text-secondary">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-brand-surface border border-brand-border p-6 rounded-lg transition-colors">
                <h3 className="text-xl font-serif font-normal text-brand-text-primary mb-2">Interactive iOS AI Assistant App</h3>
                <p className="text-brand-text-secondary mb-3">
                  Developed a modern, SwiftUI-powered chat assistant app for iOS, integrating OpenAI Chat Completions. It provides a clean, multi-threaded chat experience with persistent history and is designed to be easily extensible for custom use cases.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['SwiftUI', 'Amazon Bedrock', 'WebSocket'].map(tech => (
                    <span key={tech} className="bg-brand-bg border border-brand-border px-2 py-1 rounded text-xs text-brand-text-secondary">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-brand-surface border border-brand-border p-6 rounded-lg transition-colors">
                <h3 className="text-xl font-serif font-normal text-brand-text-primary mb-2">Smart Code Review Tool</h3>
                <p className="text-brand-text-secondary mb-3">
                  Built an AI-powered code review system that analyzes pull requests and provides contextual feedback.
                  Integrated with GitHub API and custom ML models for code quality assessment.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Python', 'Flask', 'GitHub API', 'PostgreSQL', 'Docker'].map(tech => (
                    <span key={tech} className="bg-brand-bg border border-brand-border px-2 py-1 rounded text-xs text-brand-text-secondary">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </section>

        </div>
      </main>

      <footer className="border-t border-brand-border mt-12 py-6 text-center text-sm text-brand-text-tertiary">
        © {new Date().getFullYear()} Nathan A. King. All rights reserved.
      </footer>
    </div>
  );
}
