'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

// LinkedIn post status types
type LinkedInStatus = 'PENDING' | 'MANUALLY_SCHEDULED' | 'POSTED'

// LinkedIn post data interface
interface LinkedInPostData {
  id: string
  postId: string
  content: string
  hashtags: string[]
  scheduledDate: string | null
  scheduledTime: string | null
  imageFile: string | null
  status: LinkedInStatus
  manuallyScheduled: boolean
  linkedinPostUrl: string | null
  postedAt: string | null
  createdAt: string
  updatedAt: string
  post: {
    id: string
    slug: string
    title: string
    excerpt: string | null
    featuredImage: string | null
    ogImage: string | null
    status: string
    category: string | null
    publishedAt: string | null
  }
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

// Copyable field component
interface CopyableFieldProps {
  label: string
  value: string
  description?: string
}

function CopyableField({ label, value, description }: CopyableFieldProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          readOnly
          className="flex-1 rounded-lg border border-border-light dark:border-border-dark bg-light-neutral-grey dark:bg-dark-deep-blue px-4 py-2.5 text-text-primary dark:text-text-dark-primary font-mono text-sm"
        />
        <button
          type="button"
          onClick={handleCopy}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
            copied
              ? 'bg-accent-success text-white'
              : 'bg-accent-primary text-white hover:bg-accent-primary/90'
          }`}
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
              Copy
            </>
          )}
        </button>
      </div>
      {description && (
        <p className="mt-1 text-xs text-text-muted dark:text-text-dark-muted">{description}</p>
      )}
    </div>
  )
}

// Copyable image component
interface CopyableImageProps {
  label: string
  imageUrl: string | null
  fallbackUrl?: string | null
}

function CopyableImage({ label, imageUrl, fallbackUrl }: CopyableImageProps) {
  const [copied, setCopied] = useState(false)
  const url = imageUrl || fallbackUrl

  const handleCopyUrl = async () => {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary">
        {label}
      </label>
      {url ? (
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden border border-border-light dark:border-border-dark bg-light-neutral-grey dark:bg-dark-deep-blue">
            <img
              src={url}
              alt="Blog post image"
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              readOnly
              className="flex-1 rounded-lg border border-border-light dark:border-border-dark bg-light-neutral-grey dark:bg-dark-deep-blue px-4 py-2.5 text-text-primary dark:text-text-dark-primary font-mono text-xs"
            />
            <button
              type="button"
              onClick={handleCopyUrl}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                copied
                  ? 'bg-accent-success text-white'
                  : 'bg-accent-primary text-white hover:bg-accent-primary/90'
              }`}
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
                  Copy URL
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-border-light dark:border-border-dark p-8 text-center bg-light-neutral-grey/50 dark:bg-dark-deep-blue/50">
          <svg className="mx-auto h-12 w-12 text-text-muted dark:text-text-dark-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <p className="mt-2 text-sm text-text-muted dark:text-text-dark-muted">
            No image available for this blog post
          </p>
        </div>
      )}
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
  LinkedIn: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  ),
  ExternalLink: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  ),
}

// Main LinkedIn Edit Page Component
export default function LinkedInPostEditPage() {
  const router = useRouter()
  const params = useParams()
  const { status: sessionStatus } = useSession()
  const linkedinPostId = params.id as string

  // State
  const [linkedinPost, setLinkedinPost] = useState<LinkedInPostData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Form state
  const [content, setContent] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [hashtagInput, setHashtagInput] = useState('')
  const [status, setStatus] = useState<LinkedInStatus>('PENDING')
  const [linkedinPostUrl, setLinkedinPostUrl] = useState('')

  // Redirect to login if not authenticated
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [sessionStatus, router])

  // Fetch LinkedIn post data
  useEffect(() => {
    async function fetchData() {
      if (!linkedinPostId) return

      try {
        setIsLoading(true)
        const response = await fetch(`/api/admin/linkedin-db/${linkedinPostId}`)
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to fetch LinkedIn post')
        }

        setLinkedinPost(data.linkedinPost)
        setContent(data.linkedinPost.content || '')
        setHashtags(data.linkedinPost.hashtags || [])
        setStatus(data.linkedinPost.status)
        setLinkedinPostUrl(data.linkedinPost.linkedinPostUrl || '')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load LinkedIn post')
      } finally {
        setIsLoading(false)
      }
    }

    if (sessionStatus === 'authenticated') {
      fetchData()
    }
  }, [linkedinPostId, sessionStatus])

  // Show toast notification
  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }, [])

  // Handle adding hashtag
  const handleAddHashtag = useCallback(() => {
    const trimmed = hashtagInput.trim().replace(/^#/, '')
    if (trimmed && !hashtags.includes(`#${trimmed}`)) {
      setHashtags(prev => [...prev, `#${trimmed}`])
      setHashtagInput('')
    }
  }, [hashtagInput, hashtags])

  // Handle removing hashtag
  const handleRemoveHashtag = useCallback((tag: string) => {
    setHashtags(prev => prev.filter(t => t !== tag))
  }, [])

  // Save changes
  const handleSave = useCallback(async () => {
    if (!linkedinPost) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/linkedin-db/${linkedinPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          hashtags,
          status,
          linkedinPostUrl: linkedinPostUrl || null,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to save LinkedIn post')
      }

      setLinkedinPost(data.linkedinPost)
      showToast('LinkedIn post saved successfully', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to save LinkedIn post', 'error')
    } finally {
      setIsSaving(false)
    }
  }, [linkedinPost, content, hashtags, status, linkedinPostUrl, showToast])

  // Calculate character count
  const characterCount = content.length

  // Get blog post URL
  const blogPostUrl = linkedinPost?.post?.slug
    ? `https://fernandotorres.dev/blog/${linkedinPost.post.slug}`
    : ''

  // Loading state
  if (sessionStatus === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary" />
      </div>
    )
  }

  // Error state
  if (error || !linkedinPost) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-text-secondary dark:text-text-dark-secondary">
          {error || 'LinkedIn post not found'}
        </p>
        <Link
          href="/admin/linkedin"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-accent-primary text-white hover:bg-accent-primary/90 transition-colors"
        >
          <Icons.ArrowLeft />
          Back to LinkedIn Posts
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
          href="/admin/linkedin"
          className="inline-flex items-center gap-2 text-sm text-text-secondary dark:text-text-dark-secondary hover:text-accent-primary transition-colors mb-4"
        >
          <Icons.ArrowLeft />
          Back to LinkedIn Posts
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Icons.LinkedIn />
              <h1 className="font-heading text-3xl font-bold text-text-primary dark:text-text-dark-primary">
                Edit LinkedIn Post
              </h1>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-3 mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  status === 'POSTED'
                    ? 'bg-accent-success/10 text-accent-success'
                    : status === 'MANUALLY_SCHEDULED'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                }`}
              >
                {status === 'POSTED' ? 'Posted' : status === 'MANUALLY_SCHEDULED' ? 'Scheduled' : 'Pending'}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-lg bg-accent-primary px-4 py-2 text-sm font-medium text-white hover:bg-accent-primary/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Linked Blog Post Section */}
      <div className="rounded-xl border border-accent-primary/30 bg-accent-primary/5 dark:bg-accent-primary/10 p-6 mb-6">
        <h2 className="text-lg font-semibold text-text-primary dark:text-text-dark-primary font-heading mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
          </svg>
          Linked Blog Post
        </h2>

        <div className="space-y-4">
          {/* Blog Post Info */}
          <div className="flex items-start gap-4">
            {linkedinPost.post.featuredImage && (
              <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-light-neutral-grey dark:bg-dark-deep-blue">
                <img
                  src={linkedinPost.post.featuredImage}
                  alt={linkedinPost.post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-text-primary dark:text-text-dark-primary truncate">
                {linkedinPost.post.title}
              </h3>
              {linkedinPost.post.excerpt && (
                <p className="text-sm text-text-secondary dark:text-text-dark-secondary mt-1 line-clamp-2">
                  {linkedinPost.post.excerpt}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2">
                <Link
                  href={`/admin/blog/${linkedinPost.post.id}/edit`}
                  className="inline-flex items-center gap-1 text-sm text-accent-primary hover:underline"
                >
                  Edit Blog Post
                  <Icons.ExternalLink />
                </Link>
                {linkedinPost.post.status === 'PUBLISHED' && (
                  <Link
                    href={`/blog/${linkedinPost.post.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-sm text-accent-primary hover:underline"
                  >
                    View on Site
                    <Icons.ExternalLink />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Copyable Blog Post URL */}
          {blogPostUrl && (
            <CopyableField
              label="Blog Post URL"
              value={blogPostUrl}
              description="Copy this URL to include in your LinkedIn post"
            />
          )}

          {/* Copyable Blog Post Image */}
          <CopyableImage
            label="Blog Post Image"
            imageUrl={linkedinPost.post.featuredImage}
            fallbackUrl={linkedinPost.post.ogImage}
          />
        </div>
      </div>

      {/* LinkedIn Post Content */}
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Content */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-text-primary dark:text-text-dark-primary"
            >
              LinkedIn Post Content
            </label>
            <span
              className={`text-sm font-mono ${
                characterCount > 3000
                  ? 'text-accent-error'
                  : characterCount > 2400
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-text-muted dark:text-text-dark-muted'
              }`}
            >
              {characterCount.toLocaleString()} / 3,000
            </span>
          </div>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            placeholder="Write your LinkedIn post content here..."
            className="w-full rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue px-4 py-3 text-text-primary dark:text-text-dark-primary placeholder-text-muted dark:placeholder-text-dark-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
          />
          <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                characterCount > 3000
                  ? 'bg-accent-error'
                  : characterCount > 2400
                  ? 'bg-yellow-500'
                  : 'bg-accent-success'
              }`}
              style={{ width: `${Math.min((characterCount / 3000) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Hashtags */}
        <div>
          <label
            htmlFor="hashtagInput"
            className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary"
          >
            Hashtags
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="hashtagInput"
              value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddHashtag()
                }
              }}
              placeholder="Add a hashtag (without #)"
              className="flex-1 rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue px-4 py-2.5 text-text-primary dark:text-text-dark-primary placeholder-text-muted dark:placeholder-text-dark-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
            />
            <button
              type="button"
              onClick={handleAddHashtag}
              className="rounded-lg bg-accent-primary px-4 py-2 text-sm font-medium text-white hover:bg-accent-primary/90 transition-colors"
            >
              Add
            </button>
          </div>

          {hashtags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {hashtags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-accent-primary/10 px-3 py-1 text-sm text-accent-primary"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveHashtag(tag)}
                    className="ml-1 rounded-full p-0.5 hover:bg-accent-primary/20"
                    aria-label={`Remove ${tag} hashtag`}
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

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary"
          >
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as LinkedInStatus)}
            className="w-full rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue px-4 py-2.5 text-text-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
          >
            <option value="PENDING">Pending</option>
            <option value="MANUALLY_SCHEDULED">Manually Scheduled</option>
            <option value="POSTED">Posted</option>
          </select>
        </div>

        {/* LinkedIn Post URL (for tracking) */}
        <div>
          <label
            htmlFor="linkedinPostUrl"
            className="mb-2 block text-sm font-medium text-text-primary dark:text-text-dark-primary"
          >
            LinkedIn Post URL (optional)
          </label>
          <input
            type="url"
            id="linkedinPostUrl"
            value={linkedinPostUrl}
            onChange={(e) => setLinkedinPostUrl(e.target.value)}
            placeholder="https://www.linkedin.com/posts/..."
            className="w-full rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue px-4 py-2.5 text-text-primary dark:text-text-dark-primary placeholder-text-muted dark:placeholder-text-dark-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary transition-colors"
          />
          <p className="mt-1 text-xs text-text-muted dark:text-text-dark-muted">
            Paste the URL of your published LinkedIn post here for tracking
          </p>
        </div>
      </form>

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
