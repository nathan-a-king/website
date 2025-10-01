---
slug: building-memory-for-writing
title: "Building Memory for Writing"
date: September 28, 2025
excerpt: "I built a RAG system to query my own writing. What started as a weekend experiment became a mirror for understanding my own voice."
categories: ["Writing", "AI", "Engineering"]
---

Writers accumulate words the way servers accumulate logs—relentlessly, continuously, without pause. Blog posts, essays, project documentation, half-finished drafts. Over years, it becomes a corpus. Over a career, it becomes overwhelming.

I have dozens of blog posts scattered across Markdown files. Each one captured a thought, a project, a moment of clarity about some problem I was solving. But memory fades. I'd find myself asking: *Did I already write about this? What was that insight I had about AI-native design? Where did I talk about prompt engineering?*

The answer was always the same: dig through files, search manually, hope I remembered the right keywords. It felt archaic. We have better tools now. So I built one.

## The Problem: Context Without Search

Traditional search works when you know what you're looking for. You type keywords, you get matches, you scan results. It's deterministic, mechanical, and often frustrating when your memory is fuzzy.

What I wanted was different: **semantic search over my own writing.** Not keyword matching, but meaning matching. I wanted to ask questions like *"What have I written about RAG systems?"* or *"How did I explain the difference between features and foundations?"* and get back not just documents, but synthesized answers drawn from everything I'd written.

This is the promise of Retrieval-Augmented Generation: give an AI access to your documents, let it find the relevant pieces, and have it answer questions with context it couldn't have learned during training. It's search that understands meaning, paired with generation that understands synthesis.

## The Stack: Mastra, Voyage, and LibSQL

I built this on [Mastra](https://mastra.ai), a TypeScript framework for AI agents and workflows. Mastra handles the orchestration—agents, tools, workflows, memory—letting me focus on the logic instead of the plumbing.

For embeddings, I used [Voyage AI's voyage-3-large model](https://www.nateking.dev/blog/voyage-context-3). Voyage specializes in high-quality embeddings, and voyage-3-large produces 1024-dimensional vectors that capture semantic meaning with impressive precision. I've been watching their work closely—contextualized embeddings are solving real problems in RAG systems, and their models consistently outperform alternatives in retrieval accuracy.

For storage, I went with LibSQL, a SQLite fork that Mastra already uses. No external dependencies, no database servers, just a local file that stores embeddings as binary blobs. Cosine similarity search happens in-memory. It's simple, fast, and eliminates infrastructure complexity.

The architecture is straightforward:

1. **Document Ingestion Workflow**: Read Markdown files → chunk them into ~800 token segments with 200 token overlap → generate embeddings → store in vector database
2. **Query Workflow**: User asks a question → embed the query → search for similar chunks → pass results to GPT-4o → synthesize an answer

No external APIs beyond OpenAI and Voyage. No authentication layers. No deployment complexity. Just a tool that works.

## Implementation: Workflows, Not Scripts

What makes Mastra elegant is its workflow model. Instead of writing scripts with manual orchestration, you define steps and chain them together. Each step has an input schema, an output schema, and an execute function. Mastra handles the rest.

Here's the ingestion workflow:

```typescript
const readDocuments = createStep({
  id: 'read-documents',
  execute: async ({ inputData }) => {
	const result = await markdownReaderTool.execute({
	  context: { directoryPath: inputData.directoryPath }
	});
	return result;
  }
});

const generateEmbeddings = createStep({
  id: 'generate-embeddings',
  execute: async ({ inputData }) => {
	const { chunks } = inputData;
	const texts = chunks.map(chunk => chunk.content);

	const result = await voyageEmbeddingTool.execute({
	  context: { texts, inputType: 'document' }
	});

	return { embeddings: result.embeddings, chunks };
  }
});

const storeEmbeddings = createStep({
  id: 'store-embeddings',
  execute: async ({ inputData }) => {
	await vectorStoreTool.execute({
	  context: { chunks: inputData.embeddings }
	});
	return { success: true };
  }
});

export const documentIngestionWorkflow = createWorkflow({
  id: 'document-ingestion-workflow'
})
  .then(readDocuments)
  .then(generateEmbeddings)
  .then(storeEmbeddings);
```

Three steps, clear dependencies, automatic error handling. When I run this workflow, it processes every Markdown file in my `documents/` directory, generates embeddings in batches to stay under API rate limits, and stores everything in LibSQL. The entire corpus of my writing gets vectorized in a few minutes.

The query side is even simpler:

```typescript
const processQuery = createStep({
  id: 'process-query',
  execute: async ({ inputData, mastra }) => {
	const agent = mastra?.getAgent('writingAssistantAgent');
	const response = await agent.stream([
	  { role: 'user', content: inputData.query }
	]);

	// Stream response to stdout
	for await (const chunk of response.textStream) {
	  process.stdout.write(chunk);
	}
  }
});
```

The agent has access to a `semanticSearchTool` that embeds the query, retrieves relevant chunks, and returns them as context. GPT-4o does the synthesis. The result feels conversational, but it's grounded in my actual writing.

![](/images/posts/mastra-document-ingestion.png)

## What I Learned: Context Is Everything

Building this system reinforced something I already knew but hadn't fully internalized: **chunking strategy matters.**

At first, I tried simple splits—just break documents every 1000 characters. The results were terrible. Chunks cut off mid-sentence, context vanished, and retrieval became a game of luck. A query about "AI-native design" would return fragments that mentioned AI but missed the design philosophy entirely.

The fix was semantic chunking: split on natural boundaries (paragraphs, headings), keep chunks around 800 tokens, and overlap by 200 tokens so context flows between segments. This preserved narrative structure and dramatically improved retrieval quality.

I also learned that **input\_type matters** with Voyage embeddings. When generating embeddings for storage, you set `input_type: 'document'`. When embedding a query, you set `input_type: 'query'`. This subtle difference optimizes the vector space for asymmetric search—queries and documents occupy the same space but encode different information densities.

## The Meta Moment: Asking It to Write This Post

After building the system, I had a realization: *What if I asked it to write a blog post about itself?*

So I did. I ran the query workflow and typed: *"Take a look at my blog posts and write a post about this project in my style."*

The system scanned my writing, identified patterns in how I structure posts, recognized my preference for direct technical explanations mixed with reflective commentary, and generated a draft. Not this post—I'm still the one writing—but a draft that captured the voice well enough to make me pause.

It's strange to see your own style reflected back at you. The system picked up on my tendency to open with a problem, my habit of using blockquotes for emphasis, my preference for concrete examples over abstract theory. It even nailed the tone: pragmatic, slightly wry, grounded in building actual things.

This is what AI-native tools should feel like: not replacing the work, but augmenting it. Not writing for you, but helping you see your own patterns more clearly.

## What's Next: Memory as a Creative Tool

Right now, this system is read-only. It ingests documents, answers questions, and that's it. But the next step is obvious: **make it bidirectional.**

What if the writing assistant could track recurring themes across my work? What if it could suggest connections between ideas I've explored in different posts? What if it could identify gaps—topics I've touched on but never fully developed?

Memory isn't just storage. It's context, continuity, and coherence. For writers, it's the difference between scattered thoughts and a body of work that builds on itself.

AI gives us the tools to make that memory queryable, searchable, and generative. We're not just storing words anymore—we're building systems that understand them, connect them, and help us see what we've been saying all along.

## The Craft of Building AI Tools

There's a particular satisfaction in building tools for yourself. No product requirements, no stakeholder meetings, no compromise between vision and feasibility. Just a problem you have, a tool you build, and the immediate feedback of using it daily.

This project took a weekend to build and another week to refine. The code is clean, the dependencies are minimal, and the system does exactly what I need. It's not a product. It's not a startup. It's a tool that makes my writing practice better.

And that's enough.

---

*The writing-agent project is built with [Mastra](https://mastra.ai), [Voyage AI embeddings](https://voyageai.com), and LibSQL. All code lives in a single repository, runs locally, and costs pennies per query. It's open-source and can be found in [my GitHub repository](https://github.com/nathan-a-king/rag-writing-assistant).*