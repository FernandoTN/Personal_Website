'use client'

/**
 * BlogEditor component for creating and editing blog posts.
 *
 * Features:
 * - Title input with character count
 * - Slug auto-generation from title (editable)
 * - Rich content textarea for MDX/Markdown
 * - Excerpt field with auto-extraction
 * - Category and series selection
 * - Tags input
 * - Featured image URL
 * - SEO fields (meta title, meta description)
 * - Save draft and publish buttons
 * - Form validation
 * - Loading states
 * - Dark mode support
 *
 * Usage:
 * <BlogEditor />
 * <BlogEditor initialData={existingPost} onSave={handleSave} />
 *
 * Accessibility:
 * - All form fields have proper labels
 * - Error messages linked via aria-describedby
 * - Loading states announced via aria-busy
 */

import { useState, useCallback, useEffect, FormEvent, ChangeEvent } from 'react'
import { useToast } from '@/components/ui/Toast'
import { slugify } from '@/lib/utils'
import { MDXUpload, MDXParsedData } from '@/components/admin/MDXUpload'

// Post category options
const CATEGORIES = [
  { value: '', label: 'Select category...' },
  { value: 'ANCHOR', label: 'Anchor' },
  { value: 'THEME', label: 'Theme Deep Dive' },
  { value: 'EMERGENT', label: 'Emergent Insight' },
  { value: 'PRACTITIONER', label: 'Practitioner Perspective' },
  { value: 'PROTOTYPE', label: 'Prototype Learning' },
  { value: 'CONFERENCE', label: 'Conference Insight' },
  { value: 'METHODOLOGY', label: 'Methodology' },
]

// Form data interface
interface BlogEditorData {
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage: string
  category: string
  seriesId: string
  seriesOrder: string
  tags: string
  metaTitle: string
  metaDescription: string
}

// Props interface
interface BlogEditorProps {
  /** Initial data for editing existing post */
  initialData?: Partial<BlogEditorData>
  /** Callback when post is saved */
  onSave?: (post: Record<string, unknown>) => void
  /** Callback when draft is saved */
  onSaveDraft?: (post: Record<string, unknown>) => void
}

// Form field validation
interface FieldError {
  field: string
  message: string
}

// Initial form state
const initialFormState: BlogEditorData = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  featuredImage: '',
  category: '',
  seriesId: '',
  seriesOrder: '',
  tags: '',
  metaTitle: '',
  metaDescription: '',
}

export function BlogEditor({ initialData, onSave, onSaveDraft }: BlogEditorProps) {
  const { showToast } = useToast()

  // Form state
  const [formData, setFormData] = useState<BlogEditorData>({
    ...initialFormState,
    ...initialData,
  })
  const [errors, setErrors] = useState<FieldError[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [autoSlug, setAutoSlug] = useState(!initialData?.slug)

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }))
      setAutoSlug(!initialData.slug)
    }
  }, [initialData])

  // Handle input change
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target

      setFormData((prev) => {
        const newData = { ...prev, [name]: value }

        // Auto-generate slug from title if autoSlug is enabled
        if (name === 'title' && autoSlug) {
          newData.slug = slugify(value)
        }

        return newData
      })

      // Clear error for this field
      setErrors((prev) => prev.filter((e) => e.field !== name))
    },
    [autoSlug]
  )

  // Handle slug input change (disables auto-generation)
  const handleSlugChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFormData((prev) => ({ ...prev, slug: value }))
    setAutoSlug(false)
    setErrors((prev) => prev.filter((e) => e.field !== 'slug'))
  }, [])

  // Reset slug to auto-generated
  const handleResetSlug = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      slug: slugify(prev.title),
    }))
    setAutoSlug(true)
  }, [])

  // Handle MDX file parsed - pre-fill the form with extracted data
  const handleMDXParsed = useCallback((data: MDXParsedData) => {
    setFormData(data.formData)
    setAutoSlug(false) // Disable auto-slug since we have the extracted slug
    setErrors([])
    showToast({
      type: 'success',
      message: 'MDX file parsed successfully! Form has been pre-filled.',
    })
  }, [showToast])

  // Handle MDX upload error
  const handleMDXError = useCallback((errorMessage: string) => {
    showToast({
      type: 'error',
      message: errorMessage,
    })
  }, [showToast])

  // Validate form data
  const validateForm = useCallback((): FieldError[] => {
    const validationErrors: FieldError[] = []

    if (!formData.title.trim()) {
      validationErrors.push({ field: 'title', message: 'Title is required' })
    } else if (formData.title.trim().length < 3) {
      validationErrors.push({ field: 'title', message: 'Title must be at least 3 characters' })
    }

    if (!formData.content.trim()) {
      validationErrors.push({ field: 'content', message: 'Content is required' })
    } else if (formData.content.trim().length < 10) {
      validationErrors.push({ field: 'content', message: 'Content must be at least 10 characters' })
    }

    return validationErrors
  }, [formData])

  // Get error for a specific field
  const getFieldError = useCallback(
    (field: string): string | undefined => {
      return errors.find((e) => e.field === field)?.message
    },
    [errors]
  )

  // Submit handler for save draft
  const handleSaveDraft = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()

      // Validate form
      const validationErrors = validateForm()
      if (validationErrors.length > 0) {
        setErrors(validationErrors)
        showToast({
          type: 'error',
          message: 'Please fix the errors before saving',
        })
        return
      }

      setIsSubmitting(true)
      setErrors([])

      try {
        // Prepare request data
        const requestData = {
          title: formData.title.trim(),
          slug: formData.slug.trim() || undefined,
          content: formData.content,
          excerpt: formData.excerpt.trim() || undefined,
          featuredImage: formData.featuredImage.trim() || undefined,
          category: formData.category || undefined,
          seriesId: formData.seriesId.trim() || undefined,
          seriesOrder: formData.seriesOrder ? parseInt(formData.seriesOrder, 10) : undefined,
          tags: formData.tags
            ? formData.tags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
            : undefined,
          metaTitle: formData.metaTitle.trim() || undefined,
          metaDescription: formData.metaDescription.trim() || undefined,
          status: 'DRAFT',
        }

        // Make API request
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          showToast({
            type: 'success',
            message: data.message || 'Draft saved successfully!',
          })

          // Call onSaveDraft callback if provided
          if (onSaveDraft) {
            onSaveDraft(data.post)
          }

          // Update slug with the one returned from API (in case it was generated)
          if (data.post?.slug && data.post.slug !== formData.slug) {
            setFormData((prev) => ({ ...prev, slug: data.post.slug }))
          }
        } else {
          // Handle validation errors from API
          if (data.errors && Array.isArray(data.errors)) {
            setErrors(data.errors)
          }

          showToast({
            type: 'error',
            message: data.error || 'Failed to save draft. Please try again.',
          })
        }
      } catch (error) {
        console.error('Save draft error:', error)
        showToast({
          type: 'error',
          message: 'Network error. Please check your connection and try again.',
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, validateForm, showToast, onSaveDraft]
  )

  // Submit handler for publish
  const handlePublish = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()

      // Validate form
      const validationErrors = validateForm()
      if (validationErrors.length > 0) {
        setErrors(validationErrors)
        showToast({
          type: 'error',
          message: 'Please fix the errors before publishing',
        })
        return
      }

      setIsSubmitting(true)
      setErrors([])

      try {
        // Prepare request data
        const requestData = {
          title: formData.title.trim(),
          slug: formData.slug.trim() || undefined,
          content: formData.content,
          excerpt: formData.excerpt.trim() || undefined,
          featuredImage: formData.featuredImage.trim() || undefined,
          category: formData.category || undefined,
          seriesId: formData.seriesId.trim() || undefined,
          seriesOrder: formData.seriesOrder ? parseInt(formData.seriesOrder, 10) : undefined,
          tags: formData.tags
            ? formData.tags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
            : undefined,
          metaTitle: formData.metaTitle.trim() || undefined,
          metaDescription: formData.metaDescription.trim() || undefined,
          status: 'PUBLISHED',
        }

        // Make API request
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          showToast({
            type: 'success',
            message: data.message || 'Post published successfully!',
          })

          // Call onSave callback if provided
          if (onSave) {
            onSave(data.post)
          }
        } else {
          // Handle validation errors from API
          if (data.errors && Array.isArray(data.errors)) {
            setErrors(data.errors)
          }

          showToast({
            type: 'error',
            message: data.error || 'Failed to publish post. Please try again.',
          })
        }
      } catch (error) {
        console.error('Publish error:', error)
        showToast({
          type: 'error',
          message: 'Network error. Please check your connection and try again.',
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, validateForm, showToast, onSave]
  )

  // Common input styles
  const inputClassName = `
    w-full rounded-lg border px-4 py-2.5
    text-sm text-text-primary dark:text-text-dark-primary
    placeholder:text-text-tertiary dark:placeholder:text-text-dark-tertiary
    bg-light-base dark:bg-dark-elevated
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-1
    disabled:cursor-not-allowed disabled:opacity-60
  `

  const inputErrorClassName = 'border-red-500 dark:border-red-400'
  const inputNormalClassName =
    'border-border-light dark:border-border-dark hover:border-accent-primary/50'

  return (
    <form className="space-y-6">
      {/* Upload Markdown Section */}
      <div className="border-b border-border-light dark:border-border-dark pb-6 mb-6">
        <h3 className="text-sm font-semibold text-text-primary dark:text-text-dark-primary mb-3">
          Upload Markdown
        </h3>
        <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-4">
          Upload an MDX or Markdown file to pre-fill the form with its content and frontmatter.
        </p>
        <MDXUpload
          onParsed={handleMDXParsed}
          onError={handleMDXError}
        />
      </div>

      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-1.5"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter post title"
          disabled={isSubmitting}
          aria-invalid={!!getFieldError('title')}
          aria-describedby={getFieldError('title') ? 'title-error' : undefined}
          className={`${inputClassName} ${
            getFieldError('title') ? inputErrorClassName : inputNormalClassName
          }`}
        />
        {getFieldError('title') && (
          <p id="title-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
            {getFieldError('title')}
          </p>
        )}
        <p className="mt-1 text-xs text-text-tertiary dark:text-text-dark-tertiary">
          {formData.title.length}/200 characters
        </p>
      </div>

      {/* Slug */}
      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-1.5"
        >
          Slug
        </label>
        <div className="flex gap-2">
          <input
            id="slug"
            name="slug"
            type="text"
            value={formData.slug}
            onChange={handleSlugChange}
            placeholder="auto-generated-from-title"
            disabled={isSubmitting}
            className={`flex-1 ${inputClassName} ${inputNormalClassName}`}
          />
          {!autoSlug && (
            <button
              type="button"
              onClick={handleResetSlug}
              disabled={isSubmitting}
              className="px-3 py-2 text-sm font-medium text-accent-primary hover:text-accent-primary/80 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-text-tertiary dark:text-text-dark-tertiary">
          {autoSlug ? 'Auto-generated from title' : 'Custom slug (editing disables auto-generation)'}
        </p>
      </div>

      {/* Content */}
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-1.5"
        >
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Write your post content in Markdown/MDX..."
          rows={15}
          disabled={isSubmitting}
          aria-invalid={!!getFieldError('content')}
          aria-describedby={getFieldError('content') ? 'content-error' : undefined}
          className={`${inputClassName} font-mono text-xs ${
            getFieldError('content') ? inputErrorClassName : inputNormalClassName
          }`}
        />
        {getFieldError('content') && (
          <p id="content-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
            {getFieldError('content')}
          </p>
        )}
        <p className="mt-1 text-xs text-text-tertiary dark:text-text-dark-tertiary">
          Supports Markdown and MDX syntax
        </p>
      </div>

      {/* Excerpt */}
      <div>
        <label
          htmlFor="excerpt"
          className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-1.5"
        >
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          placeholder="Brief summary of the post (auto-generated if left empty)"
          rows={3}
          disabled={isSubmitting}
          className={`${inputClassName} ${inputNormalClassName}`}
        />
        <p className="mt-1 text-xs text-text-tertiary dark:text-text-dark-tertiary">
          {formData.excerpt.length}/160 characters (recommended)
        </p>
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-1.5"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={isSubmitting}
          className={`${inputClassName} ${inputNormalClassName}`}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Featured Image */}
      <div>
        <label
          htmlFor="featuredImage"
          className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-1.5"
        >
          Featured Image URL
        </label>
        <input
          id="featuredImage"
          name="featuredImage"
          type="url"
          value={formData.featuredImage}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          disabled={isSubmitting}
          className={`${inputClassName} ${inputNormalClassName}`}
        />
      </div>

      {/* Tags */}
      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-1.5"
        >
          Tags
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          value={formData.tags}
          onChange={handleChange}
          placeholder="ai, agents, research (comma-separated)"
          disabled={isSubmitting}
          className={`${inputClassName} ${inputNormalClassName}`}
        />
        <p className="mt-1 text-xs text-text-tertiary dark:text-text-dark-tertiary">
          Separate multiple tags with commas
        </p>
      </div>

      {/* SEO Section */}
      <div className="border-t border-border-light dark:border-border-dark pt-6">
        <h3 className="text-sm font-semibold text-text-primary dark:text-text-dark-primary mb-4">
          SEO Settings
        </h3>

        <div className="space-y-4">
          {/* Meta Title */}
          <div>
            <label
              htmlFor="metaTitle"
              className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-1.5"
            >
              Meta Title
            </label>
            <input
              id="metaTitle"
              name="metaTitle"
              type="text"
              value={formData.metaTitle}
              onChange={handleChange}
              placeholder="Custom title for search engines (uses post title if empty)"
              disabled={isSubmitting}
              className={`${inputClassName} ${inputNormalClassName}`}
            />
            <p className="mt-1 text-xs text-text-tertiary dark:text-text-dark-tertiary">
              {formData.metaTitle.length}/60 characters (recommended)
            </p>
          </div>

          {/* Meta Description */}
          <div>
            <label
              htmlFor="metaDescription"
              className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-1.5"
            >
              Meta Description
            </label>
            <textarea
              id="metaDescription"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              placeholder="Custom description for search engines (uses excerpt if empty)"
              rows={2}
              disabled={isSubmitting}
              className={`${inputClassName} ${inputNormalClassName}`}
            />
            <p className="mt-1 text-xs text-text-tertiary dark:text-text-dark-tertiary">
              {formData.metaDescription.length}/160 characters (recommended)
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-light dark:border-border-dark">
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className={`
            inline-flex items-center justify-center gap-2
            rounded-lg px-5 py-2.5
            text-sm font-medium
            transition-all duration-200
            border border-border-light dark:border-border-dark
            text-text-primary dark:text-text-dark-primary
            bg-light-base dark:bg-dark-elevated
            hover:bg-light-neutral-grey dark:hover:bg-dark-panel
            focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-60
          `}
        >
          {isSubmitting ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
              <span>Saving...</span>
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <span>Save Draft</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handlePublish}
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className={`
            inline-flex items-center justify-center gap-2
            rounded-lg bg-accent-primary px-5 py-2.5
            text-sm font-medium text-white
            transition-all duration-200
            hover:bg-accent-primary/90
            focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-60
          `}
        >
          {isSubmitting ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                />
              </svg>
              <span>Publish</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default BlogEditor
