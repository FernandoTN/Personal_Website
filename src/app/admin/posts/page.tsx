'use client'

/**
 * Admin Posts Page
 *
 * Features:
 * - Create new blog posts with the BlogEditor component
 * - List all posts with status filters (All, Published, Scheduled, Draft)
 * - Fetch posts from database via API
 * - Save drafts with toast notifications
 * - Publish posts immediately
 * - Form validation and error handling
 *
 * Usage:
 * Navigate to /admin/posts to access the blog post management interface
 */

import { useState, useCallback, useEffect } from 'react'
import { BlogEditor } from '@/components/admin/BlogEditor'

// Tab type for switching between views
type TabView = 'create' | 'list'

// Status filter type
type StatusFilter = 'ALL' | 'PUBLISHED' | 'SCHEDULED' | 'DRAFT'

// Post type from API
interface Post {
  id: string
  title: string
  slug: string
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED'
  category: string
  publishedAt: string | null
  scheduledFor: string | null
  createdAt: string
  updatedAt: string
}

// Status filter configuration
const STATUS_FILTERS: { value: StatusFilter; label: string; color: string }[] = [
  { value: 'ALL', label: 'All', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' },
  { value: 'PUBLISHED', label: 'Published', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'SCHEDULED', label: 'Scheduled', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { value: 'DRAFT', label: 'Draft', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
]

export default function AdminPostsPage() {
  const [activeTab, setActiveTab] = useState<TabView>('list')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch posts from API
  const fetchPosts = useCallback(async (status: StatusFilter) => {
    setLoading(true)
    setError(null)
    try {
      const url = status === 'ALL'
        ? '/api/admin/posts'
        : `/api/admin/posts?status=${status}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      const data = await response.json()
      setPosts(data.posts || data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch posts when tab changes to list or filter changes
  useEffect(() => {
    if (activeTab === 'list') {
      fetchPosts(statusFilter)
    }
  }, [activeTab, statusFilter, fetchPosts])

  // Handle when a draft is saved
  const handleSaveDraft = useCallback(() => {
    // Refresh the post list
    if (activeTab === 'list') {
      fetchPosts(statusFilter)
    }
  }, [activeTab, statusFilter, fetchPosts])

  // Handle when a post is published
  const handlePublish = useCallback(() => {
    // Refresh the post list and switch to list view
    setActiveTab('list')
    fetchPosts(statusFilter)
  }, [statusFilter, fetchPosts])

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'SCHEDULED':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-text-primary dark:text-text-dark-primary">
          Manage Posts
        </h1>
        <p className="mt-2 text-text-secondary dark:text-text-dark-secondary">
          Create, edit, and manage your blog posts.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-border-light dark:border-border-dark">
        <nav className="flex gap-4" aria-label="Post management tabs">
          <button
            onClick={() => setActiveTab('list')}
            className={`
              relative pb-3 text-sm font-medium transition-colors
              ${
                activeTab === 'list'
                  ? 'text-accent-primary'
                  : 'text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark-primary'
              }
            `}
            aria-current={activeTab === 'list' ? 'page' : undefined}
          >
            All Posts
            {posts.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-accent-primary/10 text-accent-primary">
                {posts.length}
              </span>
            )}
            {activeTab === 'list' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`
              relative pb-3 text-sm font-medium transition-colors
              ${
                activeTab === 'create'
                  ? 'text-accent-primary'
                  : 'text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark-primary'
              }
            `}
            aria-current={activeTab === 'create' ? 'page' : undefined}
          >
            Create New Post
            {activeTab === 'create' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary" />
            )}
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'create' && (
        <div className="max-w-4xl">
          <div className="bg-light-base dark:bg-dark-panel rounded-xl p-6 shadow-sm border border-border-light dark:border-border-dark">
            <h2 className="text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-6">
              Create New Blog Post
            </h2>
            <BlogEditor onSave={handlePublish} onSaveDraft={handleSaveDraft} />
          </div>
        </div>
      )}

      {activeTab === 'list' && (
        <div>
          {/* Status Filter Buttons */}
          <div className="mb-6 flex flex-wrap gap-2">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`
                  px-4 py-2 text-sm font-medium rounded-lg transition-all
                  ${
                    statusFilter === filter.value
                      ? 'bg-accent-primary text-white shadow-sm'
                      : 'bg-light-neutral-grey dark:bg-dark-elevated text-text-secondary dark:text-text-dark-secondary hover:bg-light-icy-blue dark:hover:bg-dark-panel'
                  }
                `}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12 bg-light-base dark:bg-dark-panel rounded-xl border border-border-light dark:border-border-dark">
              <div className="animate-spin mx-auto h-8 w-8 border-2 border-accent-primary border-t-transparent rounded-full" />
              <p className="mt-4 text-sm text-text-secondary dark:text-text-dark-secondary">
                Loading posts...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-900/30">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.924-.833-2.694 0L4.07 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <h3 className="mt-4 text-sm font-medium text-red-800 dark:text-red-400">
                Error loading posts
              </h3>
              <p className="mt-2 text-sm text-red-600 dark:text-red-300">{error}</p>
              <button
                onClick={() => fetchPosts(statusFilter)}
                className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-12 bg-light-base dark:bg-dark-panel rounded-xl border border-border-light dark:border-border-dark">
              <svg
                className="mx-auto h-12 w-12 text-text-tertiary dark:text-text-dark-tertiary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
              <h3 className="mt-4 text-sm font-medium text-text-primary dark:text-text-dark-primary">
                {statusFilter === 'ALL' ? 'No posts yet' : `No ${statusFilter.toLowerCase()} posts`}
              </h3>
              <p className="mt-2 text-sm text-text-secondary dark:text-text-dark-secondary">
                {statusFilter === 'ALL'
                  ? 'Create your first blog post to get started.'
                  : `There are no posts with ${statusFilter.toLowerCase()} status.`}
              </p>
              <button
                onClick={() => setActiveTab('create')}
                className="mt-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent-primary rounded-lg hover:bg-accent-primary/90 transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create Post
              </button>
            </div>
          )}

          {/* Posts List */}
          {!loading && !error && posts.length > 0 && (
            <div className="bg-light-base dark:bg-dark-panel rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
              {/* Table Header */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-light-neutral-grey/50 dark:bg-dark-elevated/50 border-b border-border-light dark:border-border-dark text-xs font-medium uppercase tracking-wide text-text-secondary dark:text-text-dark-secondary">
                <div className="col-span-5">Title</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-1">Actions</div>
              </div>

              {/* Posts Rows */}
              <div className="divide-y divide-border-light dark:divide-border-dark">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 md:px-6 md:py-4 hover:bg-light-neutral-grey/30 dark:hover:bg-dark-elevated/30 transition-colors"
                  >
                    {/* Title & Slug */}
                    <div className="col-span-5">
                      <h3 className="font-medium text-text-primary dark:text-text-dark-primary truncate">
                        {post.title}
                      </h3>
                      <p className="text-xs text-text-tertiary dark:text-text-dark-tertiary truncate">
                        /{post.slug}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="col-span-2 flex items-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(post.status)}`}
                      >
                        {post.status}
                      </span>
                    </div>

                    {/* Category */}
                    <div className="col-span-2 flex items-center">
                      <span className="text-sm text-text-secondary dark:text-text-dark-secondary capitalize">
                        {post.category?.toLowerCase() || '-'}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="col-span-2 flex items-center">
                      <span className="text-sm text-text-secondary dark:text-text-dark-secondary">
                        {post.status === 'PUBLISHED'
                          ? formatDate(post.publishedAt)
                          : post.status === 'SCHEDULED'
                            ? formatDate(post.scheduledFor)
                            : formatDate(post.createdAt)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center justify-end md:justify-start">
                      <a
                        href={`/admin/blog/${post.id}/edit`}
                        className="text-accent-primary hover:text-accent-primary/80 text-sm font-medium"
                      >
                        Edit
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
