# Website Copy Instructions

Instructions for copying AI Agents Research blog publications to a Next.js or Astro website.

## Source Directory

```
/Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/
```

## Target Directory (typical)

```
# Next.js (App Router)
/website/content/blog/

# Next.js (Pages Router with Contentlayer or similar)
/website/src/content/blog/

# Astro
/website/src/content/blog/
```

---

## Copy Commands

### Publication 1 (Anchor)

The foundational overview post that introduces the research findings.

```bash
# File: 2025-12-ai-agents-research-overview.mdx
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/2025-12-ai-agents-research-overview.mdx [target]/
```

| File                                      | Title                                                                                | Word Count |
| ----------------------------------------- | ------------------------------------------------------------------------------------ | ---------- |
| `2025-12-ai-agents-research-overview.mdx` | What's Really Blocking AI Agents from Production? Insights from 36 Expert Interviews | ~2,400     |

---

### Publications 2-7 (Theme Deep Dives)

Deep analysis of the six major themes identified in the research.

```bash
# Copy all Theme Deep Dives
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/2025-12-system-integration-92-percent.mdx [target]/
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/2025-12-40-percent-context-rule.mdx [target]/
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/2025-12-framework-abandonment.mdx [target]/
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/2025-12-demo-production-chasm.mdx [target]/
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/2025-12-enterprise-business-case.mdx [target]/
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/2025-12-coding-agent-exception.mdx [target]/
```

| #   | File                                        | Title                                                                                          |
| --- | ------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 2   | `2025-12-system-integration-92-percent.mdx` | The 92% Problem: Why System Integration Breaks AI Agent Deployments                            |
| 3   | `2025-12-40-percent-context-rule.mdx`       | The 40% Rule: Why Larger Context Windows Won't Save Your AI Agent                              |
| 4   | `2025-12-framework-abandonment.mdx`         | The Framework Paradox: Why 80-90% of Teams Abandon a popular AI agent framework for Production |
| 5   | `2025-12-demo-production-chasm.mdx`         | The Demo-Production Chasm: Why 70% Accuracy Creates False Expectations                         |
| 6   | `2025-12-enterprise-business-case.mdx`      | Why 90% of AI Agent Pilots Fail Before Hitting Technical Limits                                |
| 7   | `2025-12-coding-agent-exception.mdx`        | The Coding Agent Exception: Why AI Works for Code but Struggles Everywhere Else                |

---

### Publications 8-13 (Emergent Insights)

Novel insights that emerged from cross-source analysis.

```bash
# Copy all Emergent Insights
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/2025-12-model-myth.mdx [target]/
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/2025-12-dual-memory-architecture.mdx [target]/
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/2025-12-mcp-tool-cliff.mdx [target]/
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/2025-12-handoff-rate-metric.mdx [target]/
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/2025-12-component-evaluation.mdx [target]/
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/2025-12-evaluation-gap.mdx [target]/
```

| #   | File                                   | Title                                                                                |
| --- | -------------------------------------- | ------------------------------------------------------------------------------------ |
| 8   | `2025-12-model-myth.mdx`               | The 30-40% Model Myth: Why Framework Architecture Matters More Than Model Capability |
| 9   | `2025-12-dual-memory-architecture.mdx` | Dual Memory Architecture: The Distinction Most AI Companies Miss                     |
| 10  | `2025-12-mcp-tool-cliff.mdx`           | MCP Reality Check: The 25-Tool Accuracy Cliff No One Talks About                     |
| 11  | `2025-12-handoff-rate-metric.mdx`      | Handoff Rate: The North Star Metric for AI Agent Success                             |
| 12  | `2025-12-component-evaluation.mdx`     | Component-Level Evaluation: Why End-to-End Testing Fails for AI Agents               |
| 13  | `2025-12-evaluation-gap.mdx`           | The Evaluation Gap: Why 7 YC Companies Building Eval Tools Have Zero Adoption        |

---

### Publications 14-18 (Practitioner Perspectives)

Insights from interviews with industry practitioners.

```bash
# Copy all Practitioner Perspectives
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/2025-12-practitioner-interview-2.mdx [target]/
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/2025-12-practitioner-interview-1.mdx [target]/
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/2025-12-practitioner-interview-3.mdx [target]/
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/2025-12-practitioner-interview-4.mdx [target]/
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/2025-12-practitioner-interview-5.mdx [target]/
```

| #   | File                                   | Title                                                                                                       |
| --- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 14  | `2025-12-practitioner-interview-2.mdx` | an AI infrastructure company's Take: Managing Expectations with Probabilistic Systems                       |
| 15  | `2025-12-practitioner-interview-1.mdx` | Inside an AI agent orchestration company: Why 90% of Enterprise AI Agent Pilots Never Convert to Production |
| 16  | `2025-12-practitioner-interview-3.mdx` | How a major enterprise identity company is Solving AI Agent Identity: The Next SSO Moment                   |
| 17  | `2025-12-practitioner-interview-4.mdx` | a multi-agent framework company's Lesson: Why Enterprise Topology Complexity Is Your Moat                   |
| 18  | `2025-12-practitioner-interview-5.mdx` | an AI sales intelligence company's Approach: Building AI Sales Agents That Actually Work                    |

---

### Publications 19-21 (Prototype Learnings)

Lessons learned from building prototype agents.

```bash
# Copy all Prototype Learnings
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/2025-12-shopping-agent.mdx [target]/
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/2025-12-repo-patcher.mdx [target]/
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/2025-12-good-agents.mdx [target]/
```

| #   | File                         | Title                                                                       |
| --- | ---------------------------- | --------------------------------------------------------------------------- |
| 19  | `2025-12-shopping-agent.mdx` | Building a Shopping Agent: Framework Bloat in Action                        |
| 20  | `2025-12-repo-patcher.mdx`   | Repo Patcher: Using State Machines to Make AI Agents Reliable               |
| 21  | `2025-12-good-agents.mdx`    | Good Agents: Implementing Plan-Verify-Execute for Multi-Agent Orchestration |

---

### Publications 22-24 (Conference Insights)

Key learnings from AI agent conferences and events.

```bash
# Copy all Conference Insights
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/2025-12-autonomous-agent-fireside.mdx [target]/
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/2025-12-why-95-fail.mdx [target]/
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/2025-12-production-summit.mdx [target]/
```

| #   | File                                    | Title                                                                                           |
| --- | --------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 22  | `2025-12-autonomous-agent-fireside.mdx` | an AI autonomous agent company Fireside: The 30-40% Model Revelation That Changed Everything    |
| 23  | `2025-12-why-95-fail.mdx`               | Why 95% of Agentic AI Projects Fail: Key Takeaways from the Conference Everyone's Talking About |
| 24  | `2025-12-production-summit.mdx`         | Production Agents Summit: The 40% Context Rule and Other Uncomfortable Truths                   |

---

### Publication 25 (Methodology)

Research methodology documentation.

```bash
# File: 2025-12-research-methodology.mdx
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/2025-12-research-methodology.mdx [target]/
```

| File                               | Title                                                | Word Count |
| ---------------------------------- | ---------------------------------------------------- | ---------- |
| `2025-12-research-methodology.mdx` | How We Processed 44 Sources Into Actionable Research | ~2,200     |

---

## Image Copy

The images directory currently contains specification files for image generation:

```
/Users/fernandotn/Downloads/390/publishing/deliverables/images/
```

### Image Specification Files

| File                                      | Description                                     |
| ----------------------------------------- | ----------------------------------------------- |
| `anchor-cover-spec.md`                    | Cover image spec for the anchor publication     |
| `theme-covers-spec.md`                    | Cover image specs for theme deep dive posts     |
| `infographic-70-30-spec.md`               | Infographic spec for 70/30 architecture insight |
| `infographic-enterprise-blockers-spec.md` | Infographic spec for enterprise blockers        |
| `infographic-framework-spec.md`           | Infographic spec for framework patterns         |
| `infographic-metrics-spec.md`             | Infographic spec for key metrics                |

### Once Images Are Generated

```bash
# Copy all generated images to website public folder
cp -r /Users/fernandotn/Downloads/390/publishing/deliverables/images/*.png [target]/public/images/blog/
cp -r /Users/fernandotn/Downloads/390/publishing/deliverables/images/*.jpg [target]/public/images/blog/
cp -r /Users/fernandotn/Downloads/390/publishing/deliverables/images/*.svg [target]/public/images/blog/
cp -r /Users/fernandotn/Downloads/390/publishing/deliverables/images/*.webp [target]/public/images/blog/

# Or copy entire folder
cp -r /Users/fernandotn/Downloads/390/publishing/deliverables/images/* [target]/public/images/blog/
```

---

## Bulk Copy Command

Copy all 25 publications at once:

```bash
# Copy all .mdx files
cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/*.mdx [target]/
```

---

## Post-Copy Checklist

### File Verification

- [ ] Verify all 25 .mdx files copied successfully
- [ ] Confirm file permissions are correct (readable)
- [ ] Check total file count matches (25 posts)

### Frontmatter Verification

- [ ] Check frontmatter renders correctly in each post
- [ ] Verify `title` field displays properly
- [ ] Verify `date` field parses correctly
- [ ] Verify `author` field displays properly
- [ ] Verify `tags` array renders as expected
- [ ] Verify `excerpt` displays in previews

### Content Verification

- [ ] Test internal links between publications work
- [ ] Verify MDX components render correctly
- [ ] Check code blocks display with proper syntax highlighting
- [ ] Verify blockquotes and callouts render properly
- [ ] Test any custom components used in posts

### Image Verification (once generated)

- [ ] Verify all images are in public folder
- [ ] Check image paths in frontmatter (`image` field) resolve correctly
- [ ] Test images display on post pages
- [ ] Verify images display in social previews (og:image)

### SEO Verification

- [ ] Verify meta descriptions generate from excerpt
- [ ] Check Open Graph tags render correctly
- [ ] Test Twitter Card previews
- [ ] Verify canonical URLs are correct

### Navigation Verification

- [ ] Test category/tag filtering works
- [ ] Verify pagination (if applicable)
- [ ] Check "Related Posts" functionality
- [ ] Test search indexing (if applicable)

---

## Framework-Specific Notes

### Next.js (with Contentlayer)

Ensure `contentlayer.config.ts` has correct document type:

```typescript
export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    author: { type: 'string', required: true },
    excerpt: { type: 'string', required: true },
    tags: { type: 'list', of: { type: 'string' } },
    image: { type: 'string' },
  },
}));
```

### Astro

Ensure content collection schema in `src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    author: z.string(),
    excerpt: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
  }),
});

export const collections = { blog };
```

---

## Publication Summary

| Category                  | Count  | Publications |
| ------------------------- | ------ | ------------ |
| Anchor                    | 1      | #1           |
| Theme Deep Dives          | 6      | #2-7         |
| Emergent Insights         | 6      | #8-13        |
| Practitioner Perspectives | 5      | #14-18       |
| Prototype Learnings       | 3      | #19-21       |
| Conference Insights       | 3      | #22-24       |
| Methodology               | 1      | #25          |
| **Total**                 | **25** |              |
