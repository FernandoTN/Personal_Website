/**
 * Script to create AI Agents Research series and assign all AI posts to it
 * Run with: DATABASE_URL="..." npx ts-node scripts/assign-ai-series.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// AI Research posts in order (from update-post-images.ts)
const aiResearchPosts = [
  'what-is-needed-to-unlock-ai-agents',      // Post 1 - Anchor
  'llm-cognitive-engine',                     // Post 2
  'context-memory-foundations',               // Post 3
  'system-integration-challenges',            // Post 4
  'authentication-identity',                  // Post 5
  'trust-governance-guardrails',              // Post 6
  'emergent-behaviors',                       // Post 7
  'cost-management-strategies',               // Post 8
  'agent-evaluations',                        // Post 9
  'monitoring-telemetry',                     // Post 10
  'practitioner-pharma-insights',             // Post 11
  'practitioner-supply-chain',                // Post 12
  'emergent-reasoning-patterns',              // Post 13
  'practitioner-customer-service',            // Post 14
  'practitioner-code-assistants',             // Post 15
  'prototype-rag-agent',                      // Post 16
  'prototype-multi-agent',                    // Post 17
  'emergent-tool-use',                        // Post 18
  'prototype-voice-agent',                    // Post 19
  'practitioner-data-analysis',               // Post 20
  'conference-neurips-insights',              // Post 21
  'conference-icml-trends',                   // Post 22
  'conference-stanford-ai',                   // Post 23
  'methodology-eight-pillars',                // Post 24
  'series-conclusion',                        // Post 25
]

async function assignAiSeries() {
  console.log('Starting AI Agents Research series assignment...\n')

  // Step 1: Create or find the series
  const seriesSlug = 'ai-agents-research'
  let series = await prisma.series.findUnique({
    where: { slug: seriesSlug },
  })

  if (!series) {
    console.log('Creating AI Agents Research series...')
    series = await prisma.series.create({
      data: {
        slug: seriesSlug,
        name: 'AI Agents Research',
        description: 'A comprehensive 10-week research series exploring what enterprises need to successfully deploy AI agents in production. From technical challenges to governance frameworks, this series covers the complete landscape of agentic AI.',
        isFeatured: true,
        startDate: new Date('2025-12-08'),
        endDate: new Date('2026-02-13'),
        postCount: 25,
      },
    })
    console.log(`✓ Created series: ${series.name} (ID: ${series.id})\n`)
  } else {
    console.log(`✓ Found existing series: ${series.name} (ID: ${series.id})\n`)
  }

  // Step 2: Update all AI research posts with series info
  let updated = 0
  let skipped = 0
  let notFound = 0

  for (let i = 0; i < aiResearchPosts.length; i++) {
    const slug = aiResearchPosts[i]
    const seriesOrder = i + 1 // 1-indexed order

    try {
      // Check if post exists and already has series
      const existingPost = await prisma.post.findUnique({
        where: { slug },
        select: { id: true, title: true, seriesId: true, seriesOrder: true },
      })

      if (!existingPost) {
        console.log(`⚠ Not found: ${slug}`)
        notFound++
        continue
      }

      // Skip if already assigned to this series with correct order
      if (existingPost.seriesId === series.id && existingPost.seriesOrder === seriesOrder) {
        console.log(`○ Already assigned: #${seriesOrder} ${slug}`)
        skipped++
        continue
      }

      // Update the post
      await prisma.post.update({
        where: { slug },
        data: {
          seriesId: series.id,
          seriesOrder: seriesOrder,
        },
      })

      console.log(`✓ Assigned: #${seriesOrder} ${slug}`)
      updated++
    } catch (error) {
      console.error(`✗ Error updating ${slug}:`, error)
    }
  }

  // Step 3: Update series post count
  const actualPostCount = await prisma.post.count({
    where: { seriesId: series.id },
  })

  await prisma.series.update({
    where: { id: series.id },
    data: { postCount: actualPostCount },
  })

  console.log('\n--- Summary ---')
  console.log(`Series: ${series.name}`)
  console.log(`Updated: ${updated}`)
  console.log(`Already assigned: ${skipped}`)
  console.log(`Not found: ${notFound}`)
  console.log(`Total posts in series: ${actualPostCount}`)
}

assignAiSeries()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
