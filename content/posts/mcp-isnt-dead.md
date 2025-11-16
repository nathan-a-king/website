---
slug: mcp-isnt-dead
title: "No, MCP Isn't Dead"
date: November 16, 2025
excerpt: "Everyone's declaring MCP dead after Anthropic's new agent pattern. They're wrong. The pattern doesn't kill MCP—it finally shows what it was built for."
categories: ["AI"]
---

Every few months, the AI world goes through a familiar ritual: a new idea appears, Twitter catches fire, and someone declares that something foundational has become obsolete. Anthropic’s new code-execution pattern is the latest spark, and the proclamation arrived right on schedule:

> *“MCP is dead.”*

It’s not. In fact, the opposite is true. The pattern everyone is excited about only works because Model Context Protocol exists—and uses it more deeply than any agent system we've seen so far. The confusion comes from misunderstanding what MCP actually is.

When you read Anthropic's examples, they're disarmingly simple. The model writes TypeScript. It imports modules:

```typescript
import { searchCustomers } from './servers/crm/searchCustomers.ts'
```

It runs code in a sandbox. It feels like a normal development loop—just one staffed by a neural network instead of a junior engineer.

But look at that import path again.

Where does `./servers/crm/` come from? The model didn't create it. The sandbox didn't conjure it from nowhere. Something had to register that a "crm" server exists, expose "searchCustomers" as a typed, importable function, mount the server at a discoverable path in the filesystem, and provide type definitions so TypeScript knows what to autocomplete.

That "something" is MCP.

This isn't speculation. Anthropic's engineering team published [a detailed technical breakdown](https://www.anthropic.com/engineering/code-execution-with-mcp) explaining exactly how the new pattern works:

> "MCP provides a foundational protocol for agents to connect to many tools and systems."

The architecture they describe organizes MCP servers as a filesystem hierarchy. Each server becomes a directory (`google-drive`, `salesforce`). Each tool becomes a TypeScript file (`getDocument.ts`). Agents explore the environment by listing `./servers/` to discover available integrations, then read specific tool files to understand their interfaces.

The model treats MCP servers as code libraries. Same servers. Same protocol. Just exposed differently.

And here's the critical part: Anthropic could have built a new protocol for this pattern. They didn't. They used MCP—the same open protocol they released a year ago—because it already solves exactly this problem.

Building a competing protocol would fragment the ecosystem of community-built MCP servers, break compatibility with existing tools, force developers to maintain dual implementations, and fundamentally undermine MCP's core purpose: interoperability across agents.

Instead, they showed us what MCP was designed for. Not just tool calling, but tool *composition*. The pattern doesn't replace the protocol. It validates it.

And because the experience looks so natural—imports instead of JSON, code instead of prompts—many observers assume the underlying protocol must have changed. Tools look like modules and resources look like files. Therefore, the thinking goes, MCP must be gone.

But that's like mistaking a web framework for the death of HTTP.

The abstraction became cleaner, so the protocol disappeared from view. The protocol didn't die. It matured. When infrastructure is well-designed, it becomes invisible.

## Anthropic Didn't Replace MCP. They Showed Us What It's For.

The most interesting part of the new agent pattern is not that the model writes code. It's that the model treats tools like *libraries*. A tool is no longer an opaque endpoint you summon with JSON and hope for the best. It's a module you import from a real path.

And that path is not a trick. It's MCP's virtual filesystem—the model can freely write within its workspace; MCP server directories are readable, typed, and discoverable but not mutated.

The model can explore the environment that tools expose because MCP standardizes how those tools present themselves. Without MCP, there would be no servers to discover, no resources to read, no typed stubs to import, and no stable boundary between the model and the sandbox that executes its code.

What Anthropic built is not a replacement for MCP. It’s MCP finally being used to its full potential.

## The Real Shift: Moving Computation Out of the Model

For years, agents have been built around a simple loop:

1. The model reads the prompt.
2. The model calls a tool.
3. The tool does something.
4. The model summarizes the result.

This worked, but it was clumsy. Everything had to pass through the model's context window. The model needed to see every piece of raw data. It had to decide which tool to call based on natural language descriptions of capabilities. And because it was reasoning inside its own probabilistic fog, the whole pipeline was fragile and expensive.

Anthropic's pattern breaks that loop. The model doesn't operate on data anymore—it writes code that does.

By treating MCP servers as importable libraries instead of context-embedded tool definitions, the pattern achieves what Anthropic calls "a time and cost saving of 98.7%"—reducing token usage from 150,000 to 2,000 tokens for the same capability set. The heavy lifting of aggregating and transforming data moves into the sandbox.

The model only sees the distilled, meaningful pieces. And because the sandbox has a real filesystem and real modules, the model can build multi-step workflows that would have been unwieldy or impossible with traditional tool calls.

But again: the only reason the model *has* a filesystem, and *has* modules, and *has* a workspace at all, is because MCP defines those abstractions.

People declaring MCP dead are missing the architecture right beneath their feet.

## Protocols Don’t Disappear When Patterns Change

The easiest way to see the relationship is this:

**MCP is the protocol.**
  The stable interface. The boundary. The transport. The contract.

**Anthropic’s pattern is the architecture.**
  The strategy for using that interface intelligently and efficiently.

This is the same separation we see in existing architectural patterns—HTTP didn’t die when React arrived and Linux syscalls didn’t die when Docker containers became the norm. When a clean abstraction appears, the underlying layer becomes easier to ignore. That doesn’t make the layer obsolete. It makes it fundamental.

Anthropic’s system is MCP finally being *expressed*.

## The Kernel Moment

Most people think of MCP as “tool calling, but standardized.” That was always the least interesting interpretation. MCP was designed as a *kernel*—a way for models to interact with the world beyond the prompt.

Anthropic’s pattern treats it that way. It doesn’t ask the model to remember tool names, tool schemas, or natural-language descriptions. It gives the model a filesystem and lets code imports do the explanation. It gives the agent a workspace and lets TypeScript become the planning language. It turns tool orchestration into software engineering instead of prompt gymnastics.

The result feels different enough that observers assume the underlying layer must have changed. It hasn’t. It finally came into focus.

The whole point of protocols is that they fade beneath good design. Anthropic’s agent pattern doesn’t kill MCP. It fulfills its original promise: a clean contract between models and tools, invisible when you want it to be, powerful when you need it.

If you want to know whether MCP is dead, here's the simplest test: 

Take the new agent pattern and remove MCP. What happens?

Every existing MCP server stops working. The Postgres server, the GitHub server, the Slack server, the filesystem server—all built by the community over the past year—become incompatible. You'd need to rewrite each one for the new protocol.

Every other MCP client loses access to those tools. The pattern becomes Anthropic-specific instead of ecosystem-wide and interoperability disappears. Tools built for this agent can't be used by other agents. Tools built for other agents can't be imported here. The open specification gets replaced by a proprietary one, and third-party development would grind to a halt.

The pattern doesn't just break. It becomes a walled garden. The pattern only works because MCP exists. Agents didn't outgrow the protocol, they finally showed us the full potential of MCP.

---

## References

Jones, Adam, and Conor Kelly. "Code Execution with MCP: Building More Efficient Agents." Anthropic. November 4, 2025. https://www.anthropic.com/engineering/code-execution-with-mcp.
