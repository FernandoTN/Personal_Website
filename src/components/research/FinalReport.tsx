'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, List, X } from 'lucide-react'

/**
 * Table of contents heading interface
 */
export interface ReportHeading {
  id: string
  text: string
  level: 2 | 3
}

/**
 * Final Report section data extracted from markdown
 */
const reportSections = [
  {
    id: 'abstract',
    title: 'Abstract',
    level: 2 as const,
    content: `AI agents represent one of the most promising frontiers in artificial intelligence, yet a stark gap persists between demonstrated capabilities and production deployment. This research investigates what prevents agents from transitioning from impressive demonstrations to reliable enterprise tools. Through 36 expert interviews, 5 industry conferences, and 3 functional prototypes, we discovered that production deployment is fundamentally an engineering problem, not an AI problem. Models contribute only 30-40% to agent success; the remaining 60-70% comes from framework architecture, system integration, and evaluation infrastructure. Most critically, 90% of enterprise pilots fail not due to technical limitations but because organizations cannot define ROI, forecast costs, or manage stakeholder expectations around probabilistic systems. This research reveals significant infrastructure opportunities in evaluation frameworks, memory architectures, and vertical-specific integration, opportunities that will unlock the next wave of value creation in agentic AI.`,
  },
  {
    id: 'background-hypotheses-methodology',
    title: 'Background, Hypotheses & Research Methodology',
    level: 2 as const,
    content: `To effectively unlock the true potential of AI Agents, we must first dismantle the machinery that drives them. We cannot identify the bottlenecks of a system until we fully understand its anatomy. An agent is not merely a Large Language Model (LLM) wrapped in a loop; it is a complex orchestration of disparate components working in concert to reason, act, and reflect.

To ground our analysis, we identified the eight key pillars that are critical to any modern production-ready agentic system.`,
  },
  {
    id: 'eight-pillars-overview',
    title: 'The Eight Pillars',
    level: 3 as const,
    content: `<ol class="list-decimal pl-6 space-y-3">
      <li><strong>The LLM (The Cognitive Engine):</strong> The core reasoning unit. It is responsible for intent detection, planning, and generating responses. Its importance is foundational; without a sufficiently capable model, the agent cannot navigate ambiguity or execute complex instructions.</li>
      <li><strong>Context & Memory Management:</strong> LLMs are inherently stateless. This layer provides the continuity required for long-running tasks. It involves managing the context window, retrieving relevant historical data (via RAG or vector stores), and maintaining state across multi-turn interactions so the agent "remembers" what it has done.</li>
      <li><strong>System Integration:</strong> An agent without access to data is merely a chatbot. This pillar handles the connections to external systems (APIs, databases, SaaS tools). It is the mechanism by which an agent perceives the dynamic world and executes actions within it.</li>
      <li><strong>Authentication & Identity:</strong> In an enterprise setting, an agent acts on behalf of a user. This layer manages permissions, OAuth tokens, and Role-Based Access Control (RBAC), ensuring the agent can only access data and perform actions authorized for that specific human user.</li>
      <li><strong>Trust, Governance & Guardrails:</strong> This serves as the system's conscience and safety net. It includes PII redaction, output filtering, and policy enforcement to prevent hallucinations or malicious use. It is critical for regulatory compliance and brand safety.</li>
      <li><strong>Cost Management:</strong> Agentic loops can be token-intensive. This component tracks usage, manages quotas, and optimizes model selection (routing to cheaper models for simpler tasks) to ensure the Return on Investment (ROI) remains positive.</li>
      <li><strong>Agent Evaluations (Evals):</strong> Unlike deterministic software, probabilistic AI requires rigorous testing. This pillar involves benchmarking the agent's accuracy, reliability, and safety using datasets and simulation environments before deployment.</li>
      <li><strong>Monitoring & Telemetry:</strong> Once deployed, observability is non-negotiable. This involves tracing execution chains, logging latency, and debugging failures in real-time to maintain system health.</li>
    </ol>`,
  },
  {
    id: 'initial-hypothesis',
    title: 'The Rise of Agentic AI Enablers and Our Initial Hypothesis',
    level: 3 as const,
    content: `Given the rise of hundreds of startups and established tech giants rushing to fill the gaps in the agentic stack, we formed an initial hypothesis that most of the pillars would have relatively thin friction while a couple may appear as the pillars to really focus on. We define friction from the vantage point of building a production-ready agent. Low friction implies the existence of a plug-and-play solution or a highly generalizable framework that allows developers to focus on logic rather than plumbing. High friction implies the need for bespoke engineering, fragile workarounds, or the lack of established patterns.

Consequently, we entered this study with a <strong>technical-first framing</strong>. We hypothesized that the primary bottlenecks preventing agents from reaching their potential were located in the deep technical nuances of the agentic stack with business case or engineering issues being secondary. This paper outlines how that hypothesis stood up against reality.`,
  },
  {
    id: 'research-methodology',
    title: 'Research Methodology: Depth and Breadth',
    level: 3 as const,
    content: `To test these hypotheses, we employed a three-pronged approach spanning September through November 2024:

<ul class="list-disc pl-6 space-y-2 mt-4">
  <li><strong>36 Expert Interviews:</strong> We conducted in-depth conversations with practitioners actively deploying agentic workflows—enterprise AI platform providers, coding agent developers, identity and security experts, vertical SaaS companies, framework companies, infrastructure providers, and foundation model companies. We sought builders with production deployments, not researchers or theorists.</li>
  <li><strong>5 Industry Conferences:</strong> We attended leading AI agent events in San Francisco and Palo Alto—a major industry conference, the Production Agents Summit, an industry fireside chat, an academic project summit, and "Why 95% of Agentic AI Projects Fail"—to observe industry consensus and emerging standards.</li>
  <li><strong>3 Functional Prototypes:</strong> We built working agent systems to validate interview findings: <em>Shopping Agent</em> (e-commerce automation testing framework approaches), <em>Repo Patcher</em> (code fixing agent with state machine architecture), and <em>Good Agents</em> (multi-agent orchestration with plan-verify-execute framework). These served dual purposes: empirical validation of claimed challenges and opportunity identification for future research.</li>
</ul>`,
  },
  {
    id: 'major-learnings',
    title: 'Section B: Major Learnings & Insights',
    level: 2 as const,
    content: `This research began with a technical hypothesis, with model capabilities, context management, and integration standards were the primary blockers. What we discovered was more fundamental: <strong>production AI agents are an engineering problem, not an AI problem</strong>. Models at GPT-4 capability levels are "good enough" for many use cases, playing a minor role in Agentic friction. The bulk of the heavy lifting comes from framework architecture, system integration, context engineering, and evaluation infrastructure. As a popular consumer AI Agent founder articulated at an interview: "We found that the model only maybe contributes 30 or 40% of the whole thing. And the framework, the whole system you build upon the model is much more important than the model itself." This inverted our initial assumptions entirely.

In addition, we discovered that <strong>business case failure precedes technical failure in many cases</strong>. A large number of enterprise pilots fail not because the technology doesn't work, but because organizations cannot define ROI, cannot forecast costs due to pricing model confusion, and cannot manage stakeholder expectations around probabilistic systems.`,
  },
  {
    id: 'pattern-1-system-integration',
    title: 'Key Pattern 1: System Integration Dominates Deployment Effort',
    level: 3 as const,
    content: `System integration emerged as the dominant enterprise challenge, appearing in 92% of our sources and consuming 40-50% of all deployment time. A founder from an enterprise AI platform stated: "A lot of people think AI has to be like 70%, 80%, 90% about prompt engineering and training the AI workforce. In reality that's only around 40% of the work, max. The rest of the time I spent on system integration."

The integration challenge stems from heterogeneous enterprise tech stacks built over decades with no expectation of coordination. AI agents must orchestrate workflows across these systems, requiring custom connectors, authentication handling across disparate identity systems, and often browser automation when APIs don't exist.

Our prototypes empirically validated this finding. In Good Agents, MCP integration consumed more engineering time than core orchestration logic. In Shopping Agent, multi-platform connectors represented the primary technical challenge versus agent reasoning.

A critical discovery: while industry narratives emphasize standardization for seamless and speedy deployments, AI companies with successful deployments end up creating deeply custom integrations which in turn become competitive moats, rather than a problem to solve.`,
  },
  {
    id: 'pattern-2-frameworks',
    title: 'Key Pattern 2: Agent Frameworks Deliver Limited Value Beyond Prototyping',
    level: 3 as const,
    content: `Agent Frameworks including widely used popular open-source libraries achieve billion-dollar valuations through initial developer adoption, yet we see majority of production teams abandon them due to bloat, performance overhead (3-4x slower), and loss of control. A leader from an agent framework company reported: "Every company we've talked to started with LangChain as a framework to build AI agents. But once they start going into production, they realize it's full of bloat. They end up ditching that solution, and they build their own. This has been like 80, 90% of the clients we've talked to."

Our Shopping Agent prototype provided firsthand validation. Initially implemented with a graph-based framework, we were forced to switch to a popular open-source framework mid-development due to extensive bloat and complexity. Under time pressure, framework abstractions became intolerable, which is exactly the pattern reported in interviews.

The paradox: framework abstractions that accelerate prototyping become obstacles to understanding agent decision-making in production. Teams need control and performance that generic frameworks cannot provide.`,
  },
  {
    id: 'pattern-3-probabilistic-systems',
    title: 'Key Pattern 3: Managing Expectations of Probabilistic Systems',
    level: 3 as const,
    content: `The demo-to-production chasm exists because '80% reliability' creates impressive demos but systematically fails in production workflows. A founder from an Agent Framework company articulated the mechanism: "When I run a demo, I recognize I'm relying on luck. I know perhaps 20% of the time it will fail, but for the demo, I just need a single successful execution. The problem is, our customers aren't accustomed to this probabilistic performance. They see a single win and immediately believe the agent is ready for production deployment."

This isn't a model limitation but an expectation mismatch. Most people building technology over the last 30 years expect deterministic systems, where if it works once, it works reliably thereafter. This assumption is catastrophic for LLM-based systems.

Without systematic improvement methodologies, teams enter a "doom loop": fixing one scenario breaks another, creating continuous firefighting.`,
  },
  {
    id: 'pattern-4-context-management',
    title: 'Key Pattern 4: Context Management Requires Engineering, Not Larger Windows',
    level: 3 as const,
    content: `Context window engineering emerged as a fundamental architectural challenge in the majority of our conversations. The critical discovery: a <strong>"40% context utilization rule"</strong> contradicts vendor narratives around million-token windows. From the Production Agents Summit we heard "If your agent is using anything more than 40% of the context window, it's probably going to make mistakes. This is true for an agent you develop for your software. It's also true for things like Cursor."

This threshold exists independent of maximum window size; quality degrades well before theoretical limits. MCP exemplifies the problem: when you have more than 25 MCP tools, accuracy drops to 30% due to verbose tool definitions exhausting context in multi-step conversations.

Production teams employ sophisticated context engineering techniques:
<ul class="list-disc pl-6 space-y-2 mt-4">
  <li><strong>Notes summarization:</strong> Periodic bullet point summaries replacing full conversation history.</li>
  <li><strong>Just-in-time retrieval:</strong> Track file path references instead of contents; fetch on-demand.</li>
  <li><strong>Sub-agent patterns:</strong> Parallel agents with internal iteration loops compress context before passing to orchestrator.</li>
  <li><strong>Dual memory architecture:</strong> User memory (preferences, past interactions) versus agent memory (tool performance, problem-solving patterns), which are architecturally different problems requiring separate solutions.</li>
</ul>`,
  },
  {
    id: 'pattern-5-business-economics',
    title: 'Key Pattern 5: Business Economics Often Block Before Technical Limits',
    level: 3 as const,
    content: `The emergence of business case and ROI concerns as a dominant theme revealed our research blind spot. An AI startup founder we spoke to identified this as "the primary failure mode" in our very first interview: "Most AI agent deployments fail due to undefined ROI calculations and lack of commercial mindset with respect to deployments, not technical limitations."

This precedes technical challenges. Enterprises cannot forecast costs because multiple pricing models coexist (seat-based, token-based, outcome-based) without convergence, token consumption varies unpredictably, and startups themselves are experimenting with business models. An expert from a large tech company explained: "All of these pricing changes or types of pricing schemes is confusing to enterprises. They don't know how many tokens they're going to use. They can't model their usage, they can't model their outcome."

Meanwhile, enterprises demonstrate willingness to pay $400-750/month (versus current $20/month offerings), but cost predictability doesn't exist.`,
  },
  {
    id: 'pattern-6-evaluations',
    title: 'Key Pattern 6: Evaluation (Evals) Is Still a Missing Piece',
    level: 3 as const,
    content: `The agent evaluation (Evals) market suffers from an Evaluation Value Chasm, as current solutions predominantly focus on readily measurable intermediate metrics leveraged by LLM as a judge (e.g., token cost and retrieval accuracy) instead of the essential business outcomes (handoff rate and task completion). This approach provides insufficient quality signals for debugging complex, probabilistic pipelines, a problem validated by the anecdote of a recent Y Combinator founder noting that agent builder companies in his batch failed to adopt third party evaluation tools, despite 7+ evaluation tool companies in the same batch.

To unlock reliable production readiness, the winning evaluation paradigm must holistically combine component-level testing for deterministic steps with direct business outcome tracking, and the establishment of industry-specific benchmarks derived from real-world usage rather than synthetic datasets.`,
  },
  {
    id: 'emerging-opportunities',
    title: 'Section C: Emerging Opportunities & Trends',
    level: 2 as const,
    content: `Our research reveals that the gap between current capabilities and production requirements exposes where innovation is needed most urgently. Contrary to dominant narratives about better models, the highest-value opportunities lie in infrastructure that doesn't yet exist.`,
  },
  {
    id: 'enterprise-memory',
    title: 'Enterprise Memory Systems',
    level: 3 as const,
    content: `Current solutions suffer from static staleness (batch-based memory can't benefit from improved prompts without reprocessing), multi-modal limitations, and PII leakage risks that block enterprise adoption. The opportunity lies in privacy-preserving architecture with cryptographic isolation, multi-modal retrieval across text, images, documents, and voice, dynamic update capability, and explicit separation of user memory versus agent memory layers.`,
  },
  {
    id: 'context-engineering-services',
    title: 'Context Engineering Services',
    level: 3 as const,
    content: `Production practitioners discovered that using more than 40% of context window causes accuracy degradation regardless of maximum window size. The opportunity exists for "context-as-a-service" abstraction layers that monitor utilization in real-time, provide compression recommendations, implement proven patterns, and prevent degradation before it occurs. This requires deep expertise in both LLM behavior and distributed systems.`,
  },
  {
    id: 'mcp-specificity-layer',
    title: 'MCP Specificity Layer',
    level: 3 as const,
    content: `MCP accuracy drops to 30% beyond 25 tools because generic MCP servers expose too many operations without use-case context. The near term opportunities may involve dynamic tool loading solutions that fine-tune small models to select which tools to load before LLM invocation, provide use-case-specific tool bundles, and enable MCP adoption at enterprise scale without hitting accuracy cliffs.`,
  },
  {
    id: 'vertical-specialization',
    title: 'Vertical Specialization May Dominate',
    level: 3 as const,
    content: `Every successful deployment in our research operated in narrow, well-defined domains. Generic horizontal platforms struggle because they cannot encode domain-specific knowledge about which operations matter when, what workflows are standard, or how to handle exceptions. High-value verticals include healthcare (HIPAA compliance workflows), financial services (regulatory reporting, KYC automation), legal (contract analysis, compliance checking), and supply chain (multi-party coordination, customs documentation).`,
  },
  {
    id: 'small-model-constellations',
    title: 'Small Model Constellations Instead of Single Frontier Models',
    level: 3 as const,
    content: `Even if model capabilities plateau and inference costs remain static, some advanced teams will shift to specialized small models (~8B parameters) with domain-specific fine-tuning achieving 10-100x speed improvements, task-specific routing, and owned training infrastructure creating sustainable moats. This is a key trend that the advancements of open source models like the Qwen, Kimi and Llama families will only accelerate.`,
  },
  {
    id: 'conclusion',
    title: 'Conclusion: Where Does the Most Friction Lie Today?',
    level: 2 as const,
    content: `Contrary to our initial hypothesis, where we expected to find friction in a few pillars of the stack, we found that friction (and lack of generalizability) continues to exist in almost all the pillars of the Agentic Stack today.

<ul class="list-disc pl-6 space-y-3 mt-4">
  <li><strong>System Integration</strong> emerged as the dominant friction point, consuming the largest share of deployment effort as teams grapple with heterogeneous enterprise tech stacks built over decades.</li>
  <li><strong>Context & Memory Management</strong> revealed an unexpected ceiling; accuracy degrades well before theoretical window limits, requiring sophisticated compression techniques rather than simply waiting for larger context windows.</li>
  <li><strong>Agent Evaluations</strong> remains a critical gap: despite numerous startups building eval tools, adoption is minimal because solutions measure intermediate metrics rather than business outcomes.</li>
  <li><strong>Cost Management</strong> creates enterprise paralysis through pricing model confusion, making cost forecasting nearly impossible.</li>
  <li><strong>Authentication & Identity</strong> and <strong>Trust, Governance & Guardrails</strong> compound enterprise blockers through fragmented identity standards, unreliable PII detection, and absent frameworks for trusting probabilistic systems.</li>
  <li><strong>Monitoring & Telemetry</strong> struggles because traditional observability tools cannot trace non-deterministic decision chains.</li>
  <li><strong>The LLM itself</strong> showed the least friction. Current frontier models are "good enough" for many production use cases. The bottleneck today is not intelligence but the infrastructure surrounding it.</li>
</ul>

<p class="mt-6 text-lg font-semibold text-accent-primary dark:text-accent-secondary-dark">In conclusion, our research reveals that the bottleneck to production AI agents is not artificial intelligence itself but rather infrastructure, and organizational readiness. As we stand today, agents are only ~30% model capability but 60-70% system architecture.</p>`,
  },
  {
    id: 'acknowledgments',
    title: 'Acknowledgments',
    level: 2 as const,
    content: `This research would not have been possible without the generosity of 36 practitioners in the broader AI ecosystem (founder, engineers, product managers, etc) who shared candid insights about production agent deployments. Finally, we thank Professor Scott J. Brady and Brett Jordan for sponsoring this individual research and providing invaluable guidance throughout the investigation.`,
  },
]

/**
 * Extract headings from report sections
 */
const reportHeadings: ReportHeading[] = reportSections.map((section) => ({
  id: section.id,
  text: section.title,
  level: section.level,
}))

/**
 * Mobile Table of Contents component with collapsible menu
 */
interface MobileTocProps {
  headings: ReportHeading[]
  activeId: string | null
  onHeadingClick: (id: string) => void
}

function MobileTableOfContents({ headings, activeId, onHeadingClick }: MobileTocProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleHeadingClick = (id: string) => {
    onHeadingClick(id)
    setIsOpen(false)
  }

  return (
    <div className="lg:hidden sticky top-16 z-40 mb-6">
      <div className="bg-light-base/95 dark:bg-dark-base/95 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="
            w-full flex items-center justify-between p-4
            text-text-primary dark:text-text-dark-primary
            hover:bg-light-icy-blue dark:hover:bg-dark-deep-blue
            transition-colors duration-200
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-accent-primary focus-visible:ring-inset
          "
          aria-expanded={isOpen}
          aria-controls="mobile-toc-menu"
        >
          <span className="flex items-center gap-2">
            <List className="h-5 w-5 text-accent-primary" aria-hidden="true" />
            <span className="font-medium">Table of Contents</span>
          </span>
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-toc-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden bg-light-panel dark:bg-dark-panel border-t border-border-light dark:border-border-dark"
            >
              <nav className="p-4 max-h-[60vh] overflow-y-auto" aria-label="Table of contents">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-text-muted dark:text-text-dark-muted">
                    Jump to section
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded hover:bg-light-icy-blue dark:hover:bg-dark-deep-blue transition-colors"
                    aria-label="Close table of contents"
                  >
                    <X className="h-4 w-4 text-text-muted dark:text-text-dark-muted" />
                  </button>
                </div>
                <ol className="space-y-1" role="list">
                  {headings.map(({ id, text, level }) => {
                    const isActive = activeId === id
                    return (
                      <li key={id}>
                        <button
                          onClick={() => handleHeadingClick(id)}
                          className={`
                            w-full text-left py-2 px-3 rounded-lg text-sm
                            transition-all duration-200
                            ${level === 3 ? 'pl-6' : 'pl-3'}
                            ${
                              isActive
                                ? 'bg-accent-primary/10 text-accent-primary font-medium'
                                : 'text-text-secondary dark:text-text-dark-secondary hover:bg-light-icy-blue dark:hover:bg-dark-deep-blue hover:text-text-primary dark:hover:text-text-dark-primary'
                            }
                          `}
                          aria-current={isActive ? 'location' : undefined}
                        >
                          {text}
                        </button>
                      </li>
                    )
                  })}
                </ol>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/**
 * Desktop Table of Contents component with sticky sidebar
 */
interface DesktopTocProps {
  headings: ReportHeading[]
  activeId: string | null
  onHeadingClick: (id: string) => void
}

function DesktopTableOfContents({ headings, activeId, onHeadingClick }: DesktopTocProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="sticky top-24 h-fit max-h-[calc(100vh-120px)] overflow-y-auto"
      aria-label="Table of contents"
    >
      <div className="p-4 rounded-lg bg-light-panel dark:bg-dark-panel border border-border-light dark:border-border-dark">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border-light dark:border-border-dark">
          <List className="h-4 w-4 text-accent-primary" aria-hidden="true" />
          <span className="text-sm font-semibold text-text-primary dark:text-text-dark-primary">
            On this page
          </span>
        </div>

        {/* TOC List */}
        <ol className="space-y-1" role="list">
          {headings.map(({ id, text, level }) => {
            const isActive = activeId === id

            return (
              <li key={id}>
                <button
                  onClick={() => onHeadingClick(id)}
                  className={`
                    w-full text-left block py-1.5 text-sm leading-snug
                    transition-all duration-200
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-accent-primary focus-visible:ring-offset-1
                    rounded
                    ${level === 3 ? 'pl-4' : 'pl-0'}
                    ${
                      isActive
                        ? 'text-accent-primary font-medium'
                        : 'text-text-secondary dark:text-text-dark-secondary hover:text-accent-primary'
                    }
                  `}
                  aria-current={isActive ? 'location' : undefined}
                >
                  <span className="flex items-center gap-2">
                    {isActive && (
                      <motion.span
                        layoutId="report-toc-active-indicator"
                        className="w-0.5 h-4 bg-accent-primary rounded-full flex-shrink-0"
                        initial={false}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className={isActive ? '' : 'ml-2.5'}>{text}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </motion.nav>
  )
}

/**
 * FinalReport component renders the full research report with a table of contents
 *
 * Features:
 * - Renders Final Report markdown content as styled HTML sections
 * - Sticky TOC sidebar on desktop showing all major sections
 * - Collapsible TOC menu on mobile
 * - Smooth scroll to sections when TOC items are clicked
 * - Active section highlighting based on scroll position
 * - Anchor links for deep linking
 * - Intersection Observer for tracking current section
 *
 * Accessibility:
 * - Semantic HTML structure
 * - ARIA labels and landmarks
 * - Keyboard navigation support
 * - Focus management
 */
export function FinalReport() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const headingElementsRef = useRef<Map<string, IntersectionObserverEntry>>(new Map())

  /**
   * Handle click on a TOC item - scroll to heading
   */
  const handleHeadingClick = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // Calculate offset for sticky header (approximately 100px)
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })

      // Update active state immediately for better UX
      setActiveId(id)

      // Update URL hash without scrolling
      history.pushState(null, '', `#${id}`)

      // Focus the heading for accessibility
      element.focus({ preventScroll: true })
    }
  }, [])

  /**
   * Set up Intersection Observer to track which heading is currently visible
   */
  useEffect(() => {
    // Callback to determine which heading is currently active
    const getActiveHeading = () => {
      const headingElements = headingElementsRef.current
      const visibleHeadings: { id: string; top: number }[] = []

      headingElements.forEach((entry, id) => {
        if (entry.isIntersecting) {
          visibleHeadings.push({
            id,
            top: entry.boundingClientRect.top,
          })
        }
      })

      if (visibleHeadings.length === 0) {
        // If no headings are visible, find the last one that was passed
        const allHeadings = Array.from(headingElements.entries())
        const passedHeadings = allHeadings.filter(
          ([, entry]) => entry.boundingClientRect.top < 150
        )
        if (passedHeadings.length > 0) {
          // Get the last passed heading
          const lastPassed = passedHeadings[passedHeadings.length - 1]
          setActiveId(lastPassed[0])
        }
        return
      }

      // Sort by position and get the topmost visible heading
      visibleHeadings.sort((a, b) => a.top - b.top)
      setActiveId(visibleHeadings[0].id)
    }

    // Create observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          headingElementsRef.current.set(entry.target.id, entry)
        })
        getActiveHeading()
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: [0, 1],
      }
    )

    // Observe all heading elements
    const observer = observerRef.current
    const headingElements = headingElementsRef.current
    reportHeadings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    // Initial check for active heading
    getActiveHeading()

    return () => {
      observer.disconnect()
      headingElements.clear()
    }
  }, [])

  // Handle initial hash in URL
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash && reportHeadings.some((h) => h.id === hash)) {
      setActiveId(hash)
      // Small delay to ensure content is rendered
      setTimeout(() => {
        const element = document.getElementById(hash)
        if (element) {
          const offset = 100
          const elementPosition = element.getBoundingClientRect().top + window.scrollY
          const offsetPosition = elementPosition - offset
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
        }
      }, 100)
    }
  }, [])

  return (
    <div className="relative">
      {/* Mobile TOC */}
      <MobileTableOfContents
        headings={reportHeadings}
        activeId={activeId}
        onHeadingClick={handleHeadingClick}
      />

      <div className="flex gap-8 lg:gap-12">
        {/* Desktop TOC Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <DesktopTableOfContents
            headings={reportHeadings}
            activeId={activeId}
            onHeadingClick={handleHeadingClick}
          />
        </aside>

        {/* Main Content */}
        <article className="flex-1 min-w-0">
          <div className="prose-custom">
            {reportSections.map((section, index) => (
              <motion.section
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="mb-8"
              >
                {section.level === 2 ? (
                  <h2
                    id={section.id}
                    tabIndex={-1}
                    className="
                      scroll-mt-24
                      text-2xl md:text-3xl font-heading font-bold
                      text-text-primary dark:text-text-dark-primary
                      mb-4 pt-4 border-t border-border-light dark:border-border-dark
                      first:border-t-0 first:pt-0
                      focus:outline-none
                    "
                  >
                    <a
                      href={`#${section.id}`}
                      className="group flex items-center gap-2 hover:text-accent-primary transition-colors"
                      onClick={(e) => {
                        e.preventDefault()
                        handleHeadingClick(section.id)
                      }}
                    >
                      {section.title}
                      <span
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-accent-primary"
                        aria-hidden="true"
                      >
                        #
                      </span>
                    </a>
                  </h2>
                ) : (
                  <h3
                    id={section.id}
                    tabIndex={-1}
                    className="
                      scroll-mt-24
                      text-xl md:text-2xl font-heading font-semibold
                      text-text-primary dark:text-text-dark-primary
                      mb-3 mt-6
                      focus:outline-none
                    "
                  >
                    <a
                      href={`#${section.id}`}
                      className="group flex items-center gap-2 hover:text-accent-primary transition-colors"
                      onClick={(e) => {
                        e.preventDefault()
                        handleHeadingClick(section.id)
                      }}
                    >
                      {section.title}
                      <span
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-accent-primary"
                        aria-hidden="true"
                      >
                        #
                      </span>
                    </a>
                  </h3>
                )}
                <div
                  className="text-text-secondary dark:text-text-dark-secondary leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </motion.section>
            ))}
          </div>
        </article>
      </div>
    </div>
  )
}

export default FinalReport
