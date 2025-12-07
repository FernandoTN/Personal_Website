'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { BlogPostCard, type BlogPost } from '@/components/ui/BlogPostCard'

/**
 * Sample blog posts for the AI Agents series
 * These will be replaced with dynamic data from CMS/database
 */
const samplePosts: BlogPost[] = [
  {
    slug: 'the-eight-pillars-of-ai-agent-systems',
    title: 'The Eight Pillars of AI Agent Systems',
    excerpt:
      'A comprehensive framework for understanding and building effective AI agents. From context management to tool orchestration, these eight pillars form the foundation of robust agentic systems.',
    publishedAt: '2024-11-15',
    category: 'Anchor',
    readingTime: 12,
    featured: true,
  },
  {
    slug: 'why-90-percent-of-ai-pilots-fail',
    title: 'Why 90% of AI Pilots Fail',
    excerpt:
      'Most enterprise AI initiatives never make it past the pilot phase. The reasons are rarely technical. Understanding organizational dynamics, change management, and realistic expectations is key to success.',
    publishedAt: '2024-11-08',
    category: 'Theme',
    readingTime: 8,
  },
  {
    slug: 'context-management-the-hidden-challenge',
    title: 'Context Management: The Hidden Challenge',
    excerpt:
      'The context window is both the greatest strength and biggest limitation of modern LLMs. Learn strategies for effective context management that separate production-ready agents from demos.',
    publishedAt: '2024-11-01',
    category: 'Emergent',
    readingTime: 10,
  },
]

interface LatestPostsProps {
  /** Override default posts (useful for testing or CMS integration) */
  posts?: BlogPost[]
  /** Maximum number of posts to display */
  maxPosts?: number
  /** Additional CSS classes */
  className?: string
}

/**
 * Container animation variants for staggered children
 */
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

/**
 * Heading animation variants
 */
const headingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
}

/**
 * LatestPosts component displays recent blog posts on the homepage.
 *
 * Features:
 * - Section heading with "View All" link
 * - Grid of BlogPostCard components
 * - Staggered reveal animations with Framer Motion
 * - Responsive layout (1 column mobile, 2 tablet, 3 desktop)
 * - AI Agents series posts featured by default
 *
 * Usage:
 * ```tsx
 * // Default usage with sample posts
 * <LatestPosts />
 *
 * // With custom posts
 * <LatestPosts posts={myPosts} maxPosts={4} />
 * ```
 *
 * Accessibility:
 * - Uses semantic section element with aria-labelledby
 * - Proper heading hierarchy (h2)
 * - Keyboard navigation support
 * - Reduced motion support via Framer Motion
 */
export function LatestPosts({
  posts = samplePosts,
  maxPosts = 3,
  className = '',
}: LatestPostsProps) {
  const displayPosts = posts.slice(0, maxPosts)

  return (
    <section
      className={`py-16 sm:py-20 lg:py-24 ${className}`}
      aria-labelledby="latest-posts-heading"
    >
      <div className="container-wide">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Section header */}
          <motion.div
            variants={headingVariants}
            className="mb-10 sm:mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
          >
            <div>
              <h2
                id="latest-posts-heading"
                className="
                  font-heading text-3xl sm:text-4xl font-bold
                  text-text-primary dark:text-text-dark-primary
                "
              >
                Latest from the Blog
              </h2>
              <p className="
                mt-2 text-lg text-text-secondary dark:text-text-dark-secondary
                max-w-2xl
              ">
                Exploring AI agents, enterprise technology, and the future of work.
              </p>
            </div>

            {/* View all link */}
            <Link
              href="/blog"
              className="
                inline-flex items-center gap-2
                text-sm font-medium text-accent-primary
                hover:text-accent-primary/80
                transition-colors duration-200
                group
              "
            >
              View all posts
              <ArrowRight
                className="
                  h-4 w-4
                  group-hover:translate-x-1
                  transition-transform duration-200
                "
                aria-hidden="true"
              />
            </Link>
          </motion.div>

          {/* Posts grid */}
          <div className="
            grid gap-6 sm:gap-8
            grid-cols-1 md:grid-cols-2 lg:grid-cols-3
          ">
            {displayPosts.map((post, index) => (
              <BlogPostCard
                key={post.slug}
                post={post}
                animationDelay={index * 0.15}
              />
            ))}
          </div>

          {/* Mobile "View all" button */}
          <motion.div
            variants={headingVariants}
            className="mt-10 text-center sm:hidden"
          >
            <Link
              href="/blog"
              className="
                btn-outline px-6 py-3
                inline-flex items-center gap-2
              "
            >
              View all posts
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default LatestPosts
