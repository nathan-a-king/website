# Blog Post Categories

Valid categories for blog posts, extracted from existing content.

## Primary Categories

### AI
**Topics**: Artificial intelligence, machine learning, LLMs, Claude, GPT, AI agents, AI infrastructure

**Example posts**:
- "The Mispricing of Understanding"
- "AI is Not a Feature"
- "The Mirror That Learned to Speak"
- "MCP Isn't Dead"

**Use when**: Discussing AI technology, capabilities, implications, or applications

---

### Engineering
**Topics**: Software development, architecture, coding practices, technical implementation, infrastructure

**Example posts**:
- "AI Learning About You"
- "Context Rot: The Hidden Tax on AI Development"
- "Building Memory for Writing"
- "Introducing Grindlab"

**Use when**: Covering technical details, implementation approaches, or engineering challenges

---

### Design
**Topics**: Product design, UI/UX, visual design, design systems, user experience

**Example posts**:
- "Nova: An Editor with a Soul"
- "Grindlab Flow"
- "Grindlab Optimization"
- "Start Your Engines"

**Use when**: Discussing design decisions, visual aesthetics, or user experience

---

### Product
**Topics**: Product strategy, product management, product decisions, user needs

**Example posts**:
- "Nova: An Editor with a Soul"

**Use when**: Focusing on product strategy, user needs, or product development

---

### Writing
**Topics**: Writing craft, content creation, prose, storytelling, writing tools

**Example posts**:
- "Building Memory for Writing"
- "Introducing Prose"

**Use when**: Discussing writing techniques, tools for writers, or the craft of writing

---

### Personal
**Topics**: Personal reflections, life experiences, self-awareness, introspection

**Example posts**:
- "A Life in Gigabytes"

**Use when**: Sharing personal stories, reflections, or experiences

---

### Strategy
**Topics**: Strategic thinking, business strategy, decision-making, planning

**Example posts**:
- "Two Minds, One War"

**Use when**: Exploring strategic concepts, frameworks, or decision-making approaches

---

### Leadership
**Topics**: Leadership principles, management, team dynamics, responsibility

**Example posts**:
- "Two Minds, One War"

**Use when**: Discussing leadership challenges, principles, or lessons

---

## Category Guidelines

### Choosing Categories

1. **Primary first**: Order categories by relevance (most relevant first)
2. **Limit to 2-3**: Don't over-categorize; choose the most relevant
3. **Be specific**: Prefer narrower categories when applicable
4. **Avoid overlap**: If "Engineering" already covers it, don't also add "Product"

### Category Combinations

**Common combinations**:
- `["AI", "Engineering"]` - Technical AI implementation posts
- `["Design", "Engineering"]` - Design system or UI engineering posts
- `["Writing", "AI", "Engineering"]` - AI writing tools or technical writing
- `["Strategy", "Leadership"]` - Strategic leadership insights

**Single category posts**: Use when the post clearly focuses on one topic
- `["AI"]` - Pure AI discussion
- `["Personal"]` - Personal reflections
- `["Design"]` - Pure design thinking

### Adding New Categories

When adding a new category:
1. Ensure it doesn't overlap with existing categories
2. Use title case (capitalize first letter)
3. Keep to single words when possible
4. Update this reference file
5. Consider if posts can be combined with existing categories

## Category Statistics

Based on current posts (as of last update):
- **AI**: Most common category (~12 posts)
- **Engineering**: Second most common (~8 posts)
- **Design**: Frequently used (~5 posts)
- **Writing**: Growing category (~2 posts)
- **Product**: Less common (~1 post)
- **Personal**: Occasional (~1 post)
- **Strategy**: Occasional (~1 post)
- **Leadership**: Occasional (~1 post)

## Validation

To check all categories in use:

```bash
rg "^categories:" content/posts/ | sort | uniq
```

To see category distribution:

```bash
rg "^categories:" content/posts/ | sort | uniq -c | sort -rn
```
