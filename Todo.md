# Blog Post Issues - Investigation & Fixes

## Summary

The blog system has **three different content sources** that were out of sync:
1. **Database** (prisma/seed.ts) - Has correct slugs but only placeholder content
2. **Blog listing page** (src/app/(public)/blog/page.tsx) - Had wrong slugs (now fixed)
3. **BlogPostClient** (src/app/(public)/blog/[slug]/BlogPostClient.tsx) - Had wrong slugs (now fixed), only 5 posts have mock content

## Current Status

### Fixed Issues

| Issue | File | Status |
|-------|------|--------|
| Blog listing uses wrong slugs | `src/app/(public)/blog/page.tsx` | FIXED |
| BlogPostClient mock slugs wrong | `src/app/(public)/blog/[slug]/BlogPostClient.tsx` | FIXED |
| Series navigation uses wrong slugs | `src/app/(public)/blog/[slug]/BlogPostClient.tsx` | FIXED |

### Outstanding Issues

| Issue | Description | Priority |
|-------|-------------|----------|
| 20 posts have no content | Only 5 posts have mock content in BlogPostClient | HIGH |
| MDX content not loaded | Full content exists in MDX files but isn't used | HIGH |
| Database has placeholder text | seed.ts only creates short placeholder content | MEDIUM |

## Architecture Overview

### Content Flow

```
User visits /blog → blog/page.tsx (mock data for listing)
                            ↓
User clicks post → blog/[slug]/BlogPostClient.tsx
                            ↓
                   Check mockBlogPostsContent
                            ↓
                   If found → Display mock content
                   If not → API call → Database (placeholder only)
```

### Content Sources

1. **MDX Files** (FULL CONTENT): `/content/deliverables/blog-posts/*.mdx`
   - 25 files with complete blog post content
   - Named like `2025-12-ai-agents-research-overview.mdx`
   - NOT currently being used by the site

2. **Database** (PLACEHOLDER): Via `prisma/seed.ts`
   - 25 posts with correct slugs
   - Only 1-2 sentences of placeholder content
   - Used as fallback when no mock content exists

3. **Mock Data** (PARTIAL): In `BlogPostClient.tsx`
   - Only 5 posts have full mock content:
     - `what-is-needed-to-unlock-ai-agents`
     - `llm-cognitive-engine`
     - `context-memory-foundations`
     - `system-integration-challenges`
     - `authentication-identity`

## Database Slugs (Authoritative)

These are the correct slugs that exist in the database:

| # | Slug | Category | Has Mock Content |
|---|------|----------|------------------|
| 1 | what-is-needed-to-unlock-ai-agents | ANCHOR | YES |
| 2 | llm-cognitive-engine | THEME | YES |
| 3 | context-memory-foundations | THEME | YES |
| 4 | system-integration-challenges | THEME | YES |
| 5 | authentication-identity | THEME | YES |
| 6 | trust-governance-guardrails | THEME | NO |
| 7 | emergent-behaviors | EMERGENT | NO |
| 8 | cost-management-strategies | EMERGENT | NO |
| 9 | agent-evaluations | EMERGENT | NO |
| 10 | monitoring-telemetry | EMERGENT | NO |
| 11 | practitioner-pharma-insights | PRACTITIONER | NO |
| 12 | practitioner-supply-chain | PRACTITIONER | NO |
| 13 | emergent-reasoning-patterns | EMERGENT | NO |
| 14 | practitioner-customer-service | PRACTITIONER | NO |
| 15 | practitioner-code-assistants | PRACTITIONER | NO |
| 16 | prototype-rag-agent | PROTOTYPE | NO |
| 17 | prototype-multi-agent | PROTOTYPE | NO |
| 18 | emergent-tool-use | EMERGENT | NO |
| 19 | prototype-voice-agent | PROTOTYPE | NO |
| 20 | practitioner-data-analysis | PRACTITIONER | NO |
| 21 | conference-neurips-insights | CONFERENCE | NO |
| 22 | conference-icml-trends | CONFERENCE | NO |
| 23 | conference-stanford-ai | CONFERENCE | NO |
| 24 | methodology-eight-pillars | METHODOLOGY | NO |
| 25 | series-conclusion | THEME | NO |

## MDX to Database Slug Mapping

The MDX files need to be mapped to database slugs:

| MDX Filename | Database Slug |
|--------------|---------------|
| 2025-12-ai-agents-research-overview.mdx | what-is-needed-to-unlock-ai-agents |
| 2025-12-coding-agent-exception.mdx | llm-cognitive-engine |
| 2025-12-40-percent-context-rule.mdx | context-memory-foundations |
| 2025-12-system-integration-92-percent.mdx | system-integration-challenges |
| 2025-12-okta-interview.mdx | authentication-identity |
| 2025-12-enterprise-business-case.mdx | trust-governance-guardrails |
| 2025-12-demo-production-chasm.mdx | emergent-behaviors |
| 2025-12-model-myth.mdx | cost-management-strategies |
| 2025-12-evaluation-gap.mdx | agent-evaluations |
| 2025-12-mcp-tool-cliff.mdx | monitoring-telemetry |
| 2025-12-handoff-rate-metric.mdx | practitioner-pharma-insights |
| 2025-12-component-evaluation.mdx | practitioner-supply-chain |
| 2025-12-dual-memory-architecture.mdx | emergent-reasoning-patterns |
| 2025-12-qurrent-interview.mdx | practitioner-customer-service |
| 2025-12-sybill-interview.mdx | practitioner-code-assistants |
| 2025-12-crewai-interview.mdx | prototype-rag-agent |
| 2025-12-autonomy-interview.mdx | prototype-multi-agent |
| 2025-12-framework-abandonment.mdx | emergent-tool-use |
| 2025-12-shopping-agent.mdx | prototype-voice-agent |
| 2025-12-repo-patcher.mdx | practitioner-data-analysis |
| 2025-12-good-agents.mdx | conference-neurips-insights |
| 2025-12-manus-fireside.mdx | conference-icml-trends |
| 2025-12-why-95-fail.mdx | conference-stanford-ai |
| 2025-12-production-summit.mdx | methodology-eight-pillars |
| 2025-12-research-methodology.mdx | series-conclusion |

## Recommended Solutions

### Option A: Populate Database with Full Content (Recommended for Production)

1. Create a migration script that:
   - Reads each MDX file
   - Parses frontmatter and content
   - Updates the corresponding database record with full content

2. Update `prisma/seed.ts` to:
   - Read MDX files instead of hardcoded placeholder content
   - Map MDX filenames to slugs using the table above

### Option B: Load MDX Content at Runtime

1. Create a content loader utility
2. Modify BlogPostClient to:
   - First check for MDX content
   - Fall back to database if not found

### Option C: Add All Mock Content to BlogPostClient (Quick Fix)

1. Copy content from each MDX file into BlogPostClient mock data
2. Pros: Fast to implement, no architecture changes
3. Cons: Duplicates content, hard to maintain

## Relevant Files

| File | Purpose |
|------|---------|
| `src/app/(public)/blog/page.tsx` | Blog listing page with mock data |
| `src/app/(public)/blog/[slug]/BlogPostClient.tsx` | Individual post page with mock content |
| `prisma/seed.ts` | Database seeding with placeholder content |
| `content/deliverables/blog-posts/*.mdx` | Full MDX content files |
| `verify-schedule.js` | Publication schedule verification |
| `content/deliverables/maintenance/content-refresh-schedule.md` | Content refresh schedule |

## Publication Schedule

Posts are scheduled for release starting Dec 8, 2025:
- Week 1-3: Dec 8-26, 2025 (8 posts)
- Week 4-6: Dec 29, 2025 - Jan 16, 2026 (6 posts)
- Week 7-10: Jan 19 - Feb 13, 2026 (11 posts)

The posts were temporarily set to PUBLISHED for testing, but should be returned to SCHEDULED status before production deployment.

## Next Steps

1. [ ] Choose solution approach (A, B, or C above)
2. [ ] Implement content loading from MDX files
3. [ ] Test all 25 posts display correctly
4. [ ] Reset post statuses to SCHEDULED
5. [ ] Verify publication schedule works correctly
6. [ ] Deploy to production

## Commands Used

```bash
# Check database posts
docker exec postgres-dev psql -U postgres -d personal_website_dev \
  -c "SELECT slug, title, status FROM posts ORDER BY slug;"

# Check content length in database
docker exec postgres-dev psql -U postgres -d personal_website_dev \
  -c "SELECT slug, LENGTH(content) as content_length FROM posts ORDER BY slug;"

# Run seed to reset database
pnpm prisma db seed

# Verify publication schedule
node verify-schedule.js
```
