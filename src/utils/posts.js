// Fallback to inline content for now - the file-based system needs more setup
const realPosts = [
  {
    slug: "beyond-chatbot",
    title: "Let's Move Beyond the Chatbot",
    date: "July 19, 2025",
    excerpt: "When ChatGPT first launched, the chat interface felt novel and even magical...",
    content: `
When ChatGPT first launched, the chat interface felt **novel** and even *magical*. You could type a question and receive a thoughtful answer in plain English. It was like talking to a super-intelligent friend who never slept.

But over time, we've started to feel the limits of this format. Power users don't just want to chat. They want to **build**, **explore**, and **execute**. Copying answers from chat into other tools is tedious. 

> The future isn't just smarter AI—it's better interfaces for working alongside it.

## The Problem with Chat

AI should enhance your workflow, not interrupt it. The next generation of AI tools won't just answer questions—they'll help you:

- Write and edit documents
- Code and debug programs  
- Organize and structure information
- Design and prototype ideas
- Solve problems within context

That's the leap we need to make: **from chatbot to creative partner**.
    `
  },
  {
    slug: "ai-first-workflows",
    title: "Designing for AI-First Workflows",
    date: "July 12, 2025",
    excerpt: "AI-first products demand a different approach. It's not just about embedding a model...",
    content: `
AI-first products demand a different approach. It's not just about embedding a model—it's about **rethinking the entire user experience**.

## Key Principles

We need tools that are:

1. **Context-aware** - Understanding where you are and what you're working on
2. **Continuously learning** - Adapting to your patterns and preferences  
3. **Deeply integrated** - Seamlessly woven into existing workflows

> The magic happens when AI isn't a feature, but a co-pilot.

The best AI tools don't feel like tools. They feel like *extensions of your own thinking*.

### The Future is Collaborative

Instead of asking AI to do things **for** you, the future is about AI working **with** you in real-time, augmenting your capabilities without disrupting your flow.
    `
  },
  {
    slug: "chat-interface-limits",
    title: "Why the Chat Interface Is Holding Us Back",
    date: "July 5, 2025",
    excerpt: "Chat interfaces are flexible, but they're not always the right fit...",
    content: `
Chat interfaces are flexible, but they're not always the right fit. Sometimes, you need **structure**. 

## Beyond the Text Box

Think about how we actually organize thought:

- **Tables** for comparing options
- **Forms** for structured input
- **Timelines** for sequential planning  
- **Canvases** for spatial thinking
- **Diagrams** for relationships

When we constrain AI to a text box, we limit its potential. 

> The challenge now is to design interfaces that surface the full power of the model—without drowning the user in complexity.

### The Path Forward

The next wave of AI interfaces will be:

1. **Multi-modal** - Supporting text, images, voice, and gestures
2. **Contextual** - Adapting to the task at hand
3. **Collaborative** - Enabling real-time co-creation
4. **Invisible** - Feeling natural and intuitive

*The best interface is the one you don't notice.*
    `
  }
];

export function getAllPosts() {
  // Return the posts, sorted by date (newest first)
  return realPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPostBySlug(slug) {
  const posts = getAllPosts();
  return posts.find(post => post.slug === slug);
}
