'use client'

import { motion, Variants } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

/**
 * Skill category configuration
 */
interface SkillCategory {
  title: string
  skills: string[]
  colorScheme: {
    bg: string
    bgDark: string
    text: string
    textDark: string
    border: string
    borderDark: string
    icon: string
  }
  icon: React.ReactNode
}

/**
 * Technical skills icon - code/brackets
 */
function TechnicalIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />
    </svg>
  )
}

/**
 * Domain skills icon - building/industry
 */
function DomainIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  )
}

/**
 * Leadership skills icon - users/team
 */
function LeadershipIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  )
}

/**
 * Skill categories data
 */
const skillCategories: SkillCategory[] = [
  {
    title: 'Technical Skills',
    skills: [
      'Python',
      'TypeScript',
      'R',
      'SQL',
      'Machine Learning Workflows',
      'Agentic System Design',
      'REST/gRPC',
      'Kubernetes',
      'Next.js',
      'Cloud Infrastructure',
    ],
    colorScheme: {
      bg: 'bg-blue-50',
      bgDark: 'dark:bg-blue-950/30',
      text: 'text-blue-700',
      textDark: 'dark:text-blue-300',
      border: 'border-blue-200',
      borderDark: 'dark:border-blue-800',
      icon: 'text-accent-primary',
    },
    icon: <TechnicalIcon />,
  },
  {
    title: 'Domain Expertise',
    skills: [
      'Pharmaceutical BD',
      'Healthcare Operations',
      'Supply Chain Optimization',
      'Enterprise AI Adoption',
      'Context Management',
      'Licensing Negotiations',
    ],
    colorScheme: {
      bg: 'bg-emerald-50',
      bgDark: 'dark:bg-emerald-950/30',
      text: 'text-emerald-700',
      textDark: 'dark:text-emerald-300',
      border: 'border-emerald-200',
      borderDark: 'dark:border-emerald-800',
      icon: 'text-accent-success',
    },
    icon: <DomainIcon />,
  },
  {
    title: 'Leadership Skills',
    skills: [
      'Strategic Negotiation',
      'Cross-functional Leadership',
      'Deal Execution',
      'Enterprise Stakeholder Mgmt',
      'Founder-driven Execution',
      'Product Thinking',
    ],
    colorScheme: {
      bg: 'bg-purple-50',
      bgDark: 'dark:bg-purple-950/30',
      text: 'text-purple-700',
      textDark: 'dark:text-purple-300',
      border: 'border-purple-200',
      borderDark: 'dark:border-purple-800',
      icon: 'text-category-research',
    },
    icon: <LeadershipIcon />,
  },
]

/**
 * Animation variants for container
 */
const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

/**
 * Animation variants for skill category cards
 */
const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

/**
 * Animation variants for individual skill tags
 */
const skillTagVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

/**
 * Props interface for Skills component
 */
export interface SkillsProps {
  /** Optional className for additional styling */
  className?: string
}

/**
 * Skills - A visual skill categories component for the About page
 *
 * Displays three skill categories (Technical, Domain, Leadership) with
 * animated skill tags/badges. Uses Framer Motion for staggered reveal
 * animations and is fully responsive.
 *
 * Features:
 * - Three distinct skill categories with category-specific colors
 * - Staggered reveal animations using Framer Motion
 * - Responsive grid layout (1 column on mobile, 3 on desktop)
 * - Accessible with proper ARIA labels and semantic HTML
 * - Dark mode support
 *
 * Usage:
 * ```tsx
 * // Basic usage
 * <Skills />
 *
 * // With custom className
 * <Skills className="mt-16" />
 * ```
 *
 * Accessibility:
 * - Uses semantic section and heading elements
 * - Icons are decorative and hidden from screen readers
 * - Color is not the only indicator (text labels are present)
 * - Supports reduced motion preferences via Framer Motion
 */
export function Skills({ className = '' }: SkillsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      ref={ref}
      className={`py-12 ${className}`}
      aria-labelledby="skills-heading"
    >
      <motion.h2
        id="skills-heading"
        className="font-heading text-2xl md:text-3xl font-bold mb-8 text-text-primary dark:text-text-dark-primary"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        Skills & Expertise
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {skillCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.title}
            variants={cardVariants}
            className={`
              rounded-xl p-6 border
              ${category.colorScheme.bg} ${category.colorScheme.bgDark}
              ${category.colorScheme.border} ${category.colorScheme.borderDark}
              transition-shadow duration-300
              hover:shadow-lg dark:hover:shadow-glow
            `}
          >
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`
                  flex items-center justify-center
                  w-10 h-10 rounded-lg
                  bg-white/80 dark:bg-dark-panel/80
                  ${category.colorScheme.icon}
                `}
                aria-hidden="true"
              >
                {category.icon}
              </span>
              <h3
                className={`
                  font-heading font-semibold text-lg
                  ${category.colorScheme.text} ${category.colorScheme.textDark}
                `}
              >
                {category.title}
              </h3>
            </div>

            {/* Skill Tags */}
            <div
              className="flex flex-wrap gap-2"
              role="list"
              aria-label={`${category.title} list`}
            >
              {category.skills.map((skill, skillIndex) => (
                <motion.span
                  key={skill}
                  variants={skillTagVariants}
                  className={`
                    inline-flex items-center
                    px-3 py-1.5 rounded-full
                    text-sm font-medium
                    bg-white/90 dark:bg-dark-base/60
                    ${category.colorScheme.text} ${category.colorScheme.textDark}
                    border ${category.colorScheme.border} ${category.colorScheme.borderDark}
                    hover:scale-105 transition-transform duration-200
                  `}
                  role="listitem"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default Skills
