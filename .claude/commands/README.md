# Agent Workflow Commands

This directory contains slash command agents that orchestrate the skills in [.claude/skills/](.claude/skills/) for common workflows.

## Quick Reference

| Command | Purpose | Use When |
|---------|---------|----------|
| `/publish-post` | Complete blog post publishing workflow | Publishing new or updated blog posts |
| `/qa-check` | Comprehensive pre-deployment validation | Before deploying to production |
| `/design-audit` | Design system consistency and compliance | Checking design consistency, dark mode coverage |
| `/perf-check` | Bundle performance monitoring and optimization | Monitoring bundle sizes, finding optimizations |

## Command Details

### `/publish-post`
**End-to-end content publishing**
- Creates/validates post
- Checks frontmatter and content quality
- Suggests internal links
- Validates SEO
- Previews locally
- Builds and commits

**Usage**: `/publish-post`

---

### `/qa-check`
**Pre-deployment validation suite**
- Runs all tests
- Validates all blog posts
- Checks content quality
- Builds and analyzes bundles
- Tests production server
- Validates SEO and accessibility
- Generates comprehensive report

**Usage**: `/qa-check`

---

### `/design-audit`
**Design system compliance check**
- Scans for hardcoded colors
- Checks dark mode coverage
- Validates adaptive color usage
- Verifies accessibility (WCAG AA)
- Checks CSS/Tailwind sync
- Generates compliance report with score

**Usage**: `/design-audit`

---

### `/perf-check`
**Performance monitoring and analysis**
- Analyzes bundle sizes
- Compares with baseline
- Checks performance budget
- Reviews code splitting
- Identifies optimization opportunities
- Generates performance report with score

**Usage**: `/perf-check`

## How It Works

Each slash command:
1. **Loads** relevant skill context
2. **Executes** workflow steps autonomously
3. **Aggregates** results into comprehensive report
4. **Provides** actionable recommendations

## Tips

- **Let agents run**: They work autonomously and ask if they need input
- **Review reports**: Agents surface important issues you might miss
- **Follow recommendations**: Agents prioritize fixes by impact
- **Run regularly**: Catch issues early before they compound

## Documentation

Full documentation available in [.claude/skills/README.md](.claude/skills/README.md#agent-workflows)

## Skills Used

These agents orchestrate the following skills:
- [blog-post-manager](.claude/skills/blog-post-manager/)
- [build-validator](.claude/skills/build-validator/)
- [content-quality-checker](.claude/skills/content-quality-checker/)
- [seo-metadata-manager](.claude/skills/seo-metadata-manager/)
- [design-system-guardian](.claude/skills/design-system-guardian/)

---

**Version**: 1.0.0
**Last Updated**: January 2025
