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
    updateDocumentMeta(generatePageMeta('contact'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="relative min-h-screen bg-white dark:bg-brand-ink text-brand-charcoal dark:text-gray-200 font-avenir transition-colors">
      <main className="pt-36 px-6 sm:px-10 pb-14">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <header className="mb-16 text-center opacity-0 animate-fadeIn" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
            <h1 className="text-4xl mb-4 text-brand-charcoal dark:text-white leading-tight">
              Get in Touch
            </h1>
            <p className="text-lg text-brand-charcoal/80 dark:text-gray-200 max-w-xl mx-auto">
              Have a question or want to discuss a project? I'd love to hear from you.
            </p>
          </header>

          {/* Contact Form */}
          <Card className="border border-brand-charcoal/10 dark:border-brand-charcoal/40 shadow-lg bg-white/90 dark:bg-brand-ink/50 rounded-3xl backdrop-blur-sm opacity-0 animate-fadeIn" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            <CardContent className="p-8 pt-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="flex items-center text-sm font-medium text-brand-charcoal/80 dark:text-gray-200 mb-2">
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
                    className="w-full px-4 py-3 border border-brand-charcoal/15 dark:border-brand-charcoal/40 bg-white/95 dark:bg-brand-ink/40 text-brand-charcoal dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary/50 dark:focus:ring-brand-primary/40 focus:border-transparent transition-colors placeholder-brand-charcoal/40 dark:placeholder-gray-500 backdrop-blur-sm"
                    placeholder="Your full name"
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="flex items-center text-sm font-medium text-brand-charcoal/80 dark:text-gray-200 mb-2">
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
                    className="w-full px-4 py-3 border border-brand-charcoal/15 dark:border-brand-charcoal/40 bg-white/95 dark:bg-brand-ink/40 text-brand-charcoal dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary/50 dark:focus:ring-brand-primary/40 focus:border-transparent transition-colors placeholder-brand-charcoal/40 dark:placeholder-gray-500 backdrop-blur-sm"
                    placeholder="What's this about?"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="flex items-center text-sm font-medium text-brand-charcoal/80 dark:text-gray-200 mb-2">
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
                    className="w-full px-4 py-3 border border-brand-charcoal/15 dark:border-brand-charcoal/40 bg-white/95 dark:bg-brand-ink/40 text-brand-charcoal dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary/50 dark:focus:ring-brand-primary/40 focus:border-transparent transition-colors resize-none placeholder-brand-charcoal/40 dark:placeholder-gray-500 backdrop-blur-sm"
                    placeholder="Tell me more about your project or question..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-primary text-white py-3 px-6 rounded-full font-medium hover:bg-brand-primary/90 focus:ring-2 focus:ring-brand-primary/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-brand-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Opening Email Client...' : 'Send Message'}
                </button>

                {/* Success Message */}
                {submitStatus === 'success' && (
                  <div className="text-center text-brand-primary font-medium">
                    Email client opened! Your message is ready to send.
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-brand-charcoal/10 dark:border-brand-charcoal/45 mt-20 py-6 text-center text-sm text-brand-charcoal/60 dark:text-gray-200">
        © {new Date().getFullYear()} Nathan A. King. All rights reserved.
      </footer>
    </div>
  );
}
