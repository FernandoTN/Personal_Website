'use client'

import { LazyMotion, domAnimation } from 'framer-motion'
import { ReactNode } from 'react'

/**
 * Motion Provider with LazyMotion
 *
 * This provider uses LazyMotion with domAnimation feature set which includes:
 * - Basic animations (opacity, scale, x, y, etc.)
 * - Variants
 * - AnimatePresence
 * - whileHover, whileTap, whileFocus
 * - whileInView (scroll animations)
 *
 * This reduces the framer-motion bundle from ~100KB to ~15KB!
 *
 * The full feature set (domMax) would add:
 * - Layout animations
 * - Drag
 * - Path animations
 *
 * Usage:
 * Wrap your app or specific routes with this provider, then use `m` instead of `motion`:
 *
 * ```tsx
 * import { m } from 'framer-motion'
 *
 * <m.div animate={{ opacity: 1 }} />
 * ```
 */
interface MotionProviderProps {
  children: ReactNode
}

export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  )
}

export default MotionProvider
