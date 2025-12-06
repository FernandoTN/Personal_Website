# Publishing Workspace

This directory contains all publishing deliverables for the AI Agents Research Publication Series.

## Overview

The AI Agents Research project transforms research findings from Stanford GSB GSBGEN 390 into 25 standalone blog publications with accompanying LinkedIn promotional posts. This workspace organizes all content creation, review, and final delivery.

**Research Scope:**

- 36 expert interviews
- 5 industry conferences
- 3 functional prototypes
- 6 core themes + 17 emergent themes

**Deliverables:**

- 25 blog posts (MDX format)
- 25 LinkedIn posts (promotional content)
- Cover images and diagrams

## Folder Structure

```
publishing/
├── deliverables/           # Final outputs ready for publication
│   ├── blog-posts/         # MDX files ready for website integration
│   ├── linkedin-posts/     # LinkedIn promotional content
│   └── images/             # Cover images and diagrams
│
└── staging/                # Work in progress
    ├── drafts/             # Posts being written
    └── review/             # Posts awaiting review and editing
```

## Directory Descriptions

### `/deliverables/`

Final outputs that have passed quality review and are ready for publishing.

#### `/deliverables/blog-posts/`

- **Purpose:** Contains final MDX files ready for website integration
- **Format:** MDX files with contentlayer-compatible frontmatter
- **Naming:** `2025-12-[topic-slug].mdx`
- **Target:** Copy to `/Users/fernandotn/Projects/FernandoTorresWebsite/content/blog/`

#### `/deliverables/linkedin-posts/`

- **Purpose:** Contains LinkedIn promotional posts for each blog publication
- **Format:** Markdown files with LinkedIn-optimized content
- **Naming:** `[number]-[topic].md` (e.g., `01-anchor-post.md`)
- **Usage:** Copy-paste content when posting to LinkedIn

#### `/deliverables/images/`

- **Purpose:** Contains cover images, diagrams, and visual assets
- **Format:** PNG/JPG optimized for web (max 200KB)
- **Naming:** `[topic]-cover.png` or `diagrams/[diagram-name].png`
- **Target:** Copy to `/Users/fernandotn/Projects/FernandoTorresWebsite/public/images/blog/`

### `/staging/`

Work-in-progress content that is being drafted or reviewed.

#### `/staging/drafts/`

- **Purpose:** Active content creation workspace
- **Status:** Posts being written, edited, or revised
- **Workflow:** Move to `review/` when draft is complete

#### `/staging/review/`

- **Purpose:** Content awaiting quality review
- **Checklist:**
  - All required frontmatter fields present
  - Minimum 2-3 attributed quotes included
  - Statistics and data points verified
  - No spelling/grammar errors
  - Follows template structure
- **Workflow:** Move to `deliverables/` after approval

## Content Standards

### Blog Posts

- **Template:** Follow structure in `specPublishing.txt` Section 3
- **Length:** 1,500-2,600 words
- **Quotes:** Minimum 2-3 direct attributions per post
- **Format:** MDX with valid frontmatter
- **Footer:** Include series reference and contact info

### LinkedIn Posts

- **Template:** Follow structure in `specPublishing.txt` Section 4
- **Length:** Under 3,000 characters
- **Structure:** Hook → Context → Insight → Bullets → CTA → Engagement prompt
- **Hashtags:** #AIAgents #EnterpriseAI #LLMs #TechLeadership #ProductionAI

## Workflow

```
1. CREATE DRAFT
   └─> Write content in /staging/drafts/

2. REVIEW
   └─> Move to /staging/review/ when complete
   └─> Check against quality standards
   └─> Revise if needed

3. PUBLISH
   └─> Move to /deliverables/[blog-posts|linkedin-posts|images]/
   └─> Ready for website integration
```

## Quality Checklist

Before moving content to `/deliverables/`:

- [ ] Follows template structure from `specPublishing.txt`
- [ ] All frontmatter fields complete and accurate
- [ ] Minimum 2-3 attributed quotes included
- [ ] Statistics match source documents
- [ ] No spelling or grammar errors
- [ ] Cross-references to other posts work correctly
- [ ] Images optimized and properly named
- [ ] Privacy requirements respected (confidential sources anonymized)

## Website Integration

Once content is in `/deliverables/`:

1. **Copy blog posts:**

   ```bash
   cp /Users/fernandotn/Downloads/390/publishing/deliverables/blog-posts/*.mdx \
      /Users/fernandotn/Projects/FernandoTorresWebsite/content/blog/
   ```

2. **Copy images:**

   ```bash
   cp /Users/fernandotn/Downloads/390/publishing/deliverables/images/* \
      /Users/fernandotn/Projects/FernandoTorresWebsite/public/images/blog/
   ```

3. **Build and verify:**

   ```bash
   cd /Users/fernandotn/Projects/FernandoTorresWebsite
   npm run build
   ```

4. **Post to LinkedIn:**
   - Copy content from `/deliverables/linkedin-posts/`
   - Post same day as blog publish (9-11am PST optimal)
   - Include link to blog post

## Publication Categories

### 1. Anchor Publication (1 post)

- Flagship post introducing entire research project
- Featured: Yes
- Links to all other publications

### 2. Theme Deep Dives (6 posts)

- System Integration
- Context Management
- Framework Ecosystem
- Probabilistic Systems
- Enterprise Blockers
- Model Capabilities

### 3. Emergent Insights (6 posts)

- 30-40% Model Myth
- Handoff Rate Metric
- Dual Memory Architecture
- MCP Reality Check
- Component-Level Evaluation
- Evaluation Gap

### 4. Practitioner Perspectives (5 posts)

- an AI agent orchestration company
- an AI infrastructure company
- a major enterprise identity company
- a multi-agent framework company
- an AI sales intelligence company
- **Note:** Requires attribution permission

### 5. Prototype Learnings (3 posts)

- Shopping Agent
- Repo Patcher
- Good Agents

### 6. Conference Insights (3 posts)

- an AI autonomous agent company Fireside
- Why 95% Fail
- Production Agents Summit

### 7. Methodology & Meta (1 post)

- Research methodology post

## Privacy Requirements

- 19 confidential interviews: **NO names/companies disclosed**
- Use: "Multiple interviewees noted..." or "Practitioners we spoke with..."
- Practitioner perspective posts (Publications 14-18): **Require explicit attribution permission**
- Conference quotes: Public unless marked confidential

## Reference Materials

- **Full Specification:** `/Users/fernandotn/Downloads/390/specPublishing.txt`
- **Instructions:** `/Users/fernandotn/Downloads/390/coding_prompt.md`
- **Source Materials:**
  - `/Users/fernandotn/Downloads/390/Aggregations/` (Theme consolidations)
  - `/Users/fernandotn/Downloads/390/Extractions/Interviews/` (Interview data)
  - `/Users/fernandotn/Downloads/390/Extractions/Conferences/` (Conference notes)
  - `/Users/fernandotn/Downloads/390/Extractions/Prototypes/` (Prototype learnings)
  - `/Users/fernandotn/Downloads/390/FinalReport/` (Final report)

## Key Statistics Reference

Use these accurately in publications:

| Statistic                     | Value                   | Source                                  |
| ----------------------------- | ----------------------- | --------------------------------------- |
| System integration challenges | 92% (24/26 sources)     | Theme_Frequency_Analysis                |
| Pilot failure rate            | 90%                     | an enterprise AI deployment expert      |
| Framework abandonment         | 80-90%                  | a consulting firm practitioner          |
| Integration time              | 40-50% of deployment    | an enterprise AI deployment expert      |
| Model contribution            | 30-40%                  | an AI autonomous agent company Fireside |
| Context utilization rule      | 40% max                 | Production Agents Summit                |
| MCP tool accuracy cliff       | 25 tools → 30% accuracy | CC (an AI infrastructure company)       |

## Contact

**Author:** Fernando Torres (MSx '26)
**Project:** Stanford GSB GSBGEN 390 — Independent Research (Autumn 2025)
**Email:** fertorresnavarrete@gmail.com
**LinkedIn:** https://www.linkedin.com/in/fernandotn/
**Website:** https://fernandotorres.io

---

**Last Updated:** 2025-12-03
**Status:** Workspace initialized and ready for content creation
