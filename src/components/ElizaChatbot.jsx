import React, { useState, useRef, useEffect } from 'react';

const ElizaChatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello. I am ELIZA. How are you feeling today?", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const lastDefaultIndexRef = useRef(-1);

  // ELIZA logic
  const reflections = {
    "i": "you",
    "i'm": "you're",
    "i am": "you are",
    "i'd": "you'd",
    "i would": "you would",
    "i've": "you've",
    "i have": "you have",
    "i'll": "you'll",
    "i will": "you will",
    "my": "your",
    "mine": "yours",
    "me": "you",
    "myself": "yourself",
    "you": "I",
    "you're": "I'm",
    "you are": "I am",
    "you'd": "I'd",
    "you would": "I would",
    "you've": "I've",
    "you have": "I have",
    "you'll": "I'll",
    "you will": "I will",
    "your": "my",
    "yours": "mine",
    "yourself": "myself"
  };

  const patterns = [
    {
      pattern: /\b(i need|i want)\b(.+)/i,
      responses: [
        "What would it mean to you if you got{1}?",
        "Why do you need{1}?",
        "What would you do if you got{1}?",
        "What stands in the way of you getting{1}?"
      ]
    },
    {
      pattern: /\b(i am|i'm)\b(.+)/i,
      responses: [
        "How long have you been{1}?",
        "Do you believe it's normal to be{1}?",
        "Do you enjoy being{1}?",
        "Why do you tell me you're{1}?"
      ]
    },
    {
      pattern: /\b(i feel)\b(.+)/i,
      responses: [
        "Tell me more about feeling{1}.",
        "Do you often feel{1}?",
        "What makes you feel{1}?",
        "When do you usually feel{1}?"
      ]
    },
    {
      pattern: /\b(why don't you|why do you not)\b(.+)/i,
      responses: [
        "Do you think I should{1}?",
        "Perhaps in time I will{1}.",
        "Should you{1} yourself?",
        "You want me to{1}?"
      ]
    },
    {
      pattern: /\b(why can't i)\b(.+)/i,
      responses: [
        "Do you think you should be able to{1}?",
        "What would happen if you could{1}?",
        "What prevents you from being able to{1}?",
        "Have you really tried to{1}?"
      ]
    },
    {
      pattern: /\b(i can't)\b(.+)/i,
      responses: [
        "How do you know you can't{1}?",
        "Perhaps you could{1} if you tried.",
        "What would it take for you to{1}?",
        "What prevents you from{1}?"
      ]
    },
    {
      pattern: /\b(are you)\b(.+)/i,
      responses: [
        "Why are you interested in whether I am{1}?",
        "Would you prefer if I weren't{1}?",
        "Perhaps in your fantasies I am{1}.",
        "Do you sometimes think I am{1}?"
      ]
    },
    {
      pattern: /\b(what|how|who|where|when|why)\b(.+)/i,
      responses: [
        "Why do you ask?",
        "Does that question interest you?",
        "What do you think?",
        "What answer would please you most?",
        "What comes to your mind when you ask that?",
        "Have you asked such questions before?"
      ]
    },
    {
      pattern: /\b(because)\b(.+)/i,
      responses: [
        "Is that the real reason?",
        "Don't any other reasons come to mind?",
        "Does that reason seem to explain anything else?",
        "What other reasons might there be?"
      ]
    },
    {
      pattern: /\b(sorry|apologize)\b/i,
      responses: [
        "Please don't apologize.",
        "Apologies are not necessary.",
        "What feelings do you have when you apologize?",
        "Don't be so defensive!"
      ]
    },
    {
      pattern: /\b(dream|dreams)\b/i,
      responses: [
        "What does that dream suggest to you?",
        "Do you dream often?",
        "What persons appear in your dreams?",
        "Are you disturbed by your dreams?"
      ]
    },
    {
      pattern: /\b(maybe|perhaps|possibly)\b/i,
      responses: [
        "You don't seem quite certain.",
        "Why the uncertain tone?",
        "Can't you be more positive?",
        "You aren't sure?"
      ]
    },
    {
      pattern: /\b(no)\b/i,
      responses: [
        "Are you saying 'no' just to be negative?",
        "You are being a bit negative.",
        "Why not?",
        "Why 'no'?"
      ]
    },
    {
      pattern: /\b(my mother|my father|my family|my brother|my sister)\b/i,
      responses: [
        "Tell me more about your family.",
        "Who else in your family comes to mind?",
        "What does your family have to do with your feelings?",
        "How do you feel about your family?"
      ]
    },
    {
      pattern: /\b(yes)\b/i,
      responses: [
        "You seem quite certain.",
        "I see.",
        "I understand.",
        "Can you elaborate on that?"
      ]
    },
    {
      pattern: /\b(always)\b/i,
      responses: [
        "Can you think of a specific example?",
        "When?",
        "Really, always?",
        "Always?"
      ]
    },
    {
      pattern: /\b(think|thinking)\b(.+)/i,
      responses: [
        "Do you doubt{1}?",
        "What makes you think{1}?",
        "Do you really think so?",
        "But you're not sure?"
      ]
    },
    {
      pattern: /\b(friend|friends)\b/i,
      responses: [
        "Why do you bring up the topic of friends?",
        "Do your friends worry you?",
        "Do your friends pick on you?",
        "Are you sure you have any real friends?"
      ]
    },
    {
      pattern: /\b(computer|computers|machine|machines)\b/i,
      responses: [
        "Do computers worry you?",
        "Why do you mention computers?",
        "What do you think machines have to do with your problem?",
        "Don't you think computers can help people?"
      ]
    }
  ];

  const defaults = [
    "Please go on.",
    "That's quite interesting.",
    "Tell me more about that.",
    "Can you elaborate on that?",
    "How does that make you feel?",
    "What does that suggest to you?",
    "I see.",
    "Very interesting.",
    "I understand.",
    "And what does that tell you?",
    "How do you feel when you say that?"
  ];

  const reflect = (text) => {
    const words = text.toLowerCase().split(' ');
    return words.map((word) => reflections[word] || word).join(' ');
  };

  const getElizaResponse = (input) => {
    const cleanInput = input.toLowerCase().replace(/[.,!?;:]/g, '');

    for (const pair of patterns) {
      const match = cleanInput.match(pair.pattern);
      if (match) {
        const response = pair.responses[Math.floor(Math.random() * pair.responses.length)];

        if (match[2]) {
          const reflected = reflect(match[2].trim());
          return response.replace('{1}', ' ' + reflected);
        }
        return response;
      }
    }

    lastDefaultIndexRef.current = (lastDefaultIndexRef.current + 1) % defaults.length;
    return defaults[lastDefaultIndexRef.current];
  };

  const handleSubmit = () => {
    const input = inputValue.trim();
    if (!input) return;

    // Add user message
    setMessages((prev) => [...prev, { text: input, isUser: true }]);
    setInputValue('');
    setIsTyping(true);

    // Simulate ELIZA thinking delay
    setTimeout(() => {
      const response = getElizaResponse(input);
      setMessages((prev) => [...prev, { text: response, isUser: false }]);
      setIsTyping(false);
    }, 800 + Math.random() * 800);
  };

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const styles = {
    container: {
      width: '100%',
      maxWidth: '700px',
      background: '#000',
      border: '2px solid #00ff00',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
      fontFamily: '"Courier New", monospace',
      color: '#00ff00',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
      paddingBottom: '15px',
      borderBottom: '1px solid #00ff00'
    },
    title: {
      fontSize: '24px',
      marginBottom: '5px',
      textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
      margin: '0 0 5px 0'
    },
    subtitle: {
      fontSize: '12px',
      opacity: 0.8,
      margin: '2px 0'
    },
    chatContainer: {
      height: '400px',
      overflowY: 'auto',
      marginBottom: '20px',
      padding: '10px',
      background: '#0a0a0a',
      border: '1px solid #00ff00',
      borderRadius: '4px'
    },
    message: {
      marginBottom: '15px',
      lineHeight: 1.4,
      color: '#00ff00'
    },
    userMessage: {
      color: '#00ff00'
    },
    elizaMessage: {
      color: '#00ff00',
      paddingLeft: '20px',
      opacity: 0.9
    },
    inputContainer: {
      display: 'flex',
      gap: '10px'
    },
    input: {
      flex: 1,
      background: '#0a0a0a',
      border: '1px solid #00ff00',
      color: '#00ff00',
      padding: '10px',
      fontFamily: '"Courier New", monospace',
      fontSize: '14px',
      borderRadius: '4px',
      outline: 'none'
    },
    button: {
      background: '#00ff00',
      color: '#000',
      border: 'none',
      padding: '10px 20px',
      fontFamily: '"Courier New", monospace',
      fontWeight: 'bold',
      cursor: 'pointer',
      borderRadius: '4px',
      transition: 'all 0.3s'
    },
    typingIndicator: {
      color: '#00ff00',
      opacity: 0.5,
      fontStyle: 'italic',
      paddingLeft: '20px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>ELIZA</h1>
        <p style={styles.subtitle}>Computer Psychotherapist - MIT, 1966</p>
        <p style={styles.subtitle}>Created by Joseph Weizenbaum</p>
      </div>

      <div style={styles.chatContainer} ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={message.isUser ? styles.userMessage : styles.elizaMessage}
          >
            {message.isUser ? '> ' : 'ELIZA: '}
            {message.text}
          </div>
        ))}
        {isTyping && (
          <div style={styles.typingIndicator}>
            ELIZA is typing...
          </div>
        )}
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Type your response..."
          style={styles.input}
          autoFocus
        />
        <button
          type="button"
          onClick={handleSubmit}
          style={styles.button}
          onMouseEnter={(event) => {
            event.currentTarget.style.background = '#00dd00';
            event.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.background = '#00ff00';
            event.currentTarget.style.boxShadow = 'none';
          }}
        >
          SEND
        </button>
      </div>
    </div>
  );
};

export default ElizaChatbot;
