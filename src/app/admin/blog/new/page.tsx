'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

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
  publishDate: string
  publishTime: string
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

// Basic markdown to HTML parser for preview
function parseMarkdown(markdown: string): string {
  if (!markdown.trim()) return ''

  const html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
    // Code blocks
    .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-md my-4 overflow-x-auto text-sm font-mono"><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/gim, '<code class="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-accent-primary pl-4 my-4 italic text-text-secondary dark:text-text-dark-secondary">$1</blockquote>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-accent-primary hover:underline">$1</a>')
    // Unordered lists
    .replace(/^\s*[-*] (.*$)/gim, '<li class="ml-6 list-disc">$1</li>')
    // Paragraphs (double line breaks)
    .replace(/\n\n/gim, '</p><p class="my-4">')
    // Line breaks
    .replace(/\n/gim, '<br>')

  return `<div class="prose max-w-none"><p class="my-4">${html}</p></div>`
}

// Schedule Modal Component
interface ScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  onSchedule: (scheduledFor: string) => void
  isLoading: boolean
}

function ScheduleModal({ isOpen, onClose, onSchedule, isLoading }: ScheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('09:00')

  useEffect(() => {
    if (isOpen) {
      // Default to tomorrow at 9 AM
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      setSelectedDate(tomorrow.toISOString().split('T')[0])
      setSelectedTime('09:00')
    }
  }, [isOpen])

  const handleSubmit = useCallback(() => {
    if (!selectedDate || !selectedTime) return
    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}:00`)
    onSchedule(scheduledDateTime.toISOString())
  }, [selectedDate, selectedTime, onSchedule])

  if (!isOpen) return null

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-dark-panel border border-border-light dark:border-border-dark"
        role="dialog"
        aria-modal="true"
      >
        <h3 className="text-lg font-semibold text-text-primary dark:text-text-dark-primary font-heading">
          Schedule Post for Publication
        </h3>
        <p className="mt-2 text-sm text-text-secondary dark:text-text-dark-secondary">
          Choose when you want this post to be automatically published.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="schedule-date" className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
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

          <div>
            <label htmlFor="schedule-time" className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
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
            className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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

// Confirmation Dialog Component
interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      <div
        className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-dark-panel border border-border-light dark:border-border-dark"
        role="dialog"
        aria-modal="true"
      >
        <h3 className="text-lg font-semibold text-text-primary dark:text-text-dark-primary">
          {title}
        </h3>
        <p className="mt-2 text-sm text-text-secondary dark:text-text-dark-secondary">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg border border-border-light dark:border-border-dark px-4 py-2 text-sm font-medium text-text-secondary dark:text-text-dark-secondary hover:bg-light-neutral-grey dark:hover:bg-dark-deep-blue transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Publishing...
              </>
            ) : (
              confirmText
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
        type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
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
      <button onClick={onClose} className="ml-2 rounded p-1 hover:bg-white/20" aria-label="Close">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Main Blog Editor Page Component
export default function NewBlogPostPage() {
  const router = useRouter()
  const { status: sessionStatus } = useSession()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [sessionStatus, router])

  // Form state
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    ogImage: '',
    category: '',
    seriesId: '',
    seriesOrder: null,
    tags: [],
    metaTitle: '',
    metaDescription: '',
    status: 'DRAFT',
    publishDate: '',
    publishTime: '09:00',
  })

  // Data state
  const [seriesList, setSeriesList] = useState<Series[]>([])
  const [existingTags, setExistingTags] = useState<ExistingTag[]>([])

  // UI state
  const [tagInput, setTagInput] = useState('')
  const [showTagSelector, setShowTagSelector] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)
  const [isUploadingFeatured, setIsUploadingFeatured] = useState(false)
  const [isUploadingOg, setIsUploadingOg] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [savedPostId, setSavedPostId] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  // Refs
  const featuredFileInputRef = useRef<HTMLInputElement>(null)
  const ogFileInputRef = useRef<HTMLInputElement>(null)

  // Fetch series and tags on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [seriesResponse, tagsResponse] = await Promise.all([
          fetch('/api/series'),
          fetch('/api/tags'),
        ])

        if (seriesResponse.ok) {
          const seriesData = await seriesResponse.json()
          setSeriesList(seriesData.series || [])
        }

        if (tagsResponse.ok) {
          const tagsData = await tagsResponse.json()
          setExistingTags(tagsData.tags || [])
        }
      } catch (err) {
        console.error('Failed to fetch data:', err)
      }
    }

    fetchData()
  }, [])

  // Parsed markdown content for preview
  const parsedContent = useMemo(() => {
    return parseMarkdown(formData.content)
  }, [formData.content])

  // Auto-generate slug from title
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      slug: prev.slug || generateSlug(newTitle),
    }))
  }, [])

  // Handle form field changes
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  // Handle tag addition
  const handleAddTag = useCallback(() => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }))
      setTagInput('')
    }
  }, [tagInput, formData.tags])

  // Handle tag removal
  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }))
  }, [])

  // Handle selecting an existing tag
  const handleSelectExistingTag = useCallback((tagName: string) => {
    if (!formData.tags.includes(tagName)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagName],
      }))
    }
  }, [formData.tags])

  // Handle image upload using client-side upload (supports larger files up to 10MB)
  const handleImageUpload = useCallback(async (file: File, field: 'featuredImage' | 'ogImage') => {
    const setUploading = field === 'featuredImage' ? setIsUploadingFeatured : setIsUploadingOg

    setUploading(true)
    try {
      // Validate file before upload
      if (!file || file.size === 0) {
        throw new Error('No file selected or file is empty')
      }

      // Check file size (10MB limit for client uploads)
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 10MB.`)
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Invalid file type. Allowed: JPEG, PNG, WebP, GIF, SVG`)
      }

      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 8)
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const baseName = file.name
        .replace(/\.[^.]+$/, '')
        .replace(/[^a-zA-Z0-9-_]/g, '-')
        .substring(0, 50)
      const pathname = `blog/${baseName}-${timestamp}-${randomString}.${extension}`

      // Import and use client upload
      const { upload } = await import('@vercel/blob/client')

      const blob = await upload(pathname, file, {
        access: 'public',
        handleUploadUrl: '/api/upload/client-token',
      })

      setFormData(prev => ({
        ...prev,
        [field]: blob.url,
      }))

      showToast('Image uploaded successfully!', 'success')
    } catch (err) {
      console.error('Upload error:', err)
      showToast(err instanceof Error ? err.message : 'Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }, [])

  // Show toast notification
  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }, [])

  // Save post as draft
  const handleSaveDraft = useCallback(async () => {
    if (!formData.title.trim()) {
      showToast('Please enter a title', 'error')
      return
    }

    setIsSaving(true)
    try {
      const postData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt,
        content: formData.content,
        featuredImage: formData.featuredImage || null,
        ogImage: formData.ogImage || null,
        category: formData.category || null,
        seriesId: formData.seriesId || null,
        seriesOrder: formData.seriesOrder,
        tags: formData.tags,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        status: 'DRAFT',
      }

      const url = savedPostId ? `/api/admin/posts/${savedPostId}` : '/api/posts'
      const method = savedPostId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save post')
      }

      const data = await response.json()
      setSavedPostId(data.post?.id || data.id)
      showToast('Post saved as draft', 'success')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to save post', 'error')
    } finally {
      setIsSaving(false)
    }
  }, [formData, savedPostId, showToast])

  // Open publish confirmation dialog
  const handlePublishClick = useCallback(() => {
    if (!formData.title.trim()) {
      showToast('Please enter a title before publishing', 'error')
      return
    }
    if (!formData.content.trim()) {
      showToast('Please add content before publishing', 'error')
      return
    }
    setShowPublishDialog(true)
  }, [formData.title, formData.content, showToast])

  // Confirm and publish post
  const handleConfirmPublish = useCallback(async () => {
    setIsPublishing(true)
    try {
      let postId = savedPostId

      // First create the post if not saved
      if (!postId) {
        const postData = {
          title: formData.title,
          slug: formData.slug || generateSlug(formData.title),
          excerpt: formData.excerpt,
          content: formData.content,
          featuredImage: formData.featuredImage || null,
          ogImage: formData.ogImage || null,
          category: formData.category || null,
          seriesId: formData.seriesId || null,
          seriesOrder: formData.seriesOrder,
          tags: formData.tags,
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
          status: 'DRAFT',
        }

        const saveResponse = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        })

        if (!saveResponse.ok) {
          const errorData = await saveResponse.json()
          throw new Error(errorData.error || 'Failed to create post')
        }

        const saveData = await saveResponse.json()
        postId = saveData.post?.id || saveData.id
        setSavedPostId(postId)
      }

      // Now publish the post
      const publishResponse = await fetch(`/api/posts/${postId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!publishResponse.ok) {
        const errorData = await publishResponse.json()
        throw new Error(errorData.error || 'Failed to publish post')
      }

      showToast('Post published successfully!', 'success')
      setShowPublishDialog(false)

      setTimeout(() => {
        router.push('/admin/posts')
      }, 1500)
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to publish post', 'error')
    } finally {
      setIsPublishing(false)
    }
  }, [formData, savedPostId, showToast, router])

  // Open schedule modal
  const handleScheduleClick = useCallback(() => {
    if (!formData.title.trim()) {
      showToast('Please enter a title before scheduling', 'error')
      return
    }
    if (!formData.content.trim()) {
      showToast('Please add content before scheduling', 'error')
      return
    }
    setShowScheduleModal(true)
  }, [formData.title, formData.content, showToast])

  // Schedule post
  const handleSchedule = useCallback(async (scheduledFor: string) => {
    setIsScheduling(true)
    try {
      let postId = savedPostId

      // First create the post if not saved
      if (!postId) {
        const postData = {
          title: formData.title,
          slug: formData.slug || generateSlug(formData.title),
          excerpt: formData.excerpt,
          content: formData.content,
          featuredImage: formData.featuredImage || null,
          ogImage: formData.ogImage || null,
          category: formData.category || null,
          seriesId: formData.seriesId || null,
          seriesOrder: formData.seriesOrder,
          tags: formData.tags,
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
          status: 'DRAFT',
        }

        const saveResponse = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        })

        if (!saveResponse.ok) {
          const errorData = await saveResponse.json()
          throw new Error(errorData.error || 'Failed to create post')
        }

        const saveData = await saveResponse.json()
        postId = saveData.post?.id || saveData.id
        setSavedPostId(postId)
      }

      // Now schedule the post
      const scheduleResponse = await fetch(`/api/posts/${postId}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledFor }),
      })

      if (!scheduleResponse.ok) {
        const errorData = await scheduleResponse.json()
        throw new Error(errorData.error || 'Failed to schedule post')
      }

      showToast('Post scheduled successfully!', 'success')
      setShowScheduleModal(false)

      setTimeout(() => {
        router.push('/admin/posts')
      }, 1500)
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to schedule post', 'error')
    } finally {
      setIsScheduling(false)
    }
  }, [formData, savedPostId, showToast, router])

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
  if (sessionStatus === 'loading') {
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

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-2 text-sm text-text-secondary dark:text-text-dark-secondary hover:text-accent-primary transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Posts
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-text-primary dark:text-text-dark-primary">
              Create New Post
            </h1>
            <p className="text-sm text-text-secondary dark:text-text-dark-secondary mt-1">
              {savedPostId ? 'Draft saved' : 'Not saved yet'}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            {/* Preview Button */}
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center gap-2 rounded-lg border border-accent-primary px-4 py-2 text-sm font-medium text-accent-primary hover:bg-accent-primary/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              {showPreview ? 'Edit' : 'Preview'}
            </button>

            {/* Save Draft Button */}
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving || isPublishing || isScheduling}
              className="rounded-lg border border-border-light dark:border-border-dark px-4 py-2 text-sm font-medium text-text-secondary dark:text-text-dark-secondary hover:bg-light-neutral-grey dark:hover:bg-dark-deep-blue transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Draft'}
            </button>

            {/* Schedule Button */}
            <button
              type="button"
              onClick={handleScheduleClick}
              disabled={isSaving || isPublishing || isScheduling}
              className="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Schedule
            </button>

            {/* Publish Button */}
            <button
              type="button"
              onClick={handlePublishClick}
              disabled={isSaving || isPublishing || isScheduling}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isPublishing ? 'Publishing...' : 'Publish Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Title */}
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="Enter post title"
            className="w-full rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue px-4 py-2.5 text-text-primary dark:text-text-dark-primary placeholder-text-muted dark:placeholder-text-dark-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary">
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
          <label htmlFor="excerpt" className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary">
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
          <label htmlFor="content" className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary">
            Content <span className="text-red-500">*</span>
          </label>
          {showPreview ? (
            <div className="min-h-[400px] p-4 rounded-lg bg-light-neutral-grey dark:bg-dark-deep-blue border border-border-light dark:border-border-dark overflow-auto">
              {parsedContent ? (
                <div className="text-text-primary dark:text-text-dark-primary" dangerouslySetInnerHTML={{ __html: parsedContent }} />
              ) : (
                <p className="text-text-muted dark:text-text-dark-muted italic">Nothing to preview yet...</p>
              )}
            </div>
          ) : (
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={15}
              placeholder="Write your post content here (supports Markdown)"
              className="w-full rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue px-4 py-2.5 font-mono text-sm text-text-primary dark:text-text-dark-primary placeholder-text-muted dark:placeholder-text-dark-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
            />
          )}
        </div>

        {/* Featured Image */}
        <div>
          <label htmlFor="featuredImage" className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary">
            Featured Image
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              id="featuredImage"
              name="featuredImage"
              value={formData.featuredImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg or upload below"
              className="flex-1 rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue px-4 py-2.5 text-text-primary dark:text-text-dark-primary placeholder-text-muted dark:placeholder-text-dark-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
            />
            <label className="relative cursor-pointer">
              <input
                ref={featuredFileInputRef}
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
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* OG Image */}
        <div>
          <label htmlFor="ogImage" className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary">
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
                ref={ogFileInputRef}
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
                {isUploadingOg ? 'Uploading...' : 'Upload'}
              </span>
            </label>
          </div>
          <p className="mt-1 text-xs text-text-muted dark:text-text-dark-muted">
            Image used when sharing on social media. Falls back to featured image if not set.
          </p>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary">
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
              <label htmlFor="seriesId" className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary">
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
              <label htmlFor="seriesOrder" className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary">
                Order in Series
              </label>
              <input
                type="number"
                id="seriesOrder"
                name="seriesOrder"
                value={formData.seriesOrder ?? ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? null : parseInt(e.target.value, 10)
                  setFormData(prev => ({ ...prev, seriesOrder: value }))
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
          <label htmlFor="tagInput" className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary">
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
            {existingTags.length > 0 && (
              <button
                type="button"
                onClick={() => setShowTagSelector(!showTagSelector)}
                className="rounded-lg border border-accent-primary px-4 py-2 text-sm font-medium text-accent-primary hover:bg-accent-primary/10 transition-colors"
              >
                Existing
              </button>
            )}
          </div>

          {/* Selected Tags */}
          {formData.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-accent-primary/10 text-accent-primary"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:bg-accent-primary/20 rounded-full p-0.5"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

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
                      onClick={() => handleSelectExistingTag(tag.name)}
                      className="px-3 py-1.5 rounded-full text-sm bg-light-neutral-grey dark:bg-dark-deep-blue text-text-primary dark:text-text-dark-primary hover:bg-accent-primary/10 hover:text-accent-primary transition-colors"
                    >
                      {tag.name} ({tag.postCount})
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* SEO Section */}
        <div className="rounded-xl border border-border-light dark:border-border-dark p-6">
          <h2 className="mb-4 text-lg font-semibold text-text-primary dark:text-text-dark-primary font-heading">
            SEO Settings
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="metaTitle" className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary">
                Meta Title
              </label>
              <input
                type="text"
                id="metaTitle"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                placeholder="SEO title (defaults to post title)"
                className="w-full rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue px-4 py-2.5 text-text-primary dark:text-text-dark-primary placeholder-text-muted dark:placeholder-text-dark-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
              />
            </div>

            <div>
              <label htmlFor="metaDescription" className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary">
                Meta Description
              </label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                rows={2}
                placeholder="SEO description (defaults to excerpt)"
                className="w-full rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue px-4 py-2.5 text-text-primary dark:text-text-dark-primary placeholder-text-muted dark:placeholder-text-dark-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
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
      />

      {/* Publish Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showPublishDialog}
        title="Publish Post"
        message="Are you sure you want to publish this post? It will be immediately visible to the public."
        confirmText="Publish"
        cancelText="Cancel"
        onConfirm={handleConfirmPublish}
        onCancel={() => setShowPublishDialog(false)}
        isLoading={isPublishing}
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
