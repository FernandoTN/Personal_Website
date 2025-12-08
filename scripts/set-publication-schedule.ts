import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Publication schedule: Post order -> scheduled date (9am UTC)
const PUBLICATION_SCHEDULE: { slug: string; date: string; status: 'PUBLISHED' | 'SCHEDULED' }[] = [
  // Post 1: Anchor - PUBLISHED immediately
  { slug: 'what-is-needed-to-unlock-ai-agents', date: '2024-12-08', status: 'PUBLISHED' },

  // Week 1-3: Dec 8-26, 2025 (posts 2-9)
  { slug: 'llm-cognitive-engine', date: '2025-12-10', status: 'SCHEDULED' },
  { slug: 'context-memory-foundations', date: '2025-12-12', status: 'SCHEDULED' },
  { slug: 'system-integration-challenges', date: '2025-12-15', status: 'SCHEDULED' },
  { slug: 'authentication-identity', date: '2025-12-17', status: 'SCHEDULED' },
  { slug: 'trust-governance-guardrails', date: '2025-12-19', status: 'SCHEDULED' },
  { slug: 'emergent-behaviors', date: '2025-12-22', status: 'SCHEDULED' },
  { slug: 'cost-management-strategies', date: '2025-12-24', status: 'SCHEDULED' },
  { slug: 'agent-evaluations', date: '2025-12-26', status: 'SCHEDULED' },

  // Week 4-6: Dec 29, 2025 - Jan 16, 2026 (posts 10-15)
  { slug: 'monitoring-telemetry', date: '2025-12-29', status: 'SCHEDULED' },
  { slug: 'practitioner-pharma-insights', date: '2026-01-02', status: 'SCHEDULED' },
  { slug: 'practitioner-supply-chain', date: '2026-01-05', status: 'SCHEDULED' },
  { slug: 'emergent-reasoning-patterns', date: '2026-01-08', status: 'SCHEDULED' },
  { slug: 'practitioner-customer-service', date: '2026-01-12', status: 'SCHEDULED' },
  { slug: 'practitioner-code-assistants', date: '2026-01-15', status: 'SCHEDULED' },

  // Week 7-10: Jan 19 - Feb 13, 2026 (posts 16-25)
  { slug: 'prototype-rag-agent', date: '2026-01-19', status: 'SCHEDULED' },
  { slug: 'prototype-multi-agent', date: '2026-01-22', status: 'SCHEDULED' },
  { slug: 'emergent-tool-use', date: '2026-01-26', status: 'SCHEDULED' },
  { slug: 'prototype-voice-agent', date: '2026-01-29', status: 'SCHEDULED' },
  { slug: 'practitioner-data-analysis', date: '2026-02-02', status: 'SCHEDULED' },
  { slug: 'conference-neurips-insights', date: '2026-02-05', status: 'SCHEDULED' },
  { slug: 'conference-icml-trends', date: '2026-02-08', status: 'SCHEDULED' },
  { slug: 'conference-stanford-ai', date: '2026-02-10', status: 'SCHEDULED' },
  { slug: 'methodology-eight-pillars', date: '2026-02-12', status: 'SCHEDULED' },
  { slug: 'series-conclusion', date: '2026-02-13', status: 'SCHEDULED' },
]

async function setPublicationSchedule() {
  console.log('Setting publication schedule for all posts...\n')

  for (const item of PUBLICATION_SCHEDULE) {
    const scheduleDate = new Date(`${item.date}T09:00:00Z`) // 9am UTC

    try {
      const post = await prisma.post.update({
        where: { slug: item.slug },
        data: {
          status: item.status,
          publishedAt: item.status === 'PUBLISHED' ? scheduleDate : null,
          scheduledFor: item.status === 'SCHEDULED' ? scheduleDate : null,
        },
      })

      const statusIcon = item.status === 'PUBLISHED' ? '✅' : '📅'
      console.log(`${statusIcon} ${post.title}`)
      console.log(`   Status: ${item.status}`)
      console.log(`   Date: ${item.date}`)
      console.log('')
    } catch (error) {
      console.error(`❌ Failed to update ${item.slug}:`, error)
    }
  }

  // Summary
  const published = await prisma.post.count({ where: { status: 'PUBLISHED' } })
  const scheduled = await prisma.post.count({ where: { status: 'SCHEDULED' } })
  const draft = await prisma.post.count({ where: { status: 'DRAFT' } })

  console.log('\n=== Summary ===')
  console.log(`Published: ${published}`)
  console.log(`Scheduled: ${scheduled}`)
  console.log(`Draft: ${draft}`)
}

setPublicationSchedule()
  .then(() => {
    console.log('\nDone!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
