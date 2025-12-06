# Social Sharing Metadata Specification

## Overview

This document specifies the Open Graph and Twitter Card metadata requirements for the AI Agents Research blog series. All 25 blog posts have been verified to contain the required frontmatter fields for social sharing.

---

## Open Graph Tags (Required)

For each blog post, the following Open Graph meta tags should be generated from frontmatter:

| OG Property      | Source                | Description                     |
| ---------------- | --------------------- | ------------------------------- |
| `og:title`       | `frontmatter.title`   | Post headline                   |
| `og:description` | `frontmatter.summary` | 1-2 sentence SEO description    |
| `og:image`       | `frontmatter.image`   | Cover image path (absolute URL) |
| `og:type`        | `"article"`           | Static value for blog posts     |
| `og:url`         | Canonical URL         | Full URL of the blog post       |
| `og:site_name`   | Site name             | e.g., "Fernando Torres"         |

---

## Twitter Card Tags

For optimal Twitter/X sharing:

| Twitter Property      | Source                  | Description                    |
| --------------------- | ----------------------- | ------------------------------ |
| `twitter:card`        | `"summary_large_image"` | Large image card format        |
| `twitter:title`       | `frontmatter.title`     | Post headline                  |
| `twitter:description` | `frontmatter.summary`   | Preview description            |
| `twitter:image`       | `frontmatter.image`     | Cover image (absolute URL)     |
| `twitter:site`        | `@handle`               | Optional site Twitter handle   |
| `twitter:creator`     | `@handle`               | Optional author Twitter handle |

---

## Sample Implementation (Next.js/Astro)

### Next.js App Router (generateMetadata)

```typescript
// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { getPostBySlug } from '@/lib/posts';

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  const baseUrl = 'https://yourdomain.com';

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      url: `${baseUrl}/blog/${params.slug}`,
      images: [
        {
          url: `${baseUrl}${post.image}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      siteName: 'Fernando Torres',
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: [`${baseUrl}${post.image}`],
    },
  };
}
```

### Astro (Head Component)

```astro
---
// src/layouts/BlogPost.astro
const { frontmatter } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const imageURL = new URL(frontmatter.image, Astro.site);
---

<head>
  <!-- Open Graph -->
  <meta property="og:title" content={frontmatter.title} />
  <meta property="og:description" content={frontmatter.summary} />
  <meta property="og:image" content={imageURL} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={canonicalURL} />
  <meta property="og:site_name" content="Fernando Torres" />
  <meta property="article:published_time" content={frontmatter.publishedAt} />
  <meta property="article:author" content={frontmatter.author} />
  {frontmatter.tags?.map((tag) => (
    <meta property="article:tag" content={tag} />
  ))}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={frontmatter.title} />
  <meta name="twitter:description" content={frontmatter.summary} />
  <meta name="twitter:image" content={imageURL} />
</head>
```

### Contentlayer Integration

```typescript
// contentlayer.config.ts
import { defineDocumentType } from 'contentlayer/source-files';

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    summary: { type: 'string', required: true },
    publishedAt: { type: 'date', required: true },
    image: { type: 'string', required: false },
    author: { type: 'string', required: false, default: 'Fernando Torres' },
    featured: { type: 'boolean', required: false, default: false },
    tags: { type: 'list', of: { type: 'string' }, required: false },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.replace('blog/', ''),
    },
    ogImage: {
      type: 'string',
      resolve: (doc) => doc.image || '/images/default-og.png',
    },
  },
}));
```

---

## Image Requirements

For optimal display across platforms:

| Requirement       | Specification                       |
| ----------------- | ----------------------------------- |
| **Minimum Size**  | 1200 x 630 pixels                   |
| **Aspect Ratio**  | 1.91:1 (recommended)                |
| **Max File Size** | < 8 MB (Twitter), < 8 MB (Facebook) |
| **Format**        | PNG, JPG, or WebP                   |
| **Safe Zone**     | Keep text within center 1000x500 px |

---

## Testing Checklist

Use these tools to validate social sharing metadata before publishing:

- [ ] **Facebook Sharing Debugger** - https://developers.facebook.com/tools/debug/
  - Validates Open Graph tags
  - Shows preview of shared content
  - Can scrape/refresh cached metadata

- [ ] **Twitter Card Validator** - https://cards-dev.twitter.com/validator
  - Validates Twitter Card tags
  - Shows preview of card appearance
  - Note: Requires Twitter login

- [ ] **LinkedIn Post Inspector** - https://www.linkedin.com/post-inspector/
  - Validates LinkedIn sharing metadata
  - Shows preview and potential issues
  - Can refresh cached metadata

- [ ] **OpenGraph.xyz** - https://www.opengraph.xyz/
  - Universal OG tag checker
  - Shows previews for multiple platforms

---

## Posts Ready for Social Sharing

All 25 blog posts have been verified to contain the required metadata fields.

| #   | Post                                  | Has Title | Has Summary | Has Image |
| --- | ------------------------------------- | --------- | ----------- | --------- |
| 1   | 2025-12-ai-agents-research-overview   | Yes       | Yes         | Yes       |
| 2   | 2025-12-system-integration-92-percent | Yes       | Yes         | Yes       |
| 3   | 2025-12-40-percent-context-rule       | Yes       | Yes         | Yes       |
| 4   | 2025-12-framework-abandonment         | Yes       | Yes         | Yes       |
| 5   | 2025-12-demo-production-chasm         | Yes       | Yes         | Yes       |
| 6   | 2025-12-enterprise-business-case      | Yes       | Yes         | Yes       |
| 7   | 2025-12-coding-agent-exception        | Yes       | Yes         | Yes       |
| 8   | 2025-12-model-myth                    | Yes       | Yes         | Yes       |
| 9   | 2025-12-handoff-rate-metric           | Yes       | Yes         | Yes       |
| 10  | 2025-12-dual-memory-architecture      | Yes       | Yes         | Yes       |
| 11  | 2025-12-mcp-tool-cliff                | Yes       | Yes         | Yes       |
| 12  | 2025-12-component-evaluation          | Yes       | Yes         | Yes       |
| 13  | 2025-12-evaluation-gap                | Yes       | Yes         | Yes       |
| 14  | 2025-12-practitioner-interview-1      | Yes       | Yes         | Yes       |
| 15  | 2025-12-practitioner-interview-2      | Yes       | Yes         | Yes       |
| 16  | 2025-12-practitioner-interview-3      | Yes       | Yes         | Yes       |
| 17  | 2025-12-practitioner-interview-4      | Yes       | Yes         | Yes       |
| 18  | 2025-12-practitioner-interview-5      | Yes       | Yes         | Yes       |
| 19  | 2025-12-shopping-agent                | Yes       | Yes         | Yes       |
| 20  | 2025-12-repo-patcher                  | Yes       | Yes         | Yes       |
| 21  | 2025-12-good-agents                   | Yes       | Yes         | Yes       |
| 22  | 2025-12-autonomous-agent-fireside     | Yes       | Yes         | Yes       |
| 23  | 2025-12-why-95-fail                   | Yes       | Yes         | Yes       |
| 24  | 2025-12-production-summit             | Yes       | Yes         | Yes       |
| 25  | 2025-12-research-methodology          | Yes       | Yes         | Yes       |

---

## Image Paths Reference

| Post                          | Image Path                                                      |
| ----------------------------- | --------------------------------------------------------------- |
| ai-agents-research-overview   | /images/blog/ai-agents-research-cover.png                       |
| system-integration-92-percent | /images/blog/system-integration-92-percent.png                  |
| 40-percent-context-rule       | /images/blog/context-management-cover.png                       |
| framework-abandonment         | /images/blog/framework-abandonment-cover.png                    |
| demo-production-chasm         | /images/blog/demo-production-chasm-cover.png                    |
| enterprise-business-case      | /images/blog/enterprise-blockers-cover.png                      |
| coding-agent-exception        | /images/blog/coding-agent-exception-cover.png                   |
| model-myth                    | /images/blog/model-myth-cover.png                               |
| handoff-rate-metric           | /images/blog/handoff-rate-metric.png                            |
| dual-memory-architecture      | /images/blog/dual-memory-architecture.png                       |
| mcp-tool-cliff                | /images/blog/mcp-tool-cliff.png                                 |
| component-evaluation          | /images/blog/component-evaluation-cover.png                     |
| evaluation-gap                | /images/blog/evaluation-gap-cover.png                           |
| practitioner-interview-1      | /images/blog/practitioner-interview-1.png                       |
| practitioner-interview-2      | /images/blog/practitioner-interview-2-probabilistic-systems.png |
| practitioner-interview-3      | /images/blog/practitioner-interview-3.png                       |
| practitioner-interview-4      | /images/blog/practitioner-interview-4.png                       |
| practitioner-interview-5      | /images/blog/practitioner-interview-5-cover.png                 |
| shopping-agent                | /images/blog/shopping-agent-cover.png                           |
| repo-patcher                  | /images/blog/repo-patcher-cover.png                             |
| good-agents                   | /images/blog/good-agents.png                                    |
| autonomous-agent-fireside     | /images/blog/autonomous-agent-fireside.png                      |
| why-95-fail                   | /images/blog/why-95-fail.png                                    |
| production-summit             | /images/blog/production-summit.png                              |
| research-methodology          | /images/research-methodology-cover.png                          |

---

## Additional Metadata Recommendations

### Article-Specific Tags

```html
<meta property="article:published_time" content="2025-12-10T00:00:00Z" />
<meta property="article:author" content="Fernando Torres" />
<meta property="article:section" content="AI Agents" />
<meta property="article:tag" content="AI Agents" />
<meta property="article:tag" content="Research" />
```

### JSON-LD Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{{title}}",
  "description": "{{summary}}",
  "image": "{{image}}",
  "datePublished": "{{publishedAt}}",
  "author": {
    "@type": "Person",
    "name": "Fernando Torres"
  },
  "publisher": {
    "@type": "Person",
    "name": "Fernando Torres"
  }
}
```

---

## Status: READY

All 25 blog posts contain the required frontmatter fields for social sharing:

- **Title**: 25/25 posts (100%)
- **Summary**: 25/25 posts (100%)
- **Image**: 25/25 posts (100%)

**Note**: Ensure all image files exist in the `/public/images/blog/` directory before deployment. One post (research-methodology) uses a different image path (`/images/research-methodology-cover.png` instead of `/images/blog/...`).

---

_Generated: 2025-12-03_
