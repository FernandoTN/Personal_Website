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
  ogImage: string
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

// Series interface
interface Series {
  id: string
  name: string
  slug: string
}

// Tag interface for existing tags
interface ExistingTag {
  id: string
  name: string
  slug: string
  postCount: number
}

// Schedule Modal Props
interface ScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  onSchedule: (scheduledFor: string) => void
  onMoveToDraft: () => void
  isLoading: boolean
  isMovingToDraft: boolean
  currentScheduledFor: string | null
  isScheduled: boolean
}

// Preview Modal Props
interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  formData: BlogPostFormData
}

// Schedule Modal Component
function ScheduleModal({
  isOpen,
  onClose,
  onSchedule,
  onMoveToDraft,
  isLoading,
  isMovingToDraft,
  currentScheduledFor,
  isScheduled,
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

        {/* Move to Draft option - only show if currently scheduled */}
        {isScheduled && (
          <div className="mt-6 pt-4 border-t border-border-light dark:border-border-dark">
            <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-3">
              Or remove the schedule and move back to draft:
            </p>
            <button
              type="button"
              onClick={onMoveToDraft}
              disabled={isLoading || isMovingToDraft}
              className="w-full rounded-lg border border-text-muted dark:border-text-dark-muted px-4 py-2 text-sm font-medium text-text-secondary dark:text-text-dark-secondary hover:bg-light-neutral-grey dark:hover:bg-dark-deep-blue transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isMovingToDraft ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Moving to Draft...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  Move to Draft
                </>
              )}
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading || isMovingToDraft}
            className="rounded-lg border border-border-light dark:border-border-dark px-4 py-2 text-sm font-medium text-text-secondary dark:text-text-dark-secondary hover:bg-light-neutral-grey dark:hover:bg-dark-deep-blue transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || isMovingToDraft || !selectedDate || !selectedTime}
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
                {isScheduled ? 'Update Schedule' : 'Schedule Post'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Preview Modal Component
function PreviewModal({ isOpen, onClose, formData }: PreviewModalProps) {
  if (!isOpen) return null

  // Get category label
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      ANCHOR: 'Anchor',
      THEME: 'Theme Deep Dive',
      EMERGENT: 'Emergent Insight',
      PRACTITIONER: 'Practitioner Perspective',
      PROTOTYPE: 'Prototype Learning',
      CONFERENCE: 'Conference Insight',
      METHODOLOGY: 'Methodology',
    }
    return labels[category] || category
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      ANCHOR: 'bg-accent-primary text-white',
      THEME: 'bg-category-research text-white',
      EMERGENT: 'bg-accent-secondary text-white',
      PRACTITIONER: 'bg-accent-success text-white',
      PROTOTYPE: 'bg-accent-warning text-white',
      CONFERENCE: 'bg-accent-error text-white',
      METHODOLOGY: 'bg-text-muted text-white',
    }
    return colors[category] || 'bg-text-muted text-white'
  }

  // Format date for preview
  const getDisplayDate = () => {
    if (formData.status === 'PUBLISHED' && formData.publishedAt) {
      return new Date(formData.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    }
    if (formData.status === 'SCHEDULED' && formData.scheduledFor) {
      return new Date(formData.scheduledFor).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    }
    return new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4 rounded-xl bg-light-base dark:bg-dark-base shadow-2xl border border-border-light dark:border-border-dark"
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-dialog-title"
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-light-base/95 dark:bg-dark-base/95 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            <h3 id="preview-dialog-title" className="text-lg font-semibold text-text-primary dark:text-text-dark-primary font-heading">
              Post Preview
            </h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              formData.status === 'PUBLISHED'
                ? 'bg-accent-success/10 text-accent-success'
                : formData.status === 'SCHEDULED'
                ? 'bg-accent-warning/10 text-accent-warning'
                : 'bg-text-muted/10 text-text-muted'
            }`}>
              {formData.status === 'PUBLISHED' ? 'Published' : formData.status === 'SCHEDULED' ? 'Scheduled' : 'Draft'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-secondary dark:text-text-dark-secondary hover:bg-light-neutral-grey dark:hover:bg-dark-panel transition-colors"
            aria-label="Close preview"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Preview Content - Simulating the blog post layout */}
        <div className="p-6 md:p-10">
          {/* Featured Image */}
          {formData.featuredImage && (
            <div className="mb-8 rounded-xl overflow-hidden aspect-video bg-light-neutral-grey dark:bg-dark-panel">
              <img
                src={formData.featuredImage}
                alt={formData.title || 'Featured image'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}

          {/* Category & Date */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {formData.category && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(formData.category)}`}>
                {getCategoryLabel(formData.category)}
              </span>
            )}
            <span className="text-sm text-text-secondary dark:text-text-dark-secondary">
              {getDisplayDate()}
            </span>
            <span className="text-sm text-text-muted dark:text-text-dark-muted">
              • 5 min read
            </span>
          </div>

          {/* Title */}
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary dark:text-text-dark-primary mb-4 leading-tight">
            {formData.title || 'Untitled Post'}
          </h1>

          {/* Excerpt */}
          {formData.excerpt && (
            <p className="text-lg text-text-secondary dark:text-text-dark-secondary mb-6 leading-relaxed">
              {formData.excerpt}
            </p>
          )}

          {/* Tags */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-accent-primary/10 text-accent-primary dark:bg-accent-primary/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <hr className="border-border-light dark:border-border-dark mb-8" />

          {/* Content Preview */}
          <div className="prose dark:prose-invert max-w-none prose-headings:font-heading prose-headings:text-text-primary dark:prose-headings:text-text-dark-primary prose-p:text-text-secondary dark:prose-p:text-text-dark-secondary prose-a:text-accent-primary prose-strong:text-text-primary dark:prose-strong:text-text-dark-primary prose-code:text-accent-primary prose-code:bg-light-neutral-grey dark:prose-code:bg-dark-panel prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-dark-base prose-pre:text-text-dark-primary">
            {formData.content ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: formData.content.slice(0, 3000) + (formData.content.length > 3000 ? '<p class="text-text-muted dark:text-text-dark-muted italic mt-4">... [Content truncated in preview]</p>' : '')
                }}
              />
            ) : (
              <p className="text-text-muted dark:text-text-dark-muted italic">
                No content yet. Add content to see it in the preview.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-light-neutral-grey/80 dark:bg-dark-panel/80 backdrop-blur-sm border-t border-border-light dark:border-border-dark flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-accent-primary px-6 py-2 text-sm font-medium text-white hover:bg-accent-primary/90 transition-colors"
          >
            Close Preview
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
  Eye: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
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
  const [seriesList, setSeriesList] = useState<Series[]>([])
  const [existingTags, setExistingTags] = useState<ExistingTag[]>([])
  const [showTagSelector, setShowTagSelector] = useState(false)
  const [isUploadingFeatured, setIsUploadingFeatured] = useState(false)
  const [isUploadingOg, setIsUploadingOg] = useState(false)

  // UI state
  const [tagInput, setTagInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)
  const [isMovingToDraft, setIsMovingToDraft] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [sessionStatus, router])

  // Fetch post data and series list
  useEffect(() => {
    async function fetchData() {
      if (!postId) return

      try {
        setIsLoading(true)

        // Fetch post, series, and existing tags in parallel
        const [postResponse, seriesResponse, tagsResponse] = await Promise.all([
          fetch(`/api/admin/posts/${postId}`),
          fetch('/api/series'),
          fetch('/api/tags')
        ])

        if (!postResponse.ok) {
          throw new Error('Failed to fetch post')
        }

        const postData = await postResponse.json()
        const post = postData.post

        // Set series list
        if (seriesResponse.ok) {
          const seriesData = await seriesResponse.json()
          setSeriesList(seriesData.series || seriesData || [])
        }

        // Set existing tags
        if (tagsResponse.ok) {
          const tagsData = await tagsResponse.json()
          setExistingTags(tagsData.tags || [])
        }

        setFormData({
          id: post.id,
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          featuredImage: post.featuredImage || '',
          ogImage: post.ogImage || '',
          category: post.category || '',
          seriesId: post.seriesId || '',
          seriesOrder: post.seriesOrder ?? null,
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
      fetchData()
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

  // Handle selecting an existing tag
  const handleSelectExistingTag = useCallback((tagName: string) => {
    if (formData && !formData.tags.includes(tagName)) {
      setFormData(prev => prev ? {
        ...prev,
        tags: [...prev.tags, tagName],
      } : null)
    }
  }, [formData])

  // Show toast notification
  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }, [])

  // Handle image upload
  const handleImageUpload = useCallback(async (
    file: File,
    field: 'featuredImage' | 'ogImage'
  ) => {
    const setUploading = field === 'featuredImage' ? setIsUploadingFeatured : setIsUploadingOg

    setUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('folder', 'blog')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()

      setFormData(prev => prev ? {
        ...prev,
        [field]: data.url,
      } : null)

      showToast('Image uploaded successfully!', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }, [showToast])

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

  // Move post back to draft (remove scheduling)
  const handleMoveToDraft = useCallback(async () => {
    if (!formData) return

    setIsMovingToDraft(true)
    try {
      const response = await fetch(`/api/admin/posts/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'DRAFT',
          scheduledFor: null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to move post to draft')
      }

      setFormData(prev => prev ? {
        ...prev,
        status: 'DRAFT',
        scheduledFor: null,
      } : null)

      setShowScheduleModal(false)
      showToast('Post moved to draft successfully!', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to move post to draft', 'error')
    } finally {
      setIsMovingToDraft(false)
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
            {/* Preview Button */}
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-accent-primary px-4 py-2 text-sm font-medium text-accent-primary hover:bg-accent-primary/10 transition-colors"
            >
              <Icons.Eye />
              Preview
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isPublishing || isScheduling || isMovingToDraft}
              className="rounded-lg border border-border-light dark:border-border-dark px-4 py-2 text-sm font-medium text-text-secondary dark:text-text-dark-secondary hover:bg-light-neutral-grey dark:hover:bg-dark-deep-blue transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>

            {/* Schedule Button - only show if not published */}
            {formData.status !== 'PUBLISHED' && (
              <button
                type="button"
                onClick={() => setShowScheduleModal(true)}
                disabled={isSaving || isPublishing || isScheduling || isMovingToDraft}
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
                disabled={isSaving || isPublishing || isScheduling || isMovingToDraft}
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
          <div className="flex gap-2">
            <input
              type="url"
              id="featuredImage"
              name="featuredImage"
              value={formData.featuredImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="flex-1 rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue px-4 py-2.5 text-text-primary dark:text-text-dark-primary placeholder-text-muted dark:placeholder-text-dark-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
            />
            <label className="relative cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file, 'featuredImage')
                }}
                disabled={isUploadingFeatured}
              />
              <span className={`inline-flex items-center gap-2 rounded-lg border border-accent-primary px-4 py-2.5 text-sm font-medium text-accent-primary hover:bg-accent-primary/10 transition-colors ${isUploadingFeatured ? 'opacity-50 cursor-wait' : ''}`}>
                {isUploadingFeatured ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    Upload
                  </>
                )}
              </span>
            </label>
          </div>
          {formData.featuredImage && (
            <div className="mt-3 relative rounded-lg overflow-hidden border border-border-light dark:border-border-dark max-w-xs">
              <img
                src={formData.featuredImage}
                alt="Featured image preview"
                className="w-full h-auto max-h-40 object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
          )}
        </div>

        {/* OG Image */}
        <div>
          <label
            htmlFor="ogImage"
            className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary"
          >
            Social Share Image (OG Image)
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              id="ogImage"
              name="ogImage"
              value={formData.ogImage}
              onChange={handleChange}
              placeholder="https://example.com/og-image.jpg (defaults to featured image)"
              className="flex-1 rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue px-4 py-2.5 text-text-primary dark:text-text-dark-primary placeholder-text-muted dark:placeholder-text-dark-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
            />
            <label className="relative cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file, 'ogImage')
                }}
                disabled={isUploadingOg}
              />
              <span className={`inline-flex items-center gap-2 rounded-lg border border-accent-primary px-4 py-2.5 text-sm font-medium text-accent-primary hover:bg-accent-primary/10 transition-colors ${isUploadingOg ? 'opacity-50 cursor-wait' : ''}`}>
                {isUploadingOg ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    Upload
                  </>
                )}
              </span>
            </label>
          </div>
          <p className="mt-1 text-xs text-text-muted dark:text-text-dark-muted">
            Image used when sharing on social media. Falls back to featured image if not set.
          </p>
          {formData.ogImage && (
            <div className="mt-3 relative rounded-lg overflow-hidden border border-border-light dark:border-border-dark max-w-xs">
              <img
                src={formData.ogImage}
                alt="OG image preview"
                className="w-full h-auto max-h-40 object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
          )}
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

        {/* Series Section */}
        <div className="rounded-xl border border-border-light dark:border-border-dark p-6 bg-accent-primary/5 dark:bg-accent-primary/10">
          <h2 className="mb-4 text-lg font-semibold text-text-primary dark:text-text-dark-primary font-heading">
            Series Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Series Dropdown */}
            <div>
              <label
                htmlFor="seriesId"
                className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary"
              >
                Series
              </label>
              <select
                id="seriesId"
                name="seriesId"
                value={formData.seriesId}
                onChange={handleChange}
                className="w-full rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-panel px-4 py-2.5 text-text-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
              >
                <option value="">No series (standalone post)</option>
                {seriesList.map(series => (
                  <option key={series.id} value={series.id}>
                    {series.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-text-muted dark:text-text-dark-muted">
                Assign this post to a series for grouping related content.
              </p>
            </div>

            {/* Series Order */}
            <div>
              <label
                htmlFor="seriesOrder"
                className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary"
              >
                Order in Series
              </label>
              <input
                type="number"
                id="seriesOrder"
                name="seriesOrder"
                value={formData.seriesOrder ?? ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? null : parseInt(e.target.value, 10)
                  setFormData(prev => prev ? { ...prev, seriesOrder: value } : null)
                }}
                min="1"
                placeholder="e.g., 1, 2, 3..."
                disabled={!formData.seriesId}
                className="w-full rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-panel px-4 py-2.5 text-text-primary dark:text-text-dark-primary placeholder-text-muted dark:placeholder-text-dark-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-text-muted dark:text-text-dark-muted">
                {formData.seriesId ? 'Position of this post within the series.' : 'Select a series first.'}
              </p>
            </div>
          </div>
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
            <button
              type="button"
              onClick={() => setShowTagSelector(!showTagSelector)}
              className="rounded-lg border border-accent-primary px-4 py-2 text-sm font-medium text-accent-primary hover:bg-accent-primary/10 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
              </svg>
              Existing
            </button>
          </div>

          {/* Existing Tags Selector */}
          {showTagSelector && existingTags.length > 0 && (
            <div className="mt-3 p-4 rounded-lg border border-border-light dark:border-border-dark bg-light-neutral-grey/50 dark:bg-dark-panel/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-text-primary dark:text-text-dark-primary">
                  Select from existing tags
                </h4>
                <button
                  type="button"
                  onClick={() => setShowTagSelector(false)}
                  className="text-text-muted hover:text-text-primary dark:hover:text-text-dark-primary"
                  aria-label="Close tag selector"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {existingTags
                  .filter(tag => !formData.tags.includes(tag.name))
                  .map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        handleSelectExistingTag(tag.name)
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-accent-primary/30 bg-white dark:bg-dark-base px-3 py-1 text-sm text-accent-primary hover:bg-accent-primary/10 transition-colors"
                    >
                      {tag.name}
                      {tag.postCount > 0 && (
                        <span className="text-xs text-text-muted dark:text-text-dark-muted">
                          ({tag.postCount})
                        </span>
                      )}
                    </button>
                  ))}
              </div>
              {existingTags.filter(tag => !formData.tags.includes(tag.name)).length === 0 && (
                <p className="text-sm text-text-muted dark:text-text-dark-muted italic">
                  All available tags have been added.
                </p>
              )}
            </div>
          )}

          {showTagSelector && existingTags.length === 0 && (
            <div className="mt-3 p-4 rounded-lg border border-border-light dark:border-border-dark bg-light-neutral-grey/50 dark:bg-dark-panel/50">
              <p className="text-sm text-text-muted dark:text-text-dark-muted italic">
                No existing tags found. Create new tags by typing them above.
              </p>
            </div>
          )}

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
        onMoveToDraft={handleMoveToDraft}
        isLoading={isScheduling}
        isMovingToDraft={isMovingToDraft}
        currentScheduledFor={formData.scheduledFor}
        isScheduled={formData.status === 'SCHEDULED'}
      />

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        formData={formData}
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
