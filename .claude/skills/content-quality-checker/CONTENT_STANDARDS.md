## Content Standards

Writing and formatting guidelines for blog posts.

## Structure

### Frontmatter
Every post must have valid YAML frontmatter:
```yaml
---
slug: descriptive-slug
title: "Compelling Title"
date: November 17, 2025
excerpt: "Hook the reader in under 160 characters."
categories: ["Category1", "Category2"]
---
```

### Opening
- **First paragraph**: Hook the reader, establish context
- **First image**: Place early for social sharing (og:image)
- **Length**: 2-4 sentences, set expectations

### Body
- **Headings**: Use `##` for main sections, `###` for subsections
- **Paragraphs**: Keep under 5 sentences for readability
- **Lists**: Use for scannable content
- **Examples**: Include code blocks or images to illustrate points

### Conclusion
- **Closing thought**: Tie back to opening
- **Call to action**: What should reader do/think?
- **Links**: Related posts or external resources

## Writing Style

### Voice and Tone
- **Personal but professional**: First person okay, maintain expertise
- **Active voice preferred**: "I built this" not "This was built by me"
- **Conversational**: Write how you'd explain to a colleague
- **Confident**: State opinions clearly, back them with reasoning

### Clarity
- **One idea per sentence**: Complex ideas need simple sentences
- **Concrete over abstract**: Use specific examples
- **Jargon awareness**: Define technical terms or assume appropriate audience level
- **Transitions**: Connect paragraphs and sections smoothly

### Engagement
- **Questions**: Use rhetorical questions to engage reader
- **Storytelling**: Use narrative structure when appropriate
- **Examples**: Real-world applications and use cases
- **Controversy**: Take positions, but defend them

## Formatting

### Headings
- **Hierarchy**: Don't skip levels (H2 → H4)
- **Descriptive**: Heading should summarize section
- **Parallel structure**: Use consistent grammatical form
- **Length**: Keep under 60 characters

**Good heading examples**:
- "The Mind That Contracted"
- "Why Bundle Size Matters"
- "Three Approaches to State Management"

**Bad heading examples**:
- "Introduction" (not descriptive)
- "Some Thoughts About the Thing I Mentioned Before" (too long)
- "lol this is broken" (not professional)

### Code Blocks
Always specify language for syntax highlighting:

````markdown
```javascript
function example() {
  return "This has highlighting";
}
```
````

**Languages to use**:
- `javascript` or `js`
- `typescript` or `ts`
- `python` or `py`
- `bash` or `shell`
- `yaml`
- `json`
- `html`
- `css`
- `markdown` or `md`

**Code block guidelines**:
- Keep under 50 lines when possible
- Add comments for complex logic
- Show complete, runnable examples
- Use consistent indentation (2 spaces)
- Remove unnecessary code

### Lists
Use lists for:
- Multiple related items
- Steps in a process
- Scannable content
- Comparisons

**Unordered lists** (bullets):
```markdown
- First item
- Second item
- Third item
```

**Ordered lists** (numbers):
```markdown
1. First step
2. Second step
3. Third step
```

**Nested lists**:
```markdown
- Main item
  - Sub item
  - Another sub item
- Another main item
```

### Images
All images must:
- Have descriptive alt text
- Exist in `public/images/`
- Be web-optimized (WebP, compressed JPEG/PNG)
- Use descriptive filenames

**Good image usage**:
```markdown
![Dashboard showing three charts: user growth, engagement, and revenue](/images/dashboard-overview.png)
```

**Bad image usage**:
```markdown
![](/images/img1.png)
![screenshot](/images/screenshot.png)
```

**Image guidelines**:
- Alt text describes what's shown, not just labels it
- Place first image early (for social sharing)
- Keep files under 200 KB
- Consider dark mode variants (use `-dark-` in filename)

### Links
**Internal links** to other posts:
```markdown
[Related post about leadership](/blog/two-minds-one-war)
```

**External links**:
```markdown
[React documentation](https://react.dev)
```

**Link text guidelines**:
- Describe the destination
- Avoid "click here" or "read more"
- Make links stand out with surrounding text

**Good link text**:
- "Read my analysis of [AI learning patterns](/blog/ai-learning-about-you)"
- "See the [React Router documentation](https://reactrouter.com)"

**Bad link text**:
- "[Click here](/blog/some-post) to read more"
- "Visit [this link](https://example.com)"

### Emphasis
- **Bold** for emphasis and key terms
- *Italic* for subtle emphasis or terms
- `Code` for technical terms, file names, commands

**Good emphasis usage**:
```markdown
The **key insight** is that context management *fundamentally* changes how we think about `state`.
```

**Don't overuse**:
```markdown
**Everything** is *emphasized* which means `nothing` is.
```

### Blockquotes
Use for:
- Quotes from other sources
- Highlighting key insights
- Callouts or asides

```markdown
> This is the psychological detail that matters: He needed the numbers to be true.
```

## Content Quality

### Length Guidelines
- **Minimum**: 500 words (with exceptions for technical tutorials)
- **Optimal**: 800-1500 words
- **Maximum**: 3000 words (consider splitting longer posts)

### Readability
- **Sentences**: Average 15-20 words
- **Paragraphs**: 3-5 sentences
- **Headings**: Every 200-300 words
- **Reading level**: Aim for 8th-10th grade (Flesch-Kincaid)

### Technical Accuracy
- **Test code**: Ensure all code examples work
- **Link validity**: Check links are current
- **Fact checking**: Verify claims and statistics
- **Version awareness**: Note software versions if relevant

### SEO Optimization
- **Title**: Under 60 characters, include keywords
- **Excerpt**: Under 160 characters, compelling hook
- **Headings**: Include relevant keywords naturally
- **First paragraph**: Set context with keywords
- **Images**: Descriptive alt text and filenames

## Accessibility

### WCAG 2.1 AA Compliance
- **Alt text**: All images must have descriptive alt text
- **Heading hierarchy**: Logical, no skipped levels
- **Link text**: Descriptive, not "click here"
- **Color**: Don't rely on color alone for meaning
- **Contrast**: Text must meet 4.5:1 ratio (handled by theme)

### Screen Reader Friendly
- **Proper HTML semantics**: Markdown generates good HTML
- **Descriptive headings**: Help navigation
- **Alt text**: Describe what's shown, not just label
- **Link context**: Links make sense out of context

## Common Mistakes to Avoid

### Writing
- ❌ Starting too abstractly without context
- ❌ Using jargon without explanation
- ❌ Overly long paragraphs (> 7 sentences)
- ❌ No clear takeaway or conclusion

### Formatting
- ❌ Code blocks without language tags
- ❌ Images without alt text
- ❌ Skipping heading levels (H2 → H4)
- ❌ Broken internal links

### Content
- ❌ Untested code examples
- ❌ Broken external links
- ❌ Outdated information without context
- ❌ Missing categories or incorrect frontmatter

## Quality Checklist

Before publishing, verify:

**Structure**:
- [ ] Valid frontmatter with all required fields
- [ ] Clear opening paragraph
- [ ] Logical heading hierarchy
- [ ] Meaningful conclusion

**Writing**:
- [ ] Active voice throughout
- [ ] Clear, concise sentences
- [ ] Proper grammar and spelling
- [ ] Consistent voice and tone

**Formatting**:
- [ ] All code blocks have language tags
- [ ] All images have descriptive alt text
- [ ] Links are properly formatted
- [ ] Lists are parallel in structure

**Technical**:
- [ ] Code examples tested and working
- [ ] Links are valid (internal and external)
- [ ] Images exist and are optimized
- [ ] Technical claims are accurate

**SEO**:
- [ ] Title under 60 characters
- [ ] Excerpt under 160 characters
- [ ] First image present for social sharing
- [ ] Relevant categories selected

**Accessibility**:
- [ ] Alt text for all images
- [ ] Heading hierarchy is logical
- [ ] Link text is descriptive
- [ ] Content is screen-reader friendly

## Post Length Recommendations

### Short Posts (500-800 words)
Good for:
- Quick tips or insights
- Announcements
- Simple tutorials
- Link roundups

### Medium Posts (800-1500 words)
Good for:
- How-to guides
- Opinion pieces
- Case studies
- Technical explanations

### Long Posts (1500-3000 words)
Good for:
- In-depth tutorials
- Comprehensive guides
- Essay-style analysis
- Multi-part comparisons

### Very Long (3000+ words)
Consider splitting into series or standalone pieces. Requires:
- Table of contents
- Clear section breaks
- Compelling narrative
- Exceptional value to justify length
