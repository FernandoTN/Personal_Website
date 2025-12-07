'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { formatDate } from '@/lib/utils'

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED'

interface BlogPost {
  id: string
  title: string
  slug: string
  status: PostStatus
  category: string | null
  createdAt: string
  publishedAt: string | null
  scheduledFor: string | null
}

interface StatusFilter {
  label: string
  value: PostStatus | 'ALL'
  count: number
}

// ------------------------------------------------------------------
// Icons
// ------------------------------------------------------------------
const Icons = {
  Plus: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  Search: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  ),
  Edit: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  ),
  Refresh: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  ),
}

// ------------------------------------------------------------------
// StatusBadge Component
// ------------------------------------------------------------------
interface StatusBadgeProps {
  status: PostStatus
}

function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    PUBLISHED: {
      label: 'Published',
      className: 'bg-accent-success/10 text-accent-success dark:bg-accent-success-dark/10 dark:text-accent-success-dark',
    },
    DRAFT: {
      label: 'Draft',
      className: 'bg-text-muted/10 text-text-muted dark:bg-text-dark-muted/10 dark:text-text-dark-muted',
    },
    SCHEDULED: {
      label: 'Scheduled',
      className: 'bg-accent-warning/10 text-accent-warning dark:bg-accent-warning-dark/10 dark:text-accent-warning-dark',
    },
  }

  const config = statusConfig[status]

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}

// ------------------------------------------------------------------
// DeleteConfirmModal Component
// ------------------------------------------------------------------
interface DeleteConfirmModalProps {
  isOpen: boolean
  postTitle: string
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

function DeleteConfirmModal({ isOpen, postTitle, isDeleting, onConfirm, onCancel }: DeleteConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark-base/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-light-base dark:bg-dark-panel rounded-xl p-6 shadow-glow-lg max-w-md w-full mx-4 border border-border-light dark:border-border-dark">
        <h3 className="font-heading text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-2">
          Delete Post
        </h3>
        <p className="text-text-secondary dark:text-text-dark-secondary mb-6">
          Are you sure you want to delete &quot;{postTitle}&quot;? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary dark:text-text-dark-secondary hover:bg-light-neutral-grey dark:hover:bg-dark-deep-blue transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-accent-error text-white hover:bg-accent-error/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------
// Toast Component
// ------------------------------------------------------------------
interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg ${
        type === 'success'
          ? 'bg-accent-success text-white'
          : 'bg-accent-error text-white'
      }`}
      role="alert"
    >
      {type === 'success' ? (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 rounded p-1 hover:bg-white/20"
        aria-label="Close notification"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

// ------------------------------------------------------------------
// BlogListTable Component
// ------------------------------------------------------------------
interface BlogListTableProps {
  posts: BlogPost[]
  onDelete: (post: BlogPost) => void
}

function BlogListTable({ posts, onDelete }: BlogListTableProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-12 h-12 rounded-full bg-light-neutral-grey dark:bg-dark-deep-blue flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-text-muted dark:text-text-dark-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        </div>
        <h3 className="font-heading text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-1">
          No posts found
        </h3>
        <p className="text-text-secondary dark:text-text-dark-secondary mb-4">
          Try adjusting your search or filter criteria.
        </p>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-accent-primary text-white hover:bg-accent-primary/90 transition-colors"
        >
          <Icons.Plus />
          Create your first post
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border-light dark:border-border-dark">
            <th className="text-left py-3 px-4 text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wide">
              Title
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wide">
              Status
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wide hidden sm:table-cell">
              Created
            </th>
            <th className="text-right py-3 px-4 text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wide">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-light dark:divide-border-dark">
          {posts.map((post) => (
            <tr
              key={post.id}
              className="hover:bg-light-icy-blue dark:hover:bg-dark-deep-blue transition-colors"
            >
              <td className="py-4 px-4">
                <div>
                  <Link
                    href={`/admin/blog/${post.id}/edit`}
                    className="font-medium text-text-primary dark:text-text-dark-primary hover:text-accent-primary transition-colors line-clamp-1"
                  >
                    {post.title}
                  </Link>
                  {post.category && (
                    <span className="text-xs text-text-muted dark:text-text-dark-muted mt-0.5 block">
                      {post.category.charAt(0) + post.category.slice(1).toLowerCase()}
                    </span>
                  )}
                </div>
              </td>
              <td className="py-4 px-4">
                <StatusBadge status={post.status} />
                {post.status === 'SCHEDULED' && post.scheduledFor && (
                  <p className="text-xs text-text-muted dark:text-text-dark-muted mt-1">
                    {formatDate(post.scheduledFor, { month: 'short', day: 'numeric' })}
                  </p>
                )}
              </td>
              <td className="py-4 px-4 hidden sm:table-cell">
                <span className="text-sm text-text-secondary dark:text-text-dark-secondary">
                  {formatDate(post.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/blog/${post.id}/edit`}
                    className="p-2 rounded-lg text-text-secondary dark:text-text-dark-secondary hover:bg-light-neutral-grey dark:hover:bg-dark-panel hover:text-accent-primary transition-colors"
                    title="Edit post"
                  >
                    <Icons.Edit />
                  </Link>
                  <button
                    onClick={() => onDelete(post)}
                    className="p-2 rounded-lg text-text-secondary dark:text-text-dark-secondary hover:bg-accent-error/10 hover:text-accent-error transition-colors"
                    title="Delete post"
                  >
                    <Icons.Trash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ------------------------------------------------------------------
// AdminBlogListPage Component
// ------------------------------------------------------------------
export default function AdminBlogListPage() {
  const { status: sessionStatus } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  // State
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<PostStatus | 'ALL'>('ALL')
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; post: BlogPost | null }>({
    isOpen: false,
    post: null,
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Fetch posts from API
  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/admin/posts')

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin/login')
          return
        }
        throw new Error('Failed to fetch posts')
      }

      const data = await response.json()
      setPosts(data.posts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  // Initialize filter from URL params
  useEffect(() => {
    const statusParam = searchParams.get('status')
    if (statusParam) {
      const normalizedStatus = statusParam.toUpperCase() as PostStatus | 'ALL'
      if (['ALL', 'PUBLISHED', 'DRAFT', 'SCHEDULED'].includes(normalizedStatus)) {
        setActiveFilter(normalizedStatus)
      }
    }
  }, [searchParams])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [sessionStatus, router])

  // Fetch posts when authenticated
  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      fetchPosts()
    }
  }, [sessionStatus, fetchPosts])

  // Calculate status counts
  const statusCounts = useMemo(() => {
    return {
      ALL: posts.length,
      PUBLISHED: posts.filter(p => p.status === 'PUBLISHED').length,
      SCHEDULED: posts.filter(p => p.status === 'SCHEDULED').length,
      DRAFT: posts.filter(p => p.status === 'DRAFT').length,
    }
  }, [posts])

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    let result = posts

    // Apply status filter
    if (activeFilter !== 'ALL') {
      result = result.filter(post => post.status === activeFilter)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.slug.toLowerCase().includes(query) ||
        (post.category && post.category.toLowerCase().includes(query))
      )
    }

    return result
  }, [posts, activeFilter, searchQuery])

  // Status filter options
  const statusFilters: StatusFilter[] = [
    { label: 'All', value: 'ALL', count: statusCounts.ALL },
    { label: 'Published', value: 'PUBLISHED', count: statusCounts.PUBLISHED },
    { label: 'Scheduled', value: 'SCHEDULED', count: statusCounts.SCHEDULED },
    { label: 'Draft', value: 'DRAFT', count: statusCounts.DRAFT },
  ]

  // Handle filter change
  const handleFilterChange = useCallback((value: PostStatus | 'ALL') => {
    setActiveFilter(value)
    // Update URL without navigation
    const url = new URL(window.location.href)
    if (value === 'ALL') {
      url.searchParams.delete('status')
    } else {
      url.searchParams.set('status', value.toLowerCase())
    }
    window.history.replaceState({}, '', url.toString())
  }, [])

  // Handle delete
  const handleDeleteClick = useCallback((post: BlogPost) => {
    setDeleteModal({ isOpen: true, post })
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteModal.post) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/posts/${deleteModal.post.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete post')
      }

      // Remove post from local state
      setPosts(prev => prev.filter(p => p.id !== deleteModal.post?.id))
      setToast({ message: 'Post deleted successfully', type: 'success' })
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : 'Failed to delete post',
        type: 'error',
      })
    } finally {
      setIsDeleting(false)
      setDeleteModal({ isOpen: false, post: null })
    }
  }, [deleteModal.post])

  const handleDeleteCancel = useCallback(() => {
    setDeleteModal({ isOpen: false, post: null })
  }, [])

  // Show loading state while checking session
  if (sessionStatus === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary" />
      </div>
    )
  }

  // Don't render if not authenticated
  if (sessionStatus === 'unauthenticated') {
    return null
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-text-secondary dark:text-text-dark-secondary">{error}</p>
        <button
          onClick={fetchPosts}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-accent-primary text-white hover:bg-accent-primary/90 transition-colors"
        >
          <Icons.Refresh />
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-text-primary dark:text-text-dark-primary">
            Blog Posts
          </h1>
          <p className="mt-1 text-text-secondary dark:text-text-dark-secondary">
            Manage and organize your blog content.
          </p>
        </div>

        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm bg-accent-primary text-white hover:bg-accent-primary/90 shadow-light hover:shadow-glow transition-all duration-200"
        >
          <Icons.Plus />
          New Post
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-light-base dark:bg-dark-panel rounded-xl border border-border-light dark:border-border-dark p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => handleFilterChange(filter.value)}
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${activeFilter === filter.value
                    ? 'bg-accent-primary text-white'
                    : 'bg-light-neutral-grey dark:bg-dark-deep-blue text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark-primary'
                  }
                `}
              >
                {filter.label}
                <span className={`
                  inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full text-xs
                  ${activeFilter === filter.value
                    ? 'bg-white/20 text-white'
                    : 'bg-light-icy-blue dark:bg-dark-panel text-text-muted dark:text-text-dark-muted'
                  }
                `}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icons.Search />
            </div>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full lg:w-64 pl-10 pr-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue text-text-primary dark:text-text-dark-primary placeholder-text-muted dark:placeholder-text-dark-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-light-base dark:bg-dark-panel rounded-xl border border-border-light dark:border-border-dark">
        <BlogListTable posts={filteredPosts} onDelete={handleDeleteClick} />
      </div>

      {/* Results Count */}
      <p className="text-sm text-text-muted dark:text-text-dark-muted text-center">
        Showing {filteredPosts.length} of {posts.length} posts
      </p>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        postTitle={deleteModal.post?.title || ''}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
