'use client'

import { useRef } from 'react'
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useReducedMotion,
  Variants,
} from 'framer-motion'
import { GraduationCap, Briefcase, Building2 } from 'lucide-react'

/**
 * Event type definitions for timeline
 */
export type TimelineEventType = 'education' | 'work'

export interface TimelineEvent {
  /** Unique identifier for the event */
  id: string
  /** Job title or degree name */
  title: string
  /** Company name or institution */
  organization: string
  /** Start date (e.g., "2025") */
  startDate: string
  /** End date (e.g., "2026" or "Present") */
  endDate: string
  /** Brief description of the role or degree */
  description: string
  /** Type of event for styling differentiation */
  type: TimelineEventType
  /** Whether this is the current/ongoing event */
  isCurrent?: boolean
}

/**
 * Props interface for Timeline component
 */
export interface TimelineProps {
  /** Array of timeline events to display */
  events?: TimelineEvent[]
  /** Additional CSS classes */
  className?: string
}

/**
 * Default career timeline data
 * Ordered from most recent to oldest
 */
const defaultEvents: TimelineEvent[] = [
  {
    id: 'stanford-gsb',
    title: 'Sloan Fellow (MSx)',
    organization: 'Stanford Graduate School of Business',
    startDate: '2025',
    endDate: '2026',
    description:
      'Conducting applied research on AI agent architectures, long‑term memory systems, and context infrastructure. Building Memori as part of the venture development track and engaging with faculty and industry leaders across AI, product, and healthcare.',
    type: 'education',
    isCurrent: true,
  },
  {
    id: 'chinoin',
    title: 'Business Development Director',
    organization: 'Chinoin',
    startDate: '2020',
    endDate: '2025',
    description:
      'Led international negotiations for major licensing deals across 35+ countries. Oversaw strategic partnerships, financial modeling, and regulatory coordination. Managed a direct team of 11 overseeing operations for 200+ employees.',
    type: 'work',
  },
  {
    id: 'fermintech',
    title: 'Founder',
    organization: 'FerminTech',
    startDate: '2017',
    endDate: '2019',
    description:
      'Built a platform using Convolutional Neural Networks to identify lung nodules from medical images. Achieved radiologist‑level accuracy in predicting lung cancer probability for challenging nodules.',
    type: 'work',
  },
  {
    id: 'sahna-innovasalud',
    title: 'CTO & Product Manager',
    organization: 'Sahna & InnovaSalud',
    startDate: '2017',
    endDate: '2018',
    description:
      'Developed a platform using Angular, Node.js, and MongoDB to assess risks for diabetes and hypertension, delivering personalized health plans including nutrition and physical activity recommendations.',
    type: 'work',
  },
  {
    id: 'socially-mx',
    title: 'Co‑Founder',
    organization: 'Socially MX',
    startDate: 'College',
    endDate: 'Years',
    description:
      'Co‑founded a marketing and communications company specializing in digital advertising, sales promotion, and brand positioning consulting while in college.',
    type: 'work',
  },
  {
    id: 'ibero',
    title: 'Industrial Engineer',
    organization: 'Ibero University',
    startDate: 'Graduated',
    endDate: '',
    description:
      'Graduated from Ibero University in Mexico City. Active member of the chess team and built lasting relationships with peers.',
    type: 'education',
  },
  {
    id: 'early-career',
    title: 'Early Career',
    organization: 'Self-taught Developer',
    startDate: 'Childhood',
    endDate: '',
    description:
      'Started coding to build a custom server for an MMORPG (Runescape style). Maintained it for 6 months for a mid‑size community, learning core programming concepts driven by a passion for gaming.',
    type: 'work',
  },
]

/**
 * Animation variants for milestone dots
 * Uses GPU-accelerated properties: scale and opacity
 */
const createDotVariants = (prefersReducedMotion: boolean): Variants => ({
  hidden: {
    opacity: 0,
    scale: prefersReducedMotion ? 1 : 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: prefersReducedMotion ? 0.01 : 0.4,
      ease: [0.34, 1.56, 0.64, 1], // Slight bounce for milestone markers
    },
  },
})

/**
 * Animation variants for event cards
 * Uses GPU-accelerated properties: translateX and opacity
 */
const createCardVariants = (prefersReducedMotion: boolean): Variants => ({
  hidden: {
    opacity: 0,
    x: prefersReducedMotion ? 0 : 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: prefersReducedMotion ? 0.01 : 0.5,
      ease: [0.22, 1, 0.36, 1], // Smooth easing for 60fps animation
      delay: prefersReducedMotion ? 0 : 0.15, // Slight delay after dot appears
    },
  },
})

/**
 * Animation variants for connecting lines
 * Uses GPU-accelerated scaleY for drawing effect
 */
const createLineVariants = (prefersReducedMotion: boolean): Variants => ({
  hidden: {
    scaleY: prefersReducedMotion ? 1 : 0,
    opacity: prefersReducedMotion ? 1 : 0,
  },
  visible: {
    scaleY: 1,
    opacity: 1,
    transition: {
      duration: prefersReducedMotion ? 0.01 : 0.6,
      ease: [0.22, 1, 0.36, 1],
      delay: prefersReducedMotion ? 0 : 0.2, // Draws after dot appears
    },
  },
})

/**
 * TimelineItem - Individual event in the timeline with scroll-triggered animations
 */
interface TimelineItemProps {
  event: TimelineEvent
  index: number
  isLast: boolean
  prefersReducedMotion: boolean
}

function TimelineItem({ event, index, isLast, prefersReducedMotion }: TimelineItemProps) {
  const itemRef = useRef<HTMLDivElement>(null)
  const Icon = event.type === 'education' ? GraduationCap : Briefcase

  // Individual useInView for each timeline item - triggers when 20% visible
  const isInView = useInView(itemRef, {
    once: true,
    amount: 0.2,
    margin: '-50px 0px -50px 0px', // Trigger slightly before element enters viewport
  })

  // Get animation variants based on reduced motion preference
  const dotVariants = createDotVariants(prefersReducedMotion)
  const cardVariants = createCardVariants(prefersReducedMotion)
  const lineVariants = createLineVariants(prefersReducedMotion)

  // Colors based on event type
  const dotColor =
    event.type === 'education'
      ? 'bg-accent-primary'
      : 'bg-accent-success dark:bg-accent-success-dark'

  const iconBgColor =
    event.type === 'education'
      ? 'bg-accent-primary/10 dark:bg-accent-primary/20'
      : 'bg-accent-success/10 dark:bg-accent-success/20'

  const iconColor =
    event.type === 'education'
      ? 'text-accent-primary'
      : 'text-accent-success dark:text-accent-success-dark'

  const borderColor =
    event.type === 'education'
      ? 'border-accent-primary/30 dark:border-accent-primary/40'
      : 'border-accent-success/30 dark:border-accent-success-dark/40'

  return (
    <div
      ref={itemRef}
      className="relative pl-8 sm:pl-10 pb-8 sm:pb-12 last:pb-0"
      data-testid={`timeline-event-${event.id}`}
    >
      {/* Connecting line - draws progressively as you scroll */}
      {!isLast && (
        <motion.div
          variants={lineVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="absolute left-[11px] sm:left-[13px] top-8 w-0.5 h-full bg-border-light dark:bg-border-dark origin-top will-change-transform"
          aria-hidden="true"
          style={{
            // GPU acceleration hint
            transform: 'translateZ(0)',
          }}
        />
      )}

      {/* Milestone dot - animates with scale effect */}
      <motion.div
        variants={dotVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className={`absolute left-0 top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full ${dotColor} flex items-center justify-center ring-4 ring-light-base dark:ring-dark-base will-change-transform`}
        aria-hidden="true"
        style={{
          // GPU acceleration hint
          transform: 'translateZ(0)',
        }}
      >
        {event.isCurrent && !prefersReducedMotion && (
          <motion.span
            className="absolute w-full h-full rounded-full bg-current opacity-25"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.25, 0, 0.25],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            aria-hidden="true"
          />
        )}
        {event.isCurrent && prefersReducedMotion && (
          <span className="absolute w-full h-full rounded-full bg-current opacity-25" />
        )}
        <span className="w-2 h-2 rounded-full bg-white" />
      </motion.div>

      {/* Event card - slides in from right with staggered delay */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className={`relative bg-light-base dark:bg-dark-panel border ${borderColor} rounded-lg p-4 sm:p-5 shadow-light dark:shadow-none transition-shadow duration-300 hover:shadow-lg hover:shadow-accent-primary/10 dark:hover:shadow-glow/20 cursor-pointer group will-change-transform`}
        style={{
          // GPU acceleration hint
          transform: 'translateZ(0)',
        }}
      >
        {/* Header with icon */}
        <div className="flex items-start gap-4">
          <motion.div
            className={`flex-shrink-0 w-10 h-10 rounded-lg ${iconBgColor} flex items-center justify-center`}
            aria-hidden="true"
            whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </motion.div>

          <div className="flex-1 min-w-0">
            {/* Title and current badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-heading text-base sm:text-lg font-semibold text-text-primary dark:text-text-dark-primary group-hover:text-accent-primary transition-colors duration-300">
                {event.title}
              </h3>
              {event.isCurrent && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent-primary/10 text-accent-primary dark:bg-accent-primary/20">
                  Current
                </span>
              )}
            </div>

            {/* Organization */}
            <div className="flex items-center gap-1.5 mt-1 text-text-secondary dark:text-text-dark-secondary">
              <Building2 className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium">{event.organization}</span>
            </div>

            {/* Date range */}
            <p className="mt-1 text-sm text-text-muted dark:text-text-dark-muted">
              {event.startDate} - {event.endDate}
            </p>

            {/* Description */}
            <p className="mt-3 text-sm text-text-secondary dark:text-text-dark-secondary leading-relaxed">
              {event.description}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/**
 * ProgressLine - A scroll-linked progress line that draws as user scrolls through timeline
 */
interface ProgressLineProps {
  containerRef: React.RefObject<HTMLDivElement | null>
  prefersReducedMotion: boolean
}

function ProgressLine({ containerRef, prefersReducedMotion }: ProgressLineProps) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  })

  // Transform scroll progress to line height (0% to 100%)
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  if (prefersReducedMotion) {
    return null
  }

  return (
    <motion.div
      className="absolute left-[11px] sm:left-[13px] top-0 w-0.5 h-full bg-accent-primary/30 origin-top will-change-transform pointer-events-none"
      style={{
        scaleY,
        transform: 'translateZ(0)',
      }}
      aria-hidden="true"
    />
  )
}

/**
 * Timeline - A vertical career timeline component with scroll animations
 *
 * Displays career events (work experience and education) in chronological order
 * with Framer Motion animations triggered on scroll. Each event type has
 * distinct visual styling for easy differentiation.
 *
 * Features:
 * - Responsive vertical timeline layout
 * - Scroll-triggered animations using useInView
 * - Staggered animation sequence (events appear sequentially)
 * - Progressive line drawing as you scroll
 * - Milestone markers animate with scale effect
 * - GPU-accelerated animations (transform, opacity only) for 60fps
 * - Respects prefers-reduced-motion for accessibility
 * - Visual differentiation between education (blue) and work (green)
 * - Current/ongoing event indicator with pulse animation
 * - Hover effects on event cards
 * - Dark mode support
 * - Semantic HTML structure for accessibility
 *
 * Usage:
 * ```tsx
 * // With default events
 * <Timeline />
 *
 * // With custom events
 * <Timeline events={customEvents} />
 *
 * // With additional styling
 * <Timeline className="mt-8" />
 * ```
 *
 * Accessibility:
 * - Uses semantic HTML (section, heading levels)
 * - Decorative elements marked with aria-hidden
 * - Logical reading order matches visual order
 * - Color is not the only differentiator (icons used)
 * - Respects prefers-reduced-motion system preference
 */
export function Timeline({ events = defaultEvents, className = '' }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  // Respect user's reduced motion preference
  const prefersReducedMotion = useReducedMotion() ?? false

  // Check if header is in view for initial animations
  const isHeaderInView = useInView(headerRef, {
    once: true,
    amount: 0.5,
  })

  // Header animation variants
  const headerVariants: Variants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.01 : 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const legendVariants: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0.01 : 0.5,
        delay: prefersReducedMotion ? 0 : 0.2,
      },
    },
  }

  return (
    <section
      className={`relative ${className}`}
      aria-label="Career Timeline"
      data-testid="timeline-component"
    >
      {/* Section header */}
      <motion.div
        ref={headerRef}
        variants={headerVariants}
        initial="hidden"
        animate={isHeaderInView ? 'visible' : 'hidden'}
        className="mb-6 sm:mb-8"
      >
        <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-text-primary dark:text-text-dark-primary">
          Career Journey
        </h2>
        <p className="mt-2 text-sm sm:text-base text-text-secondary dark:text-text-dark-secondary">
          My professional path through technology and education
        </p>
      </motion.div>

      {/* Legend */}
      <motion.div
        variants={legendVariants}
        initial="hidden"
        animate={isHeaderInView ? 'visible' : 'hidden'}
        className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8"
        aria-label="Timeline legend"
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-accent-primary"
            aria-hidden="true"
          />
          <span className="text-xs sm:text-sm text-text-secondary dark:text-text-dark-secondary">
            Education
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-accent-success dark:bg-accent-success-dark"
            aria-hidden="true"
          />
          <span className="text-xs sm:text-sm text-text-secondary dark:text-text-dark-secondary">
            Work Experience
          </span>
        </div>
      </motion.div>

      {/* Timeline events container */}
      <div ref={containerRef} className="relative">
        {/* Progressive scroll-linked line overlay */}
        <ProgressLine
          containerRef={containerRef}
          prefersReducedMotion={prefersReducedMotion}
        />

        {/* Individual timeline items with scroll-triggered animations */}
        {events.map((event, index) => (
          <TimelineItem
            key={event.id}
            event={event}
            index={index}
            isLast={index === events.length - 1}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>
    </section>
  )
}

export default Timeline
