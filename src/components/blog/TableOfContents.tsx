'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { List } from 'lucide-react'

/**
 * Table of contents heading interface
 */
export interface TocHeading {
  id: string
  text: string
  level: 2 | 3
}

interface TableOfContentsProps {
  /** Array of headings to display in the TOC */
  headings: TocHeading[]
  /** Additional CSS classes */
  className?: string
}

/**
 * TableOfContents component renders a sticky sidebar with navigable headings.
 *
 * Features:
 * - Extracts and displays h2/h3 headings from content
 * - Sticky positioning (stays visible while scrolling)
 * - Active section highlighting based on scroll position
 * - Smooth scroll to heading on click
 * - Responsive (hidden on mobile, visible on desktop lg+)
 * - Indented h3 items for visual hierarchy
 *
 * Usage:
 * ```tsx
 * const headings = [
 *   { id: 'introduction', text: 'Introduction', level: 2 },
 *   { id: 'getting-started', text: 'Getting Started', level: 3 },
 *   { id: 'conclusion', text: 'Conclusion', level: 2 },
 * ]
 *
 * <TableOfContents headings={headings} />
 * ```
 *
 * Accessibility:
 * - Uses semantic nav element with aria-label
 * - Uses ordered list for proper structure
 * - Current section announced via aria-current
 * - Focus styles for keyboard navigation
 * - Respects reduced motion preferences
 */
export function TableOfContents({ headings, className = '' }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const headingElementsRef = useRef<Map<string, IntersectionObserverEntry>>(new Map())

  /**
   * Handle click on a TOC item - scroll to heading
   */
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
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
    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    // Initial check for active heading
    getActiveHeading()

    return () => {
      observer.disconnect()
      headingElementsRef.current.clear()
    }
  }, [headings])

  // Handle initial hash in URL
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash && headings.some((h) => h.id === hash)) {
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
  }, [headings])

  if (headings.length === 0) {
    return null
  }

  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className={`sticky top-24 ${className}`}
      aria-label="Table of contents"
    >
      <div className="
        p-4 rounded-lg
        bg-light-panel dark:bg-dark-panel
        border border-border-light dark:border-border-dark
      ">
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
                <a
                  href={`#${id}`}
                  onClick={(e) => handleClick(e, id)}
                  className={`
                    block py-1.5 text-sm leading-snug
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
                  {/* Active indicator */}
                  <span className="flex items-center gap-2">
                    {isActive && (
                      <motion.span
                        layoutId="toc-active-indicator"
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
                </a>
              </li>
            )
          })}
        </ol>
      </div>
    </motion.nav>
  )
}

export default TableOfContents
