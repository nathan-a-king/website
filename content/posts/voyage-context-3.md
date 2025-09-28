---
slug: voyage-context-3
title: "Voyage Context 3: The Future of RAG?"
date: August 3, 2025
excerpt: "With Voyage's new voyage-context-3 model, developers can simplify their pipelines while improving answer quality across complex documents."
category: "AI"
---

I was immediately intrigued by [Voyage AI's recent blog article](https://blog.voyageai.com/2025/07/23/voyage-context-3/) introducing `voyage-context-3`, a new contextualized chunk embedding model. The model offers an elegant approach to resolving a core tension in Retrieval-Augmented Generation (RAG): balancing fine-grained precision from smaller chunks with the need for broader contextual understanding.

## The Core Dilemma

**Smaller chunks provide focused detail but lose global context.** When you break a large document into small segments, each chunk can capture very specific, granular information with high precision. However, these isolated chunks lack the broader document context that may be essential for understanding and answering queries accurately.

Smaller chunks excel at capturing *precise, fine-grained information*. The announcement illustrates this with a legal contract example: if you have a 50-page document vectorized as a single embedding, specific details like "All data transmissions between the Client and the Service Provider's infrastructure shall utilize AES-256 encryption in GCM mode" would likely get buried or lost in the aggregate representation.

By chunking the document into paragraphs, the resulting embeddings can much better capture these localized technical details like "AES-256 encryption," making retrieval more accurate for specific factual queries. However, that same precisely-chunked paragraph about AES-256 encryption may not contain global context like the client's name, which appears elsewhere in the document.

Traditional workarounds to this issue include chunk overlapping and metadata augmentation, which introduce complexity, increase development time and marginal costs. Voyage AI's solution claims to provide focused detail and global context **without tradeoffs.** Let's take a look at how we can incorporate this into an application.

Let's remove our old chunking code:

```py
# Standard embedding
chunk_embds = vo.embed(
    texts=[record["chunk"] for record in all_chunks],
    model="voyage-3-large",
    input_type="document"
).embeddings
```

And replace it with contextualized embeddings:

```py
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
```

That's it! You can use your same semantic similarity search with contextualized chunk embeddings. Let's look at how it performs in real-world use.

Using [MikeRoyal's Apple Silicon Guide](https://github.com/mikeroyal/Apple-Silicon-Guide) as input,we posed a question that requires synthesizing information across multiple sections:

`query = "What are the differences between M1 Pro and M2 Max performance specs?"`

Standard embedding models return the following results:

```text
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
```

With voyage-context-3, we can get the following results:
```text
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
```

The result is a more accurate and contextually aware answer that seamlessly draws from multiple sections of the document. This is a powerful example of how contextualized embeddings can enhance the performance of RAG systems, providing both precision and broader context without the need for complex workarounds.