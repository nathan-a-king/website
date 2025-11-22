# Custom Agent Skills for Website

This directory contains custom Claude Code Agent Skills tailored to this React/Vite personal website and blog.

## Overview

These skills provide specialized capabilities for managing blog content, validating builds, maintaining design consistency, and optimizing SEO. They leverage the progressive disclosure architecture of Agent Skills: lightweight metadata loads at startup, detailed instructions load on-demand, and executable scripts run only when needed.

**Agent Workflows**: This system includes 4 specialized agents (slash commands) that orchestrate these skills for common workflows:
- `/publish-post` - Complete content publishing workflow
- `/qa-check` - Pre-deployment validation
- `/design-audit` - Design system compliance
- `/perf-check` - Bundle performance monitoring

See the [Agent Workflows](#agent-workflows) section below for details.

## Available Skills

### 1. blog-post-manager
**Create, validate, and enhance blog posts**

**Trigger keywords**: "create blog post", "new post", "validate post", "check frontmatter"

**Capabilities**:
- Create new posts using templates
- Validate YAML frontmatter (slug, title, date, excerpt, categories)
- Auto-generate excerpts from content
- Suggest internal links to related posts
- Extract images for social sharing
- Category management and validation

**Key scripts**:
- `scripts/validate-frontmatter.js` - Validates post frontmatter
- `scripts/suggest-links.js` - Suggests related post links
- `CATEGORIES.md` - Valid category reference

**Usage**:
```bash
# Create new post
npm run new-post "Post Title" "Optional excerpt"

# Validate frontmatter
node .claude/skills/blog-post-manager/scripts/validate-frontmatter.js content/posts/post.md

# Get link suggestions
node .claude/skills/blog-post-manager/scripts/suggest-links.js content/posts/post.md
```

---

### 2. build-validator
**Validate production builds and deployment readiness**

**Trigger keywords**: "run build", "validate build", "check bundle size", "test deployment"

**Capabilities**:
- Run and validate production builds
- Check build output completeness
- Analyze bundle sizes with historical tracking
- Test production server endpoints
- Verify SEO meta tags and structured data
- Flag bundle size regressions

**Key scripts**:
- `scripts/bundle-analysis.js` - Bundle size analysis
- `scripts/health-check.js` - Server health checks
- `THRESHOLDS.md` - Bundle size thresholds

**Usage**:
```bash
# Build and validate
npm run build:validate

# Analyze bundle sizes
node .claude/skills/build-validator/scripts/bundle-analysis.js

# Save baseline
node .claude/skills/build-validator/scripts/bundle-analysis.js --save-baseline

# Health check (server must be running)
npm start &
node .claude/skills/build-validator/scripts/health-check.js
```

---

### 3. content-quality-checker
**Validate markdown content quality and accessibility**

**Trigger keywords**: "check content", "validate links", "check images", "markdown quality"

**Capabilities**:
- Validate markdown syntax
- Check internal and external links
- Verify image paths and alt text
- Ensure accessibility (WCAG AA)
- Check heading hierarchy
- Validate code block language tags
- Content structure analysis

**Key scripts**:
- `scripts/check-post.js` - Main validation
- `CONTENT_STANDARDS.md` - Writing guidelines

**Usage**:
```bash
# Check single post
node .claude/skills/content-quality-checker/scripts/check-post.js content/posts/post.md

# Check all posts
for file in content/posts/*.md; do
  node .claude/skills/content-quality-checker/scripts/check-post.js "$file"
done
```

---

### 4. seo-metadata-manager
**Generate and validate SEO metadata**

**Trigger keywords**: "SEO", "meta tags", "social sharing", "structured data", "sitemap"

**Capabilities**:
- Generate page and post metadata
- Validate Open Graph tags
- Check Twitter Card tags
- Verify structured data (JSON-LD)
- Sitemap validation
- Social media optimization
- Title and description length checks

**Key files**:
- `SKILL.md` - SEO best practices and validation

**Related files**:
- `src/utils/seo.js` - Runtime SEO utilities
- `scripts/prerender.js` - Build-time SEO generation
- `server.js` - Server-side meta injection

**Usage**:
SEO is managed automatically through existing build pipeline and React utilities. This skill provides guidance and validation.

---

### 5. design-system-guardian
**Maintain design system consistency**

**Trigger keywords**: "check colors", "validate design system", "dark mode", "accessibility check"

**Capabilities**:
- Validate color usage (adaptive vs static)
- Ensure dark mode coverage
- Check CSS/Tailwind config sync
- Accessibility contrast validation
- Find hardcoded colors
- Design system documentation

**Key files**:
- `SKILL.md` - Design system guidelines

**Related files**:
- `COLOR_SYSTEM.md` - Color system documentation
- `src/styles/globals.css` - CSS custom properties
- `tailwind.config.js` - Tailwind configuration

**Usage**:
The skill provides guidelines for maintaining the design system. Scripts would be used to audit color usage and validate consistency.

---

## Skill Architecture

### Progressive Disclosure

Each skill follows the three-level loading pattern:

**Level 1: Metadata** (always loaded, ~100 tokens)
- `name` and `description` in YAML frontmatter
- Loaded at Claude startup in system prompt

**Level 2: Instructions** (loaded when triggered, ~2-5k tokens)
- Main SKILL.md content with workflows and guidance
- Loaded via bash when skill is needed

**Level 3: Resources** (loaded as needed, unlimited)
- Bundled scripts, reference files, templates
- Accessed via bash commands or file reads
- Scripts execute without loading into context

### File Structure

```
.claude/skills/
├── README.md (this file)
├── blog-post-manager/
│   ├── SKILL.md (main instructions)
│   ├── CATEGORIES.md (reference)
│   └── scripts/
│       ├── validate-frontmatter.js
│       └── suggest-links.js
├── build-validator/
│   ├── SKILL.md
│   ├── THRESHOLDS.md (reference)
│   └── scripts/
│       ├── bundle-analysis.js
│       └── health-check.js
├── content-quality-checker/
│   ├── SKILL.md
│   ├── CONTENT_STANDARDS.md (reference)
│   └── scripts/
│       └── check-post.js
├── seo-metadata-manager/
│   ├── SKILL.md
│   └── scripts/ (optional)
└── design-system-guardian/
    ├── SKILL.md
    └── scripts/ (optional)
```

## Integration with Workflow

### Content Publishing Workflow

Use multiple skills together for end-to-end publishing:

```bash
# 1. Create new post
npm run new-post "Post Title" "Compelling excerpt under 160 chars"

# 2. Validate frontmatter (blog-post-manager)
node .claude/skills/blog-post-manager/scripts/validate-frontmatter.js content/posts/new-post.md

# 3. Check content quality (content-quality-checker)
node .claude/skills/content-quality-checker/scripts/check-post.js content/posts/new-post.md

# 4. Preview locally
npm run dev

# 5. Build and validate (build-validator)
npm run build:validate

# 6. Commit and deploy
git add content/posts/new-post.md
git commit -m "Add new post: Post Title"
git push
```

### Pre-Deployment Checklist

Before deploying:

1. **Content validation**:
   ```bash
   # Validate all posts
   for file in content/posts/*.md; do
     node .claude/skills/blog-post-manager/scripts/validate-frontmatter.js "$file"
     node .claude/skills/content-quality-checker/scripts/check-post.js "$file"
   done
   ```

2. **Build validation**:
   ```bash
   npm run build:validate
   ```

3. **Bundle analysis**:
   ```bash
   node .claude/skills/build-validator/scripts/bundle-analysis.js
   ```

4. **Health check**:
   ```bash
   npm start &
   sleep 3
   node .claude/skills/build-validator/scripts/health-check.js
   ```

## How Claude Uses These Skills

### Automatic Triggering

Claude automatically uses skills based on user requests:

**Example 1**: "Create a new blog post about AI"
→ Triggers `blog-post-manager`
→ Runs `npm run new-post "AI Post Title"`
→ Validates frontmatter
→ Checks content quality

**Example 2**: "Build the site and make sure everything is ready to deploy"
→ Triggers `build-validator`
→ Runs `npm run build`
→ Validates build output
→ Checks bundle sizes
→ Runs health checks

**Example 3**: "Check if this post is SEO-optimized"
→ Triggers `seo-metadata-manager` and `content-quality-checker`
→ Validates meta tags
→ Checks title/excerpt length
→ Verifies images for social sharing

### Skill Composition

Skills work together for complex tasks:

**Publishing workflow**:
1. `blog-post-manager` - Create and validate post
2. `content-quality-checker` - Check quality
3. `seo-metadata-manager` - Verify SEO
4. `build-validator` - Build and validate

**Design audit**:
1. `design-system-guardian` - Check color usage
2. `content-quality-checker` - Verify image alt text
3. `build-validator` - Ensure CSS builds correctly

## Development

### Adding New Skills

To add a new skill:

1. Create directory: `.claude/skills/new-skill/`
2. Create `SKILL.md` with frontmatter:
   ```yaml
   ---
   name: new-skill
   description: What it does and when to use it
   ---
   ```
3. Add instructions in markdown
4. Bundle any scripts in `scripts/` directory
5. Test with Claude

### Updating Existing Skills

To update a skill:

1. Edit `SKILL.md` for new instructions
2. Update scripts if needed
3. Test changes with Claude
4. Update this README if capabilities change

### Script Development

Guidelines for bundled scripts:

- Use ES modules (import/export)
- Add shebang: `#!/usr/bin/env node`
- Make executable: `chmod +x script.js`
- Accept file paths as arguments
- Return non-zero exit code on errors
- Format output clearly (emoji, colors OK)

## Best Practices

### For Users

1. **Be specific**: "Check the new blog post for quality issues"
2. **Combine tasks**: "Create a new post, validate it, and build"
3. **Trust automation**: Skills handle details, you focus on content

### For Skill Authors

1. **Clear descriptions**: Help Claude know when to use the skill
2. **Standalone scripts**: Scripts should work independently
3. **Helpful output**: Scripts should format output clearly
4. **Error handling**: Graceful failures with actionable messages
5. **Documentation**: Keep SKILL.md up to date

## Maintenance

### Regular Tasks

**Weekly**:
- Run content quality checks on all posts
- Review bundle sizes for regressions
- Update baselines after major changes

**Monthly**:
- Review category usage and consolidate
- Check for broken external links
- Audit color usage for consistency

**As Needed**:
- Update thresholds after infrastructure changes
- Add new categories to CATEGORIES.md
- Update SEO best practices

## Troubleshooting

### Skill Not Triggering

**Issue**: Claude doesn't use a skill when expected

**Solutions**:
1. Check description includes relevant keywords
2. Be more explicit in request
3. Directly reference skill: "Use the blog-post-manager skill to..."

### Script Errors

**Issue**: Bundled script fails

**Solutions**:
1. Check file paths are absolute or relative to project root
2. Verify dependencies are installed
3. Run script directly to see error: `node .claude/skills/skill-name/scripts/script.js`

### Slow Performance

**Issue**: Skill loading feels slow

**Solutions**:
1. Keep SKILL.md under 5000 tokens
2. Use more scripts, less instructions
3. Split large skills into focused skills

## Agent Workflows

In addition to the skills above, this system includes 4 specialized **agent workflows** implemented as slash commands. These agents orchestrate multiple skills to complete complex, multi-step tasks autonomously.

### Available Agents

#### 1. `/publish-post` - Content Publisher Agent

**Purpose**: Complete end-to-end blog post publishing workflow

**What it does**:
1. Creates or validates blog post
2. Validates frontmatter (blog-post-manager)
3. Checks content quality (content-quality-checker)
4. Suggests internal links (blog-post-manager)
5. Validates SEO optimization (seo-metadata-manager)
6. Starts preview server for user review
7. Runs production build (build-validator)
8. Commits to git (with user approval)

**When to use**:
- "Publish my new blog post"
- "Create and publish a post about X"
- "Help me publish the post I just wrote"

**Skills used**: blog-post-manager, content-quality-checker, seo-metadata-manager, build-validator

**Example**:
```
User: /publish-post
Agent: I'll guide you through publishing a blog post. Do you want to create a new post or validate an existing one?
User: Validate content/posts/my-new-post.md
Agent: [Runs validation, checks quality, shows SEO score, builds, asks for approval, commits]
```

---

#### 2. `/qa-check` - Quality Assurance Agent

**Purpose**: Comprehensive pre-deployment validation

**What it does**:
1. Runs test suite
2. Validates all blog posts (blog-post-manager)
3. Checks content quality on all posts (content-quality-checker)
4. Runs production build
5. Analyzes bundle sizes (build-validator)
6. Validates SEO metadata (seo-metadata-manager)
7. Tests production server (build-validator)
8. Checks design system consistency (design-system-guardian)
9. Validates accessibility
10. Generates comprehensive QA report
11. Provides deployment recommendation

**When to use**:
- "Run QA before deployment"
- "Make sure everything is ready to deploy"
- "Check if the site is production-ready"

**Skills used**: All 5 skills

**Example**:
```
User: /qa-check
Agent: Running comprehensive QA checks...
[Runs all validations]
Agent: ✅ All checks passed! Site is ready for deployment.
      93/100 score - Excellent condition.
```

---

#### 3. `/design-audit` - Design Consistency Agent

**Purpose**: Ensure design system consistency and compliance

**What it does**:
1. Loads design system context
2. Scans for hardcoded colors
3. Validates adaptive color usage
4. Analyzes dark mode coverage
5. Checks CSS/Tailwind config sync
6. Validates accessibility (WCAG AA)
7. Checks color contrast ratios
8. Audits key components
9. Identifies design violations
10. Generates design audit report with compliance score
11. Provides specific fix recommendations

**When to use**:
- "Audit the design system"
- "Check dark mode coverage"
- "Make sure colors are consistent"
- "Validate design system compliance"

**Skills used**: design-system-guardian, content-quality-checker

**Example**:
```
User: /design-audit
Agent: Running design system audit...
[Scans all components]
Agent: ⚠️ Found 3 minor issues:
      - src/components/Card.jsx:42 uses hardcoded #ffffff
      - src/pages/About.jsx missing dark mode classes
      - 85% dark mode coverage (target: 90%+)

      Compliance score: 78/100 - Needs improvement
```

---

#### 4. `/perf-check` - Performance Monitor Agent

**Purpose**: Monitor bundle performance and identify optimizations

**What it does**:
1. Runs production build with timing
2. Analyzes bundle sizes (build-validator)
3. Compares with historical baseline
4. Analyzes each chunk in detail
5. Checks for large dependencies
6. Reviews code splitting strategy
7. Checks asset optimization (images, fonts)
8. Validates build output
9. Checks performance budget
10. Generates performance report with score
11. Recommends specific optimizations

**When to use**:
- "Check bundle performance"
- "Why is the build so large?"
- "Monitor bundle sizes"
- "Identify optimization opportunities"

**Skills used**: build-validator

**Example**:
```
User: /perf-check
Agent: Analyzing bundle performance...
[Runs analysis]
Agent: ⚠️ Main bundle: 285KB (target: <250KB)
      ✅ Vendor bundle: 420KB (target: <450KB)
      📈 Total size increased 12% since baseline

      Recommendation: Lazy load the syntax highlighter
      Expected impact: -80KB from main bundle

      Performance score: 82/100 - Good
```

---

### Agent Architecture

**Skills vs Agents**:
- **Skills** = Reusable capabilities (tools in the toolbox)
- **Agents** = Autonomous workflows (workers using the tools)

**Progressive Execution**:
1. Agent receives user request
2. Loads relevant skill context
3. Executes workflow steps autonomously
4. Uses skill scripts where appropriate
5. Aggregates results into report
6. Provides actionable recommendations

**Error Handling**:
- Continue on non-critical errors (document in report)
- Stop on critical errors (build fails, tests fail)
- Provide clear error messages with fix suggestions
- Offer to help fix issues

### Using Agents

**Invoke via slash commands**:
```
/publish-post
/qa-check
/design-audit
/perf-check
```

**Or request naturally**:
```
"Help me publish this blog post"
"Run QA checks before deployment"
"Audit the design system"
"Check bundle performance"
```

Claude will automatically invoke the appropriate agent based on your request.

### Agent Best Practices

**For Users**:
1. **Let agents run autonomously** - They'll ask if they need input
2. **Review reports carefully** - Agents surface important issues
3. **Follow recommendations** - Agents prioritize fixes
4. **Run regularly** - Catch issues early

**For Developers**:
1. **Clear workflows** - Step-by-step execution
2. **Comprehensive reporting** - Aggregate all findings
3. **Actionable recommendations** - Specific fixes with impact
4. **Score/grade system** - Quick assessment of status

### Integration with CI/CD

These agents can be integrated into CI/CD pipelines:

**Pre-commit hook**:
```bash
# Run QA on changed files
/qa-check
```

**Pre-deployment**:
```bash
# Full validation
/qa-check
/perf-check
```

**Weekly maintenance**:
```bash
# Regular audits
/design-audit
/perf-check
```

## Resources

- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills)
- [Agent Skills Guide](https://docs.anthropic.com/en/docs/build-with-claude/agent-skills)
- [Skills Cookbook](https://github.com/anthropics/claude-cookbooks/tree/main/skills)
- [Slash Commands Documentation](https://code.claude.com/docs/en/slash-commands)

## Contributing

To contribute improvements:

1. Test changes thoroughly
2. Update relevant documentation
3. Add examples if adding new capabilities
4. Update this README for new skills or agents

---

**Skills Version**: 1.0.0
**Agents Version**: 1.0.0
**Last Updated**: January 2025
**Compatible with**: Claude Code, Claude API
