'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

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
      ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth animation
    },
  },
}

// GPU acceleration style hints for smoother animations
// Using transform: translateZ(0) or translate3d(0,0,0) forces GPU layer creation
// will-change hints to browser for optimization
// backfaceVisibility: hidden creates composite layer for smoother animations
const gpuAcceleratedStyle = {
  willChange: 'transform, opacity',
  backfaceVisibility: 'hidden' as const,
  perspective: 1000,
  transform: 'translateZ(0)', // Force GPU layer creation
}

const buttonContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.6,
    },
  },
}

const buttonVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

/**
 * Hero Section Component
 *
 * Displays the main hero section with:
 * - Author name with gradient text
 * - Subtitle (MSx '26, Stanford GSB)
 * - Tagline about technology/healthcare/AI
 * - Two CTA buttons with staggered animations
 *
 * Uses Framer Motion for entrance animations with fade-in and slide-up effects.
 * Fully responsive and accessible.
 */
export default function Hero() {
  return (
    <section
      className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 sm:px-6 lg:px-8"
      aria-labelledby="hero-heading"
    >
      {/* Background gradient accent */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-accent-primary/5 blur-3xl dark:bg-accent-primary/10" />
        <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-accent-secondary/5 blur-3xl dark:bg-accent-secondary/10" />
      </div>

      <motion.div
        className="relative z-10 mx-auto max-w-4xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={gpuAcceleratedStyle}
      >
        {/* Main Heading - Author Name */}
        <motion.h1
          id="hero-heading"
          className="font-heading text-4xl font-bold tracking-tight text-text-primary dark:text-text-dark-primary sm:text-5xl md:text-6xl lg:text-7xl"
          variants={itemVariants}
        >
          Fernando Torres
        </motion.h1>

        {/* Subtitle - Education */}
        <motion.p
          className="mt-4 text-xl font-medium text-accent-primary sm:text-2xl"
          variants={itemVariants}
        >
          MSx &apos;26, Stanford GSB
        </motion.p>

        {/* Tagline - Focus Areas */}
        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary dark:text-text-dark-secondary sm:text-xl"
          variants={itemVariants}
        >
          Building at the intersection of{' '}
          <span className="font-semibold text-text-primary dark:text-text-dark-primary">
            technology
          </span>{' '}
          and{' '}
          <span className="font-semibold text-text-primary dark:text-text-dark-primary">
            healthcare
          </span>
          . Exploring{' '}
          <span className="text-gradient font-semibold">AI agents</span> and
          their potential to transform enterprise workflows.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          variants={buttonContainerVariants}
          initial="hidden"
          animate="visible"
          style={gpuAcceleratedStyle}
        >
          <motion.div variants={buttonVariants} style={gpuAcceleratedStyle}>
            <Link
              href="/projects"
              className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-base font-semibold shadow-lg transition-all duration-300 hover:shadow-glow sm:text-lg"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              View Projects
            </Link>
          </motion.div>

          <motion.div variants={buttonVariants} style={gpuAcceleratedStyle}>
            <Link
              href="/research"
              className="btn-outline inline-flex items-center gap-2 px-8 py-3 text-base font-semibold transition-all duration-300 sm:text-lg"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Read Research
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={gpuAcceleratedStyle}
        >
          <motion.div
            className="flex flex-col items-center gap-2 text-text-muted dark:text-text-dark-muted"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={gpuAcceleratedStyle}
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
