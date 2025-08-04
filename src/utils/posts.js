// Fallback to inline content for now - the file-based system needs more setup
const realPosts = [
{
    slug: "voyage-context-3",
    title: "Voyage Context 3: The Future of RAG?",
    date: "August 3, 2025",
    excerpt: "With Voyage's new voyage-context-3 model, developers can simplify their pipelines while improving answer quality across complex documents.",
    content: `
I was immediately intrigued by [Voyage AI's recent blog article](https://blog.voyageai.com/2025/07/23/voyage-context-3/) introducing \`voyage-context-3\`, a new contextualized chunk embedding model. The model offers an elegant approach to resolving a core tension in Retrieval-Augmented Generation (RAG): balancing fine-grained precision from smaller chunks with the need for broader contextual understanding.

## The Core Dilemma

**Smaller chunks provide focused detail but lose global context.** When you break a large document into small segments, each chunk can capture very specific, granular information with high precision. However, these isolated chunks lack the broader document context that may be essential for understanding and answering queries accurately.

Smaller chunks excel at capturing *precise, fine-grained information*. The announcement illustrates this with a legal contract example: if you have a 50-page document vectorized as a single embedding, specific details like "All data transmissions between the Client and the Service Provider's infrastructure shall utilize AES-256 encryption in GCM mode" would likely get buried or lost in the aggregate representation.

By chunking the document into paragraphs, the resulting embeddings can much better capture these localized technical details like "AES-256 encryption," making retrieval more accurate for specific factual queries. However, that same precisely-chunked paragraph about AES-256 encryption may not contain global context like the client's name, which appears elsewhere in the document.

Traditional workarounds to this issue include chunk overlapping and metadata augmentation, which introduce complexity, increase development time and marginal costs. Voyage AI's solution claims to provide focused detail and global context **without tradeoffs.** Let's take a look at how we can incorporate this into an application.

Let's remove our old chunking code:

\`\`\`py
# Standard embedding
chunk_embds = vo.embed(
    texts=[record["chunk"] for record in all_chunks],
    model="voyage-3-large",
    input_type="document"
).embeddings
\`\`\`

And replace it with contextualized embeddings:

\`\`\`py
# Contextualized embedding model
query_embd_context = vo.contextualized_embed(inputs=[[query]],
model="voyage-context-3", input_type="query").results[0].embeddings[0]

embds_obj = vo.contextualized_embed(
    inputs=texts,
    model="voyage-context-3",
    input_type="document"
)

contextualized_chunk_embds = [emb for r in embds_obj.results
for emb in r.embeddings]
\`\`\`

That's it! You can use your same semantic similarity search with contextualized chunk embeddings. Let's look at how it performs in real-world use.

Using [MikeRoyal's Apple Silicon Guide](https://github.com/mikeroyal/Apple-Silicon-Guide) as input,we posed a question that requires synthesizing information across multiple sections:

\`query = "What are the differences between M1 Pro and M2 Max performance specs?"\`

Standard embedding models return the following results:

\`\`\`text
To compare the performance specifications of the M1 Pro and M2 Max, 
we can look at several key areas, including CPU performance, GPU performance, 
memory bandwidth, and overall architecture enhancements.

1. **CPU Performance**:
   - The M1 Pro features up to 10 CPU cores, with a mix of high-performance 
     and high-efficiency cores. It is designed to handle demanding tasks
     efficiently.
   - The M2 Max, on the other hand, offers an enhanced architecture with up to 
     12 CPU cores, which provides improved performance for multi-threaded 
     applications and overall processing power.

2. **GPU Performance**:
   - The M1 Pro comes with a GPU that can have up to 16 cores, which is capable 
     of handling graphics-intensive tasks and providing good performance for 
     creative applications.
   - The M2 Max significantly boosts this capability with up to 38 GPU cores, 
     offering a substantial increase in graphics performance, making it more 
     suitable for professional video editing, 3D rendering, and other 
     graphics-heavy workloads.

3. **Memory Bandwidth**:
   - The M1 Pro has a memory bandwidth of 200 GB/s, which is quite high and 
     supports efficient data transfer for demanding applications.
   - The M2 Max increases this further, providing a memory bandwidth of 400 GB/s, 
     allowing for even faster data access and processing, which is crucial for 
     high-performance computing tasks.

4. **Unified Memory**:
   - The M1 Pro supports up to 32 GB of unified memory, which allows for 
     efficient memory usage across the CPU and GPU.
   - In contrast, the M2 Max supports up to 96 GB of unified memory, enabling 
     it to handle larger datasets and more demanding applications without 
     performance bottlenecks.

5. **Architecture Enhancements**:
   - The M2 Max benefits from architectural improvements over the M1 Pro, 
     including better power efficiency and enhanced performance per watt. 
     This means that while the M2 Max is more powerful, it also manages 
     power consumption more effectively.

In summary, the M2 Max outperforms the M1 Pro in several critical areas: 
it has more CPU and GPU cores, higher memory bandwidth, greater unified 
memory capacity, and overall architectural enhancements that contribute to 
better performance and efficiency. These improvements make the M2 Max 
particularly well-suited for professional users who require top-tier 
performance for demanding tasks.
\`\`\`

With voyage-context-3, we can get the following results:
\`\`\`text
Based on the document, here are the key performance specification 
differences between the M1 Pro and M2 Max:

M1 Pro Specifications:
- CPU: 8 or 10-core system-on-a-chip (SoC)
- GPU: 14-core or 16-core options
- Memory: Up to 32GB of unified memory
- Memory bandwidth: Up to 200GB/s
- Target devices: MacBook Pro 14"

M2 Max Specifications:
- CPU: 12-core (12 high-performance and 4 energy-efficient cores)
- GPU: 38-core
- Memory: Up to 96GB of unified memory
- Memory bandwidth: 400GB/s
- Neural Engine: 16-core
- Target devices: MacBook Pro 14", MacBook Pro 16", and Mac mini

Key Performance Differences:
Performance Improvements (M2 Max vs M1 Pro):
- 20% faster CPU performance
- 30% faster GPU performance
- 40% faster Neural Engine performance

Capacity Improvements:
- 3x more maximum memory (96GB vs 32GB)
- 2x higher memory bandwidth (400GB/s vs 200GB/s)
- More than 2x GPU cores (38 vs 14-16 cores)
- More CPU cores (12 vs 8-10 cores)

The M2 Max represents a significant step up from the M1 Pro, positioning 
it as Apple's most powerful chip in the M2-series lineup at the time of 
this document, designed for the most demanding professional workloads 
requiring substantial computational power and memory capacity.
\`\`\`

The result is a more accurate and contextually aware answer that seamlessly draws from multiple sections of the document. This is a powerful example of how contextualized embeddings can enhance the performance of RAG systems, providing both precision and broader context without the need for complex workarounds.
    `
},
{
  slug: "path-to-profitability",
  title: "The Path to Profitability",
  date: "July 28, 2025",
  excerpt: "The next trillion-dollar tech company won't be built by creating the best AI model—it will be built by controlling how, where, and why people use AI.",
  content: `
The next trillion-dollar tech company won't be built by creating the best AI model—it will be built by controlling how, where, and why people use AI. Just as Microsoft didn't win the PC era by making the best chips, today's AI leaders are racing not just to build better models, but to become the indispensable platform through which AI is accessed and deployed. Last quarter, over 50% of all venture capital funding went to AI-focused companies, totaling more than $60 billion of investment. The extreme rate with which VC firms are pouring money into Artificial Intelligence begs an important question: what is the path to profitability for companies like OpenAI?

AI startups have a relatively straightforward revenue model – subscription-based pricing for access to cutting-edge models and usage-based pricing for access to the API. Extremely high R&D and capital costs make attracting more paid users a requirement, but doing this also increases their marginal costs of inference. Therefore, paid users must offset their own marginal costs while subsidizing the costs of free users before beginning to chip away at those massive fixed costs that investors are currently covering. How can these aggressive revenue numbers be achieved without the assistance of external capital?

OpenAI and the other labs creating foundation models have no competitive moat and few products that fit wide swaths of the market. They have APIs that allow developers to create products, but that further commoditizes their main strength.

## The Moat of the Personal Computer Revolution

Let’s look at the first transformational change in technology to see how our current future might play out. Much like our foundation models today, the integrated circuit and transistor were commodities. The moat that helped lock in decades of Windows/Intel hegemony was Microsoft’s platform deals.

It wasn’t the hardware itself that dictated dominance, but the strategic positioning of software as a control point—Windows became the layer through which users interacted with computing, and Intel became the default engine beneath. The real power lay not in the invention, but in the ecosystem built around it: developer tools, third-party software, enterprise integrations, and, most critically, distribution deals that ensured Windows shipped on nearly every PC.

Foundation models may be the new transistors—powerful, essential, but increasingly commoditized. The question becomes: who builds the new “Windows” for AI? Will it be a developer platform, a ubiquitous interface layer, or a vertically integrated product experience? The companies that succeed in building sticky platforms around foundation models—whether through proprietary data, user workflows, or ecosystem lock-in—may become the long-term leaders in artificial intelligence.

It’s interesting to note the trend of OpenAI enhancing its API with features typically reserved for subscribers at a faster pace. They’re also adding features to their API that will make it more difficult for developers to switch model providers. Look no further than how their new responses API compares to the original chat completions API. The new API is stateful, which makes it both easier to build solutions with and far more difficult to switch out with the API of another provider.

But there’s another layer to this. We’re seeing the early signs of this platform consolidation. Just as Microsoft leveraged pre-installation deals and developer incentives to make Windows indispensable, today’s AI leaders are racing to become the default platform on which others build. Microsoft’s investment in OpenAI, Anthropic’s partnership with Amazon, and Google’s embedding of Gemini into its product suite all mirror those earlier moves—where distribution, not just innovation, becomes the true competitive edge. The players who control not just the models, but the channels of user interaction—browsers, operating systems, productivity tools, search, or even chip infrastructure—are best positioned to own the AI era.

We’re entering a phase where control over context becomes as important as control over compute. Just as Windows became the context for productivity and the web browser the context for search, whoever owns the AI context—how, where, and why users invoke intelligence—will shape the future. That’s the real platform play.
  `
},
  {
    slug: "apple-missing-ai-race",
    title: "Apple is Missing the AI Race",
    date: "July 27, 2025",
    excerpt: "Apple is failing to implement artificial intelligence in a way that plays to their greatest strengths.",
    content: `
Apple has two major advantages in the AI race. Their ARM-based SoC’s unified memory architecture allows the GPU and Neural Engine access to far more RAM than competitors. This architectural advantage allows excellent performance of smaller models running on device as the context window grows. Each token requires a key/value pair, which causes the memory footprint to quickly grow as individual conversations get longer. Apple is not taking advantage of their most valuable resource, the platform advantage – access to *all* of my personal data.  

[Mark Gurman at Bloomberg reports:](https://www.bloomberg.com/news/articles/2025-02-14/apple-s-long-promised-ai-overhaul-for-siri-runs-into-bugs-possible-delays?srnd=phx-technology)

> “The goal is to ultimately offer a more versatile Siri that can seamlessly tap into customers’ information and communication. For instance, users will be able to ask for a file or song that they discussed with a friend over text. Siri would then automatically retrieve that item. Apple also has demonstrated the ability for Siri to quickly locate someone’s driver’s license number by reviewing their photos.”

This is Apple’s competitive differentiator and where Apple should have focused its resources from the start. Why can't I ask questions about my archived email or find correlations in exercise volume and sleep quality within the Health app?  

Apple’s real AI advantage isn’t just hardware — it’s the platform. A company that prides itself on tight integration across devices should be leading in AI that understands *me*. The ability to surface insights from my personal data, securely and privately, is where Apple could create the most compelling user experience.
    `

  },
  {
    slug: "beyond-the-chatbot",
    title: "Beyond the Chatbot",
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
