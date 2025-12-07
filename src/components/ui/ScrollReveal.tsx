'use client'

import { useRef, ReactNode } from 'react'
import { motion, useInView, Variants, HTMLMotionProps } from 'framer-motion'

/**
 * Animation variant types for ScrollReveal
 */
export type AnimationVariant = 'fadeUp' | 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'scaleUp'

/**
 * Props interface for ScrollReveal component
 */
export interface ScrollRevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  /** Content to animate */
  children: ReactNode
  /** Animation variant to use */
  variant?: AnimationVariant
  /** Animation duration in seconds */
  duration?: number
  /** Animation delay in seconds */
  delay?: number
  /** Percentage of element that must be visible to trigger (0-1) */
  threshold?: number
  /** Only animate once (default: true) */
  once?: boolean
  /** Additional CSS classes */
  className?: string
  /** Enable staggered children animations */
  staggerChildren?: boolean
  /** Delay between staggered children in seconds */
  staggerDelay?: number
  /** Custom tag to render as (for semantic HTML) */
  as?: 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'main'
}

/**
 * Animation variants configuration
 * Each variant defines hidden and visible states
 */
const animationVariants: Record<AnimationVariant, Variants> = {
  fadeUp: {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  },
  fadeIn: {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  },
  slideInLeft: {
    hidden: {
      opacity: 0,
      x: -60,
    },
    visible: {
      opacity: 1,
      x: 0,
    },
  },
  slideInRight: {
    hidden: {
      opacity: 0,
      x: 60,
    },
    visible: {
      opacity: 1,
      x: 0,
    },
  },
  scaleUp: {
    hidden: {
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      scale: 1,
    },
  },
}

/**
 * Container variants for staggered children
 */
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

/**
 * ScrollReveal - A reusable scroll-triggered animation wrapper component
 *
 * Uses Framer Motion's useInView hook to detect when elements enter the viewport
 * and triggers smooth reveal animations. Supports multiple animation variants
 * and staggered children animations.
 *
 * Features:
 * - Multiple animation variants (fadeUp, fadeIn, slideInLeft, slideInRight, scaleUp)
 * - Once-only animations to prevent re-triggering on scroll back
 * - Configurable visibility threshold (default: 20%)
 * - Staggered children support for lists/grids
 * - Semantic HTML support via 'as' prop
 * - Full accessibility - animations are purely visual, content is always accessible
 *
 * Usage examples:
 *
 * // Basic fade up animation
 * <ScrollReveal>
 *   <h2>Section Title</h2>
 * </ScrollReveal>
 *
 * // Slide in from left with delay
 * <ScrollReveal variant="slideInLeft" delay={0.2}>
 *   <Card />
 * </ScrollReveal>
 *
 * // Staggered children for a list
 * <ScrollReveal staggerChildren staggerDelay={0.15}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </ScrollReveal>
 *
 * // As a semantic section element
 * <ScrollReveal as="section" variant="fadeIn">
 *   <article>Content here</article>
 * </ScrollReveal>
 *
 * Accessibility:
 * - Uses motion.div which renders as standard HTML
 * - Animations are CSS transforms, no content is hidden from screen readers
 * - Respects prefers-reduced-motion via Framer Motion defaults
 */
export function ScrollReveal({
  children,
  variant = 'fadeUp',
  duration = 0.6,
  delay = 0,
  threshold = 0.2,
  once = true,
  className = '',
  staggerChildren = false,
  staggerDelay = 0.1,
  as = 'div',
  ...motionProps
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    once,
    amount: threshold,
  })

  // Get the base animation variant
  const selectedVariant = animationVariants[variant]

  // Create custom transition with user-provided duration and delay
  const transition = {
    duration,
    delay,
    ease: [0.25, 0.1, 0.25, 1], // Custom cubic bezier for smooth easing
  }

  // For staggered children, we use container variants
  const variants = staggerChildren
    ? {
        hidden: {
          ...selectedVariant.hidden,
        },
        visible: {
          ...selectedVariant.visible,
          transition: {
            ...transition,
            staggerChildren: staggerDelay,
          },
        },
      }
    : selectedVariant

  // Create the motion component based on the 'as' prop
  const MotionComponent = motion[as] as typeof motion.div

  return (
    <MotionComponent
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={!staggerChildren ? transition : undefined}
      className={className}
      {...motionProps}
    >
      {children}
    </MotionComponent>
  )
}

/**
 * ScrollRevealItem - Child component for staggered animations
 *
 * Use this component as a direct child of ScrollReveal when using staggerChildren.
 * Each item will animate in sequence with the configured stagger delay.
 *
 * Usage:
 * <ScrollReveal staggerChildren variant="fadeUp">
 *   <ScrollRevealItem>First item</ScrollRevealItem>
 *   <ScrollRevealItem>Second item</ScrollRevealItem>
 *   <ScrollRevealItem>Third item</ScrollRevealItem>
 * </ScrollReveal>
 */
export interface ScrollRevealItemProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  /** Animation variant (inherits parent if not specified) */
  variant?: AnimationVariant
  /** Additional CSS classes */
  className?: string
  /** Duration for this item's animation */
  duration?: number
}

export function ScrollRevealItem({
  children,
  variant = 'fadeUp',
  className = '',
  duration = 0.5,
  ...motionProps
}: ScrollRevealItemProps) {
  const selectedVariant = animationVariants[variant]

  return (
    <motion.div
      variants={selectedVariant}
      transition={{
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}

export default ScrollReveal
