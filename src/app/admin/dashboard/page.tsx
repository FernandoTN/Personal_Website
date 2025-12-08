'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  description?: string
  href?: string
  loading?: boolean
}

interface ActivityItem {
  id: string
  type: 'post_published' | 'post_scheduled' | 'comment_received' | 'subscriber_added'
  title: string
  timestamp: string
  metadata?: string
}

interface QuickActionProps {
  label: string
  href: string
  icon: React.ReactNode
  variant?: 'primary' | 'secondary'
}

interface UpcomingPost {
  id: string
  title: string
  slug: string
  category: string | null
  scheduledFor: string
}

interface DashboardData {
  success: boolean
  stats: {
    posts: {
      total: number
      published: number
      scheduled: number
      draft: number
    }
    subscribers: {
      total: number
      active: number
    }
    comments: {
      total: number
      pending: number
    }
    aiAgentsSeries: {
      total: number
      published: number
    }
  }
  recentActivity: ActivityItem[]
  upcomingPosts: UpcomingPost[]
  categoryBreakdown: Array<{ category: string | null; count: number }>
}

// ------------------------------------------------------------------
// Icons (inline SVG for simplicity)
// ------------------------------------------------------------------
const Icons = {
  Document: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  PencilSquare: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  ),
  Rocket: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  ),
  ChartBar: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  ),
  Comment: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
    </svg>
  ),
  User: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  ),
  Refresh: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  ),
}

// Category colors for the progress breakdown
const CATEGORY_COLORS: Record<string, string> = {
  ANCHOR: 'bg-category-research',
  THEME: 'bg-accent-primary',
  EMERGENT: 'bg-accent-secondary',
  PRACTITIONER: 'bg-accent-success',
  PROTOTYPE: 'bg-accent-warning',
  CONFERENCE: 'bg-category-pharma',
  METHODOLOGY: 'bg-category-ai-agents',
}

// ------------------------------------------------------------------
// StatCard Component
// ------------------------------------------------------------------
function StatCard({ title, value, icon, description, href, loading }: StatCardProps) {
  const content = (
    <div className="bg-light-base dark:bg-dark-panel rounded-xl p-6 border border-border-light dark:border-border-dark shadow-light hover:shadow-glow transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wide">
            {title}
          </p>
          {loading ? (
            <div className="mt-2 h-9 w-16 bg-light-neutral-grey dark:bg-dark-deep-blue animate-pulse rounded" />
          ) : (
            <p className="mt-2 text-3xl font-bold text-text-primary dark:text-text-dark-primary">
              {value}
            </p>
          )}
          {description && (
            <p className="mt-1 text-sm text-text-muted dark:text-text-dark-muted">
              {description}
            </p>
          )}
        </div>
        <div className="p-3 rounded-lg bg-accent-primary/10 text-accent-primary">
          {icon}
        </div>
      </div>
    </div>
  )

  if (href) {
    return <Link href={href} className="block">{content}</Link>
  }

  return content
}

// ------------------------------------------------------------------
// SeriesProgress Component
// ------------------------------------------------------------------
function SeriesProgress({
  published,
  total,
  categoryBreakdown,
  loading,
}: {
  published: number
  total: number
  categoryBreakdown: Array<{ category: string | null; count: number }>
  loading: boolean
}) {
  const percentage = total > 0 ? Math.round((published / total) * 100) : 0

  return (
    <div className="bg-light-base dark:bg-dark-panel rounded-xl p-6 border border-border-light dark:border-border-dark">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold text-text-primary dark:text-text-dark-primary">
          AI Agents Series Progress
        </h3>
        {loading ? (
          <div className="h-5 w-32 bg-light-neutral-grey dark:bg-dark-deep-blue animate-pulse rounded" />
        ) : (
          <span className="text-sm font-medium text-accent-primary">
            {published} of {total} published
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative h-4 bg-light-neutral-grey dark:bg-dark-deep-blue rounded-full overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 animate-pulse" />
        ) : (
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-text-muted dark:text-text-dark-muted">
          {loading ? '...' : `${percentage}% complete`}
        </span>
        <span className="text-text-secondary dark:text-text-dark-secondary">
          {loading ? '...' : `${total - published} posts remaining`}
        </span>
      </div>

      {/* Category Breakdown */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-5 bg-light-neutral-grey dark:bg-dark-deep-blue animate-pulse rounded" />
          ))
        ) : (
          categoryBreakdown.map((cat) => (
            <div
              key={cat.category || 'unknown'}
              className="flex items-center gap-2 text-sm"
            >
              <span className={`w-3 h-3 rounded-full ${CATEGORY_COLORS[cat.category || ''] || 'bg-gray-400'}`} />
              <span className="text-text-secondary dark:text-text-dark-secondary">
                {cat.category ? cat.category.charAt(0) + cat.category.slice(1).toLowerCase() : 'Other'}: {cat.count}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ------------------------------------------------------------------
// ActivityFeed Component
// ------------------------------------------------------------------
function ActivityFeed({ activities, loading }: { activities: ActivityItem[]; loading: boolean }) {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'post_published':
        return <Icons.CheckCircle />
      case 'post_scheduled':
        return <Icons.Clock />
      case 'comment_received':
        return <Icons.Comment />
      case 'subscriber_added':
        return <Icons.User />
      default:
        return <Icons.Document />
    }
  }

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'post_published':
        return 'text-accent-success bg-accent-success/10'
      case 'post_scheduled':
        return 'text-accent-warning bg-accent-warning/10'
      case 'comment_received':
        return 'text-accent-primary bg-accent-primary/10'
      case 'subscriber_added':
        return 'text-accent-secondary bg-accent-secondary/10'
      default:
        return 'text-text-muted bg-light-neutral-grey dark:bg-dark-deep-blue'
    }
  }

  return (
    <div className="bg-light-base dark:bg-dark-panel rounded-xl p-6 border border-border-light dark:border-border-dark">
      <h3 className="font-heading text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-4">
        Recent Activity
      </h3>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-lg bg-light-neutral-grey dark:bg-dark-deep-blue" />
              <div className="flex-1">
                <div className="h-4 w-3/4 bg-light-neutral-grey dark:bg-dark-deep-blue rounded mb-2" />
                <div className="h-3 w-1/2 bg-light-neutral-grey dark:bg-dark-deep-blue rounded" />
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          <p className="text-sm text-text-muted dark:text-text-dark-muted text-center py-4">
            No recent activity
          </p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary dark:text-text-dark-primary truncate">
                  {activity.title}
                </p>
                {activity.metadata && (
                  <p className="text-xs text-text-muted dark:text-text-dark-muted mt-0.5">
                    {activity.metadata}
                  </p>
                )}
                <p className="text-xs text-text-muted dark:text-text-dark-muted mt-1">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <Link
        href="/admin/posts"
        className="mt-4 inline-flex items-center text-sm font-medium text-accent-primary hover:text-accent-primary/80 transition-colors"
      >
        View all activity
        <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </Link>
    </div>
  )
}

// ------------------------------------------------------------------
// QuickAction Component
// ------------------------------------------------------------------
function QuickAction({ label, href, icon, variant = 'secondary' }: QuickActionProps) {
  const baseStyles = 'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200'
  const variantStyles = variant === 'primary'
    ? 'bg-accent-primary text-white hover:bg-accent-primary/90 shadow-light hover:shadow-glow'
    : 'bg-light-neutral-grey dark:bg-dark-deep-blue text-text-primary dark:text-text-dark-primary hover:bg-light-icy-blue dark:hover:bg-dark-panel border border-border-light dark:border-border-dark'

  return (
    <Link href={href} className={`${baseStyles} ${variantStyles}`}>
      {icon}
      {label}
    </Link>
  )
}

// ------------------------------------------------------------------
// UpcomingPublications Component
// ------------------------------------------------------------------
const POSTS_PER_PAGE = 6

function UpcomingPublications({ posts, loading }: { posts: UpcomingPost[]; loading: boolean }) {
  const [currentPage, setCurrentPage] = useState(1)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Sort posts by scheduledFor date (closest first)
  const sortedPosts = [...posts].sort((a, b) => {
    return new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
  })

  // Pagination
  const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const paginatedPosts = sortedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <div className="bg-light-base dark:bg-dark-panel rounded-xl p-6 border border-border-light dark:border-border-dark">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold text-text-primary dark:text-text-dark-primary">
          Upcoming Publications
        </h3>
        <Link
          href="/admin/calendar"
          className="text-sm font-medium text-accent-primary hover:text-accent-primary/80 transition-colors"
        >
          View Calendar
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 bg-light-icy-blue dark:bg-dark-deep-blue rounded-lg animate-pulse">
              <div className="h-4 w-1/3 bg-light-neutral-grey dark:bg-dark-panel rounded mb-3" />
              <div className="h-5 w-full bg-light-neutral-grey dark:bg-dark-panel rounded mb-2" />
              <div className="h-4 w-1/2 bg-light-neutral-grey dark:bg-dark-panel rounded" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-sm text-text-muted dark:text-text-dark-muted text-center py-8">
          No upcoming scheduled posts
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedPosts.map((post) => (
              <Link
                key={post.id}
                href={`/admin/blog/${post.id}`}
                className="p-4 bg-light-icy-blue dark:bg-dark-deep-blue rounded-lg border border-border-light dark:border-border-dark hover:border-accent-primary/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icons.Rocket />
                  <span className="text-xs font-medium text-accent-primary uppercase tracking-wide">
                    {post.category ? post.category.charAt(0) + post.category.slice(1).toLowerCase() : 'Post'}
                  </span>
                </div>
                <p className="font-medium text-text-primary dark:text-text-dark-primary line-clamp-2">
                  {post.title}
                </p>
                <p className="mt-2 text-sm text-text-muted dark:text-text-dark-muted">
                  {formatDate(post.scheduledFor)}
                </p>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-border-light dark:border-border-dark text-text-secondary dark:text-text-dark-secondary hover:bg-light-icy-blue dark:hover:bg-dark-deep-blue disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`min-w-[2rem] h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-accent-primary text-white'
                        : 'text-text-secondary dark:text-text-dark-secondary hover:bg-light-icy-blue dark:hover:bg-dark-deep-blue'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-border-light dark:border-border-dark text-text-secondary dark:text-text-dark-secondary hover:bg-light-icy-blue dark:hover:bg-dark-deep-blue disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          )}

          {/* Page info */}
          {totalPages > 1 && (
            <p className="mt-3 text-center text-xs text-text-muted dark:text-text-dark-muted">
              Showing {startIndex + 1}-{Math.min(startIndex + POSTS_PER_PAGE, sortedPosts.length)} of {sortedPosts.length} scheduled posts
            </p>
          )}
        </>
      )}
    </div>
  )
}

// ------------------------------------------------------------------
// Dashboard Page
// ------------------------------------------------------------------
export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession()
  const router = useRouter()

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/dashboard')
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch dashboard data')
      }

      setData(result)
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login?expired=true')
    }
  }, [status, router])

  // Fetch data when authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      fetchDashboardData()
    }
  }, [status, fetchDashboardData])

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary" />
      </div>
    )
  }

  // Don't render if not authenticated
  if (status === 'unauthenticated') {
    return null
  }

  const stats = data?.stats

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-text-primary dark:text-text-dark-primary">
            Dashboard
          </h1>
          <p className="mt-1 text-text-secondary dark:text-text-dark-secondary">
            Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}! Here is an overview of your content.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <QuickAction
            label="New Post"
            href="/admin/posts"
            icon={<Icons.Plus />}
            variant="primary"
          />
          <QuickAction
            label="View Calendar"
            href="/admin/calendar"
            icon={<Icons.Calendar />}
          />
          <QuickAction
            label="Analytics"
            href="/admin/analytics"
            icon={<Icons.ChartBar />}
          />
          <button
            onClick={() => fetchDashboardData()}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 bg-light-neutral-grey dark:bg-dark-deep-blue text-text-primary dark:text-text-dark-primary hover:bg-light-icy-blue dark:hover:bg-dark-panel border border-border-light dark:border-border-dark disabled:opacity-50"
          >
            <Icons.Refresh />
            Refresh
          </button>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 bg-light-neutral-grey dark:bg-dark-deep-blue text-text-primary dark:text-text-dark-primary hover:bg-light-icy-blue dark:hover:bg-dark-panel border border-border-light dark:border-border-dark"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-red-700 dark:text-red-300">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Posts"
          value={stats?.posts.total ?? 0}
          icon={<Icons.Document />}
          href="/admin/posts"
          loading={loading}
        />
        <StatCard
          title="Published"
          value={stats?.posts.published ?? 0}
          icon={<Icons.CheckCircle />}
          description="Live on the website"
          href="/admin/posts?status=PUBLISHED"
          loading={loading}
        />
        <StatCard
          title="Scheduled"
          value={stats?.posts.scheduled ?? 0}
          icon={<Icons.Clock />}
          description="Queued for release"
          href="/admin/posts?status=SCHEDULED"
          loading={loading}
        />
        <StatCard
          title="Drafts"
          value={stats?.posts.draft ?? 0}
          icon={<Icons.PencilSquare />}
          description="Work in progress"
          href="/admin/posts?status=DRAFT"
          loading={loading}
        />
      </div>

      {/* Series Progress & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SeriesProgress
          published={stats?.aiAgentsSeries.published ?? 0}
          total={stats?.aiAgentsSeries.total ?? 25}
          categoryBreakdown={data?.categoryBreakdown ?? []}
          loading={loading}
        />
        <ActivityFeed activities={data?.recentActivity ?? []} loading={loading} />
      </div>

      {/* Upcoming Publications */}
      <UpcomingPublications posts={data?.upcomingPosts ?? []} loading={loading} />
    </div>
  )
}
