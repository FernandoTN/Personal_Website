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
      status: 'SCHEDULED' as PostStatus,
      scheduledFor: new Date('2025-12-26T09:00:00Z'),
      category: 'EMERGENT' as PostCategory,
      seriesOrder: 8,
    },

    // Week 4 - Dec 29 - Jan 2: 2 posts
    {
      slug: 'agent-evaluations',
      title: 'Agent Evaluations: Measuring What Matters',
      excerpt: 'Frameworks for evaluating and benchmarking AI agent performance.',
      content: '# Agent Evaluations\n\nHow do you know if your agent is actually working well?...',
      status: 'SCHEDULED' as PostStatus,
      scheduledFor: new Date('2025-12-29T09:00:00Z'),
      category: 'EMERGENT' as PostCategory,
      seriesOrder: 9,
    },
    {
      slug: 'monitoring-telemetry',
      title: 'Monitoring & Telemetry for Production Agents',
      excerpt: 'Building observability into AI agent systems from day one.',
      content: '# Monitoring & Telemetry\n\nProduction agents need comprehensive observability...',
      status: 'SCHEDULED' as PostStatus,
      scheduledFor: new Date('2026-01-02T09:00:00Z'),
      category: 'EMERGENT' as PostCategory,
      seriesOrder: 10,
    },

    // Week 5 - Jan 5-9: 3 posts
    {
      slug: 'practitioner-pharma-insights',
      title: 'Practitioner Perspective: AI Agents in Pharma',
      excerpt: 'Lessons learned from deploying AI agents in pharmaceutical operations.',
      content: '# AI Agents in Pharma\n\nThe pharmaceutical industry has unique challenges...',
      status: 'SCHEDULED' as PostStatus,
      scheduledFor: new Date('2026-01-05T09:00:00Z'),
      category: 'PRACTITIONER' as PostCategory,
      seriesOrder: 11,
    },
    {
      slug: 'practitioner-supply-chain',
      title: 'Practitioner Perspective: Supply Chain Automation',
      excerpt: 'How AI agents are transforming supply chain operations.',
      content: '# Supply Chain Automation\n\nSupply chain operations benefit greatly from AI agents...',
      status: 'SCHEDULED' as PostStatus,
      scheduledFor: new Date('2026-01-07T09:00:00Z'),
      category: 'PRACTITIONER' as PostCategory,
      seriesOrder: 12,
    },
    {
      slug: 'emergent-reasoning-patterns',
      title: 'Emergent Reasoning Patterns in Large Language Models',
      excerpt: 'Unexpected reasoning capabilities that emerge from scale.',
      content: '# Emergent Reasoning Patterns\n\nAs LLMs scale, new reasoning abilities emerge...',
      status: 'SCHEDULED' as PostStatus,
      scheduledFor: new Date('2026-01-09T09:00:00Z'),
      category: 'EMERGENT' as PostCategory,
      seriesOrder: 13,
    },

    // Week 6 - Jan 12-16: 2 posts
    {
      slug: 'practitioner-customer-service',
      title: 'Practitioner Perspective: Customer Service Agents',
      excerpt: 'Building effective customer service AI agents.',
      content: '# Customer Service Agents\n\nCustomer service is a natural fit for AI agents...',
      status: 'SCHEDULED' as PostStatus,
      scheduledFor: new Date('2026-01-12T09:00:00Z'),
      category: 'PRACTITIONER' as PostCategory,
      seriesOrder: 14,
    },
    {
      slug: 'practitioner-code-assistants',
      title: 'Practitioner Perspective: Code Assistant Agents',
      excerpt: 'The evolution of AI-powered code assistants.',
      content: '# Code Assistant Agents\n\nCode assistants are among the most successful AI agent applications...',
      status: 'SCHEDULED' as PostStatus,
      scheduledFor: new Date('2026-01-16T09:00:00Z'),
      category: 'PRACTITIONER' as PostCategory,
      seriesOrder: 15,
    },

    // Week 7 - Jan 19-23: 3 posts
    {
      slug: 'prototype-rag-agent',
      title: 'Prototype Learning: Building a RAG-Powered Agent',
      excerpt: 'Lessons from building a retrieval-augmented agent.',
      content: '# RAG-Powered Agent Prototype\n\nBuilding a RAG agent taught us valuable lessons...',
      status: 'SCHEDULED' as PostStatus,
      scheduledFor: new Date('2026-01-19T09:00:00Z'),
      category: 'PROTOTYPE' as PostCategory,
      seriesOrder: 16,
    },
    {
      slug: 'prototype-multi-agent',
      title: 'Prototype Learning: Multi-Agent Orchestration',
      excerpt: 'Coordinating multiple specialized agents.',
      content: '# Multi-Agent Orchestration\n\nCoordinating multiple agents requires careful design...',
      status: 'SCHEDULED' as PostStatus,
      scheduledFor: new Date('2026-01-21T09:00:00Z'),
      category: 'PROTOTYPE' as PostCategory,
      seriesOrder: 17,
    },
    {
      slug: 'emergent-tool-use',
      title: 'Emergent Tool Use: How Agents Learn to Use Tools',
      excerpt: 'The surprising ways agents learn to leverage external tools.',
      content: '# Emergent Tool Use\n\nAgents often discover novel ways to use tools...',
      status: 'SCHEDULED' as PostStatus,
      scheduledFor: new Date('2026-01-23T09:00:00Z'),
      category: 'EMERGENT' as PostCategory,
      seriesOrder: 18,
    },

    // Week 8 - Jan 26-30: 2 posts
    {
      slug: 'prototype-voice-agent',
      title: 'Prototype Learning: Voice-Enabled Agents',
      excerpt: 'Challenges and solutions for voice-first AI agents.',
      content: '# Voice-Enabled Agents\n\nVoice interfaces add new dimensions to agent design...',
      status: 'SCHEDULED' as PostStatus,
      scheduledFor: new Date('2026-01-26T09:00:00Z'),
      category: 'PROTOTYPE' as PostCategory,
      seriesOrder: 19,
    },
    {
      slug: 'practitioner-data-analysis',
      title: 'Practitioner Perspective: Data Analysis Agents',
      excerpt: 'How AI agents are changing data analysis workflows.',
      content: '# Data Analysis Agents\n\nData analysis agents can automate complex workflows...',
      status: 'SCHEDULED' as PostStatus,
      scheduledFor: new Date('2026-01-30T09:00:00Z'),
      category: 'PRACTITIONER' as PostCategory,
      seriesOrder: 20,
    },

    // Week 9 - Feb 2-6: 3 posts
    {
      slug: 'conference-neurips-insights',
      title: 'Conference Insights: NeurIPS 2024 Agent Research',
      excerpt: 'Key takeaways from NeurIPS on AI agent research.',
      content: '# NeurIPS 2024 Insights\n\nThe latest research from NeurIPS on AI agents...',
      status: 'SCHEDULED' as PostStatus,
      scheduledFor: new Date('2026-02-02T09:00:00Z'),
      category: 'CONFERENCE' as PostCategory,
      seriesOrder: 21,
    },
    {
      slug: 'conference-icml-trends',
      title: 'Conference Insights: ICML Agent Architecture Trends',
      excerpt: 'Emerging architecture patterns from ICML.',
      content: '# ICML Agent Trends\n\nICML showcased new agent architecture approaches...',
      status: 'SCHEDULED' as PostStatus,
      scheduledFor: new Date('2026-02-04T09:00:00Z'),
      category: 'CONFERENCE' as PostCategory,
      seriesOrder: 22,
    },
    {
      slug: 'conference-stanford-ai',
      title: 'Conference Insights: Stanford AI Conference Highlights',
      excerpt: 'Notable presentations from the Stanford AI Conference.',
      content: '# Stanford AI Conference\n\nStanford\'s AI conference highlighted key developments...',
      status: 'SCHEDULED' as PostStatus,
      scheduledFor: new Date('2026-02-06T09:00:00Z'),
      category: 'CONFERENCE' as PostCategory,
      seriesOrder: 23,
    },

    // Week 10 - Feb 9-13: 2 posts
    {
      slug: 'methodology-eight-pillars',
      title: 'Methodology: The Eight Pillars Framework',
      excerpt: 'A comprehensive framework for building production AI agents.',
      content: '# The Eight Pillars Framework\n\nOur research led to an eight-pillar framework...',
      status: 'SCHEDULED' as PostStatus,
      scheduledFor: new Date('2026-02-09T09:00:00Z'),
      category: 'METHODOLOGY' as PostCategory,
      seriesOrder: 24,
    },
    {
      slug: 'series-conclusion',
      title: 'Series Conclusion: The Future of AI Agents',
      excerpt: 'Looking ahead at what the future holds for AI agents.',
      content: '# The Future of AI Agents\n\nAs we conclude this series, we look to the future...',
      status: 'SCHEDULED' as PostStatus,
      scheduledFor: new Date('2026-02-13T09:00:00Z'),
      category: 'THEME' as PostCategory,
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

  // Create LinkedIn posts for each blog post
  console.log('Creating LinkedIn posts...')

  interface LinkedInPostData {
    postSlug: string
    content: string
    hashtags: string[]
  }

  const linkedInPosts: LinkedInPostData[] = [
    {
      postSlug: 'what-is-needed-to-unlock-ai-agents',
      content: `Excited to share our new research from Stanford GSB on AI Agents!

90% of AI pilots fail to reach production. But it's not because of the models - they contribute only 30-40% to success.

The real challenges? System integration, context management, and governance.

Read the full insights in our anchor post for this 25-part series.`,
      hashtags: ['AIAgents', 'Stanford', 'EnterpriseAI', 'Research', 'Innovation']
    },
    {
      postSlug: 'llm-cognitive-engine',
      content: `Most people think of LLMs as sophisticated text predictors. But they're so much more.

In this post, I explore how to leverage LLMs as true cognitive engines - reasoning systems that can plan, adapt, and solve complex problems.

Key insight: The prompting strategy matters more than model selection.`,
      hashtags: ['LLM', 'AIAgents', 'CognitiveComputing', 'MachineLearning', 'TechLeadership']
    },
    {
      postSlug: 'context-memory-foundations',
      content: `Why do AI agents forget important context mid-conversation?

Context management is the foundation of intelligent agents. Without it, even the best LLM becomes unreliable.

This post covers the 40% utilization rule and practical patterns for effective memory management.`,
      hashtags: ['AIAgents', 'ContextManagement', 'Memory', 'EnterpriseAI', 'TechStrategy']
    },
    {
      postSlug: 'system-integration-challenges',
      content: `92% of AI pilots cite system integration as their biggest blocker.

It's not glamorous, but integration is where enterprise AI succeeds or fails.

This post breaks down the common pitfalls and how to avoid them.`,
      hashtags: ['SystemIntegration', 'EnterpriseAI', 'AIAgents', 'DigitalTransformation', 'TechLeadership']
    },
    {
      postSlug: 'authentication-identity',
      content: `When AI agents act on your behalf, who are they?

Identity and authentication in agent systems is a critical but overlooked challenge.

This post explores the security implications and design patterns for agent identity.`,
      hashtags: ['Security', 'Authentication', 'AIAgents', 'Identity', 'EnterpriseAI']
    },
    {
      postSlug: 'trust-governance-guardrails',
      content: `How do you trust an AI agent with enterprise-critical tasks?

Trust isn't just about accuracy - it's about predictability, explainability, and control.

This post covers the governance frameworks that make enterprise AI deployment possible.`,
      hashtags: ['AIGovernance', 'Trust', 'Guardrails', 'EnterpriseAI', 'RiskManagement']
    },
    {
      postSlug: 'emergent-behaviors',
      content: `Something unexpected happens when agents collaborate.

Multi-agent systems exhibit emergent behaviors that no single agent could achieve alone.

This post explores the surprising capabilities that arise from agent cooperation.`,
      hashtags: ['MultiAgent', 'EmergentBehavior', 'AIAgents', 'Collaboration', 'Innovation']
    },
    {
      postSlug: 'cost-management-strategies',
      content: `AI agents can get expensive fast. One poorly designed loop and your API bill explodes.

But cost optimization doesn't mean compromising capability.

This post shares practical strategies for managing AI agent costs at scale.`,
      hashtags: ['CostOptimization', 'AIAgents', 'CloudCosts', 'EnterpriseAI', 'Efficiency']
    },
    {
      postSlug: 'agent-evaluations',
      content: `How do you know if your AI agent is actually working well?

Traditional metrics don't capture what matters for agents.

This post introduces frameworks for evaluating and benchmarking AI agent performance.`,
      hashtags: ['AIEvaluation', 'Benchmarking', 'AIAgents', 'Metrics', 'QualityAssurance']
    },
    {
      postSlug: 'monitoring-telemetry',
      content: `Production AI agents need observability from day one.

Without proper monitoring, you're flying blind when things go wrong.

This post covers the telemetry patterns that make production agents maintainable.`,
      hashtags: ['Observability', 'Monitoring', 'Telemetry', 'AIAgents', 'Production']
    },
    {
      postSlug: 'practitioner-pharma-insights',
      content: `AI agents in pharma face unique challenges: regulatory compliance, data sensitivity, validation requirements.

But the opportunities are immense.

This post shares lessons from deploying AI agents in pharmaceutical operations.`,
      hashtags: ['Pharma', 'LifeSciences', 'AIAgents', 'Regulatory', 'HealthTech']
    },
    {
      postSlug: 'practitioner-supply-chain',
      content: `Supply chain operations are a natural fit for AI agents.

Demand forecasting, inventory optimization, logistics coordination - agents excel at these.

This post explores how AI agents are transforming supply chain management.`,
      hashtags: ['SupplyChain', 'Logistics', 'AIAgents', 'Automation', 'Operations']
    },
    {
      postSlug: 'emergent-reasoning-patterns',
      content: `As LLMs scale, something fascinating happens: new reasoning abilities emerge.

These capabilities weren't explicitly trained - they appeared spontaneously.

This post explores the emergent reasoning patterns in large language models.`,
      hashtags: ['EmergentAbilities', 'Reasoning', 'LLM', 'AIResearch', 'ScaleMatters']
    },
    {
      postSlug: 'practitioner-customer-service',
      content: `Customer service is one of the most successful AI agent applications.

But building effective customer service agents requires more than just good prompts.

This post covers the design patterns that separate good from great.`,
      hashtags: ['CustomerService', 'AIAgents', 'CX', 'Automation', 'Support']
    },
    {
      postSlug: 'practitioner-code-assistants',
      content: `Code assistants are among the most successful AI agent applications.

From Copilot to Cursor, developers are embracing AI-powered coding.

This post examines the evolution and future of AI code assistants.`,
      hashtags: ['CodeAssistant', 'AIAgents', 'DeveloperTools', 'Copilot', 'Programming']
    },
    {
      postSlug: 'prototype-rag-agent',
      content: `Building a RAG-powered agent taught us valuable lessons.

Retrieval quality matters more than generation quality.

This post shares our prototype learnings from building a retrieval-augmented agent.`,
      hashtags: ['RAG', 'Retrieval', 'AIAgents', 'Prototype', 'VectorSearch']
    },
    {
      postSlug: 'prototype-multi-agent',
      content: `Coordinating multiple specialized agents is harder than it looks.

Communication protocols, task delegation, conflict resolution - it's complex.

This post shares lessons from building a multi-agent orchestration system.`,
      hashtags: ['MultiAgent', 'Orchestration', 'AIAgents', 'Coordination', 'Architecture']
    },
    {
      postSlug: 'emergent-tool-use',
      content: `Agents often discover novel ways to use tools we never anticipated.

This emergent tool use is both exciting and concerning.

This post explores how agents learn to leverage external tools creatively.`,
      hashtags: ['ToolUse', 'EmergentBehavior', 'AIAgents', 'FunctionCalling', 'Innovation']
    },
    {
      postSlug: 'prototype-voice-agent',
      content: `Voice interfaces add new dimensions to agent design.

Latency tolerance, interruption handling, emotional tone - voice is different.

This post shares challenges and solutions for voice-first AI agents.`,
      hashtags: ['VoiceAI', 'SpeechRecognition', 'AIAgents', 'Conversational', 'UX']
    },
    {
      postSlug: 'practitioner-data-analysis',
      content: `Data analysis agents can automate complex analytical workflows.

From SQL generation to insight synthesis, agents are changing how we work with data.

This post explores the evolution of AI-powered data analysis.`,
      hashtags: ['DataAnalysis', 'Analytics', 'AIAgents', 'BusinessIntelligence', 'Automation']
    },
    {
      postSlug: 'conference-neurips-insights',
      content: `NeurIPS 2024 had some fascinating research on AI agents.

New architectures, evaluation frameworks, and safety considerations.

This post summarizes the key takeaways relevant to practitioners.`,
      hashtags: ['NeurIPS', 'AIResearch', 'Conference', 'AIAgents', 'MachineLearning']
    },
    {
      postSlug: 'conference-icml-trends',
      content: `ICML showcased new agent architecture approaches worth watching.

From chain-of-thought improvements to tool learning advances.

This post covers the emerging architecture trends from ICML.`,
      hashtags: ['ICML', 'AIResearch', 'Architecture', 'AIAgents', 'DeepLearning']
    },
    {
      postSlug: 'conference-stanford-ai',
      content: `Stanford's AI Conference highlighted key developments in agent research.

Academic insights that will shape commercial applications.

This post summarizes the notable presentations and findings.`,
      hashtags: ['Stanford', 'AIResearch', 'Conference', 'AIAgents', 'Academia']
    },
    {
      postSlug: 'methodology-eight-pillars',
      content: `Introducing the Eight Pillars Framework for production AI agents.

A comprehensive methodology born from our research at Stanford GSB.

This post presents our framework for building enterprise-ready agents.`,
      hashtags: ['Framework', 'Methodology', 'AIAgents', 'EnterpriseAI', 'BestPractices']
    },
    {
      postSlug: 'series-conclusion',
      content: `As we conclude this 25-part series, we look to the future of AI agents.

The potential is immense, but so are the challenges.

Thank you for joining this journey. The future of AI agents is just beginning.`,
      hashtags: ['AIAgents', 'Future', 'Conclusion', 'Stanford', 'Research']
    }
  ]

  // Get all posts to link LinkedIn posts
  const allPosts = await prisma.post.findMany({
    where: {
      seriesId: aiAgentsSeries.id
    }
  })

  const postSlugToId = new Map(allPosts.map(p => [p.slug, p.id]))

  for (const linkedInData of linkedInPosts) {
    const postId = postSlugToId.get(linkedInData.postSlug)
    if (!postId) {
      console.log(`Warning: Could not find post with slug ${linkedInData.postSlug}`)
      continue
    }

    await prisma.linkedInPost.upsert({
      where: { postId },
      update: {
        content: linkedInData.content,
        hashtags: linkedInData.hashtags,
      },
      create: {
        postId,
        content: linkedInData.content,
        hashtags: linkedInData.hashtags,
        status: 'PENDING',
      },
    })
    console.log(`Created/Updated LinkedIn post for: ${linkedInData.postSlug}`)
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
