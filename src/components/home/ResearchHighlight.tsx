'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'

/**
 * Animated counter component that counts up to a target value when in view.
 * Uses Framer Motion's spring animation for smooth number transitions.
 */
function AnimatedCounter({
  value,
  suffix = '',
  duration = 2,
}: {
  value: number
  suffix?: string
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
  if (isInView) {
    spring.set(value)
  }

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  )
}

/**
 * Individual statistic card with animated counter and description.
 */
interface StatCardProps {
  /** The numeric value to display (without suffix) */
  value: number
  /** Optional suffix like '%' or '+' */
  suffix?: string
  /** Short label for the statistic */
  label: string
  /** Longer description of what the stat means */
  description: string
  /** Animation delay in seconds */
  delay?: number
}

function StatCard({ value, suffix = '', label, description, delay = 0 }: StatCardProps) {
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
        <span className="text-4xl md:text-5xl font-heading font-bold text-accent-primary dark:text-accent-secondary-dark">
          <AnimatedCounter value={value} suffix={suffix} />
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
 * Research highlight data for the Stanford AI Agents study.
 */
const researchStats = [
  {
    value: 90,
    suffix: '%',
    label: 'Pilot Failure Rate',
    description: 'AI pilot projects fail to move beyond proof-of-concept stage into production deployment.',
  },
  {
    value: 35, // Using midpoint of 30-40%
    suffix: '%',
    label: 'Model Contribution',
    description: 'The AI model contributes only 30-40% to overall system success. Infrastructure matters more.',
  },
  {
    value: 92,
    suffix: '%',
    label: 'Integration Blockers',
    description: 'Projects cite system integration as the primary blocker preventing successful deployment.',
  },
]

interface ResearchHighlightProps {
  /** Additional CSS classes */
  className?: string
}

/**
 * Homepage section highlighting key findings from Stanford AI Agents research.
 * Features animated statistics that count up when scrolled into view.
 *
 * Usage:
 * <ResearchHighlight />
 *
 * Accessibility:
 * - Uses semantic section element with aria-labelledby
 * - Statistics use tabular-nums for consistent number display
 * - CTA button has clear, descriptive text
 * - Respects reduced-motion preferences via Framer Motion defaults
 */
export function ResearchHighlight({ className = '' }: ResearchHighlightProps) {
  return (
    <section
      className={`py-16 md:py-24 bg-light-icy-blue dark:bg-dark-deep-blue ${className}`}
      aria-labelledby="research-highlight-title"
    >
      <div className="container-wide">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          {/* Category badge */}
          <span className="inline-block px-3 py-1 mb-4 text-xs font-medium uppercase tracking-wider rounded-full bg-category-research/10 text-category-research">
            Featured Research
          </span>

          <h2
            id="research-highlight-title"
            className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-text-primary dark:text-text-dark-primary mb-4"
          >
            Stanford AI Agents Research
          </h2>

          <p className="max-w-2xl mx-auto text-lg text-text-secondary dark:text-text-dark-secondary">
            Key findings from our research on why enterprise AI agent deployments fail
            and what organizations can do differently.
          </p>
        </motion.div>

        {/* Statistics grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {researchStats.map((stat, index) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              description={stat.description}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Link
            href="/research"
            className="
              inline-flex items-center gap-2 px-8 py-3
              text-base font-semibold
              rounded-lg
              bg-accent-primary hover:bg-accent-primary/90
              text-white
              shadow-light hover:shadow-glow
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-accent-primary focus-visible:ring-offset-2
            "
          >
            Read the Research
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
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default ResearchHighlight
