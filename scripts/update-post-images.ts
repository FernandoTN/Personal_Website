/**
 * Script to update all AI research posts with featured images
 * Run with: DATABASE_URL="..." npx ts-node scripts/update-post-images.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Mapping of post slugs to their featured image filenames
// Images are located at /images/blog/
const postImageMap: Record<string, string> = {
  // Post 1 - Anchor post about enterprise blockers
  'what-is-needed-to-unlock-ai-agents': 'enterprise-blockers-cover.png',

  // Post 2 - Coding agent exception
  'llm-cognitive-engine': 'coding-agent-exception-cover.png',

  // Post 3 - Context/memory 40% rule
  'context-memory-foundations': 'context-management-cover.png',

  // Post 4 - System integration 92%
  'system-integration-challenges': 'system-integration-92-percent.png',

  // Post 5 - Authentication/identity
  'authentication-identity': 'auth-identity.svg',

  // Post 6 - Trust/governance (90% fail)
  'trust-governance-guardrails': 'why-95-fail.png',

  // Post 7 - Demo-production chasm
  'emergent-behaviors': 'demo-production-chasm-cover.png',

  // Post 8 - Model myth/framework
  'cost-management-strategies': 'model-myth-cover.png',

  // Post 9 - Evaluation gap
  'agent-evaluations': 'evaluation-gap-cover.png',

  // Post 10 - MCP tool cliff
  'monitoring-telemetry': 'mcp-tool-cliff.png',

  // Post 11 - Practitioner pharma
  'practitioner-pharma-insights': 'practitioner-interview.png',

  // Post 12 - Practitioner supply chain
  'practitioner-supply-chain': 'practitioner-interview-2-probabilistic-systems.png',

  // Post 13 - Emergent reasoning
  'emergent-reasoning-patterns': 'good-agents.png',

  // Post 14 - Practitioner customer service
  'practitioner-customer-service': 'practitioner-interview-3.png',

  // Post 15 - Practitioner code assistants
  'practitioner-code-assistants': 'practitioner-interview-4.png',

  // Post 16 - Prototype RAG agent
  'prototype-rag-agent': 'repo-patcher-cover.png',

  // Post 17 - Prototype multi-agent
  'prototype-multi-agent': 'dual-memory-architecture.png',

  // Post 18 - Emergent tool use
  'emergent-tool-use': 'component-evaluation-cover.png',

  // Post 19 - Prototype voice agent
  'prototype-voice-agent': 'shopping-agent-cover.png',

  // Post 20 - Practitioner data analysis
  'practitioner-data-analysis': 'practitioner-interview-5-cover.png',

  // Post 21 - Conference NeurIPS
  'conference-neurips-insights': 'autonomous-agent-fireside.png',

  // Post 22 - Conference ICML
  'conference-icml-trends': 'framework-abandonment-cover.png',

  // Post 23 - Conference Stanford
  'conference-stanford-ai': 'production-summit.png',

  // Post 24 - Methodology 8 pillars
  'methodology-eight-pillars': 'research-methodology-cover.png',

  // Post 25 - Series conclusion
  'series-conclusion': 'ai-agents-research-cover.png',
}

async function updatePostImages() {
  console.log('Starting to update post images...\n')

  let updated = 0
  let skipped = 0
  let errors = 0

  for (const [slug, imageName] of Object.entries(postImageMap)) {
    try {
      const imageUrl = `/images/blog/${imageName}`

      const result = await prisma.post.updateMany({
        where: { slug },
        data: {
          featuredImage: imageUrl,
          ogImage: imageUrl, // Use same image for OG
        },
      })

      if (result.count > 0) {
        console.log(`✓ Updated: ${slug} -> ${imageName}`)
        updated++
      } else {
        console.log(`⚠ Skipped (not found): ${slug}`)
        skipped++
      }
    } catch (error) {
      console.error(`✗ Error updating ${slug}:`, error)
      errors++
    }
  }

  console.log('\n--- Summary ---')
  console.log(`Updated: ${updated}`)
  console.log(`Skipped: ${skipped}`)
  console.log(`Errors: ${errors}`)
}

updatePostImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
