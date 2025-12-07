# Production Deployment Plan - Vercel + Neon

## Overview

Deploy the personal website to Vercel using Neon PostgreSQL as the database, with full blog content loaded from MDX files.

## Architecture Decision

**Chosen: Option A - Populate Database with Full MDX Content**

- Database becomes single source of truth
- MDX files parsed during seed, content stored in DB
- Works with publication schedule (SCHEDULED status)
- Clean production architecture

---

## Task Checklist

### Task 1: Content Migration Infrastructure
**Status: passing: true**

Create the infrastructure to read MDX files and map them to database slugs.

#### Substeps:
- [ ] Create MDX parser utility to read frontmatter and content
- [ ] Create slug mapping configuration (MDX filename → database slug)
- [ ] Test MDX parsing on sample files
- [ ] Verify all 25 MDX files can be parsed correctly

#### Files to create/modify:
- `scripts/mdx-parser.ts` - MDX parsing utility
- `scripts/slug-mapping.ts` - Mapping configuration

---

### Task 2: Update Seed Script
**Status: passing: true**

Modify `prisma/seed.ts` to load full content from MDX files instead of placeholder text.

#### Substeps:
- [ ] Import MDX parser utility into seed.ts
- [ ] Replace placeholder content with MDX file content
- [ ] Preserve existing metadata (title, excerpt, category, series, dates)
- [ ] Handle featured images from MDX frontmatter or existing mapping
- [ ] Test seed locally with Docker PostgreSQL
- [ ] Verify all 25 posts have full content after seeding

#### Files to modify:
- `prisma/seed.ts`

#### Verification:
```bash
# Reset and reseed local database
pnpm prisma db push --force-reset
pnpm prisma db seed

# Check content length
docker exec postgres-dev psql -U postgres -d personal_website_dev \
  -c "SELECT slug, LENGTH(content) as content_length FROM posts ORDER BY content_length DESC;"
```

---

### Task 3: Fix BlogPostClient Content Loading
**Status: passing: true**

Update BlogPostClient to properly fetch and render content from database instead of relying on mock data.

#### Substeps:
- [ ] Review current API route for fetching posts
- [ ] Ensure API returns full content field
- [ ] Update BlogPostClient to render database content
- [ ] Remove or reduce mock content dependency
- [ ] Test all 25 posts display correctly locally

#### Files to modify:
- `src/app/(public)/blog/[slug]/BlogPostClient.tsx`
- `src/app/api/posts/[slug]/route.ts` (if exists)

---

### Task 4: Create Neon Database
**Status: passing: false**

Set up Neon PostgreSQL project for production.

#### Substeps:
- [ ] Create Neon account (if needed)
- [ ] Create new Neon project
- [ ] Create production database
- [ ] Get connection string (pooled and direct)
- [ ] Test connection from local machine
- [ ] Document connection strings securely

#### Connection String Format:
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

---

### Task 5: Configure Prisma for Neon
**Status: passing: false**

Update Prisma configuration to work with Neon's connection pooling.

#### Substeps:
- [ ] Update `prisma/schema.prisma` for Neon compatibility
- [ ] Add `directUrl` for migrations (non-pooled connection)
- [ ] Test schema push to Neon
- [ ] Run seed on Neon database
- [ ] Verify all data migrated correctly

#### Files to modify:
- `prisma/schema.prisma`
- `.env.production` (create or update)

#### Schema update needed:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

---

### Task 6: Set Up Vercel Project
**Status: passing: false**

Create and configure Vercel project for deployment.

#### Substeps:
- [ ] Create Vercel account (if needed)
- [ ] Import GitHub repository to Vercel
- [ ] Configure build settings (Next.js auto-detected)
- [ ] Add environment variables:
  - `DATABASE_URL` (Neon pooled connection)
  - `DIRECT_URL` (Neon direct connection)
  - `NEXTAUTH_SECRET` (if using auth)
  - `NEXTAUTH_URL` (production URL)
  - Any other env vars from `.env.local`
- [ ] Configure domain (if custom domain)

---

### Task 7: Database Migration on Neon
**Status: passing: false**

Push schema and seed data to Neon production database.

#### Substeps:
- [ ] Set production DATABASE_URL locally
- [ ] Run `prisma db push` against Neon
- [ ] Run `prisma db seed` against Neon
- [ ] Verify all 25 posts exist with full content
- [ ] Set post statuses to SCHEDULED (except anchor post)
- [ ] Verify publication dates are correct

#### Commands:
```bash
# With production env vars set
DATABASE_URL="neon-connection-string" pnpm prisma db push
DATABASE_URL="neon-connection-string" pnpm prisma db seed

# Verify
DATABASE_URL="neon-connection-string" pnpm prisma studio
```

---

### Task 8: Deploy to Vercel
**Status: passing: false**

Deploy the application to Vercel.

#### Substeps:
- [ ] Push latest code to GitHub main branch
- [ ] Trigger Vercel deployment (auto or manual)
- [ ] Monitor build logs for errors
- [ ] Wait for deployment to complete
- [ ] Get production URL

---

### Task 9: Production Verification
**Status: passing: false**

Verify the deployed site works correctly.

#### Substeps:
- [ ] Visit production URL
- [ ] Test homepage loads correctly
- [ ] Test blog listing page shows correct posts
- [ ] Test anchor post (should be PUBLISHED) displays with full content
- [ ] Verify SCHEDULED posts are hidden from public
- [ ] Test admin login (if applicable)
- [ ] Test all navigation links
- [ ] Check images load correctly
- [ ] Test responsive design (mobile/tablet/desktop)
- [ ] Check SEO meta tags

---

### Task 10: Post-Deployment Configuration
**Status: passing: false**

Final production configuration and cleanup.

#### Substeps:
- [ ] Set up cron job for scheduled post publication (if needed)
- [ ] Configure monitoring/analytics
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Update README with deployment info
- [ ] Clean up local development artifacts
- [ ] Document any manual steps needed

---

## Reference Information

### MDX to Database Slug Mapping

| # | MDX Filename | Database Slug | Category |
|---|--------------|---------------|----------|
| 1 | 2025-12-ai-agents-research-overview.mdx | what-is-needed-to-unlock-ai-agents | ANCHOR |
| 2 | 2025-12-coding-agent-exception.mdx | llm-cognitive-engine | THEME |
| 3 | 2025-12-40-percent-context-rule.mdx | context-memory-foundations | THEME |
| 4 | 2025-12-system-integration-92-percent.mdx | system-integration-challenges | THEME |
| 5 | 2025-12-okta-interview.mdx | authentication-identity | THEME |
| 6 | 2025-12-enterprise-business-case.mdx | trust-governance-guardrails | THEME |
| 7 | 2025-12-demo-production-chasm.mdx | emergent-behaviors | EMERGENT |
| 8 | 2025-12-model-myth.mdx | cost-management-strategies | EMERGENT |
| 9 | 2025-12-evaluation-gap.mdx | agent-evaluations | EMERGENT |
| 10 | 2025-12-mcp-tool-cliff.mdx | monitoring-telemetry | EMERGENT |
| 11 | 2025-12-handoff-rate-metric.mdx | practitioner-pharma-insights | PRACTITIONER |
| 12 | 2025-12-component-evaluation.mdx | practitioner-supply-chain | PRACTITIONER |
| 13 | 2025-12-dual-memory-architecture.mdx | emergent-reasoning-patterns | EMERGENT |
| 14 | 2025-12-qurrent-interview.mdx | practitioner-customer-service | PRACTITIONER |
| 15 | 2025-12-sybill-interview.mdx | practitioner-code-assistants | PRACTITIONER |
| 16 | 2025-12-crewai-interview.mdx | prototype-rag-agent | PROTOTYPE |
| 17 | 2025-12-autonomy-interview.mdx | prototype-multi-agent | PROTOTYPE |
| 18 | 2025-12-framework-abandonment.mdx | emergent-tool-use | EMERGENT |
| 19 | 2025-12-shopping-agent.mdx | prototype-voice-agent | PROTOTYPE |
| 20 | 2025-12-repo-patcher.mdx | practitioner-data-analysis | PRACTITIONER |
| 21 | 2025-12-good-agents.mdx | conference-neurips-insights | CONFERENCE |
| 22 | 2025-12-manus-fireside.mdx | conference-icml-trends | CONFERENCE |
| 23 | 2025-12-why-95-fail.mdx | conference-stanford-ai | CONFERENCE |
| 24 | 2025-12-production-summit.mdx | methodology-eight-pillars | METHODOLOGY |
| 25 | 2025-12-research-methodology.mdx | series-conclusion | THEME |

### Key Files

| File | Purpose |
|------|---------|
| `prisma/seed.ts` | Database seeding script |
| `prisma/schema.prisma` | Database schema |
| `src/app/(public)/blog/page.tsx` | Blog listing page |
| `src/app/(public)/blog/[slug]/BlogPostClient.tsx` | Individual post page |
| `content/deliverables/blog-posts/*.mdx` | Full MDX content files |
| `scripts/update-images.sql` | Featured image mappings |

### Publication Schedule

Posts scheduled for release starting Dec 8, 2025:
- Week 1-3: Dec 8-26, 2025 (8 posts)
- Week 4-6: Dec 29, 2025 - Jan 16, 2026 (6 posts)
- Week 7-10: Jan 19 - Feb 13, 2026 (11 posts)

Only the anchor post (`what-is-needed-to-unlock-ai-agents`) should be PUBLISHED initially.

---

## Progress Summary

| Task | Status |
|------|--------|
| 1. Content Migration Infrastructure | true |
| 2. Update Seed Script | true |
| 3. Fix BlogPostClient Content Loading | true |
| 4. Create Neon Database | false |
| 5. Configure Prisma for Neon | false |
| 6. Set Up Vercel Project | false |
| 7. Database Migration on Neon | false |
| 8. Deploy to Vercel | false |
| 9. Production Verification | false |
| 10. Post-Deployment Configuration | false |

**Overall Progress: 3/10 tasks complete**
