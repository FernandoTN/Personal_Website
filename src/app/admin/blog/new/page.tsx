'use client'

import { useState, useCallback, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
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
  featuredImage: string | null
  featuredImageFile: File | null
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

// Status options for the dropdown
const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'SCHEDULED', label: 'Scheduled' },
] as const

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

// Confirmation dialog props
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

// Confirmation Dialog Component
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-dark-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <h3
          id="dialog-title"
          className="text-lg font-semibold text-text-primary dark:text-text-dark-primary"
        >
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
            className="rounded-md border border-light-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-light-neutral-grey disabled:opacity-50 dark:border-dark-border dark:text-text-dark-secondary dark:hover:bg-dark-card-hover"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-md bg-accent-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-blue/90 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
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
                Publishing...
              </span>
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
        type === 'success'
          ? 'bg-accent-green text-white'
          : 'bg-accent-red text-white'
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

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Main Blog Editor Page Component
export default function BlogEditorPage() {
  const router = useRouter()

  // Form state
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: null,
    featuredImageFile: null,
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

  // UI state
  const [tagInput, setTagInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [savedPostId, setSavedPostId] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  // Handle featured image upload
  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        featuredImage: reader.result as string,
        featuredImageFile: file,
      }))
    }
    reader.readAsDataURL(file)
  }, [])

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file && file.type.startsWith('image/')) {
        handleImageUpload(file)
      }
    },
    [handleImageUpload]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file && file.type.startsWith('image/')) {
        handleImageUpload(file)
      }
    },
    [handleImageUpload]
  )

  const removeImage = useCallback(() => {
    setFormData(prev => ({ ...prev, featuredImage: null, featuredImageFile: null }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
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
      const response = await fetch('/api/posts', {
        method: savedPostId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: savedPostId,
          status: 'DRAFT',
        }),
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
      // First, save or create the post if not yet saved
      let postId = savedPostId

      if (!postId) {
        const saveResponse = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            status: 'DRAFT',
          }),
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

      // Redirect to post list after successful publish
      setTimeout(() => {
        router.push('/admin/posts')
      }, 1500)
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to publish post', 'error')
    } finally {
      setIsPublishing(false)
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

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-text-dark-secondary mb-2">
            <Link
              href="/admin/posts"
              className="hover:text-accent-primary transition-colors"
            >
              Posts
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-text-primary dark:text-text-dark-primary">New Post</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-text-primary dark:text-text-dark-primary">
            Create New Post
          </h1>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="btn-outline px-4 py-2 text-sm flex items-center"
          >
            {showPreview ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving || isPublishing}
            className="btn-secondary px-4 py-2 text-sm"
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={handlePublishClick}
            disabled={isSaving || isPublishing}
            className="btn-primary px-4 py-2 text-sm"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title Input */}
          <div className="card">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2"
            >
              Title <span className="text-accent-error">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              className="input text-xl font-heading"
              placeholder="Enter post title..."
            />
          </div>

          {/* Slug Input */}
          <div className="card">
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2"
            >
              Slug
            </label>
            <div className="flex items-center">
              <span className="text-text-secondary dark:text-text-dark-secondary text-sm mr-2">
                /blog/
              </span>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="input flex-1"
                placeholder="post-url-slug"
              />
            </div>
          </div>

          {/* Content Area with Preview Toggle */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-text-primary dark:text-text-dark-primary"
              >
                Content <span className="text-accent-error">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted dark:text-text-dark-muted">
                  Markdown supported
                </span>
                <div className="flex rounded-md overflow-hidden border border-border-light dark:border-border-dark">
                  <button
                    type="button"
                    onClick={() => setShowPreview(false)}
                    className={`px-3 py-1 text-xs font-medium transition-colors ${
                      !showPreview
                        ? 'bg-accent-primary text-white'
                        : 'bg-light-neutral-grey dark:bg-dark-panel text-text-secondary dark:text-text-dark-secondary hover:bg-light-icy-blue dark:hover:bg-dark-deep-blue'
                    }`}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPreview(true)}
                    className={`px-3 py-1 text-xs font-medium transition-colors ${
                      showPreview
                        ? 'bg-accent-primary text-white'
                        : 'bg-light-neutral-grey dark:bg-dark-panel text-text-secondary dark:text-text-dark-secondary hover:bg-light-icy-blue dark:hover:bg-dark-deep-blue'
                    }`}
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>

            {showPreview ? (
              <div className="min-h-[400px] p-4 rounded-md bg-light-icy-blue dark:bg-dark-deep-blue border border-border-light dark:border-border-dark overflow-auto">
                {parsedContent ? (
                  <div
                    className="text-text-primary dark:text-text-dark-primary"
                    dangerouslySetInnerHTML={{ __html: parsedContent }}
                  />
                ) : (
                  <p className="text-text-muted dark:text-text-dark-muted italic">
                    Nothing to preview yet...
                  </p>
                )}
              </div>
            ) : (
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={16}
                className="input resize-none font-mono text-sm"
                placeholder="Write your content in Markdown..."
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Scheduling */}
          <div className="card">
            <h3 className="font-heading font-semibold text-text-primary dark:text-text-dark-primary mb-4">
              Publish Settings
            </h3>

            {/* Status Select */}
            <div className="mb-4">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Scheduled Date/Time (visible when scheduled) */}
            {formData.status === 'SCHEDULED' && (
              <div className="space-y-4 p-4 rounded-md bg-light-icy-blue dark:bg-dark-deep-blue">
                <div>
                  <label
                    htmlFor="publishDate"
                    className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2"
                  >
                    Publish Date <span className="text-accent-error">*</span>
                  </label>
                  <input
                    type="date"
                    id="publishDate"
                    name="publishDate"
                    value={formData.publishDate}
                    onChange={handleChange}
                    className="input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label
                    htmlFor="publishTime"
                    className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2"
                  >
                    Publish Time
                  </label>
                  <input
                    type="time"
                    id="publishTime"
                    name="publishTime"
                    value={formData.publishTime}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Category */}
          <div className="card">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
            >
              {categoryOptions.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="card">
            <label
              htmlFor="tagInput"
              className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2"
            >
              Tags
            </label>

            {/* Selected Tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-accent-primary/10 text-accent-primary"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-accent-primary/20 rounded-full p-0.5 transition-colors"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Tag Input */}
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
                className="input flex-1"
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="btn-primary px-3 py-2 text-sm"
              >
                Add
              </button>
            </div>
          </div>

          {/* Featured Image */}
          <div className="card">
            <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
              Featured Image
            </label>

            {formData.featuredImage ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.featuredImage}
                  alt="Featured image preview"
                  className="w-full h-40 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-dark-base/80 text-white hover:bg-dark-base transition-colors"
                  aria-label="Remove featured image"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div
                className={`
                  relative border-2 border-dashed rounded-md p-6 text-center transition-colors cursor-pointer
                  ${isDragging
                    ? 'border-accent-primary bg-accent-primary/5'
                    : 'border-border-light dark:border-border-dark hover:border-accent-primary hover:bg-light-icy-blue dark:hover:bg-dark-deep-blue'
                  }
                `}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    fileInputRef.current?.click()
                  }
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                  aria-label="Upload featured image"
                />
                <svg
                  className="mx-auto h-12 w-12 text-text-muted dark:text-text-dark-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-2 text-sm text-text-secondary dark:text-text-dark-secondary">
                  <span className="text-accent-primary font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-text-muted dark:text-text-dark-muted mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

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
