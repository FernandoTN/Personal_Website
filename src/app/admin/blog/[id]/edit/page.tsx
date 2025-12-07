'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

// Post status types matching Prisma schema
type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED'

// Post category types matching Prisma schema
type PostCategory =
  | 'ANCHOR'
  | 'THEME'
  | 'EMERGENT'
  | 'PRACTITIONER'
  | 'PROTOTYPE'
  | 'CONFERENCE'
  | 'METHODOLOGY'

// Form data interface for the blog editor
interface BlogPostFormData {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  category: PostCategory | ''
  seriesId: string
  seriesOrder: number | null
  tags: string[]
  metaTitle: string
  metaDescription: string
  status: PostStatus
  publishedAt: string | null
  scheduledFor: string | null
}

// Schedule Modal Props
interface ScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  onSchedule: (scheduledFor: string) => void
  isLoading: boolean
  currentScheduledFor: string | null
}

// Schedule Modal Component
function ScheduleModal({
  isOpen,
  onClose,
  onSchedule,
  isLoading,
  currentScheduledFor,
}: ScheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('09:00')

  // Initialize with current scheduled date if available
  useEffect(() => {
    if (currentScheduledFor) {
      const date = new Date(currentScheduledFor)
      setSelectedDate(date.toISOString().split('T')[0])
      setSelectedTime(
        date.toTimeString().slice(0, 5)
      )
    } else {
      // Default to tomorrow at 9 AM
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      setSelectedDate(tomorrow.toISOString().split('T')[0])
      setSelectedTime('09:00')
    }
  }, [currentScheduledFor, isOpen])

  const handleSubmit = useCallback(() => {
    if (!selectedDate || !selectedTime) return
    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}:00`)
    onSchedule(scheduledDateTime.toISOString())
  }, [selectedDate, selectedTime, onSchedule])

  if (!isOpen) return null

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-dark-panel border border-border-light dark:border-border-dark"
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-dialog-title"
      >
        <h3
          id="schedule-dialog-title"
          className="text-lg font-semibold text-text-primary dark:text-text-dark-primary font-heading"
        >
          Schedule Post for Publication
        </h3>
        <p className="mt-2 text-sm text-text-secondary dark:text-text-dark-secondary">
          Choose when you want this post to be automatically published.
        </p>

        <div className="mt-6 space-y-4">
          {/* Date Picker */}
          <div>
            <label
              htmlFor="schedule-date"
              className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2"
            >
              Publication Date
            </label>
            <input
              type="date"
              id="schedule-date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              className="w-full rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue px-4 py-2.5 text-text-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
            />
          </div>

          {/* Time Picker */}
          <div>
            <label
              htmlFor="schedule-time"
              className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2"
            >
              Publication Time
            </label>
            <input
              type="time"
              id="schedule-time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue px-4 py-2.5 text-text-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
            />
          </div>

          {/* Preview */}
          {selectedDate && selectedTime && (
            <div className="rounded-lg bg-accent-primary/5 dark:bg-accent-primary/10 p-3 border border-accent-primary/20">
              <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                This post will be published on:
              </p>
              <p className="mt-1 font-medium text-accent-primary">
                {new Date(`${selectedDate}T${selectedTime}:00`).toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg border border-border-light dark:border-border-dark px-4 py-2 text-sm font-medium text-text-secondary dark:text-text-dark-secondary hover:bg-light-neutral-grey dark:hover:bg-dark-deep-blue transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !selectedDate || !selectedTime}
            className="rounded-lg bg-accent-warning px-4 py-2 text-sm font-medium text-white hover:bg-accent-warning/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Scheduling...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Schedule Post
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Toast notification component
interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

function Toast({ message, type, onClose }: ToastProps) {
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

// Icons
const Icons = {
  ArrowLeft: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  ),
}

// Main Blog Editor Page Component
export default function BlogPostEditPage() {
  const router = useRouter()
  const params = useParams()
  const { status: sessionStatus } = useSession()
  const postId = params.id as string

  // Form state
  const [formData, setFormData] = useState<BlogPostFormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // UI state
  const [tagInput, setTagInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [sessionStatus, router])

  // Fetch post data
  useEffect(() => {
    async function fetchPost() {
      if (!postId) return

      try {
        setIsLoading(true)
        const response = await fetch(`/api/admin/posts/${postId}`)

        if (!response.ok) {
          throw new Error('Failed to fetch post')
        }

        const data = await response.json()
        const post = data.post

        setFormData({
          id: post.id,
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          featuredImage: post.featuredImage || '',
          category: post.category || '',
          seriesId: post.seriesId || '',
          seriesOrder: post.seriesOrder || null,
          tags: post.tags?.map((t: { tag: { name: string } }) => t.tag.name) || [],
          metaTitle: post.metaTitle || '',
          metaDescription: post.metaDescription || '',
          status: post.status || 'DRAFT',
          publishedAt: post.publishedAt || null,
          scheduledFor: post.scheduledFor || null,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post')
      } finally {
        setIsLoading(false)
      }
    }

    if (sessionStatus === 'authenticated') {
      fetchPost()
    }
  }, [postId, sessionStatus])

  // Handle form field changes
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => prev ? {
      ...prev,
      [name]: value,
    } : null)
  }, [])

  // Handle tag addition
  const handleAddTag = useCallback(() => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && formData && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => prev ? {
        ...prev,
        tags: [...prev.tags, trimmedTag],
      } : null)
      setTagInput('')
    }
  }, [tagInput, formData])

  // Handle tag removal
  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setFormData(prev => prev ? {
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    } : null)
  }, [])

  // Show toast notification
  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }, [])

  // Save post changes
  const handleSave = useCallback(async () => {
    if (!formData) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/posts/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save post')
      }

      showToast('Post saved successfully', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to save post', 'error')
    } finally {
      setIsSaving(false)
    }
  }, [formData, showToast])

  // Publish post immediately
  const handlePublish = useCallback(async () => {
    if (!formData) return

    setIsPublishing(true)
    try {
      const response = await fetch(`/api/posts/${formData.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to publish post')
      }

      const data = await response.json()
      setFormData(prev => prev ? {
        ...prev,
        status: 'PUBLISHED',
        publishedAt: data.post?.publishedAt || new Date().toISOString(),
        scheduledFor: null,
      } : null)

      showToast('Post published successfully!', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to publish post', 'error')
    } finally {
      setIsPublishing(false)
    }
  }, [formData, showToast])

  // Schedule post for future publication
  const handleSchedule = useCallback(async (scheduledFor: string) => {
    if (!formData) return

    setIsScheduling(true)
    try {
      const response = await fetch(`/api/posts/${formData.id}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledFor }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to schedule post')
      }

      const data = await response.json()
      setFormData(prev => prev ? {
        ...prev,
        status: 'SCHEDULED',
        scheduledFor: data.post?.scheduledFor || scheduledFor,
      } : null)

      setShowScheduleModal(false)
      showToast('Post scheduled successfully!', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to schedule post', 'error')
    } finally {
      setIsScheduling(false)
    }
  }, [formData, showToast])

  // Category options
  const categoryOptions: { value: PostCategory | ''; label: string }[] = [
    { value: '', label: 'Select a category' },
    { value: 'ANCHOR', label: 'Anchor' },
    { value: 'THEME', label: 'Theme Deep Dive' },
    { value: 'EMERGENT', label: 'Emergent Insight' },
    { value: 'PRACTITIONER', label: 'Practitioner Perspective' },
    { value: 'PROTOTYPE', label: 'Prototype Learning' },
    { value: 'CONFERENCE', label: 'Conference Insight' },
    { value: 'METHODOLOGY', label: 'Methodology' },
  ]

  // Loading state
  if (sessionStatus === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary" />
      </div>
    )
  }

  // Error state
  if (error || !formData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-text-secondary dark:text-text-dark-secondary">
          {error || 'Post not found'}
        </p>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-accent-primary text-white hover:bg-accent-primary/90 transition-colors"
        >
          <Icons.ArrowLeft />
          Back to Posts
        </Link>
      </div>
    )
  }

  // Don't render if not authenticated
  if (sessionStatus === 'unauthenticated') {
    return null
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 text-sm text-text-secondary dark:text-text-dark-secondary hover:text-accent-primary transition-colors mb-4"
        >
          <Icons.ArrowLeft />
          Back to Posts
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-text-primary dark:text-text-dark-primary">
              Edit Post
            </h1>

            {/* Status Badge and Scheduled Date */}
            <div className="flex items-center gap-3 mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  formData.status === 'PUBLISHED'
                    ? 'bg-accent-success/10 text-accent-success dark:bg-accent-success-dark/10 dark:text-accent-success-dark'
                    : formData.status === 'SCHEDULED'
                    ? 'bg-accent-warning/10 text-accent-warning dark:bg-accent-warning-dark/10 dark:text-accent-warning-dark'
                    : 'bg-text-muted/10 text-text-muted dark:bg-text-dark-muted/10 dark:text-text-dark-muted'
                }`}
              >
                {formData.status === 'PUBLISHED' ? 'Published' : formData.status === 'SCHEDULED' ? 'Scheduled' : 'Draft'}
              </span>

              {formData.status === 'SCHEDULED' && formData.scheduledFor && (
                <span className="inline-flex items-center gap-1.5 text-sm text-accent-warning dark:text-accent-warning-dark">
                  <Icons.Calendar />
                  {formatDate(formData.scheduledFor, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </span>
              )}

              {formData.status === 'PUBLISHED' && formData.publishedAt && (
                <span className="inline-flex items-center gap-1.5 text-sm text-text-secondary dark:text-text-dark-secondary">
                  <Icons.Calendar />
                  Published {formatDate(formData.publishedAt, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isPublishing || isScheduling}
              className="rounded-lg border border-border-light dark:border-border-dark px-4 py-2 text-sm font-medium text-text-secondary dark:text-text-dark-secondary hover:bg-light-neutral-grey dark:hover:bg-dark-deep-blue transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>

            {/* Schedule Button - only show if not published */}
            {formData.status !== 'PUBLISHED' && (
              <button
                type="button"
                onClick={() => setShowScheduleModal(true)}
                disabled={isSaving || isPublishing || isScheduling}
                className="inline-flex items-center gap-2 rounded-lg bg-accent-warning px-4 py-2 text-sm font-medium text-white hover:bg-accent-warning/90 transition-colors disabled:opacity-50"
              >
                <Icons.Clock />
                {formData.status === 'SCHEDULED' ? 'Reschedule' : 'Schedule'}
              </button>
            )}

            {/* Publish Button - only show if not published */}
            {formData.status !== 'PUBLISHED' && (
              <button
                type="button"
                onClick={handlePublish}
                disabled={isSaving || isPublishing || isScheduling}
                className="rounded-lg bg-accent-success px-4 py-2 text-sm font-medium text-white hover:bg-accent-success/90 transition-colors disabled:opacity-50"
              >
                {isPublishing ? 'Publishing...' : 'Publish Now'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary"
          >
            Title <span className="text-accent-error">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter post title"
            className="w-full rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue px-4 py-2.5 text-text-primary dark:text-text-dark-primary placeholder-text-muted dark:placeholder-text-dark-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
          />
        </div>

        {/* Slug */}
        <div>
          <label
            htmlFor="slug"
            className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary"
          >
            Slug
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="url-friendly-slug"
            className="w-full rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue px-4 py-2.5 text-text-primary dark:text-text-dark-primary placeholder-text-muted dark:placeholder-text-dark-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label
            htmlFor="excerpt"
            className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary"
          >
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
            placeholder="Brief summary of the post"
            className="w-full rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue px-4 py-2.5 text-text-primary dark:text-text-dark-primary placeholder-text-muted dark:placeholder-text-dark-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
          />
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="content"
            className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary"
          >
            Content <span className="text-accent-error">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={15}
            placeholder="Write your post content here (supports MDX)"
            className="w-full rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue px-4 py-2.5 font-mono text-sm text-text-primary dark:text-text-dark-primary placeholder-text-muted dark:placeholder-text-dark-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
          />
        </div>

        {/* Featured Image */}
        <div>
          <label
            htmlFor="featuredImage"
            className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary"
          >
            Featured Image URL
          </label>
          <input
            type="url"
            id="featuredImage"
            name="featuredImage"
            value={formData.featuredImage}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue px-4 py-2.5 text-text-primary dark:text-text-dark-primary placeholder-text-muted dark:placeholder-text-dark-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue px-4 py-2.5 text-text-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label
            htmlFor="tagInput"
            className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary"
          >
            Tags
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="tagInput"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
              placeholder="Add a tag"
              className="flex-1 rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue px-4 py-2.5 text-text-primary dark:text-text-dark-primary placeholder-text-muted dark:placeholder-text-dark-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="rounded-lg bg-accent-primary px-4 py-2 text-sm font-medium text-white hover:bg-accent-primary/90 transition-colors"
            >
              Add
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-accent-primary/10 px-3 py-1 text-sm text-accent-primary"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 rounded-full p-0.5 hover:bg-accent-primary/20"
                    aria-label={`Remove ${tag} tag`}
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* SEO Section */}
        <div className="rounded-xl border border-border-light dark:border-border-dark p-6 bg-light-icy-blue/30 dark:bg-dark-deep-blue/30">
          <h2 className="mb-4 text-lg font-semibold text-text-primary dark:text-text-dark-primary font-heading">
            SEO Settings
          </h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="metaTitle"
                className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary"
              >
                Meta Title
              </label>
              <input
                type="text"
                id="metaTitle"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                placeholder="SEO title (defaults to post title)"
                className="w-full rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-panel px-4 py-2.5 text-text-primary dark:text-text-dark-primary placeholder-text-muted dark:placeholder-text-dark-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="metaDescription"
                className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary"
              >
                Meta Description
              </label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                rows={2}
                placeholder="SEO description (defaults to excerpt)"
                className="w-full rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-panel px-4 py-2.5 text-text-primary dark:text-text-dark-primary placeholder-text-muted dark:placeholder-text-dark-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={handleSchedule}
        isLoading={isScheduling}
        currentScheduledFor={formData.scheduledFor}
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
