'use client'

import { motion } from 'framer-motion'

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

/**
 * ProfilePhoto - SVG placeholder for the author's profile photo
 * Uses a gradient background with initials
 */
function ProfilePhoto() {
  return (
    <div className="relative">
      {/* Decorative ring */}
      <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary opacity-20 blur-lg" />

      {/* Photo container */}
      <motion.div
        className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-light-base shadow-xl dark:border-dark-panel sm:h-56 sm:w-56 md:h-64 md:w-64"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* SVG Placeholder with initials */}
        <svg
          viewBox="0 0 200 200"
          className="h-full w-full"
          aria-label="Fernando Torres profile photo placeholder"
        >
          {/* Gradient background */}
          <defs>
            <linearGradient id="profileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill="url(#profileGradient)" />

          {/* Initials */}
          <text
            x="100"
            y="115"
            textAnchor="middle"
            fill="white"
            fontSize="64"
            fontWeight="bold"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            FT
          </text>
        </svg>
      </motion.div>
    </div>
  )
}

/**
 * AboutHero Component
 *
 * Displays the main hero section of the About page with:
 * - Large author name with gradient text option
 * - Subtitle showing current education/position
 * - Profile photo (SVG placeholder)
 * - Bio text describing background and interests
 *
 * Uses Framer Motion for entrance animations with fade-in and slide-up effects.
 * Fully responsive and accessible.
 *
 * Usage:
 * <AboutHero />
 */
export default function AboutHero() {
  return (
    <section
      className="relative py-16 md:py-24"
      aria-labelledby="about-heading"
    >
      {/* Background gradient accent */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-40 right-0 h-[400px] w-[400px] rounded-full bg-accent-primary/5 blur-3xl dark:bg-accent-primary/10" />
        <div className="absolute -bottom-20 left-0 h-[300px] w-[300px] rounded-full bg-accent-secondary/5 blur-3xl dark:bg-accent-secondary/10" />
      </div>

      <motion.div
        className="relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero content - two column layout on larger screens */}
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-16">
          {/* Photo column */}
          <div className="flex-shrink-0">
            <ProfilePhoto />
          </div>

          {/* Text column */}
          <div className="flex-1 text-center md:text-left">
            {/* Main Heading - Author Name */}
            <motion.h1
              id="about-heading"
              className="font-heading text-4xl font-bold tracking-tight text-text-primary dark:text-text-dark-primary sm:text-5xl lg:text-6xl"
              variants={itemVariants}
            >
              Fernando Torres
            </motion.h1>

            {/* Subtitle - Education */}
            <motion.p
              className="mt-3 text-xl font-medium text-accent-primary sm:text-2xl"
              variants={itemVariants}
            >
              MSx &apos;26, Stanford GSB
            </motion.p>

            {/* Bio text */}
            <motion.div
              className="mt-6 space-y-4 text-lg leading-relaxed text-text-secondary dark:text-text-dark-secondary"
              variants={itemVariants}
            >
              <p>
                I build at the intersection of{' '}
                <span className="font-semibold text-text-primary dark:text-text-dark-primary">
                  technology
                </span>{' '}
                and{' '}
                <span className="font-semibold text-text-primary dark:text-text-dark-primary">
                  healthcare
                </span>
                , with a particular focus on how AI agents can transform enterprise workflows
                in regulated industries.
              </p>
              <p>
                My background spans{' '}
                <span className="font-semibold text-text-primary dark:text-text-dark-primary">
                  pharmaceutical operations
                </span>
                ,{' '}
                <span className="font-semibold text-text-primary dark:text-text-dark-primary">
                  supply chain optimization
                </span>
                , and{' '}
                <span className="font-semibold text-text-primary dark:text-text-dark-primary">
                  software engineering
                </span>
                . I&apos;m passionate about leveraging emerging technologies to solve
                complex problems in healthcare delivery and patient outcomes.
              </p>
              <p>
                Currently pursuing my MSx at Stanford Graduate School of Business, where
                I&apos;m exploring the strategic implications of{' '}
                <span className="text-gradient font-semibold">AI agents</span> and
                autonomous systems for enterprise transformation.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
