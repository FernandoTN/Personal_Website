'use client'

import { useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AccordionItemProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export interface AccordionProps {
  children: ReactNode
}

/**
 * AccordionItem Component
 *
 * Individual collapsible section within an Accordion.
 */
export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return (
    <div className="border-b border-border-light dark:border-border-dark last:border-b-0">
      {/* Header button */}
      <button
        onClick={toggle}
        className={cn(
          'w-full flex items-center justify-between py-4 px-4 text-left',
          'text-text-primary dark:text-text-dark-primary font-medium',
          'hover:bg-light-neutral-grey/50 dark:hover:bg-dark-deep-blue/50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-inset',
          'transition-colors duration-200'
        )}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <span>{title}</span>
        <motion.div
          initial={false}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-text-muted dark:text-text-dark-muted" aria-hidden="true" />
        </motion.div>
      </button>

      {/* Content panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`accordion-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-text-secondary dark:text-text-dark-secondary [&>p]:mb-2 [&>p:last-child]:mb-0">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Accordion Component for MDX
 *
 * Container for collapsible AccordionItem sections.
 *
 * Features:
 * - Smooth open/close animations using framer-motion
 * - Multiple items work independently
 * - Keyboard accessible (Enter/Space to toggle)
 * - Visual rotation animation on chevron icon
 * - Dark mode support
 *
 * Usage in MDX:
 * ```mdx
 * <Accordion>
 *   <AccordionItem title="Section 1">
 *     Content for section 1...
 *   </AccordionItem>
 *   <AccordionItem title="Section 2" defaultOpen>
 *     Content for section 2 (starts open)...
 *   </AccordionItem>
 * </Accordion>
 * ```
 */
export function Accordion({ children }: AccordionProps) {
  return (
    <div className="my-6 rounded-lg border border-border-light dark:border-border-dark bg-light-panel dark:bg-dark-panel overflow-hidden">
      {children}
    </div>
  )
}

export default Accordion
