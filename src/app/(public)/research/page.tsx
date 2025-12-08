'use client'

import { useRef, useEffect } from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'
import Link from 'next/link'
import { FinalReport } from '@/components/research/FinalReport'

// Animation variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

const pillarContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const pillarCardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

/**
 * AI Agents Series categories with post counts
 */
const seriesCategories = [
  {
    name: 'Anchor',
    slug: 'anchor',
    count: 1,
    description: 'The foundational overview post introducing the research',
    color: 'bg-accent-primary',
  },
  {
    name: 'Theme Deep Dives',
    slug: 'theme',
    count: 6,
    description: 'In-depth explorations of each of the Eight Pillars',
    color: 'bg-category-research',
  },
  {
    name: 'Emergent Insights',
    slug: 'emergent',
    count: 6,
    description: 'Cross-cutting patterns discovered during research',
    color: 'bg-accent-secondary',
  },
  {
    name: 'Practitioner Perspectives',
    slug: 'practitioner',
    count: 5,
    description: 'Insights from interviews with industry practitioners',
    color: 'bg-accent-success',
  },
  {
    name: 'Prototype Learnings',
    slug: 'prototype',
    count: 3,
    description: 'Hands-on lessons from building agent prototypes',
    color: 'bg-accent-warning',
  },
  {
    name: 'Conference Insights',
    slug: 'conference',
    count: 3,
    description: 'Key takeaways from AI conferences and events',
    color: 'bg-accent-error',
  },
  {
    name: 'Methodology',
    slug: 'methodology',
    count: 1,
    description: 'Research methodology and approach documentation',
    color: 'bg-text-muted dark:bg-text-dark-muted',
  },
]

/**
 * Category card component for the AI Agents Series Hub
 */
interface CategoryCardProps {
  name: string
  slug: string
  count: number
  description: string
  color: string
  index: number
}

function CategoryCard({ name, slug, count, description, color, index }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        href={`/blog?category=${slug}`}
        className="
          group block relative p-6 rounded-xl
          bg-light-base dark:bg-dark-panel
          border border-border-light dark:border-border-dark
          shadow-light dark:shadow-none
          hover:shadow-glow dark:hover:shadow-glow
          hover:border-accent-primary dark:hover:border-accent-secondary-dark
          transition-all duration-300
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-accent-primary focus-visible:ring-offset-2
        "
        aria-label={`View ${count} ${name} post${count !== 1 ? 's' : ''}`}
      >
        {/* Color accent bar */}
        <div className={`absolute top-0 left-6 w-12 h-1 rounded-b-full ${color}`} />

        {/* Count badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`
              inline-flex items-center justify-center
              min-w-[2rem] h-8 px-2
              text-sm font-bold text-white
              rounded-full ${color}
            `}
          >
            {count}
          </span>
        </div>

        {/* Category name */}
        <h3 className="mt-2 mb-2 text-lg font-semibold text-text-primary dark:text-text-dark-primary group-hover:text-accent-primary dark:group-hover:text-accent-secondary-dark transition-colors">
          {name}
        </h3>

        {/* Description */}
        <p className="text-sm text-text-secondary dark:text-text-dark-secondary leading-relaxed pr-8">
          {description}
        </p>

        {/* Arrow indicator */}
        <div className="mt-4 flex items-center text-accent-primary dark:text-accent-secondary-dark opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-sm font-medium">View posts</span>
          <svg
            className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </motion.div>
  )
}

// GPU acceleration style hints for smoother animations
const gpuAcceleratedStyle = {
  willChange: 'transform, opacity',
  backfaceVisibility: 'hidden' as const,
  perspective: 1000,
  transform: 'translateZ(0)',
}

/**
 * Animated counter component that counts up to a target value when in view.
 * Uses Framer Motion's spring animation for smooth number transitions.
 */
function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
}: {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  })

  const display = useTransform(spring, (current) =>
    Math.round(current).toString()
  )

  // Trigger animation when in view
  useEffect(() => {
    if (isInView) {
      spring.set(value)
    }
  }, [isInView, spring, value])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  )
}

/**
 * Individual statistic card with animated counter and description.
 */
interface StatCardProps {
  value: number
  suffix?: string
  prefix?: string
  label: string
  description: string
  delay?: number
}

function StatCard({ value, suffix = '', prefix = '', label, description, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      className="
        relative p-6 rounded-xl
        bg-light-base dark:bg-dark-panel
        border border-border-light dark:border-border-dark
        shadow-light dark:shadow-none
        hover:shadow-glow dark:hover:shadow-glow
        transition-shadow duration-300
      "
    >
      {/* Accent indicator */}
      <div className="absolute top-0 left-6 w-12 h-1 rounded-b-full bg-category-research" />

      {/* Statistic value */}
      <div className="mt-2 mb-3">
        <span className="text-3xl md:text-4xl font-heading font-bold text-accent-primary dark:text-accent-secondary-dark">
          <AnimatedCounter value={value} suffix={suffix} prefix={prefix} />
        </span>
      </div>

      {/* Label */}
      <h3 className="text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-2">
        {label}
      </h3>

      {/* Description */}
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}

/**
 * Key statistics from the research
 */
const researchStats = [
  {
    value: 90,
    suffix: '%',
    label: 'Pilot Failure Rate',
    description: 'AI pilot projects fail to move beyond proof-of-concept stage into production deployment.',
  },
  {
    value: 35,
    suffix: '%',
    prefix: '30-40',
    label: 'Model Contribution',
    description: 'The AI model contributes only 30-40% to overall system success. Infrastructure matters more.',
  },
  {
    value: 92,
    suffix: '%',
    label: 'System Integration Blocker',
    description: 'Projects cite system integration as the primary blocker preventing successful deployment.',
  },
  {
    value: 85,
    suffix: '%',
    prefix: '80-90',
    label: 'Framework Abandonment',
    description: 'Enterprise teams abandon initial agentic frameworks within 6 months of production deployment.',
  },
]

/**
 * Eight Pillars of AI Agent Infrastructure
 */
const eightPillars = [
  {
    number: 1,
    title: 'LLM (Cognitive Engine)',
    description: 'The foundation of AI agents - selecting, fine-tuning, and orchestrating large language models for specific use cases.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    color: 'from-blue-500 to-blue-600',
  },
  {
    number: 2,
    title: 'Context & Memory Management',
    description: 'Managing context windows, implementing RAG systems, and maintaining agent memory for coherent long-term interactions.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
    color: 'from-purple-500 to-purple-600',
  },
  {
    number: 3,
    title: 'System Integration',
    description: 'Connecting agents to enterprise systems, APIs, and external tools while maintaining reliability and data consistency.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    number: 4,
    title: 'Authentication & Identity',
    description: 'Securing agent access, managing credentials, and implementing identity verification for autonomous operations.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
      </svg>
    ),
    color: 'from-green-500 to-green-600',
  },
  {
    number: 5,
    title: 'Trust, Governance & Guardrails',
    description: 'Implementing safety mechanisms, compliance frameworks, and ethical guidelines for responsible AI deployment.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    color: 'from-amber-500 to-amber-600',
  },
  {
    number: 6,
    title: 'Cost Management',
    description: 'Optimizing API costs, implementing caching strategies, and managing resource allocation for sustainable operations.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    number: 7,
    title: 'Agent Evaluations',
    description: 'Testing agent performance, measuring accuracy, and establishing benchmarks for continuous improvement.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    color: 'from-rose-500 to-rose-600',
  },
  {
    number: 8,
    title: 'Monitoring & Telemetry',
    description: 'Tracking agent behavior, logging interactions, and implementing observability for debugging and optimization.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
    color: 'from-indigo-500 to-indigo-600',
  },
]

/**
 * Individual Pillar Card component with hover effects and animations
 */
interface PillarCardProps {
  number: number
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

function PillarCard({ number, title, description, icon, color }: PillarCardProps) {
  return (
    <motion.div
      variants={pillarCardVariants}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      className="
        relative group p-6 rounded-xl
        bg-light-base dark:bg-dark-panel
        border border-border-light dark:border-border-dark
        shadow-light dark:shadow-none
        hover:shadow-glow dark:hover:shadow-glow
        transition-all duration-300
        overflow-hidden
      "
    >
      {/* Background gradient on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
        aria-hidden="true"
      />

      {/* Pillar number badge */}
      <div
        className={`
        absolute -top-2 -right-2 w-10 h-10 rounded-full
        bg-gradient-to-br ${color}
        flex items-center justify-center
        text-white font-bold text-sm
        shadow-lg
        transform group-hover:scale-110 transition-transform duration-300
      `}
      >
        {number}
      </div>

      {/* Icon container */}
      <div
        className={`
        mb-4 w-14 h-14 rounded-lg
        bg-gradient-to-br ${color}
        flex items-center justify-center
        text-white
        shadow-md
        group-hover:shadow-lg
        transition-shadow duration-300
      `}
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-2 pr-6">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-text-secondary dark:text-text-dark-secondary leading-relaxed">
        {description}
      </p>

      {/* Bottom accent line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
        aria-hidden="true"
      />
    </motion.div>
  )
}

/**
 * Research Page
 *
 * Displays the Stanford AI Agents research with:
 * - Hero section with research title
 * - Abstract preview
 * - Key statistics dashboard
 * - Author attribution
 * - Faculty sponsor credit
 *
 * Fully responsive with Framer Motion animations.
 */
export default function ResearchPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative py-16 md:py-24 bg-light-icy-blue dark:bg-dark-deep-blue"
        aria-labelledby="research-hero-title"
      >
        {/* Background gradient accent */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-category-research/5 blur-3xl dark:bg-category-research/10" />
          <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-accent-primary/5 blur-3xl dark:bg-accent-primary/10" />
        </div>

        <motion.div
          className="container-wide relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={gpuAcceleratedStyle}
        >
          {/* Category badge */}
          <motion.div variants={itemVariants} className="text-center mb-6">
            <span className="inline-block px-4 py-1.5 text-xs font-medium uppercase tracking-wider rounded-full bg-category-research/10 text-category-research border border-category-research/20">
              Stanford GSB Research
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            id="research-hero-title"
            className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center text-text-primary dark:text-text-dark-primary mb-6 max-w-4xl mx-auto leading-tight"
            variants={itemVariants}
          >
            What&apos;s Needed to Unlock the Full Potential of AI Agents?
          </motion.h1>

          {/* Abstract preview */}
          <motion.div
            className="max-w-3xl mx-auto text-center"
            variants={itemVariants}
          >
            <p className="text-lg md:text-xl text-text-secondary dark:text-text-dark-secondary leading-relaxed mb-8">
              A comprehensive research study exploring why 90% of enterprise AI agent pilots fail
              and the eight critical infrastructure pillars required for successful deployment.
              This research synthesizes insights from industry practitioners, academic literature,
              and hands-on prototype development.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="#full-report"
                className="
                  inline-flex items-center gap-2 px-8 py-3
                  text-base font-semibold
                  rounded-lg
                  bg-category-research hover:bg-category-research/90
                  text-white
                  shadow-light hover:shadow-glow
                  transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-category-research focus-visible:ring-offset-2
                "
              >
                Read Full Report
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </Link>

              {/* PDF Download Button */}
              <a
                href="/AI_Agents_Research_Report.pdf"
                download="AI_Agents_Research_Report.pdf"
                className="
                  inline-flex items-center gap-2 px-8 py-3
                  text-base font-semibold
                  rounded-lg
                  bg-light-base dark:bg-dark-panel
                  text-text-primary dark:text-text-dark-primary
                  border border-border-light dark:border-border-dark
                  hover:bg-light-icy-blue dark:hover:bg-dark-deep-blue
                  hover:border-category-research dark:hover:border-category-research
                  shadow-light hover:shadow-glow
                  transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-category-research focus-visible:ring-offset-2
                "
                aria-label="Download AI Agents Research Report PDF"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download PDF
              </a>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Key Statistics Dashboard */}
      <section
        className="py-16 md:py-24 bg-light-base dark:bg-dark-base"
        aria-labelledby="statistics-title"
      >
        <div className="container-wide">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2
              id="statistics-title"
              className="text-2xl md:text-3xl font-heading font-bold text-text-primary dark:text-text-dark-primary mb-4"
            >
              Key Research Findings
            </h2>
            <p className="max-w-2xl mx-auto text-text-secondary dark:text-text-dark-secondary">
              Critical statistics that reveal why enterprise AI agent deployments struggle
              and what organizations must address.
            </p>
          </motion.div>

          {/* Statistics grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {researchStats.map((stat, index) => (
              <StatCard
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix === '30-40' || stat.prefix === '80-90' ? '' : stat.prefix}
                label={stat.label}
                description={stat.description}
                delay={index * 0.1}
              />
            ))}
          </div>

          {/* Additional context stat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 p-6 rounded-xl bg-light-icy-blue dark:bg-dark-panel border border-border-light dark:border-border-dark text-center"
          >
            <p className="text-text-secondary dark:text-text-dark-secondary">
              <span className="font-semibold text-accent-primary dark:text-accent-secondary-dark">40% Context Utilization Rule:</span>{' '}
              Systems that utilize more than 40% of available context window typically experience significant performance degradation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Eight Pillars Section */}
      <section
        id="eight-pillars"
        className="py-16 md:py-24 bg-light-icy-blue dark:bg-dark-deep-blue"
        aria-labelledby="eight-pillars-title"
      >
        <div className="container-wide">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2
              id="eight-pillars-title"
              className="text-2xl md:text-3xl font-heading font-bold text-text-primary dark:text-text-dark-primary mb-4"
            >
              The Eight Pillars Framework
            </h2>
            <p className="max-w-2xl mx-auto text-text-secondary dark:text-text-dark-secondary">
              The critical infrastructure components required for successful enterprise AI agent deployment.
              Each pillar represents a fundamental building block that organizations must address.
            </p>
          </motion.div>

          {/* Pillars grid with staggered animation */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={pillarContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {eightPillars.map((pillar) => (
              <PillarCard
                key={pillar.number}
                number={pillar.number}
                title={pillar.title}
                description={pillar.description}
                icon={pillar.icon}
                color={pillar.color}
              />
            ))}
          </motion.div>

          {/* Framework summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10 p-6 rounded-xl bg-light-base dark:bg-dark-panel border border-border-light dark:border-border-dark text-center"
          >
            <p className="text-text-secondary dark:text-text-dark-secondary">
              <span className="font-semibold text-accent-primary dark:text-accent-secondary-dark">Key Insight:</span>{' '}
              Success with AI agents requires excellence across all eight pillars. Organizations that focus solely on the LLM while neglecting infrastructure typically experience the 90% pilot failure rate.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Authors Section */}
      <section
        className="py-16 md:py-24 bg-light-base dark:bg-dark-base"
        aria-labelledby="authors-title"
      >
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2
              id="authors-title"
              className="text-2xl md:text-3xl font-heading font-bold text-text-primary dark:text-text-dark-primary mb-8"
            >
              Research Team
            </h2>

            {/* Authors */}
            <div className="flex flex-col sm:flex-row justify-center gap-8 mb-12">
              {/* Fernando Torres */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  FT
                </div>
                <h3 className="text-xl font-semibold text-text-primary dark:text-text-dark-primary">
                  Fernando Torres
                </h3>
                <p className="text-text-secondary dark:text-text-dark-secondary">
                  MSx &apos;26, Stanford GSB
                </p>
              </motion.div>

              {/* Shekhar Bhende */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-br from-category-research to-accent-primary flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  SB
                </div>
                <h3 className="text-xl font-semibold text-text-primary dark:text-text-dark-primary">
                  Shekhar Bhende
                </h3>
                <p className="text-text-secondary dark:text-text-dark-secondary">
                  MSx &apos;26, Stanford GSB
                </p>
              </motion.div>
            </div>

            {/* Faculty Sponsor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="pt-8 border-t border-border-light dark:border-border-dark"
            >
              <p className="text-sm uppercase tracking-wider text-text-muted dark:text-text-dark-muted mb-2">
                Faculty Sponsor
              </p>
              <h3 className="text-xl font-semibold text-text-primary dark:text-text-dark-primary">
                Prof. Scott J. Brady
              </h3>
              <p className="text-text-secondary dark:text-text-dark-secondary">
                Stanford Graduate School of Business
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* AI Agents Series Hub */}
      <section
        className="py-16 md:py-24 bg-light-base dark:bg-dark-base"
        aria-labelledby="series-hub-title"
      >
        <div className="container-wide">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2
              id="series-hub-title"
              className="text-2xl md:text-3xl font-heading font-bold text-text-primary dark:text-text-dark-primary mb-4"
            >
              AI Agents Series
            </h2>
            <p className="max-w-2xl mx-auto text-text-secondary dark:text-text-dark-secondary mb-2">
              Explore our comprehensive 25-post blog series covering every aspect of enterprise AI agent deployment.
            </p>
            <p className="text-sm text-text-muted dark:text-text-dark-muted">
              25 posts across 7 categories
            </p>
          </motion.div>

          {/* Category cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {seriesCategories.map((category, index) => (
              <CategoryCard
                key={category.slug}
                name={category.name}
                slug={category.slug}
                count={category.count}
                description={category.description}
                color={category.color}
                index={index}
              />
            ))}
          </div>

          {/* View all posts link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-10 text-center"
          >
            <Link
              href="/blog?series=ai-agents"
              className="
                inline-flex items-center gap-2 px-6 py-3
                text-base font-semibold
                rounded-lg
                bg-category-research hover:bg-category-research/90
                text-white
                shadow-light hover:shadow-glow
                transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-category-research focus-visible:ring-offset-2
              "
            >
              View All 25 Posts
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Full Report Anchor Section */}
      <section
        id="full-report"
        className="py-16 md:py-24 bg-light-base dark:bg-dark-base"
        aria-labelledby="full-report-title"
      >
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2
              id="full-report-title"
              className="text-2xl md:text-3xl font-heading font-bold text-text-primary dark:text-text-dark-primary mb-4"
            >
              Full Research Report
            </h2>
            <p className="max-w-2xl mx-auto text-text-secondary dark:text-text-dark-secondary">
              The complete research report with detailed analysis of the Eight Pillars framework,
              methodology, practitioner interviews, and recommendations.
            </p>
          </motion.div>

          {/* Full Report Content with TOC */}
          <FinalReport />
        </div>
      </section>
    </main>
  )
}
