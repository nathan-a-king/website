import React, { useState } from "react";
import { Mail, User, MessageSquare } from "lucide-react";
import { Card, CardContent } from "../components/ui/card.jsx";
import { updateDocumentMeta, generatePageMeta } from "../utils/seo";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Update SEO meta tags
  React.useEffect(() => {
    const meta = generatePageMeta('contact');
    updateDocumentMeta(meta);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Create mailto link
    const subject = encodeURIComponent(formData.subject);
    const body = encodeURIComponent(
      `Name: ${formData.name}\n\nMessage:\n${formData.message}`
    );
    const mailtoLink = `mailto:nate@nathanaking.com?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Reset form after a short delay
    setTimeout(() => {
      setFormData({ name: '', subject: '', message: '' });
      setIsSubmitting(false);
      setSubmitStatus('success');
    }, 1000);
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-avenir transition-colors">
      <main className="pt-28 px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <header className="mb-16 text-center opacity-0 animate-fadeIn" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
            <h1 className="text-4xl mb-4 text-gray-900 dark:text-gray-100 leading-tight">
              Get in Touch
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              Have a question or want to discuss a project? I'd love to hear from you.
            </p>
          </header>

          {/* Contact Form */}
          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 opacity-0 animate-fadeIn" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            <CardContent className="p-8 pt-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User className="w-4 h-4 mr-2" />
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-colors"
                    placeholder="Your full name"
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-colors"
                    placeholder="What's this about?"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Mail className="w-4 h-4 mr-2" />
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-colors resize-none"
                    placeholder="Tell me more about your project or question..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-3 px-6 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Opening Email Client...' : 'Send Message'}
                </button>

                {/* Success Message */}
                {submitStatus === 'success' && (
                  <div className="text-center text-green-600 font-medium">
                    Email client opened! Your message is ready to send.
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 mt-20 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Nathan A. King. All rights reserved.
      </footer>
    </div>
  );
}
