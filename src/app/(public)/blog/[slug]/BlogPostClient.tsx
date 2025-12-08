'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useSpring } from 'framer-motion'
import {
  Calendar,
  Clock,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Share2,
  Link2,
  User,
  Check,
  BookOpen,
  Bell
} from 'lucide-react'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { CommentsSection } from '@/components/blog/CommentsSection'

/**
 * Types for table of contents headings
 */
export interface TocHeading {
  id: string
  text: string
  level: 2 | 3
}

/**
 * API Post response interface
 */
interface ApiPostResponse {
  success: boolean
  isScheduled: boolean
  post: {
    id?: string
    slug: string
    title: string
    excerpt: string | null
    content?: string
    featuredImage?: string | null
    ogImage?: string | null
    category: string | null
    author?: string
    publishedAt?: string | null
    scheduledFor?: string | null
    readingTimeMinutes?: number | null
    viewCount?: number
    metaTitle?: string | null
    metaDescription?: string | null
    tags?: Array<{
      tag: {
        slug: string
        name: string
      }
    }>
    series?: {
      id: string
      slug: string
      name: string
      description?: string | null
    } | null
    seriesNavigation?: {
      name: string
      current: number
      total: number
      prevSlug: string | null
      prevTitle: string | null
      prevCategory: string | null
      nextSlug: string | null
      nextTitle: string | null
      nextCategory: string | null
    } | null
  }
  error?: string
}

/**
 * Category badge color mapping
 */
const categoryStyles: Record<string, string> = {
  ANCHOR: 'bg-accent-primary/10 text-accent-primary',
  Anchor: 'bg-accent-primary/10 text-accent-primary',
  THEME: 'bg-category-research/10 text-category-research',
  Theme: 'bg-category-research/10 text-category-research',
  EMERGENT: 'bg-category-pharma/10 text-category-pharma',
  Emergent: 'bg-category-pharma/10 text-category-pharma',
  PRACTITIONER: 'bg-accent-secondary/10 text-accent-secondary dark:text-accent-secondary-dark',
  Practitioner: 'bg-accent-secondary/10 text-accent-secondary dark:text-accent-secondary-dark',
  PROTOTYPE: 'bg-accent-success/10 text-accent-success dark:text-accent-success-dark',
  Prototype: 'bg-accent-success/10 text-accent-success dark:text-accent-success-dark',
  CONFERENCE: 'bg-accent-warning/10 text-accent-warning dark:text-accent-warning-dark',
  Conference: 'bg-accent-warning/10 text-accent-warning dark:text-accent-warning-dark',
  METHODOLOGY: 'bg-category-research/10 text-category-research',
  Methodology: 'bg-category-research/10 text-category-research',
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Extract headings from HTML content for table of contents
 */
function extractHeadings(content: string): TocHeading[] {
  const headings: TocHeading[] = []
  const h2Regex = /<h2[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h2>/gi
  const h3Regex = /<h3[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h3>/gi

  let match
  while ((match = h2Regex.exec(content)) !== null) {
    headings.push({ id: match[1], text: match[2], level: 2 })
  }
  while ((match = h3Regex.exec(content)) !== null) {
    headings.push({ id: match[1], text: match[2], level: 3 })
  }

  return headings
}

/**
 * Reading progress indicator component
 */
function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-accent-primary origin-left z-50"
      style={{ scaleX }}
      aria-hidden="true"
    />
  )
}

/**
 * Twitter/X icon component
 */
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

/**
 * LinkedIn icon component
 */
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

/**
 * Social sharing buttons component
 */
function SocialShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error('Failed to copy to clipboard')
    }
  }, [url])

  const shareOnTwitter = useCallback(() => {
    const tweetText = encodeURIComponent(title)
    const tweetUrl = encodeURIComponent(url)
    window.open(
      `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`,
      'twitter-share-dialog',
      'width=626,height=436,left=100,top=100'
    )
  }, [title, url])

  const shareOnLinkedIn = useCallback(() => {
    const linkedInUrl = encodeURIComponent(url)
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${linkedInUrl}`,
      'linkedin-share-dialog',
      'width=626,height=436,left=100,top=100'
    )
  }, [url])

  const buttonBaseStyles = `
    inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg
    text-sm font-medium border transition-all duration-200
    focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-accent-primary focus-visible:ring-offset-2
  `

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Share this article">
      <button
        onClick={shareOnTwitter}
        className={`${buttonBaseStyles} text-text-secondary dark:text-text-dark-secondary bg-light-neutral-grey dark:bg-dark-panel border-border-light dark:border-border-dark hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30`}
        aria-label="Share on Twitter/X"
      >
        <TwitterIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Twitter</span>
      </button>

      <button
        onClick={shareOnLinkedIn}
        className={`${buttonBaseStyles} text-text-secondary dark:text-text-dark-secondary bg-light-neutral-grey dark:bg-dark-panel border-border-light dark:border-border-dark hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/30`}
        aria-label="Share on LinkedIn"
      >
        <LinkedInIcon className="h-4 w-4" />
        <span className="hidden sm:inline">LinkedIn</span>
      </button>

      <button
        onClick={copyToClipboard}
        className={`${buttonBaseStyles} ${copied ? 'text-accent-success dark:text-accent-success-dark bg-accent-success/10 border-accent-success/30' : 'text-text-secondary dark:text-text-dark-secondary bg-light-neutral-grey dark:bg-dark-panel border-border-light dark:border-border-dark hover:bg-light-icy-blue dark:hover:bg-dark-deep-blue hover:text-accent-primary'}`}
        aria-label={copied ? 'Link copied' : 'Copy link'}
      >
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy link'}</span>
      </button>

      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          onClick={async () => {
            try {
              await navigator.share({ title, url })
            } catch {
              // User cancelled or share failed
            }
          }}
          className={`${buttonBaseStyles} sm:hidden text-text-secondary dark:text-text-dark-secondary bg-light-neutral-grey dark:bg-dark-panel border-border-light dark:border-border-dark`}
          aria-label="Share via system share dialog"
        >
          <Share2 className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

/**
 * Series navigation component
 */
interface SeriesNavigationProps {
  series: {
    name: string
    current: number
    total: number
    prevSlug: string | null
    prevTitle: string | null
    prevCategory: string | null
    nextSlug: string | null
    nextTitle: string | null
    nextCategory: string | null
  }
}

function SeriesNavigation({ series }: SeriesNavigationProps) {
  const progressPercent = Math.round((series.current / series.total) * 100)

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-16 pt-12 border-t border-border-light dark:border-border-dark"
      aria-label="Series navigation"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-light-panel dark:bg-dark-panel border border-border-light dark:border-border-dark mb-4">
          <BookOpen className="w-4 h-4 text-accent-primary" aria-hidden="true" />
          <span className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary">
            {series.name}
          </span>
        </div>

        <p className="text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-2">
          Post {series.current} of {series.total}
        </p>

        <div className="w-full max-w-md">
          <div
            className="h-2 bg-light-neutral-grey dark:bg-dark-deep-blue rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full"
            />
          </div>
          <p className="text-xs text-text-muted dark:text-text-dark-muted text-center mt-2">
            {progressPercent}% complete
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {series.prevSlug ? (
          <Link
            href={`/blog/${series.prevSlug}`}
            className="group flex flex-col h-full p-5 rounded-lg bg-light-panel dark:bg-dark-panel border border-border-light dark:border-border-dark hover:border-accent-primary/50 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-2 text-sm text-text-muted dark:text-text-dark-muted mb-2">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Previous in Series</span>
            </div>
            <h4 className="font-heading font-semibold text-text-primary dark:text-text-dark-primary group-hover:text-accent-primary transition-colors line-clamp-2 flex-1">
              {series.prevTitle}
            </h4>
            {series.prevCategory && (
              <span className={`mt-3 inline-flex self-start items-center rounded-full px-2 py-0.5 text-xs font-medium ${categoryStyles[series.prevCategory] || categoryStyles.Theme}`}>
                {series.prevCategory}
              </span>
            )}
          </Link>
        ) : (
          <div className="hidden md:flex items-center justify-center p-5 rounded-lg border border-dashed border-border-light dark:border-border-dark">
            <p className="text-sm text-text-muted dark:text-text-dark-muted">
              This is the first post in the series
            </p>
          </div>
        )}

        {series.nextSlug ? (
          <Link
            href={`/blog/${series.nextSlug}`}
            className="group flex flex-col h-full p-5 rounded-lg text-right bg-light-panel dark:bg-dark-panel border border-border-light dark:border-border-dark hover:border-accent-primary/50 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-end gap-2 text-sm text-text-muted dark:text-text-dark-muted mb-2">
              <span>Next in Series</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
            <h4 className="font-heading font-semibold text-text-primary dark:text-text-dark-primary group-hover:text-accent-primary transition-colors line-clamp-2 flex-1">
              {series.nextTitle}
            </h4>
            {series.nextCategory && (
              <span className={`mt-3 inline-flex self-end items-center rounded-full px-2 py-0.5 text-xs font-medium ${categoryStyles[series.nextCategory] || categoryStyles.Theme}`}>
                {series.nextCategory}
              </span>
            )}
          </Link>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-5 rounded-lg text-center bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5 border border-accent-primary/20">
            <Bell className="w-8 h-8 text-accent-primary mb-2" />
            <p className="font-heading font-semibold text-text-primary dark:text-text-dark-primary">
              More Coming Soon
            </p>
            <p className="text-sm text-text-secondary dark:text-text-dark-secondary mt-1">
              New posts are published regularly
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary dark:text-text-dark-secondary hover:text-accent-primary transition-colors rounded-lg"
        >
          <BookOpen className="w-4 h-4" />
          View all posts in series
        </Link>
      </div>
    </motion.nav>
  )
}

/**
 * Coming Soon page for scheduled posts
 */
function ComingSoonPage({
  post,
}: {
  post: {
    title: string
    excerpt: string | null
    category: string | null
    scheduledFor?: string | null
    series?: { name: string } | null
  }
}) {
  return (
    <main className="min-h-screen bg-light-base dark:bg-dark-base">
      <section className="relative py-16 md:py-24 lg:py-32 bg-gradient-to-b from-light-icy-blue to-light-base dark:from-dark-deep-blue dark:to-dark-base">
        <div className="container-narrow text-center">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary dark:text-text-dark-secondary hover:text-accent-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </motion.div>

          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-accent-primary/10 mb-6"
          >
            <Clock className="w-10 h-10 text-accent-primary" />
          </motion.div>

          {/* Category badge */}
          {post.category && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mb-4"
            >
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${categoryStyles[post.category] || categoryStyles.Theme}`}>
                {post.category}
              </span>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary dark:text-text-dark-primary mb-6"
          >
            {post.title}
          </motion.h1>

          {/* Excerpt */}
          {post.excerpt && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-text-secondary dark:text-text-dark-secondary mb-8 max-w-2xl mx-auto"
            >
              {post.excerpt}
            </motion.p>
          )}

          {/* Coming Soon Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-light-panel dark:bg-dark-panel rounded-xl p-8 max-w-xl mx-auto border border-border-light dark:border-border-dark"
          >
            <h2 className="font-heading text-xl font-semibold text-text-primary dark:text-text-dark-primary mb-3">
              Coming Soon
            </h2>
            <p className="text-text-secondary dark:text-text-dark-secondary mb-4">
              This post is part of our ongoing research on AI Agents. We are working hard to bring you valuable insights and will publish this content soon.
            </p>
            {post.scheduledFor && (
              <p className="text-sm text-text-muted dark:text-text-dark-muted">
                Expected publication: {formatDate(post.scheduledFor)}
              </p>
            )}
          </motion.div>

          {/* Series info */}
          {post.series && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8"
            >
              <p className="text-sm text-text-muted dark:text-text-dark-muted">
                Part of the <span className="font-medium text-accent-primary">{post.series.name}</span> series
              </p>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary text-white rounded-lg font-medium hover:bg-accent-primary/90 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Explore Published Posts
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

interface BlogPostClientProps {
  slug: string
}

/**
 * Blog post detail page - Client component
 */
export default function BlogPostClient({ slug }: BlogPostClientProps) {
  const [postData, setPostData] = useState<ApiPostResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUrl, setCurrentUrl] = useState('')

  // Fetch post from API
  useEffect(() => {
    async function fetchPost() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/posts/by-slug/${encodeURIComponent(slug)}`)
        const data: ApiPostResponse = await response.json()

        if (!response.ok && !data.isScheduled) {
          throw new Error(data.error || 'Post not found')
        }

        setPostData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  // Set current URL for sharing
  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-light-base dark:bg-dark-base flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4" />
          <p className="text-text-secondary dark:text-text-dark-secondary">Loading post...</p>
        </div>
      </main>
    )
  }

  // Error state
  if (error || !postData) {
    return (
      <main className="min-h-screen bg-light-base dark:bg-dark-base flex flex-col items-center justify-center gap-4 p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 mb-4">
            <ArrowLeft className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-text-primary dark:text-text-dark-primary mb-2">
            Post Not Found
          </h1>
          <p className="text-text-secondary dark:text-text-dark-secondary mb-6">
            {error || 'The post you are looking for does not exist.'}
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-accent-primary text-white hover:bg-accent-primary/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </main>
    )
  }

  // Scheduled post - show Coming Soon page
  if (postData.isScheduled) {
    return <ComingSoonPage post={postData.post} />
  }

  const post = postData.post
  const headings = post.content ? extractHeadings(post.content) : []

  return (
    <>
      <ReadingProgress />

      <main className="min-h-screen bg-light-base dark:bg-dark-base">
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 lg:py-20 bg-gradient-to-b from-light-icy-blue to-light-base dark:from-dark-deep-blue dark:to-dark-base">
          <div className="container-narrow">
            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 mb-6 text-sm font-medium text-text-secondary dark:text-text-dark-secondary hover:text-accent-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
            </motion.div>

            {/* Category & Reading time */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-wrap items-center gap-3 mb-4"
            >
              {post.category && (
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${categoryStyles[post.category] || categoryStyles.Theme}`}>
                  {post.category}
                </span>
              )}
              {post.readingTimeMinutes && (
                <span className="flex items-center gap-1 text-sm text-text-muted dark:text-text-dark-muted">
                  <Clock className="h-4 w-4" />
                  {post.readingTimeMinutes} min read
                </span>
              )}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary dark:text-text-dark-primary mb-4"
            >
              {post.title}
            </motion.h1>

            {/* Excerpt */}
            {post.excerpt && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg md:text-xl text-text-secondary dark:text-text-dark-secondary mb-6"
              >
                {post.excerpt}
              </motion.p>
            )}

            {/* Author & Date */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-text-muted dark:text-text-dark-muted"
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium text-text-primary dark:text-text-dark-primary">
                  {post.author || 'Fernando Torres'}
                </span>
                <span className="hidden sm:inline">-</span>
                <span className="hidden sm:inline">MSx &apos;26, Stanford GSB</span>
              </div>
              {post.publishedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </span>
              )}
            </motion.div>

            {/* Share buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-6"
            >
              <SocialShareButtons title={post.title} url={currentUrl} />
            </motion.div>
          </div>
        </section>

        {/* Featured Image */}
        {post.featuredImage && (
          <section className="pb-8 md:pb-12">
            <motion.div
              className="container-wide"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="relative max-w-4xl mx-auto rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border border-white/10 shadow-2xl p-2 md:p-3">
                <div className="relative w-full rounded-lg overflow-hidden bg-slate-950/50">
                  <Image
                    src={post.featuredImage}
                    alt={`${post.title} featured image`}
                    width={1200}
                    height={800}
                    sizes="(max-width: 1280px) 100vw, 1024px"
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* Content Section with TOC */}
        <section className="py-12 md:py-16">
          <div className="container-wide">
            <div className="flex gap-8 lg:gap-12">
              {/* Table of Contents - Sticky Sidebar */}
              {headings.length > 0 && (
                <aside className="hidden lg:block w-64 flex-shrink-0">
                  <TableOfContents headings={headings} />
                </aside>
              )}

              {/* Main Content */}
              <article className="flex-1 min-w-0">
                {post.content && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="prose-custom"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                )}

                {/* Series Navigation */}
                {post.seriesNavigation && <SeriesNavigation series={post.seriesNavigation} />}

                {/* Comments Section */}
                <CommentsSection postSlug={slug} postTitle={post.title} />
              </article>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
