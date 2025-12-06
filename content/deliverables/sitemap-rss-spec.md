# Sitemap and RSS Feed Specification

## Overview

This document specifies the sitemap.xml structure and RSS feed configuration for the AI Agents Research Blog, covering 25 blog posts from the Stanford GSB GSBGEN 390 research project.

---

## Sitemap.xml Structure

### URL Format

```
https://[domain]/blog/[slug]
```

### Posts to Include (25 Total)

| #   | Slug                          | Title                                                                                                       | Priority | Change Frequency |
| --- | ----------------------------- | ----------------------------------------------------------------------------------------------------------- | -------- | ---------------- |
| 1   | ai-agents-research-overview   | What's Really Blocking AI Agents from Production? Insights from 36 Expert Interviews                        | 1.0      | monthly          |
| 2   | system-integration-92-percent | The 92% Problem: Why System Integration Breaks AI Agent Deployments                                         | 0.9      | monthly          |
| 3   | 40-percent-context-rule       | The 40% Rule: Why Larger Context Windows Won't Save Your AI Agent                                           | 0.8      | monthly          |
| 4   | framework-abandonment         | The Framework Paradox: Why 80-90% of Teams Abandon a popular AI agent framework for Production              | 0.8      | monthly          |
| 5   | demo-production-chasm         | The Demo-Production Chasm: Why 70% Accuracy Creates False Expectations                                      | 0.8      | monthly          |
| 6   | enterprise-business-case      | Why 90% of AI Agent Pilots Fail Before Hitting Technical Limits                                             | 0.8      | monthly          |
| 7   | coding-agent-exception        | The Coding Agent Exception: Why AI Works for Code but Struggles Everywhere Else                             | 0.8      | monthly          |
| 8   | model-myth                    | The 30-40% Model Myth: Why Framework Architecture Matters More Than Model Capability                        | 0.8      | monthly          |
| 9   | handoff-rate-metric           | Handoff Rate: The North Star Metric for AI Agent Success                                                    | 0.8      | monthly          |
| 10  | dual-memory-architecture      | Dual Memory Architecture: The Distinction Most AI Companies Miss                                            | 0.8      | monthly          |
| 11  | mcp-tool-cliff                | MCP Reality Check: The 25-Tool Accuracy Cliff No One Talks About                                            | 0.8      | monthly          |
| 12  | component-evaluation          | Component-Level Evaluation: Why End-to-End Testing Fails for AI Agents                                      | 0.8      | monthly          |
| 13  | evaluation-gap                | The Evaluation Gap: Why 7 YC Companies Building Eval Tools Have Zero Adoption                               | 0.8      | monthly          |
| 14  | practitioner-interview-1      | Inside an AI agent orchestration company: Why 90% of Enterprise AI Agent Pilots Never Convert to Production | 0.7      | monthly          |
| 15  | practitioner-interview-2      | an AI infrastructure company's Take: Managing Expectations with Probabilistic Systems                       | 0.7      | monthly          |
| 16  | practitioner-interview-3      | How a major enterprise identity company is Solving AI Agent Identity: The Next SSO Moment                   | 0.7      | monthly          |
| 17  | practitioner-interview-4      | a multi-agent framework company's Lesson: Why Enterprise Topology Complexity Is Your Moat                   | 0.7      | monthly          |
| 18  | practitioner-interview-5      | an AI sales intelligence company's Approach: Building AI Sales Agents That Actually Work                    | 0.7      | monthly          |
| 19  | shopping-agent                | Building a Shopping Agent: Framework Bloat in Action                                                        | 0.7      | monthly          |
| 20  | repo-patcher                  | Repo Patcher: Using State Machines to Make AI Agents Reliable                                               | 0.7      | monthly          |
| 21  | good-agents                   | Good Agents: Implementing Plan-Verify-Execute for Multi-Agent Orchestration                                 | 0.7      | monthly          |
| 22  | autonomous-agent-fireside     | an AI autonomous agent company Fireside: The 30-40% Model Revelation That Changed Everything                | 0.7      | monthly          |
| 23  | why-95-fail                   | Why 95% of Agentic AI Projects Fail: Key Takeaways from the Conference Everyone's Talking About             | 0.7      | monthly          |
| 24  | production-summit             | Production Agents Summit: The 40% Context Rule and Other Uncomfortable Truths                               | 0.7      | monthly          |
| 25  | research-methodology          | How We Processed 44 Sources Into Actionable Research                                                        | 0.6      | monthly          |

### Sitemap XML Template

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>https://[domain]/</loc>
    <lastmod>2025-12-26</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Blog Index -->
  <url>
    <loc>https://[domain]/blog</loc>
    <lastmod>2025-12-26</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Blog Posts (25 entries) -->
  <url>
    <loc>https://[domain]/blog/ai-agents-research-overview</loc>
    <lastmod>2025-12-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- ... additional 24 blog post entries ... -->
</urlset>
```

---

## RSS Feed Specification

### Feed Metadata

| Field               | Value                                                                                                                                                                                                                            |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Title**           | AI Agents Research Blog                                                                                                                                                                                                          |
| **Description**     | Insights from Stanford GSB research on AI agent development. Based on 36 expert interviews, 5 industry conferences, and 3 functional prototypes examining what separates successful AI agent deployments from the 90% that fail. |
| **Link**            | https://[domain]/blog                                                                                                                                                                                                            |
| **Language**        | en-us                                                                                                                                                                                                                            |
| **Managing Editor** | Fernando Torres                                                                                                                                                                                                                  |
| **Webmaster**       | Fernando Torres                                                                                                                                                                                                                  |
| **Copyright**       | Copyright 2025 Fernando Torres & Shekhar Bhende                                                                                                                                                                                  |
| **TTL**             | 1440 (24 hours)                                                                                                                                                                                                                  |
| **Image**           | https://[domain]/images/blog/ai-agents-research-cover.png                                                                                                                                                                        |

### Authors

- **Primary Author**: Fernando Torres
- **Co-Author**: Shekhar Bhende

### Items to Include (25 Posts)

| #   | Title                                                                                                       | Slug                          | Published Date | Description                                                                                                                                                                                                                                                                                                                              |
| --- | ----------------------------------------------------------------------------------------------------------- | ----------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | What's Really Blocking AI Agents from Production? Insights from 36 Expert Interviews                        | ai-agents-research-overview   | 2025-12-10     | Research spanning 36 expert interviews, 5 industry conferences, and 3 functional prototypes reveals that AI agent deployment is fundamentally an engineering problem, not an AI problem—with models contributing only 30-40% to success while framework architecture, integration, and business case clarity drive the remaining 60-70%. |
| 2   | The 92% Problem: Why System Integration Breaks AI Agent Deployments                                         | system-integration-92-percent | 2025-12-XX     | Ninety-two percent of AI agent sources cite system integration as their primary challenge. Here is what 36 expert interviews revealed about the hidden complexity that derails enterprise deployments.                                                                                                                                   |
| 3   | The 40% Rule: Why Larger Context Windows Won't Save Your AI Agent                                           | 40-percent-context-rule       | 2025-12-14     | The counterintuitive finding that quality degrades at 40% utilization regardless of window size. Context engineering matters more than context capacity.                                                                                                                                                                                 |
| 4   | The Framework Paradox: Why 80-90% of Teams Abandon a popular AI agent framework for Production              | framework-abandonment         | 2025-12-12     | a popular AI agent framework achieved billion-dollar valuations, yet most production teams abandon it. Our research reveals the performance gaps, debugging challenges, and abstraction traps driving this exodus.                                                                                                                       |
| 5   | The Demo-Production Chasm: Why 70% Accuracy Creates False Expectations                                      | demo-production-chasm         | 2025-12-18     | How 30 years of deterministic conditioning creates expectation mismatches with stochastic AI systems.                                                                                                                                                                                                                                    |
| 6   | Why 90% of AI Agent Pilots Fail Before Hitting Technical Limits                                             | enterprise-business-case      | 2025-12-10     | Enterprise AI agent adoption faces a multi-layered governance crisis where business case failures, pricing confusion, and trust deficits block production deployment—not model capabilities.                                                                                                                                             |
| 7   | The Coding Agent Exception: Why AI Works for Code but Struggles Everywhere Else                             | coding-agent-exception        | 2025-12-11     | AI coding assistants deliver 3x productivity gains while generic AI agents cost 3-5x more than human labor. Research reveals why the generation vs analysis gap makes coding the exceptional use case.                                                                                                                                   |
| 8   | The 30-40% Model Myth: Why Framework Architecture Matters More Than Model Capability                        | model-myth                    | 2025-12-24     | The counterintuitive discovery that models contribute 30-40% while framework/architecture contributes 60-70% to agent success.                                                                                                                                                                                                           |
| 9   | Handoff Rate: The North Star Metric for AI Agent Success                                                    | handoff-rate-metric           | 2025-12-09     | Why measuring the percentage of tasks passed back to humans trumps accuracy, latency, and token efficiency metrics when evaluating AI agent effectiveness.                                                                                                                                                                               |
| 10  | Dual Memory Architecture: The Distinction Most AI Companies Miss                                            | dual-memory-architecture      | 2025-12-15     | User memory and agent memory are architecturally distinct problems requiring separate solutions. Most vendors conflate them, creating systems that fail both use cases.                                                                                                                                                                  |
| 11  | MCP Reality Check: The 25-Tool Accuracy Cliff No One Talks About                                            | mcp-tool-cliff                | 2025-12-03     | Why Model Context Protocol accuracy drops to 30% beyond 25 tools and what this means for enterprise integration strategies.                                                                                                                                                                                                              |
| 12  | Component-Level Evaluation: Why End-to-End Testing Fails for AI Agents                                      | component-evaluation          | 2025-12-15     | The an AI sales intelligence company insight: test deterministic components (especially first-step retrieval) rather than entire probabilistic pipelines. Discover why traditional software testing wisdom breaks down for AI agents.                                                                                                    |
| 13  | The Evaluation Gap: Why 7 YC Companies Building Eval Tools Have Zero Adoption                               | evaluation-gap                | 2025-12-13     | Despite massive market need for AI agent evaluation tools, 7+ YC companies building them have achieved near-zero adoption. The disconnect reveals a fundamental misunderstanding: teams are measuring process metrics when outcomes matter.                                                                                              |
| 14  | Inside an AI agent orchestration company: Why 90% of Enterprise AI Agent Pilots Never Convert to Production | practitioner-interview-1      | 2025-12-16     | the practitioner from an AI agent orchestration company reveals why most enterprise AI agent pilots fail - and it's not about the technology. Insights from deploying AI agents across 25+ production use cases in financial services, insurance, and healthcare.                                                                        |
| 15  | an AI infrastructure company's Take: Managing Expectations with Probabilistic Systems                       | practitioner-interview-2      | 2025-12-15     | a founder at an AI infrastructure company on why 30 years of deterministic software conditioning creates expectation mismatches with AI agents, and the scientific approach needed to bridge the gap.                                                                                                                                    |
| 16  | How a major enterprise identity company is Solving AI Agent Identity: The Next SSO Moment                   | practitioner-interview-3      | 2025-12-18     | a major enterprise identity company's an engineering leader at a major identity company reveals why enterprise AI agent adoption is blocked by identity and security concerns, and how MCP extensions are creating the authentication standards agents need.                                                                             |
| 17  | a multi-agent framework company's Lesson: Why Enterprise Topology Complexity Is Your Moat                   | practitioner-interview-4      | 2025-12-22     | the co-founder from a multi-agent framework company reveals why navigating 40-country operations, acquisition integration, and labor law complexity creates defensible competitive advantage that money alone cannot buy.                                                                                                                |
| 18  | an AI sales intelligence company's Approach: Building AI Sales Agents That Actually Work                    | practitioner-interview-5      | 2025-12-18     | the AI lead from an AI sales intelligence company shares battle-tested insights on component-level evaluation, data architecture as competitive moat, and why opinionated design trumps flexibility for vertical AI agents.                                                                                                              |
| 19  | Building a Shopping Agent: Framework Bloat in Action                                                        | shopping-agent                | 2025-12-19     | When we built an AI shopping assistant under deadline pressure, our framework choice became a liability. This is the story of switching from LangGraph to a popular AI agent framework mid-development and what it taught us about framework selection for production agents.                                                            |
| 20  | Repo Patcher: Using State Machines to Make AI Agents Reliable                                               | repo-patcher                  | 2025-12-20     | How the INGEST-PLAN-PATCH-TEST-REPAIR-PR state machine approach provides deterministic governance over probabilistic agent behavior, with lessons from building a production-ready coding agent.                                                                                                                                         |
| 21  | Good Agents: Implementing Plan-Verify-Execute for Multi-Agent Orchestration                                 | good-agents                   | 2025-12-23     | How the Plan-Verify-Execute pattern provides governance for probabilistic agent behavior by validating feasibility before execution, building user trust through transparency.                                                                                                                                                           |
| 22  | an AI autonomous agent company Fireside: The 30-40% Model Revelation That Changed Everything                | autonomous-agent-fireside     | 2025-12-24     | A single statement at the an AI autonomous agent company fireside chat inverted conventional wisdom about AI agent success, revealing that models contribute just 30-40% while framework architecture drives the remaining 60-70%.                                                                                                       |
| 23  | Why 95% of Agentic AI Projects Fail: Key Takeaways from the Conference Everyone's Talking About             | why-95-fail                   | 2025-12-25     | Four common traps doom most AI agent projects before they reach production. A recent industry conference revealed the patterns - and introduced a game-changing metric for measuring real success.                                                                                                                                       |
| 24  | Production Agents Summit: The 40% Context Rule and Other Uncomfortable Truths                               | production-summit             | 2025-12-26     | Snowflake's Production Agents Summit revealed hard-won lessons about deploying AI agents at scale, including the counterintuitive 40% context window rule, observability requirements, and why agents are ultimately just software that demands rigorous engineering.                                                                    |
| 25  | How We Processed 44 Sources Into Actionable Research                                                        | research-methodology          | 2025-12-03     | The systematic extraction and aggregation methodology that transformed interviews, conferences, and prototypes into actionable AI agent insights.                                                                                                                                                                                        |

### RSS XML Template

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI Agents Research Blog</title>
    <link>https://[domain]/blog</link>
    <description>Insights from Stanford GSB research on AI agent development. Based on 36 expert interviews, 5 industry conferences, and 3 functional prototypes examining what separates successful AI agent deployments from the 90% that fail.</description>
    <language>en-us</language>
    <lastBuildDate>Thu, 26 Dec 2025 12:00:00 GMT</lastBuildDate>
    <atom:link href="https://[domain]/rss.xml" rel="self" type="application/rss+xml"/>
    <copyright>Copyright 2025 Fernando Torres &amp; Shekhar Bhende</copyright>
    <managingEditor>fernando@example.com (Fernando Torres)</managingEditor>
    <ttl>1440</ttl>
    <image>
      <url>https://[domain]/images/blog/ai-agents-research-cover.png</url>
      <title>AI Agents Research Blog</title>
      <link>https://[domain]/blog</link>
    </image>

    <!-- Example Item -->
    <item>
      <title>What's Really Blocking AI Agents from Production? Insights from 36 Expert Interviews</title>
      <link>https://[domain]/blog/ai-agents-research-overview</link>
      <guid isPermaLink="true">https://[domain]/blog/ai-agents-research-overview</guid>
      <pubDate>Tue, 10 Dec 2025 12:00:00 GMT</pubDate>
      <description>Research spanning 36 expert interviews, 5 industry conferences, and 3 functional prototypes reveals that AI agent deployment is fundamentally an engineering problem, not an AI problem—with models contributing only 30-40% to success while framework architecture, integration, and business case clarity drive the remaining 60-70%.</description>
      <author>fernando@example.com (Fernando Torres)</author>
      <category>AI Agents</category>
      <category>Research</category>
      <category>Enterprise AI</category>
      <category>Production</category>
      <category>Stanford GSB</category>
    </item>

    <!-- ... additional 24 items ... -->
  </channel>
</rss>
```

---

## Implementation Notes

### Framework Integration

#### Next.js (Recommended)

```javascript
// Use next-sitemap for automatic generation
// npm install next-sitemap

// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://[domain]',
  generateRobotsTxt: true,
  exclude: ['/admin/*'],
  changefreq: 'monthly',
  priority: 0.7,
};
```

#### Astro

```javascript
// Use @astrojs/sitemap
// npm install @astrojs/sitemap

// astro.config.mjs
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://[domain]',
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.7,
    }),
  ],
});
```

#### RSS Generation (Next.js)

```javascript
// Use feed package
// npm install feed

// pages/api/rss.js or app/rss.xml/route.js
import { Feed } from 'feed';

export async function GET() {
  const feed = new Feed({
    title: 'AI Agents Research Blog',
    description: 'Insights from Stanford GSB research on AI agent development',
    id: 'https://[domain]/',
    link: 'https://[domain]/',
    language: 'en',
    copyright: 'Copyright 2025 Fernando Torres & Shekhar Bhende',
    author: {
      name: 'Fernando Torres',
      email: 'fernando@example.com',
    },
  });

  // Add posts dynamically from frontmatter
  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `https://[domain]/blog/${post.slug}`,
      link: `https://[domain]/blog/${post.slug}`,
      description: post.summary,
      date: new Date(post.publishedAt),
      author: [{ name: post.author }],
    });
  });

  return new Response(feed.rss2(), {
    headers: { 'Content-Type': 'application/xml' },
  });
}
```

### Important Considerations

1. **Date Synchronization**: Ensure `pubDate` in RSS and `lastmod` in sitemap match the `publishedAt` field in each blog post's frontmatter.

2. **Placeholder Dates**: One post (`system-integration-92-percent`) has `publishedAt: '2025-12-XX'` which needs to be updated to a specific date before deployment.

3. **Domain Configuration**: Replace `[domain]` placeholder with actual domain (e.g., `aiagentsresearch.com`).

4. **Image Paths**: Ensure all referenced images exist at their specified paths in `/images/blog/`.

5. **Category Tags**: RSS items should include category tags from the frontmatter `tags` array.

6. **robots.txt**: Include sitemap reference:
   ```
   User-agent: *
   Allow: /
   Sitemap: https://[domain]/sitemap.xml
   ```

### Validation

Before deployment, validate using:

- Google Search Console sitemap validator
- W3C Feed Validation Service for RSS
- XML syntax validators

---

## Summary Statistics

| Metric                    | Count                                 |
| ------------------------- | ------------------------------------- |
| **Total Sitemap Entries** | 27 (homepage + blog index + 25 posts) |
| **Total RSS Items**       | 25                                    |
| **Featured Posts**        | 2                                     |
| **Priority 1.0 Posts**    | 1                                     |
| **Priority 0.9 Posts**    | 1                                     |
| **Priority 0.8 Posts**    | 11                                    |
| **Priority 0.7 Posts**    | 11                                    |
| **Priority 0.6 Posts**    | 1                                     |

---

_Generated: December 2025_
_Research Project: Stanford GSB GSBGEN 390 - AI Agents Research_
