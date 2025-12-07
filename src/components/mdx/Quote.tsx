'use client'

import { ReactNode } from 'react'
import { Quote as QuoteIcon } from 'lucide-react'

export interface QuoteProps {
  author?: string
  source?: string
  children: ReactNode
}

/**
 * Quote Component for MDX
 *
 * Displays styled blockquotes with optional attribution.
 *
 * Features:
 * - Large decorative quote icon
 * - Italic text styling
 * - Author and source attribution line
 * - Dark mode support
 * - Accessible with proper HTML structure
 *
 * Usage in MDX:
 * ```mdx
 * <Quote author="Steve Jobs" source="Stanford Commencement, 2005">
 *   Stay hungry, stay foolish.
 * </Quote>
 * ```
 */
export function Quote({ author, source, children }: QuoteProps) {
  const hasAttribution = author || source

  return (
    <figure className="my-8">
      <blockquote className="relative pl-8 pr-4 py-4 border-l-4 border-accent-primary/30 dark:border-accent-primary/50 bg-light-panel/50 dark:bg-dark-panel/50 rounded-r-lg">
        {/* Decorative quote icon */}
        <QuoteIcon
          className="absolute top-4 left-2 h-5 w-5 text-accent-primary/40 dark:text-accent-primary/60"
          aria-hidden="true"
        />

        {/* Quote content */}
        <div className="text-lg italic text-text-secondary dark:text-text-dark-secondary leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0">
          {children}
        </div>
      </blockquote>

      {/* Attribution */}
      {hasAttribution && (
        <figcaption className="mt-3 pl-8 text-sm text-text-muted dark:text-text-dark-muted">
          <span className="font-medium text-text-primary dark:text-text-dark-primary">
            {author}
          </span>
          {author && source && <span className="mx-1">-</span>}
          {source && <cite className="not-italic">{source}</cite>}
        </figcaption>
      )}
    </figure>
  )
}

export default Quote
