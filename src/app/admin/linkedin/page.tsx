'use client'

/**
 * Admin LinkedIn Page
 *
 * Displays all 25 LinkedIn promotional posts with:
 * - Linked blog post title
 * - Content preview
 * - Character count
 * - Status (pending, manually_scheduled, posted)
 * - Links to corresponding blog posts
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/Toast'

// LinkedIn post data type
interface LinkedInPost {
  id: string
  filename: string
  publicationNumber: number
  title: string
  type: string
  content: string
  contentPreview: string
  characterCount: number
  hashtags: string[]
  status: 'pending' | 'manually_scheduled' | 'posted'
  linkedBlogPostSlug: string | null
  imageUrl: string | null
  createdAt: string
}

// Status filter type
type StatusFilter = 'all' | 'pending' | 'manually_scheduled' | 'posted'

// Status badge component
function StatusBadge({ status }: { status: LinkedInPost['status'] }) {
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    manually_scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    posted: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  }

  const statusLabels = {
    pending: 'Pending',
    manually_scheduled: 'Scheduled',
    posted: 'Posted',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        statusStyles[status]
      )}
    >
      {statusLabels[status]}
    </span>
  )
}

// Category/Type badge component
function TypeBadge({ type }: { type: string }) {
  const typeColors: Record<string, string> = {
    'Anchor': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    'Theme Deep Dive': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
    'Emergent Insight': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400',
    'Practitioner Perspective': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    'Prototype Learning': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
    'Conference Insight': 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400',
    'Methodology & Process': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
  }

  // Find matching color or use default
  const colorClass = Object.entries(typeColors).find(([key]) =>
    type.toLowerCase().includes(key.toLowerCase())
  )?.[1] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        colorClass
      )}
    >
      {type}
    </span>
  )
}

// Character count indicator
function CharacterCount({ count }: { count: number }) {
  const maxChars = 3000
  const percentage = (count / maxChars) * 100
  const isWarning = percentage > 80
  const isDanger = percentage > 95

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'text-sm font-mono',
          isDanger
            ? 'text-red-600 dark:text-red-400'
            : isWarning
              ? 'text-yellow-600 dark:text-yellow-400'
              : 'text-text-secondary dark:text-text-dark-secondary'
        )}
      >
        {count.toLocaleString()}
      </span>
      <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            isDanger
              ? 'bg-red-500'
              : isWarning
                ? 'bg-yellow-500'
                : 'bg-green-500'
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}

// Expandable post row
function PostRow({ post, isExpanded, onToggle, onStatusChange }: {
  post: LinkedInPost
  isExpanded: boolean
  onToggle: () => void
  onStatusChange: (postId: string, newStatus: LinkedInPost['status']) => Promise<void>
}) {
  const [copied, setCopied] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const { showToast } = useToast()

  const handleScheduledCheckbox = async (checked: boolean) => {
    setIsUpdating(true)
    const newStatus: LinkedInPost['status'] = checked ? 'manually_scheduled' : 'pending'
    try {
      await onStatusChange(post.id, newStatus)
      showToast({
        type: 'success',
        message: checked
          ? `Post #${post.publicationNumber} marked as manually scheduled`
          : `Post #${post.publicationNumber} status reverted to pending`,
        duration: 3000,
      })
    } catch (error) {
      console.error('Failed to update status:', error)
      showToast({
        type: 'error',
        message: 'Failed to update post status. Please try again.',
        duration: 4000,
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(post.content)
      setCopied(true)
      showToast({
        type: 'success',
        message: `LinkedIn post #${post.publicationNumber} copied to clipboard!`,
        duration: 3000,
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      showToast({
        type: 'error',
        message: 'Failed to copy to clipboard. Please try again.',
        duration: 4000,
      })
    }
  }

  return (
    <>
      {/* Main row */}
      <tr
        className={cn(
          'hover:bg-light-neutral-grey/50 dark:hover:bg-dark-elevated/50 transition-colors cursor-pointer',
          isExpanded && 'bg-light-neutral-grey/30 dark:bg-dark-elevated/30'
        )}
        onClick={onToggle}
      >
        {/* Publication number */}
        <td className="px-4 py-4 whitespace-nowrap">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent-primary/10 text-accent-primary text-sm font-medium">
            {post.publicationNumber}
          </span>
        </td>

        {/* Blog post title / link */}
        <td className="px-4 py-4">
          <div className="flex flex-col gap-1">
            <span className="font-medium text-text-primary dark:text-text-dark-primary">
              {post.title}
            </span>
            {post.linkedBlogPostSlug && (
              <Link
                href={`/blog/${post.linkedBlogPostSlug}`}
                onClick={(e) => e.stopPropagation()}
                className="text-sm text-accent-primary hover:underline"
              >
                View blog post
              </Link>
            )}
          </div>
        </td>

        {/* Type */}
        <td className="px-4 py-4 whitespace-nowrap">
          <TypeBadge type={post.type} />
        </td>

        {/* Content preview */}
        <td className="px-4 py-4 max-w-xs">
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary truncate">
            {post.contentPreview}
          </p>
        </td>

        {/* Character count */}
        <td className="px-4 py-4 whitespace-nowrap">
          <CharacterCount count={post.characterCount} />
        </td>

        {/* Status */}
        <td className="px-4 py-4 whitespace-nowrap">
          <StatusBadge status={post.status} />
        </td>

        {/* Expand indicator */}
        <td className="px-4 py-4 whitespace-nowrap">
          <svg
            className={cn(
              'w-5 h-5 text-text-tertiary dark:text-text-dark-tertiary transition-transform',
              isExpanded && 'rotate-180'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </td>
      </tr>

      {/* Expanded content */}
      {isExpanded && (
        <tr className="bg-light-neutral-grey/50 dark:bg-dark-elevated/50">
          <td colSpan={7} className="px-4 py-6">
            <div className="max-w-4xl">
              {/* Content section */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-text-primary dark:text-text-dark-primary">
                    Full Post Content
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopy()
                    }}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
                      copied
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20'
                    )}
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                        </svg>
                        Copy to Clipboard
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-light-base dark:bg-dark-panel rounded-lg p-4 border border-border-light dark:border-border-dark">
                  <pre className="whitespace-pre-wrap text-sm text-text-primary dark:text-text-dark-primary font-sans leading-relaxed">
                    {post.content}
                  </pre>
                </div>
              </div>

              {/* Hashtags */}
              {post.hashtags.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                    Hashtags ({post.hashtags.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {post.hashtags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-sm rounded bg-accent-primary/10 text-accent-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Preview */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                  Associated Image
                </h4>
                {post.imageUrl ? (
                  <div className="relative w-64 h-40 rounded-lg overflow-hidden border border-border-light dark:border-border-dark">
                    <img
                      src={post.imageUrl}
                      alt={`Image for ${post.title}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-64 h-40 rounded-lg border-2 border-dashed border-border-light dark:border-border-dark flex items-center justify-center bg-light-neutral-grey/50 dark:bg-dark-elevated/50">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-8 w-8 text-text-tertiary dark:text-text-dark-tertiary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                      </svg>
                      <p className="mt-1 text-xs text-text-tertiary dark:text-text-dark-tertiary">
                        No image assigned
                      </p>
                      <p className="text-xs text-text-muted dark:text-text-dark-muted">
                        Use blog post featured image
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-text-tertiary dark:text-text-dark-tertiary">Character Count</span>
                  <p className="font-medium text-text-primary dark:text-text-dark-primary">
                    {post.characterCount.toLocaleString()} / 3,000
                  </p>
                </div>
                <div>
                  <span className="text-text-tertiary dark:text-text-dark-tertiary">Post Type</span>
                  <p className="font-medium text-text-primary dark:text-text-dark-primary">
                    {post.type}
                  </p>
                </div>
                <div>
                  <span className="text-text-tertiary dark:text-text-dark-tertiary">Source File</span>
                  <p className="font-medium text-text-primary dark:text-text-dark-primary font-mono text-xs">
                    {post.filename}
                  </p>
                </div>
                <div>
                  <span className="text-text-tertiary dark:text-text-dark-tertiary">Status</span>
                  <p className="font-medium">
                    <StatusBadge status={post.status} />
                  </p>
                </div>
              </div>

              {/* Scheduling Actions */}
              {post.status !== 'posted' && (
                <div className="mt-6 pt-4 border-t border-border-light dark:border-border-dark">
                  <h4 className="text-sm font-medium text-text-primary dark:text-text-dark-primary mb-3">
                    Status Actions
                  </h4>
                  <label
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                      post.status === 'manually_scheduled'
                        ? 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
                        : 'border-border-light dark:border-border-dark hover:bg-light-neutral-grey/50 dark:hover:bg-dark-elevated/50',
                      isUpdating && 'opacity-50 cursor-not-allowed'
                    )}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={post.status === 'manually_scheduled'}
                      onChange={(e) => handleScheduledCheckbox(e.target.checked)}
                      disabled={isUpdating}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 disabled:opacity-50"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-text-primary dark:text-text-dark-primary">
                        Already Scheduled in LinkedIn
                      </span>
                      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mt-0.5">
                        Check this if you have already scheduled this post in LinkedIn's native scheduler
                      </p>
                    </div>
                    {isUpdating && (
                      <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    )}
                  </label>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function AdminLinkedInPage() {
  const [posts, setPosts] = useState<LinkedInPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch LinkedIn posts
  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/linkedin')
        const data = await response.json()

        if (data.error) {
          setError(data.error)
        } else {
          setPosts(data.posts || [])
        }
      } catch (err) {
        setError('Failed to load LinkedIn posts')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Handle status change for a post
  const handleStatusChange = async (postId: string, newStatus: LinkedInPost['status']) => {
    const response = await fetch('/api/admin/linkedin', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: postId, status: newStatus }),
    })

    if (!response.ok) {
      throw new Error('Failed to update status')
    }

    // Update local state
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, status: newStatus } : post
      )
    )
  }

  // Filter posts by status and search query
  const filteredPosts = posts.filter((post) => {
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.type.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Status filter counts
  const statusCounts = {
    all: posts.length,
    pending: posts.filter((p) => p.status === 'pending').length,
    manually_scheduled: posts.filter((p) => p.status === 'manually_scheduled').length,
    posted: posts.filter((p) => p.status === 'posted').length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin" />
          <p className="text-text-secondary dark:text-text-dark-secondary">Loading LinkedIn posts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-text-primary dark:text-text-dark-primary">
            Error Loading Posts
          </h3>
          <p className="mt-2 text-text-secondary dark:text-text-dark-secondary">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-text-primary dark:text-text-dark-primary">
          LinkedIn Posts
        </h1>
        <p className="mt-2 text-text-secondary dark:text-text-dark-secondary">
          Manage and preview your {posts.length} LinkedIn promotional posts for the AI Agents series.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-light-base dark:bg-dark-panel rounded-xl p-4 border border-border-light dark:border-border-dark">
          <p className="text-sm text-text-tertiary dark:text-text-dark-tertiary">Total Posts</p>
          <p className="text-2xl font-bold text-text-primary dark:text-text-dark-primary">{posts.length}</p>
        </div>
        <div className="bg-light-base dark:bg-dark-panel rounded-xl p-4 border border-border-light dark:border-border-dark">
          <p className="text-sm text-text-tertiary dark:text-text-dark-tertiary">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{statusCounts.pending}</p>
        </div>
        <div className="bg-light-base dark:bg-dark-panel rounded-xl p-4 border border-border-light dark:border-border-dark">
          <p className="text-sm text-text-tertiary dark:text-text-dark-tertiary">Scheduled</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{statusCounts.manually_scheduled}</p>
        </div>
        <div className="bg-light-base dark:bg-dark-panel rounded-xl p-4 border border-border-light dark:border-border-dark">
          <p className="text-sm text-text-tertiary dark:text-text-dark-tertiary">Posted</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{statusCounts.posted}</p>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Status filter tabs */}
        <div className="flex gap-2">
          {(['all', 'pending', 'manually_scheduled', 'posted'] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                statusFilter === status
                  ? 'bg-accent-primary text-white'
                  : 'bg-light-base dark:bg-dark-panel text-text-secondary dark:text-text-dark-secondary hover:bg-light-neutral-grey dark:hover:bg-dark-elevated border border-border-light dark:border-border-dark'
              )}
            >
              {status === 'all' ? 'All' : status === 'manually_scheduled' ? 'Scheduled' : status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-white/20">
                {statusCounts[status]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary dark:text-text-dark-tertiary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-light-base dark:bg-dark-panel border border-border-light dark:border-border-dark rounded-lg text-text-primary dark:text-text-dark-primary placeholder-text-tertiary dark:placeholder-text-dark-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
          />
        </div>
      </div>

      {/* Posts table */}
      <div className="bg-light-base dark:bg-dark-panel rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-text-tertiary dark:text-text-dark-tertiary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
              />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-text-primary dark:text-text-dark-primary">
              No posts found
            </h3>
            <p className="mt-2 text-sm text-text-secondary dark:text-text-dark-secondary">
              {searchQuery ? 'Try a different search term.' : 'No LinkedIn posts match the selected filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-light-neutral-grey dark:bg-dark-deep-blue border-b border-border-light dark:border-border-dark">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary dark:text-text-dark-tertiary uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary dark:text-text-dark-tertiary uppercase tracking-wider">
                    Blog Post Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary dark:text-text-dark-tertiary uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary dark:text-text-dark-tertiary uppercase tracking-wider">
                    Content Preview
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary dark:text-text-dark-tertiary uppercase tracking-wider">
                    Characters
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary dark:text-text-dark-tertiary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary dark:text-text-dark-tertiary uppercase tracking-wider">
                    <span className="sr-only">Expand</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark">
                {filteredPosts.map((post) => (
                  <PostRow
                    key={post.id}
                    post={post}
                    isExpanded={expandedPostId === post.id}
                    onToggle={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="mt-4 text-sm text-text-tertiary dark:text-text-dark-tertiary">
        Showing {filteredPosts.length} of {posts.length} posts
        {searchQuery && ` matching "${searchQuery}"`}
        {statusFilter !== 'all' && ` with status "${statusFilter}"`}
      </div>
    </div>
  )
}
