import { PrismaClient, PostStatus, PostCategory } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create the AI Agents series first
  const aiAgentsSeries = await prisma.series.upsert({
    where: { slug: 'ai-agents-research' },
    update: {
      name: 'AI Agents Research',
      description: 'A comprehensive 25-post series exploring the full potential of AI Agents',
      postCount: 25,
      isFeatured: true,
    },
    create: {
      slug: 'ai-agents-research',
      name: 'AI Agents Research',
      description: 'A comprehensive 25-post series exploring the full potential of AI Agents',
      postCount: 25,
      isFeatured: true,
      startDate: new Date('2025-12-08'),
      endDate: new Date('2026-02-13'),
    },
  })

  console.log(`Created/Updated series: ${aiAgentsSeries.name}`)

  // 10-Week publication schedule (Dec 8, 2025 - Feb 13, 2026)
  // Week 1 (Dec 8-12): 3 posts - anchor, theme, theme
  // Week 2 (Dec 15-19): 2 posts - theme, theme
  // Week 3 (Dec 22-26): 3 posts
  // Week 4 (Dec 29 - Jan 2): 2 posts
  // Week 5 (Jan 5-9): 3 posts
  // Week 6 (Jan 12-16): 2 posts
  // Week 7 (Jan 19-23): 3 posts
  // Week 8 (Jan 26-30): 2 posts
  // Week 9 (Feb 2-6): 3 posts
  // Week 10 (Feb 9-13): 2 posts

  interface PostData {
    slug: string
    title: string
    excerpt: string
    content: string
    status: PostStatus
    publishedAt?: Date
    scheduledFor?: Date
    category: PostCategory
    seriesOrder: number
  }

  const posts: PostData[] = [
    // Week 1 - Dec 8-12: 3 posts (anchor, theme, theme)
    {
      slug: 'what-is-needed-to-unlock-ai-agents',
      title: "What's Needed to Unlock the Full Potential of AI Agents?",
      excerpt: 'Exploring the key infrastructure and capabilities needed for enterprise AI agent adoption.',
      content: '# What\'s Needed to Unlock the Full Potential of AI Agents?\n\nThe promise of AI agents is immense...',
      status: 'PUBLISHED' as PostStatus,
      publishedAt: new Date('2025-12-08T09:00:00Z'),
      category: 'ANCHOR' as PostCategory,
      seriesOrder: 1,
    },
    {
      slug: 'llm-cognitive-engine',
      title: 'The LLM as Cognitive Engine: Beyond Simple Prompting',
      excerpt: 'How to leverage LLMs as reasoning engines rather than just text generators.',
      content: '# The LLM as Cognitive Engine\n\nMost people think of LLMs as sophisticated text predictors...',
      status: 'PUBLISHED' as PostStatus,
      publishedAt: new Date('2025-12-10T09:00:00Z'),
      category: 'THEME' as PostCategory,
      seriesOrder: 2,
    },
    {
      slug: 'context-memory-foundations',
      title: 'Context & Memory: The Foundation of Intelligent Agents',
      excerpt: 'Understanding why context management is crucial for effective AI agents.',
      content: '# Context & Memory Foundations\n\nOne of the biggest challenges in building effective AI agents...',
      status: 'PUBLISHED' as PostStatus,
      publishedAt: new Date('2025-12-12T09:00:00Z'),
      category: 'THEME' as PostCategory,
      seriesOrder: 3,
    },

    // Week 2 - Dec 15-19: 2 posts (theme, theme)
    {
      slug: 'system-integration-challenges',
      title: 'System Integration: Where 92% of AI Pilots Fail',
      excerpt: 'The overlooked challenge of integrating AI agents with existing enterprise systems.',
      content: '# System Integration Challenges\n\nAccording to industry research, 92% of AI pilot projects fail...',
      status: 'SCHEDULED' as PostStatus,
      scheduledFor: new Date('2025-12-15T09:00:00Z'),
      category: 'THEME' as PostCategory,
      seriesOrder: 4,
    },
    {
      slug: 'authentication-identity',
      title: 'Authentication & Identity in Agent Systems',
      excerpt: 'How to handle identity and access control when agents act on behalf of users.',
      content: '# Authentication & Identity\n\nWhen agents act autonomously, identity management becomes critical...',
      status: 'SCHEDULED' as PostStatus,
      scheduledFor: new Date('2025-12-18T09:00:00Z'),
      category: 'THEME' as PostCategory,
      seriesOrder: 5,
    },

    // Week 3 - Dec 22-26: 3 posts
    {
      slug: 'trust-governance-guardrails',
      title: 'Trust, Governance & Guardrails: Building Enterprise-Ready Agents',
      excerpt: 'How to build AI agents that enterprises can trust and deploy confidently.',
      content: '# Trust, Governance & Guardrails\n\nEnterprise adoption of AI agents requires addressing trust...',
      status: 'SCHEDULED' as PostStatus,
      scheduledFor: new Date('2025-12-22T09:00:00Z'),
      category: 'THEME' as PostCategory,
      seriesOrder: 6,
    },
    {
      slug: 'emergent-behaviors',
      title: 'Emergent Behaviors in Multi-Agent Systems',
      excerpt: 'When agents collaborate, surprising capabilities emerge.',
      content: '# Emergent Behaviors\n\nWhen multiple agents work together, unexpected capabilities arise...',
      status: 'SCHEDULED' as PostStatus,
      scheduledFor: new Date('2025-12-24T09:00:00Z'),
      category: 'EMERGENT' as PostCategory,
      seriesOrder: 7,
    },
    {
      slug: 'cost-management-strategies',
      title: 'Cost Management Strategies for AI Agent Deployments',
      excerpt: 'Practical approaches to managing and optimizing AI agent costs at scale.',
      content: '# Cost Management Strategies\n\nAI agents can quickly become expensive at scale...',
      status: 'DRAFT' as PostStatus,
      category: 'EMERGENT' as PostCategory,
      seriesOrder: 8,
    },

    // Week 4 - Dec 29 - Jan 2: 2 posts
    {
      slug: 'agent-evaluations',
      title: 'Agent Evaluations: Measuring What Matters',
      excerpt: 'Frameworks for evaluating and benchmarking AI agent performance.',
      content: '# Agent Evaluations\n\nHow do you know if your agent is actually working well?...',
      status: 'DRAFT' as PostStatus,
      category: 'EMERGENT' as PostCategory,
      seriesOrder: 9,
    },
    {
      slug: 'monitoring-telemetry',
      title: 'Monitoring & Telemetry for Production Agents',
      excerpt: 'Building observability into AI agent systems from day one.',
      content: '# Monitoring & Telemetry\n\nProduction agents need comprehensive observability...',
      status: 'DRAFT' as PostStatus,
      category: 'EMERGENT' as PostCategory,
      seriesOrder: 10,
    },

    // Week 5 - Jan 5-9: 3 posts
    {
      slug: 'practitioner-pharma-insights',
      title: 'Practitioner Perspective: AI Agents in Pharma',
      excerpt: 'Lessons learned from deploying AI agents in pharmaceutical operations.',
      content: '# AI Agents in Pharma\n\nThe pharmaceutical industry has unique challenges...',
      status: 'DRAFT' as PostStatus,
      category: 'PRACTITIONER' as PostCategory,
      seriesOrder: 11,
    },
    {
      slug: 'practitioner-supply-chain',
      title: 'Practitioner Perspective: Supply Chain Automation',
      excerpt: 'How AI agents are transforming supply chain operations.',
      content: '# Supply Chain Automation\n\nSupply chain operations benefit greatly from AI agents...',
      status: 'DRAFT' as PostStatus,
      category: 'PRACTITIONER' as PostCategory,
      seriesOrder: 12,
    },
    {
      slug: 'emergent-reasoning-patterns',
      title: 'Emergent Reasoning Patterns in Large Language Models',
      excerpt: 'Unexpected reasoning capabilities that emerge from scale.',
      content: '# Emergent Reasoning Patterns\n\nAs LLMs scale, new reasoning abilities emerge...',
      status: 'DRAFT' as PostStatus,
      category: 'EMERGENT' as PostCategory,
      seriesOrder: 13,
    },

    // Week 6 - Jan 12-16: 2 posts
    {
      slug: 'practitioner-customer-service',
      title: 'Practitioner Perspective: Customer Service Agents',
      excerpt: 'Building effective customer service AI agents.',
      content: '# Customer Service Agents\n\nCustomer service is a natural fit for AI agents...',
      status: 'DRAFT' as PostStatus,
      category: 'PRACTITIONER' as PostCategory,
      seriesOrder: 14,
    },
    {
      slug: 'practitioner-code-assistants',
      title: 'Practitioner Perspective: Code Assistant Agents',
      excerpt: 'The evolution of AI-powered code assistants.',
      content: '# Code Assistant Agents\n\nCode assistants are among the most successful AI agent applications...',
      status: 'DRAFT' as PostStatus,
      category: 'PRACTITIONER' as PostCategory,
      seriesOrder: 15,
    },

    // Week 7 - Jan 19-23: 3 posts
    {
      slug: 'prototype-rag-agent',
      title: 'Prototype Learning: Building a RAG-Powered Agent',
      excerpt: 'Lessons from building a retrieval-augmented agent.',
      content: '# RAG-Powered Agent Prototype\n\nBuilding a RAG agent taught us valuable lessons...',
      status: 'DRAFT' as PostStatus,
      category: 'PROTOTYPE' as PostCategory,
      seriesOrder: 16,
    },
    {
      slug: 'prototype-multi-agent',
      title: 'Prototype Learning: Multi-Agent Orchestration',
      excerpt: 'Coordinating multiple specialized agents.',
      content: '# Multi-Agent Orchestration\n\nCoordinating multiple agents requires careful design...',
      status: 'DRAFT' as PostStatus,
      category: 'PROTOTYPE' as PostCategory,
      seriesOrder: 17,
    },
    {
      slug: 'emergent-tool-use',
      title: 'Emergent Tool Use: How Agents Learn to Use Tools',
      excerpt: 'The surprising ways agents learn to leverage external tools.',
      content: '# Emergent Tool Use\n\nAgents often discover novel ways to use tools...',
      status: 'DRAFT' as PostStatus,
      category: 'EMERGENT' as PostCategory,
      seriesOrder: 18,
    },

    // Week 8 - Jan 26-30: 2 posts
    {
      slug: 'prototype-voice-agent',
      title: 'Prototype Learning: Voice-Enabled Agents',
      excerpt: 'Challenges and solutions for voice-first AI agents.',
      content: '# Voice-Enabled Agents\n\nVoice interfaces add new dimensions to agent design...',
      status: 'DRAFT' as PostStatus,
      category: 'PROTOTYPE' as PostCategory,
      seriesOrder: 19,
    },
    {
      slug: 'practitioner-data-analysis',
      title: 'Practitioner Perspective: Data Analysis Agents',
      excerpt: 'How AI agents are changing data analysis workflows.',
      content: '# Data Analysis Agents\n\nData analysis agents can automate complex workflows...',
      status: 'DRAFT' as PostStatus,
      category: 'PRACTITIONER' as PostCategory,
      seriesOrder: 20,
    },

    // Week 9 - Feb 2-6: 3 posts
    {
      slug: 'conference-neurips-insights',
      title: 'Conference Insights: NeurIPS 2024 Agent Research',
      excerpt: 'Key takeaways from NeurIPS on AI agent research.',
      content: '# NeurIPS 2024 Insights\n\nThe latest research from NeurIPS on AI agents...',
      status: 'DRAFT' as PostStatus,
      category: 'CONFERENCE' as PostCategory,
      seriesOrder: 21,
    },
    {
      slug: 'conference-icml-trends',
      title: 'Conference Insights: ICML Agent Architecture Trends',
      excerpt: 'Emerging architecture patterns from ICML.',
      content: '# ICML Agent Trends\n\nICML showcased new agent architecture approaches...',
      status: 'DRAFT' as PostStatus,
      category: 'CONFERENCE' as PostCategory,
      seriesOrder: 22,
    },
    {
      slug: 'conference-stanford-ai',
      title: 'Conference Insights: Stanford AI Conference Highlights',
      excerpt: 'Notable presentations from the Stanford AI Conference.',
      content: '# Stanford AI Conference\n\nStanford\'s AI conference highlighted key developments...',
      status: 'DRAFT' as PostStatus,
      category: 'CONFERENCE' as PostCategory,
      seriesOrder: 23,
    },

    // Week 10 - Feb 9-13: 2 posts
    {
      slug: 'methodology-eight-pillars',
      title: 'Methodology: The Eight Pillars Framework',
      excerpt: 'A comprehensive framework for building production AI agents.',
      content: '# The Eight Pillars Framework\n\nOur research led to an eight-pillar framework...',
      status: 'DRAFT' as PostStatus,
      category: 'METHODOLOGY' as PostCategory,
      seriesOrder: 24,
    },
    {
      slug: 'series-conclusion',
      title: 'Series Conclusion: The Future of AI Agents',
      excerpt: 'Looking ahead at what the future holds for AI agents.',
      content: '# The Future of AI Agents\n\nAs we conclude this series, we look to the future...',
      status: 'DRAFT' as PostStatus,
      category: 'ANCHOR' as PostCategory,
      seriesOrder: 25,
    },
  ]

  for (const post of posts) {
    const created = await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        ...post,
        seriesId: aiAgentsSeries.id,
        author: 'Fernando Torres',
        readingTimeMinutes: Math.floor(Math.random() * 5) + 5,
      },
      create: {
        ...post,
        seriesId: aiAgentsSeries.id,
        author: 'Fernando Torres',
        readingTimeMinutes: Math.floor(Math.random() * 5) + 5,
      },
    })
    console.log(`Created/Updated post: ${created.title} (${created.status})`)
  }

  // Create admin user if not exists
  const bcrypt = await import('bcryptjs')
  const hashedPassword = await bcrypt.default.hashSync('admin123', 12)

  await prisma.adminUser.upsert({
    where: { email: 'admin@fernandotorres.dev' },
    update: {},
    create: {
      email: 'admin@fernandotorres.dev',
      passwordHash: hashedPassword,
      name: 'Admin',
    },
  })
  console.log('Created/Updated admin user')

  // Create some tags
  const tags = [
    { slug: 'ai-agents', name: 'AI Agents' },
    { slug: 'llm', name: 'LLM' },
    { slug: 'enterprise', name: 'Enterprise' },
    { slug: 'integration', name: 'Integration' },
    { slug: 'governance', name: 'Governance' },
  ]

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: tag,
      create: { ...tag, postCount: 0 },
    })
    console.log(`Created/Updated tag: ${tag.name}`)
  }

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
