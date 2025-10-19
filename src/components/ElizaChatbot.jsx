import React, { useState, useRef, useEffect } from 'react';

const ElizaChatbot = () => {
  const [messages, setMessages] = useState([
    { text: "How do you do. Please tell me your problem.", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  
  // Enhanced ELIZA state
  const memoryRef = useRef({
    lastTopic: null,
    userStatements: [],
    keyTopics: [],
    name: null,
    previousResponses: [],
    emotionalState: 'neutral'
  });

  // Enhanced reflection rules including contractions and edge cases
  const reflections = {
    "am": "are",
    "was": "were",
    "i": "you",
    "i'd": "you would",
    "i've": "you have",
    "i'll": "you will",
    "i'm": "you are",
    "my": "your",
    "me": "you",
    "mine": "yours",
    "myself": "yourself",
    "are": "am",
    "you": "I",
    "you've": "I have",
    "you'll": "I will",
    "you'd": "I would",
    "you're": "I am",
    "your": "my",
    "yours": "mine",
    "yourself": "myself",
    "were": "was"
  };

  // Comprehensive keyword patterns with priority ranking
  const keywords = [
    {
      word: /\bsuicide\b|\bkill myself\b|\bend my life\b/i,
      rank: 1,
      decomp: [
        {
          match: /(.*)/,
          reasmb: [
            "I'm deeply concerned about what you're saying. Please reach out to a mental health professional or call a crisis helpline immediately.",
            "Your life has value. Please talk to someone who can help - a counselor, therapist, or call 988 for the Suicide & Crisis Lifeline.",
          ]
        }
      ]
    },
    {
      word: /\bcomputer\b|\bcomputers\b|\bmachine\b|\bmachines\b|\bbot\b|\bprogram\b/i,
      rank: 50,
      decomp: [
        {
          match: /(.*)/,
          reasmb: [
            "Do computers worry you?",
            "Why do you mention computers?",
            "What do you think machines have to do with your problem?",
            "Don't you think computers can help people?",
            "What about machines worries you?",
            "What do you think about machines?",
            "You don't think I am a computer program, do you?"
          ]
        }
      ]
    },
    {
      word: /\bname\b/i,
      rank: 15,
      decomp: [
        {
          match: /.*name is (\w+).*/i,
          reasmb: [
            "Nice to meet you, {0}. How can I help you today?",
            "Hello {0}. What brings you here?",
          ],
          memorize: true
        },
        {
          match: /(.*)/,
          reasmb: [
            "I am not interested in names.",
            "I've told you before, I don't care about names -- please continue.",
            "Names don't interest me."
          ]
        }
      ]
    },
    {
      word: /\bdream\b|\bdreams\b|\bdreamt\b|\bdreamed\b/i,
      rank: 3,
      decomp: [
        {
          match: /.*\bdream\b.*about(.*)/i,
          reasmb: [
            "What does dreaming about{0} suggest to you?",
            "Do you dream about{0} often?",
            "What persons appear in your dreams about{0}?",
            "Do you believe that dreams about{0} have something to do with your problem?"
          ]
        },
        {
          match: /(.*)/,
          reasmb: [
            "What does that dream suggest to you?",
            "Do you dream often?",
            "What persons appear in your dreams?",
            "Don't you believe that dream has something to do with your problem?",
            "Do you ever have nightmares?",
            "What recurring dreams do you have?"
          ]
        }
      ]
    },
    {
      word: /\bmother\b|\bmom\b|\bmommy\b|\bmama\b/i,
      rank: 2,
      decomp: [
        {
          match: /.*\b(mother|mom|mommy|mama)\b(.*)/i,
          reasmb: [
            "Tell me more about your mother.",
            "What was your relationship with your mother like?",
            "How do you think your mother feels about you?",
            "How does this relate to your feelings today?",
            "Good family relations are important.",
            "How did your mother treat you as a child?",
            "When you think of your mother, what comes to mind?"
          ],
          memorize: true
        }
      ]
    },
    {
      word: /\bfather\b|\bdad\b|\bdaddy\b|\bpapa\b/i,
      rank: 2,
      decomp: [
        {
          match: /.*\b(father|dad|daddy|papa)\b(.*)/i,
          reasmb: [
            "Tell me more about your father.",
            "How did your father make you feel?",
            "What influence did your father have on you?",
            "What else comes to your mind when you think of your father?",
            "Did you have trouble communicating with your father?",
            "How do you think your father feels about you?"
          ],
          memorize: true
        }
      ]
    },
    {
      word: /\bfamily\b|\bbrother\b|\bsister\b|\bsibling\b|\brelatives\b/i,
      rank: 2,
      decomp: [
        {
          match: /.*\b(family|brother|sister|sibling|relatives)\b(.*)/i,
          reasmb: [
            "Tell me more about your family.",
            "Who else in your family comes to mind?",
            "How did your family treat you?",
            "What does your family have to do with your feelings?",
            "Do you have trouble communicating with your family?",
            "Tell me about your relationship with your {0}."
          ]
        }
      ]
    },
    {
      word: /\bsorry\b|\bapologize\b|\bapology\b/i,
      rank: 5,
      decomp: [
        {
          match: /(.*)/,
          reasmb: [
            "Please don't apologize.",
            "Apologies are not necessary.",
            "I've told you that apologies are not required.",
            "It did not bother me. Please continue.",
            "What feelings do you have when you apologize?",
            "There's no need to apologize."
          ]
        }
      ]
    },
    {
      word: /\bremember\b|\brecall\b|\bmemory\b/i,
      rank: 5,
      decomp: [
        {
          match: /.*i remember (.*)/i,
          reasmb: [
            "Do you often think of {0}?",
            "Does thinking of {0} bring anything else to mind?",
            "What else do you recollect?",
            "Why do you remember {0} just now?",
            "What in the present situation reminds you of {0}?",
            "What is the connection between me and {0}?",
            "What else does {0} remind you of?"
          ]
        },
        {
          match: /.*do you remember (.*)/i,
          reasmb: [
            "Did you think I would forget {0}?",
            "Why do you think I should recall {0} now?",
            "What about {0}?",
            "What about {0} should I remember?",
            "You mentioned {0} before, didn't you?"
          ]
        }
      ]
    },
    {
      word: /\bif\b/i,
      rank: 3,
      decomp: [
        {
          match: /.*if (.*)/i,
          reasmb: [
            "Do you think it's likely that {0}?",
            "Do you wish that {0}?",
            "What do you know about {0}?",
            "Really, if {0}?",
            "What would you do if {0}?",
            "But what are the chances that {0}?",
            "What does this speculation lead to?"
          ]
        }
      ]
    },
    {
      word: /\b(i am|i'm)\b/i,
      rank: 10,
      decomp: [
        {
          match: /.*\b(i am|i'm)\s+(.+?)(\s+.*)?$/i,
          reasmb: [
            "How long have you been {1}?",
            "Do you believe it is normal to be {1}?",
            "Do you enjoy being {1}?",
            "Do you know anyone else who is {1}?",
            "Why do you think you are {1}?",
            "What makes you {1}?",
            "Is being {1} a problem for you?"
          ]
        }
      ]
    },
    {
      word: /\b(i feel|feeling)\b/i,
      rank: 8,
      decomp: [
        {
          match: /.*\bi feel\s+(.+)/i,
          reasmb: [
            "Tell me more about such feelings.",
            "Do you often feel {0}?",
            "Do you enjoy feeling {0}?",
            "Of what does feeling {0} remind you?",
            "What triggers these feelings of {0}?",
            "When do you most often feel {0}?"
          ],
          memorize: true
        }
      ]
    },
    {
      word: /\b(i can't|cannot|can't)\b/i,
      rank: 8,
      decomp: [
        {
          match: /.*\b(can't|cannot)\s+(.+)/i,
          reasmb: [
            "How do you know that you can't {1}?",
            "Have you tried to {1}?",
            "Perhaps you could {1} now.",
            "Do you really want to be able to {1}?",
            "What if you could {1}?",
            "What would it mean to you if you could {1}?",
            "What prevents you from being able to {1}?"
          ]
        }
      ]
    },
    {
      word: /\b(i don't|dont)\b/i,
      rank: 8,
      decomp: [
        {
          match: /.*\b(don't|dont)\s+(.+)/i,
          reasmb: [
            "Don't you really {1}?",
            "Why don't you {1}?",
            "Do you wish to be able to {1}?",
            "Does that trouble you?",
            "What makes you think you don't {1}?"
          ]
        }
      ]
    },
    {
      word: /\b(i need|i want|i wish)\b/i,
      rank: 9,
      decomp: [
        {
          match: /.*\b(need|want|wish)\s+(.+)/i,
          reasmb: [
            "What would it mean to you if you got {1}?",
            "Why do you {0} {1}?",
            "Suppose you got {1} soon?",
            "What if you never got {1}?",
            "What would getting {1} mean to you?",
            "How important is it that you get {1}?",
            "What stands in the way of getting {1}?"
          ],
          memorize: true
        }
      ]
    },
    {
      word: /\b(what|why|who|where|when|how)\b/i,
      rank: 15,
      decomp: [
        {
          match: /.*\b(what|why|who|where|when|how)\s+(.*)/i,
          reasmb: [
            "Why do you ask?",
            "Does that question interest you?",
            "What is it you really want to know?",
            "Are such questions much on your mind?",
            "What answer would please you most?",
            "What do you think?",
            "What comes to mind when you ask that?",
            "Have you asked such questions before?",
            "Have you asked anyone else?"
          ]
        }
      ]
    },
    {
      word: /\bbecause\b/i,
      rank: 12,
      decomp: [
        {
          match: /.*\bbecause\s+(.*)/i,
          reasmb: [
            "Is that the real reason?",
            "Don't any other reasons come to mind?",
            "Does that reason seem to explain anything else?",
            "What other reasons might there be?",
            "Are you sure that's the real reason?",
            "Could there be a deeper reason?"
          ]
        }
      ]
    },
    {
      word: /\b(yes|yeah|yep|sure|okay|ok)\b/i,
      rank: 20,
      decomp: [
        {
          match: /(.*)/,
          reasmb: [
            "You seem to be quite positive.",
            "You are sure.",
            "I see.",
            "I understand.",
            "Can you elaborate on that?",
            "Tell me more about that.",
            "How does that make you feel?"
          ]
        }
      ]
    },
    {
      word: /\b(no|nope|never)\b/i,
      rank: 20,
      decomp: [
        {
          match: /.*\bno one\s+(.*)/i,
          reasmb: [
            "Are you sure, no one {0}?",
            "Surely someone {0}.",
            "Can you think of anyone at all?",
            "Are you thinking of a very special person?",
            "Who, may I ask?",
            "You have a particular person in mind, don't you?"
          ]
        },
        {
          match: /(.*)/,
          reasmb: [
            "Are you saying no just to be negative?",
            "You are being a bit negative.",
            "Why not?",
            "Why 'no'?",
            "Can you elaborate on that?"
          ]
        }
      ]
    },
    {
      word: /\balways\b/i,
      rank: 10,
      decomp: [
        {
          match: /(.*)/,
          reasmb: [
            "Can you think of a specific example?",
            "When?",
            "What incident are you thinking of?",
            "Really, always?",
            "Do you really think it's always the case?",
            "Always seems like a strong word."
          ]
        }
      ]
    },
    {
      word: /\balike\b|\bsimilar\b|\bsame\b/i,
      rank: 10,
      decomp: [
        {
          match: /(.*)/,
          reasmb: [
            "In what way?",
            "What resemblance do you see?",
            "What does that similarity suggest to you?",
            "What other connections do you see?",
            "What do you suppose that resemblance means?",
            "Could there really be some connection?"
          ]
        }
      ]
    },
    {
      word: /\b(friend|friends|buddy|pal)\b/i,
      rank: 5,
      decomp: [
        {
          match: /(.*)/,
          reasmb: [
            "Why do you bring up the topic of friends?",
            "Do your friends worry you?",
            "Do your friends pick on you?",
            "Are you sure you have any real friends?",
            "Do you impose on your friends?",
            "Perhaps your love for your friends worries you."
          ]
        }
      ]
    }
  ];

  // Pre and post substitutions for better parsing
  const preSubstitutions = {
    "dont": "don't",
    "cant": "can't",
    "wont": "won't",
    "youre": "you're",
    "im": "i'm",
    "ive": "i've",
    "didnt": "didn't",
    "doesnt": "doesn't",
    "haven't": "have not",
    "hasn't": "has not",
    "won't": "will not",
    "wouldn't": "would not",
    "couldn't": "could not",
    "shouldn't": "should not",
    "aren't": "are not",
    "isn't": "is not",
    "wasn't": "was not",
    "weren't": "were not"
  };

  const postSubstitutions = {
    "you're": "I am",
    "you are": "I am",
    "i'm": "you are",
    "i am": "you are",
    "you": "me",
    "i": "you",
    "your": "my",
    "my": "your",
    "yours": "mine",
    "mine": "yours",
    "yourself": "myself",
    "myself": "yourself",
    "me": "you"
  };

  // Fallback responses when no keywords match
  const fallbacks = [
    "I'm not sure I understand you fully.",
    "Please go on.",
    "What does that suggest to you?",
    "Do you feel strongly about discussing such things?",
    "That is interesting. Please continue.",
    "Tell me more about that.",
    "Does talking about this bother you?",
    "Can you elaborate on that?",
    "Why do you say that just now?",
    "Is this something that's been on your mind?",
    "Let's explore that a bit more.",
    "What makes this important to you?",
    "I see. And how does that make you feel?",
    "Interesting. What else comes to mind?",
    "That's quite thought-provoking. Go on."
  ];

  const memoryResponses = [
    "Earlier you said your {0}. Tell me more about that.",
    "Does this relate to your statement about {0}?",
    "Let's discuss further why your {0}.",
    "Earlier you mentioned {0}. Does that still concern you?",
    "You seem to have strong feelings about {0}."
  ];

  // Complex reflection function
  const reflect = (text) => {
    let words = text.split(/\s+/);
    
    // Apply reflection word by word
    words = words.map(word => {
      const lowerWord = word.toLowerCase();
      return reflections[lowerWord] || word;
    });
    
    return words.join(' ');
  };

  // Enhanced preprocessing
  const preProcess = (text) => {
    let processed = text.toLowerCase().trim();
    
    // Apply pre-substitutions
    for (let [key, value] of Object.entries(preSubstitutions)) {
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      processed = processed.replace(regex, value);
    }
    
    // Remove extra spaces
    processed = processed.replace(/\s+/g, ' ');
    
    // Remove trailing punctuation for better matching
    processed = processed.replace(/[.!?]+$/, '');
    
    return processed;
  };

  // Main response generation with memory
  const getElizaResponse = (input) => {
    const memory = memoryRef.current;
    
    // Preprocess input
    const processed = preProcess(input);
    
    // Store user statement
    memory.userStatements.push(input);
    if (memory.userStatements.length > 10) {
      memory.userStatements.shift();
    }
    
    // Sort keywords by rank (lower rank = higher priority)
    const sortedKeywords = [...keywords].sort((a, b) => a.rank - b.rank);
    
    // Try to match keywords
    for (let keywordRule of sortedKeywords) {
      if (keywordRule.word.test(processed)) {
        // Found a matching keyword
        for (let decomp of keywordRule.decomp) {
          const match = processed.match(decomp.match);
          
          if (match) {
            // Store important topics in memory
            if (decomp.memorize && match[1]) {
              memory.keyTopics.push({
                topic: match[0],
                fragment: match[1],
                keyword: keywordRule.word.source
              });
            }
            
            // Get a random reassembly
            const responses = decomp.reasmb;
            const response = responses[Math.floor(Math.random() * responses.length)];
            
            // Replace placeholders with matched groups
            let finalResponse = response;
            for (let i = 0; i < match.length; i++) {
              if (match[i]) {
                const reflected = reflect(match[i]);
                finalResponse = finalResponse.replace(`{${i}}`, reflected);
              }
            }
            
            // Avoid repeating recent responses
            if (!memory.previousResponses.includes(finalResponse)) {
              memory.previousResponses.push(finalResponse);
              if (memory.previousResponses.length > 5) {
                memory.previousResponses.shift();
              }
              
              return finalResponse;
            }
          }
        }
      }
    }
    
    // If no keyword matched, possibly use memory
    if (memory.keyTopics.length > 0 && Math.random() < 0.3) {
      const topic = memory.keyTopics[Math.floor(Math.random() * memory.keyTopics.length)];
      const memResponse = memoryResponses[Math.floor(Math.random() * memoryResponses.length)];
      return memResponse.replace('{0}', topic.fragment);
    }
    
    // Fallback to generic response
    const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    return fallback;
  };

  const handleSubmit = () => {
    const input = inputValue.trim();
    if (!input) return;

    // Check for quit commands
    if (/^(quit|exit|bye|goodbye)$/i.test(input)) {
      setMessages(prev => [...prev, 
        { text: input, isUser: true },
        { text: "Goodbye. It was nice talking to you.", isUser: false }
      ]);
      setInputValue('');
      return;
    }

    // Add user message
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setInputValue('');
    setIsTyping(true);

    // Simulate ELIZA thinking with variable delay
    const thinkingTime = 600 + Math.random() * 1200;
    setTimeout(() => {
      const response = getElizaResponse(input);
      setMessages(prev => [...prev, { text: response, isUser: false }]);
      setIsTyping(false);
    }, thinkingTime);
  };

  // Auto-scroll to bottom
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
      color: '#00ff00',
      marginBottom: '15px',
      lineHeight: 1.4
    },
    elizaMessage: {
      color: '#00ff00',
      paddingLeft: '20px',
      opacity: 0.9,
      marginBottom: '15px',
      lineHeight: 1.4
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
    },
    hint: {
      fontSize: '10px',
      opacity: 0.6,
      textAlign: 'center',
      marginTop: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>ELIZA</h1>
        <p style={styles.subtitle}>A Computer Program for the Study of Natural Language</p>
        <p style={styles.subtitle}>MIT Artificial Intelligence Laboratory, 1966</p>
        <p style={styles.subtitle}>Joseph Weizenbaum</p>
      </div>
      
      <div style={styles.chatContainer} ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div 
            key={index} 
            style={message.isUser ? styles.userMessage : styles.elizaMessage}
          >
            {message.isUser ? '> ' : ''}
            {message.text}
          </div>
        ))}
        {isTyping && (
          <div style={styles.typingIndicator}>
            ...
          </div>
        )}
      </div>
      
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Please state your problem"
          style={styles.input}
        />
        <button 
          onClick={handleSubmit}
          style={styles.button}
          onMouseEnter={(e) => {
            e.target.style.background = '#00dd00';
            e.target.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#00ff00';
            e.target.style.boxShadow = 'none';
          }}
        >
          SEND
        </button>
      </div>
      
      <div style={styles.hint}>
        Type 'quit' or 'goodbye' to end session
      </div>
    </div>
  );
};

export default ElizaChatbot;
