'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useSpring } from 'framer-motion'
import {
  Calendar,
  Clock,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Share2,
  Link2,
  User,
  Check
} from 'lucide-react'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { CommentsSection } from '@/components/blog/CommentsSection'

/**
 * Types for table of contents headings
 */
export interface TocHeading {
  id: string
  text: string
  level: 2 | 3
}

/**
 * API Post response interface
 */
interface ApiPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string
  featuredImage: string | null
  category: string | null
  author: string
  publishedAt: string | null
  readingTimeMinutes: number | null
  tags: Array<{
    tag: {
      slug: string
      name: string
    }
  }>
}

/**
 * Mock blog post content data
 * In production, this would come from the database/CMS
 */
export interface BlogPostContent {
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  category: string
  readingTime: number
  author: {
    name: string
    title: string
  }
  content: string
  headings: TocHeading[]
  featuredImage?: string
  featuredImageAlt?: string
  series?: {
    name: string
    current: number
    total: number
    prevSlug?: string
    nextSlug?: string
  }
}

/**
 * Mock blog posts with full content for demonstration
 */
export const mockBlogPostsContent: Record<string, BlogPostContent> = {
  'what-is-needed-to-unlock-ai-agents': {
    slug: 'what-is-needed-to-unlock-ai-agents',
    title: "What's Needed to Unlock the Full Potential of AI Agents?",
    excerpt: 'The anchor post for our AI Agents research series. Discover the Eight Pillars framework and why 90% of enterprise AI agent pilots fail to reach production.',
    publishedAt: '2024-12-08',
    category: 'Anchor',
    readingTime: 12,
    author: {
      name: 'Fernando Torres',
      title: 'MSx \'26, Stanford GSB',
    },
    featuredImage: '/images/blog/ai-agents-research-cover.png',
    featuredImageAlt: 'AI Agents Research: Eight Pillars Framework - Visualization showing interconnected pillars of enterprise AI agent success',
    series: {
      name: 'AI Agents Research',
      current: 1,
      total: 25,
      nextSlug: 'llm-cognitive-engine',
    },
    headings: [
      { id: 'introduction', text: 'Introduction', level: 2 },
      { id: 'the-90-failure-rate', text: 'The 90% Failure Rate', level: 2 },
      { id: 'understanding-the-gap', text: 'Understanding the Gap', level: 3 },
      { id: 'enterprise-challenges', text: 'Enterprise Challenges', level: 3 },
      { id: 'the-eight-pillars-framework', text: 'The Eight Pillars Framework', level: 2 },
      { id: 'pillar-1-llm-cognitive-engine', text: 'Pillar 1: LLM (Cognitive Engine)', level: 3 },
      { id: 'pillar-2-context-memory', text: 'Pillar 2: Context & Memory', level: 3 },
      { id: 'pillar-3-system-integration', text: 'Pillar 3: System Integration', level: 3 },
      { id: 'pillar-4-authentication', text: 'Pillar 4: Authentication & Identity', level: 3 },
      { id: 'pillar-5-trust-governance', text: 'Pillar 5: Trust, Governance & Guardrails', level: 3 },
      { id: 'pillar-6-cost-management', text: 'Pillar 6: Cost Management', level: 3 },
      { id: 'pillar-7-evaluations', text: 'Pillar 7: Agent Evaluations', level: 3 },
      { id: 'pillar-8-monitoring', text: 'Pillar 8: Monitoring & Telemetry', level: 3 },
      { id: 'key-statistics', text: 'Key Statistics', level: 2 },
      { id: 'the-30-40-model-contribution', text: 'The 30-40% Model Contribution', level: 3 },
      { id: 'the-92-system-integration-blocker', text: 'The 92% System Integration Blocker', level: 3 },
      { id: 'conclusion', text: 'Conclusion', level: 2 },
      { id: 'whats-next', text: "What's Next", level: 3 },
    ],
    content: `
      <h2 id="introduction">Introduction</h2>
      <p>The promise of AI agents has captivated the technology world. These autonomous systems, capable of reasoning, planning, and executing complex tasks, represent a fundamental shift in how we interact with artificial intelligence. Yet despite billions in investment and countless pilot projects, a sobering reality persists: <strong>90% of enterprise AI agent pilots fail to reach production</strong>.</p>

      <p>This research, conducted in collaboration with Stanford GSB, seeks to understand why this gap exists and what organizations can do to bridge it. Over the past year, we interviewed practitioners, analyzed failed deployments, and studied the handful of successful production systems to identify the patterns that separate success from failure.</p>

      <h2 id="the-90-failure-rate">The 90% Failure Rate</h2>
      <p>When we began this research, we expected to find that AI agent failures were primarily due to model limitations. What we discovered was far more nuanced and systemic.</p>

      <h3 id="understanding-the-gap">Understanding the Gap</h3>
      <p>The gap between demo and production is not primarily a model capability gap. Our research revealed that model capability accounts for only <strong>30-40% of agent success</strong>. The remaining 60-70% depends on factors that receive far less attention in the AI discourse: system integration, context management, governance, and operational infrastructure.</p>

      <h3 id="enterprise-challenges">Enterprise Challenges</h3>
      <p>Enterprise environments present unique challenges that academic benchmarks fail to capture. Real-world agents must navigate complex authentication systems, maintain context across days or weeks of operation, integrate with legacy systems that were never designed for AI interaction, and operate within strict governance and compliance frameworks.</p>

      <h2 id="the-eight-pillars-framework">The Eight Pillars Framework</h2>
      <p>Based on our research, we propose the Eight Pillars framework for understanding and addressing the requirements of production AI agents. Each pillar represents a critical capability area that must be addressed for successful deployment.</p>

      <h3 id="pillar-1-llm-cognitive-engine">Pillar 1: LLM (Cognitive Engine)</h3>
      <p>The large language model serves as the cognitive core of any agent system. However, model selection is about more than raw capability. Production systems must consider latency, cost, reliability, and the specific reasoning patterns required for their use case. The most capable model is not always the right choice.</p>

      <h3 id="pillar-2-context-memory">Pillar 2: Context & Memory Management</h3>
      <p>Production agents often run for extended periods, accumulating context that can overwhelm even the largest context windows. Effective memory management strategies are essential, including our <strong>40% context utilization rule</strong>: agents should never use more than 40% of their available context window to maintain reliable performance.</p>

      <h3 id="pillar-3-system-integration">Pillar 3: System Integration</h3>
      <p>This is where most agent pilots fail. <strong>92% of enterprises cite system integration as a primary blocker</strong> for AI agent deployment. Agents must interact with existing APIs, databases, file systems, and enterprise applications, often through adapters and middleware that add complexity and potential failure points.</p>

      <h3 id="pillar-4-authentication">Pillar 4: Authentication & Identity</h3>
      <p>Who is the agent? What permissions should it have? How do you audit its actions? These questions become critical in enterprise environments where agents act on behalf of users and need access to sensitive systems and data.</p>

      <h3 id="pillar-5-trust-governance">Pillar 5: Trust, Governance & Guardrails</h3>
      <p>Building trust in autonomous systems requires robust governance frameworks. This includes human-in-the-loop controls for high-stakes decisions, clear escalation paths, and guardrails that prevent agents from taking harmful or unintended actions.</p>

      <h3 id="pillar-6-cost-management">Pillar 6: Cost Management</h3>
      <p>AI agent operations can become expensive quickly. Token usage, API calls, and compute resources must be managed carefully. Successful deployments implement sophisticated cost tracking and optimization strategies from day one.</p>

      <h3 id="pillar-7-evaluations">Pillar 7: Agent Evaluations</h3>
      <p>How do you know if your agent is performing well? Traditional unit tests are insufficient for evaluating complex agent behaviors. New evaluation frameworks are needed that can assess reasoning quality, task completion rates, and edge case handling.</p>

      <h3 id="pillar-8-monitoring">Pillar 8: Monitoring & Telemetry</h3>
      <p>Production agents require comprehensive monitoring that goes beyond traditional application metrics. You need visibility into decision traces, context utilization, failure patterns, and emerging behaviors that may indicate drift or degradation.</p>

      <h2 id="key-statistics">Key Statistics</h2>
      <p>Our research surfaced several statistics that challenge conventional wisdom about AI agent deployment.</p>

      <h3 id="the-30-40-model-contribution">The 30-40% Model Contribution</h3>
      <p>When we analyzed successful deployments and compared them to failed pilots, we found that model capability improvements had diminishing returns after a threshold. The most common pattern was that pilots succeeded or failed based on infrastructure and integration factors, not model selection.</p>

      <h3 id="the-92-system-integration-blocker">The 92% System Integration Blocker</h3>
      <p>System integration emerged as the dominant challenge across our interviews. Organizations consistently underestimated the complexity of connecting agents to existing systems and the ongoing maintenance burden these integrations create.</p>

      <h2 id="conclusion">Conclusion</h2>
      <p>The path to production AI agents is not primarily about model capability. It is about building the infrastructure, governance, and operational practices that enable these systems to function reliably in complex enterprise environments.</p>

      <h3 id="whats-next">What's Next</h3>
      <p>In the following posts of this series, we will dive deep into each of the Eight Pillars, sharing practical guidance, case studies, and lessons learned from organizations that have successfully deployed AI agents at scale. Join us as we explore what it truly takes to unlock the full potential of AI agents.</p>
    `,
  },
  'llm-cognitive-engine': {
    slug: 'llm-cognitive-engine',
    title: 'The LLM as Cognitive Engine: Beyond Chat Completions',
    excerpt: 'Exploring how large language models serve as the reasoning core of AI agents, and why model capability alone accounts for only 30-40% of agent success.',
    publishedAt: '2024-12-10',
    category: 'Theme',
    readingTime: 8,
    author: {
      name: 'Fernando Torres',
      title: 'MSx \'26, Stanford GSB',
    },
    featuredImage: '/images/blog/coding-agent-exception-cover.png',
    featuredImageAlt: 'The LLM as Cognitive Engine - Neural network visualization showing language model architecture',
    series: {
      name: 'AI Agents Research',
      current: 2,
      total: 25,
      prevSlug: 'what-is-needed-to-unlock-ai-agents',
      nextSlug: 'context-memory-foundations',
    },
    headings: [
      { id: 'introduction', text: 'Introduction', level: 2 },
      { id: 'beyond-chat-completions', text: 'Beyond Chat Completions', level: 2 },
      { id: 'reasoning-capabilities', text: 'Reasoning Capabilities', level: 3 },
      { id: 'model-selection-criteria', text: 'Model Selection Criteria', level: 2 },
      { id: 'latency-vs-capability', text: 'Latency vs Capability', level: 3 },
      { id: 'cost-considerations', text: 'Cost Considerations', level: 3 },
      { id: 'practical-patterns', text: 'Practical Patterns', level: 2 },
      { id: 'conclusion', text: 'Conclusion', level: 2 },
    ],
    content: `
      <h2 id="introduction">Introduction</h2>
      <p>The large language model sits at the heart of every AI agent system. It provides the reasoning capability that enables agents to understand instructions, plan actions, and adapt to novel situations. Yet our research reveals that organizations often over-index on model capability while neglecting the infrastructure that enables models to function effectively.</p>

      <h2 id="beyond-chat-completions">Beyond Chat Completions</h2>
      <p>In the context of AI agents, LLMs serve a fundamentally different purpose than in conversational applications. Rather than generating human-like responses, agent LLMs must produce structured outputs that can be parsed and executed by downstream systems.</p>

      <h3 id="reasoning-capabilities">Reasoning Capabilities</h3>
      <p>Agent tasks require specific reasoning patterns: decomposing complex goals into subtasks, maintaining state across multiple interactions, and recovering from errors gracefully. Not all models excel at these patterns equally.</p>

      <h2 id="model-selection-criteria">Model Selection Criteria</h2>
      <p>Selecting the right model for an agent application involves balancing multiple factors beyond raw capability scores.</p>

      <h3 id="latency-vs-capability">Latency vs Capability</h3>
      <p>Interactive agent applications often require sub-second response times. The most capable models may be too slow for real-time use cases, necessitating trade-offs between capability and responsiveness.</p>

      <h3 id="cost-considerations">Cost Considerations</h3>
      <p>Agent operations can involve thousands of API calls per task. At scale, model costs become a significant operational concern that influences architecture decisions.</p>

      <h2 id="practical-patterns">Practical Patterns</h2>
      <p>Successful agent deployments often employ patterns that maximize model effectiveness while managing costs and latency. These include model cascading, where simpler models handle routine tasks and more capable models are reserved for complex reasoning.</p>

      <h2 id="conclusion">Conclusion</h2>
      <p>The LLM is necessary but not sufficient for agent success. Understanding how to select, configure, and operate models in production environments is a critical skill for agent developers.</p>
    `,
  },
  'context-memory-foundations': {
    slug: 'context-memory-foundations',
    title: "Context and Memory Management: The Agent's Working Memory",
    excerpt: 'How AI agents maintain context across long-running tasks and why the 40% context utilization rule is critical for production systems.',
    publishedAt: '2024-12-12',
    category: 'Theme',
    readingTime: 10,
    author: {
      name: 'Fernando Torres',
      title: 'MSx \'26, Stanford GSB',
    },
    featuredImage: '/images/blog/context-management-cover.png',
    featuredImageAlt: 'Context and Memory Management - Visualization of agent memory architecture',
    series: {
      name: 'AI Agents Research',
      current: 3,
      total: 25,
      prevSlug: 'llm-cognitive-engine',
      nextSlug: 'system-integration-challenges',
    },
    headings: [
      { id: 'introduction', text: 'Introduction', level: 2 },
      { id: 'working-memory-model', text: 'The Working Memory Model', level: 2 },
      { id: 'short-term-context', text: 'Short-Term Context', level: 3 },
      { id: 'long-term-memory', text: 'Long-Term Memory', level: 3 },
      { id: 'the-40-percent-rule', text: 'The 40% Context Utilization Rule', level: 2 },
      { id: 'why-40-percent', text: 'Why 40%?', level: 3 },
      { id: 'measuring-utilization', text: 'Measuring Utilization', level: 3 },
      { id: 'memory-strategies', text: 'Memory Management Strategies', level: 2 },
      { id: 'compression-techniques', text: 'Compression Techniques', level: 3 },
      { id: 'retrieval-augmented', text: 'Retrieval Augmented Generation', level: 3 },
      { id: 'conclusion', text: 'Conclusion', level: 2 },
    ],
    content: `
      <h2 id="introduction">Introduction</h2>
      <p>Production AI agents often run for extended periods, accumulating context that can overwhelm even the largest context windows. Understanding how to manage this working memory effectively is crucial for building reliable agent systems.</p>

      <h2 id="working-memory-model">The Working Memory Model</h2>
      <p>Just as humans have different types of memory, AI agents benefit from a structured approach to information storage and retrieval. Our research identifies two primary categories that production agents must manage.</p>

      <h3 id="short-term-context">Short-Term Context</h3>
      <p>Short-term context includes the immediate conversation history, current task state, and recent tool outputs. This information is typically kept within the model's context window and directly influences the next action.</p>

      <h3 id="long-term-memory">Long-Term Memory</h3>
      <p>Long-term memory encompasses learned patterns, user preferences, and historical interactions that persist across sessions. This requires external storage systems and retrieval mechanisms.</p>

      <h2 id="the-40-percent-rule">The 40% Context Utilization Rule</h2>
      <p>Our research revealed a critical pattern: agents should never use more than 40% of their available context window to maintain reliable performance.</p>

      <h3 id="why-40-percent">Why 40%?</h3>
      <p>Beyond 40% utilization, we observed increased error rates, degraded reasoning quality, and more frequent context confusion. The remaining 60% provides buffer for unexpected inputs, detailed reasoning, and error recovery.</p>

      <h3 id="measuring-utilization">Measuring Utilization</h3>
      <p>Effective context management requires continuous monitoring. Track token usage, set alerts for high utilization, and implement automatic summarization before reaching limits.</p>

      <h2 id="memory-strategies">Memory Management Strategies</h2>
      <p>Several proven strategies help agents operate within healthy context limits while maintaining coherent operation.</p>

      <h3 id="compression-techniques">Compression Techniques</h3>
      <p>Summarization, selective retention, and hierarchical context organization can significantly reduce token usage without losing critical information.</p>

      <h3 id="retrieval-augmented">Retrieval Augmented Generation</h3>
      <p>Moving historical context to external vector stores and retrieving only relevant information on demand enables agents to access vast amounts of information without overwhelming the context window.</p>

      <h2 id="conclusion">Conclusion</h2>
      <p>Context and memory management is often the difference between a demo that works and a production system that operates reliably over extended periods. Implementing the 40% rule and appropriate memory strategies is essential for enterprise deployments.</p>
    `,
  },
  'system-integration-challenges': {
    slug: 'system-integration-challenges',
    title: 'System Integration: The 92% Blocker',
    excerpt: 'Deep dive into why system integration is the primary reason enterprise AI agent pilots fail, and practical strategies to overcome these challenges.',
    publishedAt: '2024-12-15',
    category: 'Theme',
    readingTime: 9,
    author: {
      name: 'Fernando Torres',
      title: 'MSx \'26, Stanford GSB',
    },
    featuredImage: '/images/blog/system-integration-92-percent.png',
    featuredImageAlt: 'System Integration Challenges - Enterprise integration architecture diagram',
    series: {
      name: 'AI Agents Research',
      current: 4,
      total: 25,
      prevSlug: 'context-memory-foundations',
      nextSlug: 'authentication-identity',
    },
    headings: [
      { id: 'introduction', text: 'Introduction', level: 2 },
      { id: 'the-92-percent-statistic', text: 'The 92% Statistic', level: 2 },
      { id: 'common-integration-challenges', text: 'Common Integration Challenges', level: 2 },
      { id: 'legacy-systems', text: 'Legacy Systems', level: 3 },
      { id: 'api-inconsistencies', text: 'API Inconsistencies', level: 3 },
      { id: 'solutions-and-patterns', text: 'Solutions and Patterns', level: 2 },
      { id: 'conclusion', text: 'Conclusion', level: 2 },
    ],
    content: `
      <h2 id="introduction">Introduction</h2>
      <p>System integration consistently emerges as the dominant challenge in AI agent deployments. Our research found that 92% of enterprises cite integration issues as a primary blocker for moving from pilot to production.</p>

      <h2 id="the-92-percent-statistic">The 92% Statistic</h2>
      <p>This statistic reflects a fundamental truth about enterprise AI: agents do not operate in isolation. They must connect with existing systems, databases, APIs, and workflows that were never designed with AI integration in mind.</p>

      <h2 id="common-integration-challenges">Common Integration Challenges</h2>
      <p>Understanding the specific integration challenges helps organizations plan more effectively.</p>

      <h3 id="legacy-systems">Legacy Systems</h3>
      <p>Many critical enterprise systems lack modern APIs. Agents must often work through screen scraping, file-based integrations, or custom adapters that introduce complexity and fragility.</p>

      <h3 id="api-inconsistencies">API Inconsistencies</h3>
      <p>Even modern systems present challenges through inconsistent API designs, rate limits, authentication schemes, and data formats that agents must navigate reliably.</p>

      <h2 id="solutions-and-patterns">Solutions and Patterns</h2>
      <p>Successful organizations address integration challenges through standardized abstraction layers, robust error handling, and gradual expansion of integration scope.</p>

      <h2 id="conclusion">Conclusion</h2>
      <p>System integration is not a technical afterthought but a core competency that determines agent success. Organizations should invest heavily in integration infrastructure from the beginning of their agent journey.</p>
    `,
  },
  'authentication-identity': {
    slug: 'authentication-identity',
    title: 'Authentication and Identity for AI Agents',
    excerpt: 'Exploring the unique challenges of managing credentials, permissions, and identity when AI agents act on behalf of users and systems.',
    publishedAt: '2024-12-17',
    category: 'Theme',
    readingTime: 7,
    author: {
      name: 'Fernando Torres',
      title: 'MSx \'26, Stanford GSB',
    },
    featuredImage: '/images/blog/framework-abandonment-cover.png',
    featuredImageAlt: 'Authentication and Identity for AI Agents - Security and identity management visualization',
    series: {
      name: 'AI Agents Research',
      current: 5,
      total: 25,
      prevSlug: 'system-integration-challenges',
      nextSlug: 'trust-governance-guardrails',
    },
    headings: [
      { id: 'introduction', text: 'Introduction', level: 2 },
      { id: 'identity-questions', text: 'The Identity Question', level: 2 },
      { id: 'credential-management', text: 'Credential Management', level: 2 },
      { id: 'permission-models', text: 'Permission Models', level: 2 },
      { id: 'audit-trails', text: 'Audit Trails', level: 2 },
      { id: 'conclusion', text: 'Conclusion', level: 2 },
    ],
    content: `
      <h2 id="introduction">Introduction</h2>
      <p>Who is the agent? What permissions should it have? How do you audit its actions? These questions become critical in enterprise environments where agents act on behalf of users and need access to sensitive systems and data.</p>

      <h2 id="identity-questions">The Identity Question</h2>
      <p>AI agents blur traditional identity boundaries. They may act as themselves, on behalf of a user, or as a system service. Each scenario has different implications for access control and accountability.</p>

      <h2 id="credential-management">Credential Management</h2>
      <p>Agents often need access to multiple systems with different authentication mechanisms. Secure credential storage, rotation, and scope limitation are essential practices.</p>

      <h2 id="permission-models">Permission Models</h2>
      <p>The principle of least privilege is even more important for agents than humans. Agents should have only the minimum permissions necessary for their defined tasks, with clear boundaries on what actions they can take.</p>

      <h2 id="audit-trails">Audit Trails</h2>
      <p>Comprehensive logging of agent actions enables accountability, debugging, and compliance. Every action an agent takes should be traceable to a specific request, user context, and decision rationale.</p>

      <h2 id="conclusion">Conclusion</h2>
      <p>Authentication and identity management for AI agents requires new approaches that extend traditional IAM practices to accommodate autonomous, API-driven actors.</p>
    `,
  },
}

/**
 * Default post content for any slug not in our mock data
 */
export const defaultPostContent: BlogPostContent = {
  slug: 'default',
  title: 'Blog Post',
  excerpt: 'This is a blog post in the AI Agents research series.',
  publishedAt: '2024-12-01',
  category: 'Theme',
  readingTime: 8,
  author: {
    name: 'Fernando Torres',
    title: 'MSx \'26, Stanford GSB',
  },
  featuredImage: '/images/blog/ai-agents-research-cover.png',
  featuredImageAlt: 'AI Agents Research Series - Featured blog post illustration',
  headings: [
    { id: 'introduction', text: 'Introduction', level: 2 },
    { id: 'key-concepts', text: 'Key Concepts', level: 2 },
    { id: 'first-concept', text: 'First Concept', level: 3 },
    { id: 'second-concept', text: 'Second Concept', level: 3 },
    { id: 'implementation', text: 'Implementation', level: 2 },
    { id: 'best-practices', text: 'Best Practices', level: 3 },
    { id: 'common-pitfalls', text: 'Common Pitfalls', level: 3 },
    { id: 'case-studies', text: 'Case Studies', level: 2 },
    { id: 'conclusion', text: 'Conclusion', level: 2 },
  ],
  content: `
    <h2 id="introduction">Introduction</h2>
    <p>This blog post explores key concepts in the AI Agents research series. Understanding these fundamentals is essential for building production-ready agent systems that can operate reliably in enterprise environments.</p>

    <h2 id="key-concepts">Key Concepts</h2>
    <p>Before diving into implementation details, let's establish the foundational concepts that inform our approach.</p>

    <h3 id="first-concept">First Concept</h3>
    <p>The first key concept relates to how agents process and respond to information. This involves understanding the interaction between the cognitive engine (LLM) and the broader system infrastructure.</p>

    <h3 id="second-concept">Second Concept</h3>
    <p>The second concept addresses the challenges of maintaining coherent behavior across long-running agent operations. This is particularly critical in enterprise settings where tasks may span days or weeks.</p>

    <h2 id="implementation">Implementation</h2>
    <p>Moving from theory to practice requires careful attention to both technical and organizational factors.</p>

    <h3 id="best-practices">Best Practices</h3>
    <p>Based on our research, we recommend starting with small, well-defined tasks and gradually expanding scope as you build confidence in your agent infrastructure. This incremental approach reduces risk and allows for iterative learning.</p>

    <h3 id="common-pitfalls">Common Pitfalls</h3>
    <p>Common pitfalls include underestimating integration complexity, neglecting error handling, and failing to implement proper monitoring from the start. Addressing these proactively can save significant time and resources.</p>

    <h2 id="case-studies">Case Studies</h2>
    <p>Throughout our research, we encountered numerous examples of both successful and failed agent deployments. The patterns that emerged inform our recommendations and the Eight Pillars framework.</p>

    <h2 id="conclusion">Conclusion</h2>
    <p>Building production AI agents requires a holistic approach that goes beyond model capability. By understanding and addressing the full spectrum of requirements, organizations can significantly improve their chances of success.</p>
  `,
}

/**
 * Category badge color mapping
 */
const categoryStyles: Record<string, string> = {
  Anchor: 'bg-accent-primary/10 text-accent-primary',
  Theme: 'bg-category-research/10 text-category-research',
  Emergent: 'bg-category-pharma/10 text-category-pharma',
  Practitioner: 'bg-accent-secondary/10 text-accent-secondary dark:text-accent-secondary-dark',
  Prototype: 'bg-accent-success/10 text-accent-success dark:text-accent-success-dark',
  Conference: 'bg-accent-warning/10 text-accent-warning dark:text-accent-warning-dark',
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Reading progress indicator component
 */
function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-accent-primary origin-left z-50"
      style={{ scaleX }}
      aria-hidden="true"
    />
  )
}

/**
 * Twitter/X icon component
 */
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

/**
 * LinkedIn icon component
 */
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

/**
 * Social sharing buttons component
 */
function SocialShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error('Failed to copy to clipboard')
    }
  }, [url])

  const shareOnTwitter = useCallback(() => {
    const tweetText = encodeURIComponent(title)
    const tweetUrl = encodeURIComponent(url)
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`
    window.open(
      twitterShareUrl,
      'twitter-share-dialog',
      'width=626,height=436,left=100,top=100'
    )
  }, [title, url])

  const shareOnLinkedIn = useCallback(() => {
    const linkedInUrl = encodeURIComponent(url)
    const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${linkedInUrl}`
    window.open(
      linkedInShareUrl,
      'linkedin-share-dialog',
      'width=626,height=436,left=100,top=100'
    )
  }, [url])

  const buttonBaseStyles = `
    inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg
    text-sm font-medium
    border transition-all duration-200
    focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-accent-primary focus-visible:ring-offset-2
  `

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Share this article">
      <button
        onClick={shareOnTwitter}
        className={`
          ${buttonBaseStyles}
          text-text-secondary dark:text-text-dark-secondary
          bg-light-neutral-grey dark:bg-dark-panel
          border-border-light dark:border-border-dark
          hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30
          dark:hover:bg-[#1DA1F2]/10 dark:hover:text-[#1DA1F2] dark:hover:border-[#1DA1F2]/30
        `}
        aria-label="Share on Twitter/X"
        title="Share on Twitter/X"
      >
        <TwitterIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Twitter</span>
      </button>

      <button
        onClick={shareOnLinkedIn}
        className={`
          ${buttonBaseStyles}
          text-text-secondary dark:text-text-dark-secondary
          bg-light-neutral-grey dark:bg-dark-panel
          border-border-light dark:border-border-dark
          hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/30
          dark:hover:bg-[#0A66C2]/10 dark:hover:text-[#0A66C2] dark:hover:border-[#0A66C2]/30
        `}
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <LinkedInIcon className="h-4 w-4" />
        <span className="hidden sm:inline">LinkedIn</span>
      </button>

      <button
        onClick={copyToClipboard}
        className={`
          ${buttonBaseStyles}
          ${copied
            ? 'text-accent-success dark:text-accent-success-dark bg-accent-success/10 border-accent-success/30'
            : 'text-text-secondary dark:text-text-dark-secondary bg-light-neutral-grey dark:bg-dark-panel border-border-light dark:border-border-dark hover:bg-light-icy-blue dark:hover:bg-dark-deep-blue hover:text-accent-primary hover:border-accent-primary/30'
          }
        `}
        aria-label={copied ? 'Link copied to clipboard' : 'Copy link to clipboard'}
        title={copied ? 'Copied!' : 'Copy link'}
      >
        {copied ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Link2 className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy link'}</span>
      </button>

      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          onClick={async () => {
            try {
              await navigator.share({ title, url })
            } catch {
              // User cancelled or share failed
            }
          }}
          className={`
            ${buttonBaseStyles}
            sm:hidden
            text-text-secondary dark:text-text-dark-secondary
            bg-light-neutral-grey dark:bg-dark-panel
            border-border-light dark:border-border-dark
            hover:bg-light-icy-blue dark:hover:bg-dark-deep-blue
            hover:text-accent-primary
          `}
          aria-label="Share via system share dialog"
          title="More sharing options"
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

/**
 * Extended series info including post titles for navigation cards
 */
interface ExtendedSeries extends NonNullable<BlogPostContent['series']> {
  prevTitle?: string
  nextTitle?: string
  prevCategory?: string
  nextCategory?: string
}

/**
 * Get extended series info with titles for navigation
 */
function getExtendedSeriesInfo(slug: string): ExtendedSeries | null {
  const post = mockBlogPostsContent[slug]
  if (!post?.series) return null

  const series = post.series
  const prevPost = series.prevSlug ? mockBlogPostsContent[series.prevSlug] : null
  const nextPost = series.nextSlug ? mockBlogPostsContent[series.nextSlug] : null

  return {
    ...series,
    prevTitle: prevPost?.title || (series.prevSlug ? 'Previous Post' : undefined),
    nextTitle: nextPost?.title || (series.nextSlug ? 'Next Post' : undefined),
    prevCategory: prevPost?.category,
    nextCategory: nextPost?.category,
  }
}

/**
 * Series navigation component
 */
function SeriesNavigation({
  series,
  slug,
}: {
  series: NonNullable<BlogPostContent['series']>
  slug: string
}) {
  const extendedSeries = getExtendedSeriesInfo(slug)
  const progressPercent = Math.round((series.current / series.total) * 100)

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-16 pt-12 border-t border-border-light dark:border-border-dark"
      aria-label="Series navigation"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-light-panel dark:bg-dark-panel border border-border-light dark:border-border-dark mb-4">
          <svg
            className="w-4 h-4 text-accent-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary">
            {series.name}
          </span>
        </div>

        <p
          className="text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-2"
          aria-live="polite"
        >
          Post {series.current} of {series.total}
        </p>

        <div className="w-full max-w-md">
          <div
            className="h-2 bg-light-neutral-grey dark:bg-dark-deep-blue rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Series progress: ${progressPercent}% complete`}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full"
            />
          </div>
          <p className="text-xs text-text-muted dark:text-text-dark-muted text-center mt-2">
            {progressPercent}% complete
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {series.prevSlug ? (
          <Link
            href={`/blog/${series.prevSlug}`}
            className="
              group flex flex-col h-full p-5 rounded-lg
              bg-light-panel dark:bg-dark-panel
              border border-border-light dark:border-border-dark
              hover:border-accent-primary/50 dark:hover:border-accent-primary/50
              hover:shadow-md dark:hover:shadow-glow
              transition-all duration-300
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-accent-primary focus-visible:ring-offset-2
            "
            aria-label={`Previous in series: ${extendedSeries?.prevTitle || 'Previous post'}`}
          >
            <div className="flex items-center gap-2 text-sm text-text-muted dark:text-text-dark-muted mb-2">
              <ChevronLeft
                className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200"
                aria-hidden="true"
              />
              <span>Previous in Series</span>
            </div>
            <h4 className="font-heading font-semibold text-text-primary dark:text-text-dark-primary group-hover:text-accent-primary transition-colors duration-200 line-clamp-2 flex-1">
              {extendedSeries?.prevTitle || 'Previous Post'}
            </h4>
            {extendedSeries?.prevCategory && (
              <span
                className={`
                  mt-3 inline-flex self-start items-center rounded-full
                  px-2 py-0.5 text-xs font-medium
                  ${categoryStyles[extendedSeries.prevCategory] || categoryStyles.Theme}
                `}
              >
                {extendedSeries.prevCategory}
              </span>
            )}
          </Link>
        ) : (
          <div className="hidden md:flex items-center justify-center p-5 rounded-lg border border-dashed border-border-light dark:border-border-dark">
            <p className="text-sm text-text-muted dark:text-text-dark-muted">
              This is the first post in the series
            </p>
          </div>
        )}

        {series.nextSlug ? (
          <Link
            href={`/blog/${series.nextSlug}`}
            className="
              group flex flex-col h-full p-5 rounded-lg text-right
              bg-light-panel dark:bg-dark-panel
              border border-border-light dark:border-border-dark
              hover:border-accent-primary/50 dark:hover:border-accent-primary/50
              hover:shadow-md dark:hover:shadow-glow
              transition-all duration-300
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-accent-primary focus-visible:ring-offset-2
            "
            aria-label={`Next in series: ${extendedSeries?.nextTitle || 'Next post'}`}
          >
            <div className="flex items-center justify-end gap-2 text-sm text-text-muted dark:text-text-dark-muted mb-2">
              <span>Next in Series</span>
              <ChevronRight
                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                aria-hidden="true"
              />
            </div>
            <h4 className="font-heading font-semibold text-text-primary dark:text-text-dark-primary group-hover:text-accent-primary transition-colors duration-200 line-clamp-2 flex-1">
              {extendedSeries?.nextTitle || 'Next Post'}
            </h4>
            {extendedSeries?.nextCategory && (
              <span
                className={`
                  mt-3 inline-flex self-end items-center rounded-full
                  px-2 py-0.5 text-xs font-medium
                  ${categoryStyles[extendedSeries.nextCategory] || categoryStyles.Theme}
                `}
              >
                {extendedSeries.nextCategory}
              </span>
            )}
          </Link>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-5 rounded-lg text-center bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5 border border-accent-primary/20 dark:border-accent-primary/30">
            <span className="text-2xl mb-2" role="img" aria-hidden="true">
              &#x1F389;
            </span>
            <p className="font-heading font-semibold text-text-primary dark:text-text-dark-primary">
              Series Complete!
            </p>
            <p className="text-sm text-text-secondary dark:text-text-dark-secondary mt-1">
              You have finished the {series.name}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-8">
        <Link
          href="/blog"
          className="
            inline-flex items-center gap-2 px-4 py-2
            text-sm font-medium text-text-secondary dark:text-text-dark-secondary
            hover:text-accent-primary transition-colors duration-200
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-accent-primary focus-visible:ring-offset-2 rounded-lg
          "
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          View all posts in series
        </Link>
      </div>
    </motion.nav>
  )
}

/**
 * Convert API post to BlogPostContent format
 */
function apiPostToContent(apiPost: ApiPost): BlogPostContent {
  const headings: TocHeading[] = []
  const h2Regex = /<h2[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h2>/gi
  const h3Regex = /<h3[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h3>/gi

  let match
  const contentStr = apiPost.content || ''

  while ((match = h2Regex.exec(contentStr)) !== null) {
    headings.push({ id: match[1], text: match[2], level: 2 })
  }
  while ((match = h3Regex.exec(contentStr)) !== null) {
    headings.push({ id: match[1], text: match[2], level: 3 })
  }

  return {
    slug: apiPost.slug,
    title: apiPost.title,
    excerpt: apiPost.excerpt || '',
    publishedAt: apiPost.publishedAt || new Date().toISOString(),
    category: apiPost.category || 'Theme',
    readingTime: apiPost.readingTimeMinutes || 5,
    author: {
      name: apiPost.author || 'Fernando Torres',
      title: "MSx '26, Stanford GSB",
    },
    featuredImage: apiPost.featuredImage || undefined,
    featuredImageAlt: `${apiPost.title} featured image`,
    headings,
    content: apiPost.content,
  }
}

interface BlogPostClientProps {
  slug: string
}

/**
 * Blog post detail page - Client component
 */
export default function BlogPostClient({ slug }: BlogPostClientProps) {
  // State for API-fetched post
  const [apiPost, setApiPost] = useState<BlogPostContent | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if we have mock content for this slug
  const hasMockContent = slug in mockBlogPostsContent

  // Fetch from API if not in mock data
  useEffect(() => {
    if (!hasMockContent && !apiPost && !isLoading) {
      setIsLoading(true)
      fetch(`/api/posts/${encodeURIComponent(slug)}`)
        .then(async (res) => {
          if (!res.ok) {
            throw new Error('Post not found')
          }
          const data = await res.json()
          if (data.success && data.post) {
            setApiPost(apiPostToContent(data.post))
          } else {
            throw new Error('Post not found')
          }
        })
        .catch((err) => {
          setError(err.message)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [slug, hasMockContent, apiPost, isLoading])

  // Get post content, fallback to default if not found
  const post = useMemo(() => {
    if (hasMockContent) {
      return mockBlogPostsContent[slug]
    }
    if (apiPost) {
      return apiPost
    }
    return { ...defaultPostContent, slug, title: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }
  }, [slug, hasMockContent, apiPost])

  // Current URL for sharing
  const [currentUrl, setCurrentUrl] = useState('')
  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  // Loading state for API posts
  if (!hasMockContent && isLoading) {
    return (
      <main className="min-h-screen bg-light-base dark:bg-dark-base flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary" />
      </main>
    )
  }

  // Error state for API posts
  if (!hasMockContent && error) {
    return (
      <main className="min-h-screen bg-light-base dark:bg-dark-base flex flex-col items-center justify-center gap-4">
        <p className="text-text-secondary dark:text-text-dark-secondary">Post not found</p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-accent-primary text-white hover:bg-accent-primary/90 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
      </main>
    )
  }

  return (
    <>
      {/* Reading progress bar */}
      <ReadingProgress />

      <main className="min-h-screen bg-light-base dark:bg-dark-base">
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 lg:py-20 bg-gradient-to-b from-light-icy-blue to-light-base dark:from-dark-deep-blue dark:to-dark-base">
          <div className="container-narrow">
            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link
                href="/blog"
                className="
                  inline-flex items-center gap-2 mb-6
                  text-sm font-medium
                  text-text-secondary dark:text-text-dark-secondary
                  hover:text-accent-primary
                  transition-colors duration-200
                "
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to Blog
              </Link>
            </motion.div>

            {/* Category & Reading time */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-wrap items-center gap-3 mb-4"
            >
              <span
                className={`
                  inline-flex items-center rounded-full
                  px-3 py-1 text-sm font-medium
                  ${categoryStyles[post.category] || categoryStyles.Theme}
                `}
              >
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-sm text-text-muted dark:text-text-dark-muted">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {post.readingTime} min read
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary dark:text-text-dark-primary mb-4"
            >
              {post.title}
            </motion.h1>

            {/* Excerpt */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-text-secondary dark:text-text-dark-secondary mb-6"
            >
              {post.excerpt}
            </motion.p>

            {/* Author & Date */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-text-muted dark:text-text-dark-muted"
            >
              {/* Author */}
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" aria-hidden="true" />
                <span className="font-medium text-text-primary dark:text-text-dark-primary">
                  {post.author.name}
                </span>
                <span className="hidden sm:inline">-</span>
                <span className="hidden sm:inline">{post.author.title}</span>
              </div>
              {/* Date */}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              </span>
            </motion.div>

            {/* Share buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-6"
            >
              <SocialShareButtons title={post.title} url={currentUrl} />
            </motion.div>
          </div>
        </section>

        {/* Featured Image */}
        {post.featuredImage && (
          <section className="pb-8 md:pb-12">
            <motion.div
              className="container-wide"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <div
                className="
                  relative max-w-4xl mx-auto
                  rounded-xl md:rounded-2xl overflow-hidden
                  bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950
                  dark:from-slate-900 dark:via-slate-950 dark:to-black
                  border border-white/10 dark:border-white/5
                  shadow-2xl
                  p-2 md:p-3
                "
              >
                <div className="relative w-full rounded-lg overflow-hidden bg-slate-950/50">
                  <Image
                    src={post.featuredImage}
                    alt={post.featuredImageAlt || `${post.title} featured image`}
                    width={1200}
                    height={800}
                    sizes="(max-width: 1280px) 100vw, 1024px"
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* Content Section with TOC */}
        <section className="py-12 md:py-16">
          <div className="container-wide">
            <div className="flex gap-8 lg:gap-12">
              {/* Table of Contents - Sticky Sidebar (Desktop only) */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <TableOfContents headings={post.headings} />
              </aside>

              {/* Main Content */}
              <article className="flex-1 min-w-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="prose-custom"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Series Navigation */}
                {post.series && <SeriesNavigation series={post.series} slug={slug} />}

                {/* Comments Section */}
                <CommentsSection postSlug={slug} postTitle={post.title} />
              </article>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
