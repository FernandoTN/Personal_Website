'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

/**
 * Category types for blog posts in the AI Agents series
 */
export type PostCategory = 'Anchor' | 'Theme' | 'Emergent' | 'Practitioner' | 'Prototype' | 'Conference' | 'Meta' | 'General'

/**
 * Post status types for publication workflow
 */
export type PostStatus = 'published' | 'scheduled' | 'draft'

/**
 * Blog post data interface
 */
export interface BlogPost {
  /** Unique identifier / URL slug */
  slug: string
  /** Post title */
  title: string
  /** Short excerpt (2-3 sentences) */
  excerpt: string
  /** Publication date in ISO format */
  publishedAt: string
  /** Category tag */
  category: PostCategory
  /** Estimated reading time in minutes */
  readingTime: number
  /** Whether this post is featured */
  featured?: boolean
  /** Tags for filtering and categorization */
  tags?: string[]
  /** Post status - defaults to 'published' if not specified */
  status?: PostStatus
}

interface BlogPostCardProps {
  /** Blog post data */
  post: BlogPost
  /** Optional animation delay for stagger effect (in seconds) */
  animationDelay?: number
  /** Additional CSS classes */
  className?: string
}

/**
 * Category badge color mapping
 */
const categoryStyles: Record<PostCategory, string> = {
  Anchor: 'bg-accent-primary/10 text-accent-primary',
  Theme: 'bg-category-research/10 text-category-research',
  Emergent: 'bg-category-pharma/10 text-category-pharma',
  Practitioner: 'bg-accent-secondary/10 text-accent-secondary dark:text-accent-secondary-dark',
  Prototype: 'bg-accent-success/10 text-accent-success dark:text-accent-success-dark',
  Conference: 'bg-accent-warning/10 text-accent-warning dark:text-accent-warning-dark',
  Meta: 'bg-accent-secondary/10 text-accent-secondary dark:text-accent-secondary-dark',
  General: 'bg-light-neutral-grey text-text-secondary dark:bg-dark-panel dark:text-text-dark-secondary',
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * BlogPostCard component displays a preview of a blog post.
 *
 * Features:
 * - Title, excerpt, and metadata display
 * - Category badge with color coding
 * - Reading time estimate
 * - Publication date
 * - Hover animations
 * - Link to full post
 *
 * Usage:
 * ```tsx
 * <BlogPostCard
 *   post={{
 *     slug: 'my-post',
 *     title: 'My Post Title',
 *     excerpt: 'A short description...',
 *     publishedAt: '2024-01-15',
 *     category: 'Theme',
 *     readingTime: 5,
 *   }}
 *   animationDelay={0.1}
 * />
 * ```
 *
 * Accessibility:
 * - Uses semantic article element
 * - Link covers entire card for easier clicking
 * - Icons have aria-hidden for screen readers
 * - Focus styles visible for keyboard navigation
 */
export function BlogPostCard({
  post,
  animationDelay = 0,
  className = '',
}: BlogPostCardProps) {
  const { slug, title, excerpt, publishedAt, category, readingTime, featured } = post

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: animationDelay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={`group relative ${className}`}
    >
      <Link
        href={`/blog/${slug}`}
        className="
          block h-full
          rounded-lg border border-border-light bg-light-base p-6
          shadow-light transition-all duration-300
          hover:shadow-lg hover:-translate-y-1
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-accent-primary focus-visible:ring-offset-2
          dark:border-border-dark dark:bg-dark-panel dark:shadow-none
          dark:hover:shadow-glow dark:hover:border-accent-primary/30
        "
        aria-label={`Read article: ${title}`}
      >
        {/* Featured badge */}
        {featured && (
          <div className="absolute -top-2 -right-2">
            <span className="
              inline-flex items-center rounded-full
              bg-accent-primary px-2.5 py-0.5
              text-xs font-semibold text-white
              shadow-md
            ">
              Featured
            </span>
          </div>
        )}

        {/* Category badge */}
        <div className="mb-3">
          <span
            className={`
              inline-flex items-center rounded-full
              px-2.5 py-0.5 text-xs font-medium
              ${categoryStyles[category]}
            `}
          >
            {category}
          </span>
        </div>

        {/* Title */}
        <h3 className="
          mb-2 font-heading text-lg font-semibold
          text-text-primary dark:text-text-dark-primary
          group-hover:text-accent-primary
          transition-colors duration-200
          line-clamp-2
        ">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="
          mb-4 text-sm text-text-secondary dark:text-text-dark-secondary
          line-clamp-3
        ">
          {excerpt}
        </p>

        {/* Metadata row */}
        <div className="
          flex items-center justify-between
          text-xs text-text-muted dark:text-text-dark-muted
        ">
          <div className="flex items-center gap-4">
            {/* Date */}
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
            </span>

            {/* Reading time */}
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{readingTime} min read</span>
            </span>
          </div>

          {/* Arrow indicator */}
          <ArrowRight
            className="
              h-4 w-4 text-text-muted dark:text-text-dark-muted
              group-hover:text-accent-primary
              group-hover:translate-x-1
              transition-all duration-200
            "
            aria-hidden="true"
          />
        </div>
      </Link>
    </motion.article>
  )
}

export default BlogPostCard
