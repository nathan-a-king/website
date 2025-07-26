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

![Embeddings query](/images/posts/UI.jpeg)

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
  {    slug: "context-engineering",
    title: "Context Engineering",
    date: "July 12, 2025",
    excerpt: "AI-first products demand a different approach. It's not just about embedding a model...",
    content: `
In the [previous article](https://nathanaking.com/journal/post-determinism-correctness-and-confidence), I explored how the rise of AI and large language models has transformed our understanding of software correctness from a binary concept to a spectrum of confidence. The article examined various approaches to measuring AI output reliability, from model-reported confidence metrics like token probabilities to external validation through semantic similarity scoring. We also discussed how domain specificity and input quality constraints can improve confidence scoring reliability. These concepts set the foundation for implementing practical confidence scoring in AI applications.

While the corpus of information available to large language models is impressive, they often lack specific domain knowledge. When the LLM lacks the information necessary to fulfill the query, it will confabulate a plausible sounding answer. Therefore, our first task is to anticipate the information required for this assistant. We become [_context engineers_](https://blog.langchain.com/the-rise-of-context-engineering/), providing access to the relevant information without exposing too much irrelevant information.

Being a context engineer means recognizing that the quality of an AI model’s response is often more dependent on the input context than the underlying model architecture. Unlike traditional software, where deterministic functions operate on fixed inputs, generative AI systems rely on probabilistic reasoning shaped by subtle cues in the prompt and available context. This shifts the developer’s role: instead of hardcoding logic, we sculpt the environment in which the model thinks. We design retrieval pipelines, manage prompt structure, and filter information windows so the model has access to exactly what it needs — no more, no less. This makes context engineering a hybrid discipline of UX design, information architecture, and knowledge curation, demanding both technical precision and editorial judgment.

## Enter the Vector Store

To engineer useful context, we need a mechanism for retrieving relevant information at the right time — and that’s where [vector stores](https://python.langchain.com/docs/concepts/vectorstores/) come in. A vector store allows us to represent chunks of text as high-dimensional embeddings, making it possible to search for semantically similar content rather than relying on exact keyword matches. Instead of manually curating prompts or hardcoding rules, we can embed documents, code snippets, FAQs, or product data, then query that store based on the user’s intent. This enables dynamic retrieval of the most relevant context, tailored to the specific question, which is then injected into the model’s prompt. In essence, vector stores make it possible to give an LLM a memory — not of everything, but of the right things at the right time.

Traditional databases struggle in this role — they’re designed for structured queries and exact matches, not the fuzzy, meaning-based retrieval that LLMs require. They’re also too slow when dealing with the volume and variety of unstructured information modern applications demand.

Vector stores solve this by enabling fast, semantic search over unstructured data. Here’s how they work:

1. Raw text is transformed into _embeddings_ — high-dimensional numerical representations that capture the semantic meaning of the content.
2. These embeddings are stored as vectors in the database, where their position in space reflects meaning.
3. Vectors with similar meanings cluster near each other, even if the original text differs in wording.

When a user submits a query, it’s also converted into an embedding and compared against the stored vectors. The most semantically similar chunks are retrieved and injected into the model’s context window — enabling it to reason over custom knowledge as if it were native to the model.

Let's explore what this looks like in a simple implementation of an agent specializing in knowledge about Apple Silicon. I've stored over 65,000 lines of information about Apple Silicon in over a hundred different markdown documents and stored them in a list named \`documents\`.

We'll begin by converting these markdown documents into embeddings. Here's what they look like. Our information has been reduced to pure mathematics:
    `},
  {
    slug: "ai-first-workflows",
    title: "Designing for AI-First Workflows",
    date: "July 12, 2025",
    excerpt: "AI-first products demand a different approach. It's not just about embedding a model...",
    content: `
When ChatGPT first arrived, the chat interface felt fresh—almost magical. For the first time, anyone could type a question, a prompt, or even a vague musing into a box and get back something surprisingly coherent, sometimes even profound. It was playful, frictionless, and conversational.

That novelty gave generative AI its mainstream moment. The chat paradigm was simple enough to onboard millions and powerful enough to hint at something revolutionary. But novelty doesn’t scale, and magic doesn’t sustain workflows. We're now stuck in a chatbot trap. Every major tech company has now bolted an AI chatbot onto their products—Microsoft has Copilot, Google has Bard, Slack has Claude, and seemingly every startup has their own variation. Each promises revolutionary capabilities, but they all share the same fundamental flaw: they force users to stop what they're doing, open a chat window, and attempt to translate their needs into a prompt.

The real opportunity now lies in embedding AI into **sophisticated, task-oriented interfaces**—not as a gimmick, but as a deeply integrated assistant that respects the user’s intent, context, and expertise. Especially for power users, the current paradigm is failing, and failing spectacularly.

The chat interface is a productivity bottleneck—a useful metaphor for conversation—but a terrible interface for complex work. The next wave of AI-native products shouldn’t aim to replace existing workflows with generic chatbots. They should embed AI inside the workflow, augmenting tools like notebooks, CRMs, design software, IDEs, and dashboards.

## The Power of Context

The tight integration of AI into the user’s workspace not only allows users to leverage AI without context switching, but it provides the model with the crucial context awareness needed to become a creative partner to the user. Instead of operating in a vacuum, the AI can draw on the surrounding information—the document being written, the code being edited, the data being analyzed, or the customer record being reviewed—to offer more relevant, precise, and timely contributions.

This transforms the interaction from a disconnected Q&A into a dynamic collaboration, where the AI isn’t just responding to isolated prompts but actively supporting the user's broader goals. The result is a smoother, more intelligent workflow—one that feels less like issuing commands and more like working alongside a trusted assistant who understands the bigger picture.

## Nonlinear Interaction

Nonlinear interaction means breaking free from the rigid, turn-based structure of chat. In most current interfaces, each interaction is treated as a one-way exchange: you ask a question, the AI responds, and the thread continues forward. But real work is rarely linear. Creative and analytical tasks require detours, iterations, backtracking, and branching exploration.

Users don’t just want to react to AI output—they want to revisit earlier steps, tweak specific parts of a prompt or dataset, fork different approaches, and compare outcomes side by side. The interaction model needs the ability to maintain multiple concurrent threads of exploration, to branch and merge ideas, to version and rollback changes. They want a workspace where ideas can evolve in parallel, not a conveyor belt of prompts disappearing into a scrolling void.

## The Path Forward

Ultimately, AI should enhance existing workflows—not replace them with inferior interaction patterns. The best AI tools won’t ask users to leave their environment or reframe their problem in prompt-speak. They’ll **meet users where they are**, elevate their work, and disappear into the background when not needed.

he next generation of AI tools will be judged not by how well they chat, but by how seamlessly they integrate into our existing workflows. We need tools that:

- Preserve context and maintain state across sessions
- Support branching and versioning of AI-assisted work
- Provide granular control over AI involvement
- Integrate naturally with existing software ecosystems
- Respect user privacy and data sovereignty

The chatbot era served its purpose—it showed us what was possible. Now it's time to build something better.
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
