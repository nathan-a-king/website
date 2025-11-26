import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createEliza } from '../utils/elizaEngine';

const EXIT_PATTERN = /^(quit|exit|bye|goodbye)$/i;

const ElizaChatbot = () => {
  const eliza = useMemo(() => createEliza(), []);
  const [messages, setMessages] = useState(() => [
    {
      text: eliza.greeting(),
      isUser: false,
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  const hasUserMessages = messages.some((message) => message.isUser);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (event) => {
    event?.preventDefault?.();
    const input = inputValue.trim();
    if (!input) return;

    const timestamp = Date.now();
    setMessages((prev) => [...prev, { text: input, isUser: true, timestamp }]);
    setInputValue('');

    if (EXIT_PATTERN.test(input)) {
      setMessages((prev) => [
        ...prev,
        { text: 'Goodbye. It was nice talking to you.', isUser: false, timestamp: Date.now() },
      ]);
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    const thinkingTime = 600 + Math.random() * 1200;
    setTimeout(() => {
      const response = eliza.respond(input);
      setMessages((prev) => [
        ...prev,
        { text: response, isUser: false, timestamp: Date.now() },
      ]);
      setIsTyping(false);
    }, thinkingTime);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    try {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-10 font-sans text-brand-text-primary sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-brand-border bg-brand-surface shadow-card backdrop-blur-xs">
        <div className="border-b border-brand-border px-6 py-6 sm:py-8">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-text-tertiary">Interactive study</p>
          <h2 className="mt-3 text-3xl font-serif text-brand-text-primary">ELIZA Chatbot</h2>
          <p className="mt-3 text-base text-brand-text-secondary">
            A faithful simulation of Joseph Weizenbaum&apos;s 1966 therapist bot.
          </p>
          <div className="mt-4 h-0.5 w-16 bg-brand-accent"></div>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div className="rounded-2xl border border-brand-border bg-brand-bg shadow-inner-soft">
            <div
              ref={chatContainerRef}
              className="flex max-h-[60vh] min-h-[320px] flex-col gap-4 overflow-y-auto px-2 py-6 sm:px-4"
              aria-live="polite"
              aria-atomic="false"
            >
              {!hasUserMessages && (
                <div className="rounded-xl border border-dashed border-brand-border px-4 py-5 text-center text-sm text-brand-text-secondary">
                  <div className="mb-3 flex justify-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border text-brand-text-tertiary">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v6A2.5 2.5 0 0 1 17.5 15H14l-4 5v-5H6.5A2.5 2.5 0 0 1 4 12.5v-6Z" />
                      </svg>
                    </span>
                  </div>
                  Start a conversation with ELIZA.
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={`${index}-${message.timestamp ?? index}`}
                  className={`space-y-1 ${message.isUser ? 'text-right' : ''}`}
                >
                  <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <span
                      className={`inline-flex items-center rounded-full border border-brand-border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-text-secondary ${
                        !message.isUser && index === 0 ? 'bg-brand-bg animate-pulse' : 'bg-transparent'
                      }`}
                    >
                      {message.isUser ? 'You' : 'ELIZA'}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-brand-text-primary">
                    {message.text}
                  </p>
                  <span className="block text-xs text-brand-text-tertiary">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="space-y-1 text-brand-text-tertiary" aria-label="ELIZA is typing">
                  <div>
                    <span className="inline-flex items-center rounded-full border border-brand-border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-text-secondary">
                      ELIZA
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-brand-text-secondary"></span>
                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-brand-text-secondary"
                      style={{ animationDelay: '0.15s' }}
                    ></span>
                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-brand-text-secondary"
                      style={{ animationDelay: '0.3s' }}
                    ></span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col gap-3 rounded-2xl border border-brand-border bg-brand-bg px-4 py-3 shadow-inner-soft focus-within:ring-2 focus-within:ring-brand-accent md:flex-row md:items-center">
              <input
                type="text"
                id="eliza-message"
                name="message"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Share a thought or feeling to continue"
                autoComplete="off"
                className="flex-1 bg-transparent text-base text-brand-text-primary placeholder:text-brand-text-tertiary focus:outline-none"
                aria-label="Message ELIZA"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="hidden rounded-full border border-brand-border px-3 py-2 text-xs font-medium uppercase tracking-wide text-brand-text-secondary transition hover:text-brand-text-primary md:inline-flex"
                  aria-label="Send via keyboard shortcut"
                >
                  Cmd+Enter
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={!inputValue.trim()}
                >
                  Send
                </button>
              </div>
            </div>
            <p className="text-xs text-brand-text-tertiary">
              Press Enter to send · Type &quot;quit&quot; to end the session
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ElizaChatbot;
