'use client'

import { useState, useCallback, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, User, Mail, Send, Check, AlertCircle, Loader2 } from 'lucide-react'

/**
 * Comment interface for type safety
 */
interface Comment {
  id: string
  authorName: string
  content: string
  createdAt: string
  status: 'PENDING' | 'APPROVED'
}

/**
 * Form field errors interface
 */
interface FormErrors {
  name?: string
  email?: string
  comment?: string
}

/**
 * Props for CommentsSection component
 */
interface CommentsSectionProps {
  postSlug: string
  postTitle?: string
}

/**
 * Mock comments data for demonstration
 * In production, these would come from the database via API
 */
const mockComments: Comment[] = [
  {
    id: '1',
    authorName: 'Sarah Chen',
    content: 'This is an excellent breakdown of the challenges facing AI agent deployments. The 92% system integration statistic really resonates with what we have experienced at our organization. Looking forward to the rest of the series!',
    createdAt: '2024-12-10T14:30:00Z',
    status: 'APPROVED',
  },
  {
    id: '2',
    authorName: 'Michael Rodriguez',
    content: 'The Eight Pillars framework provides a really useful mental model for thinking about agent infrastructure. I especially appreciate the emphasis on context management - that 40% utilization rule is something more teams should be aware of.',
    createdAt: '2024-12-11T09:15:00Z',
    status: 'APPROVED',
  },
  {
    id: '3',
    authorName: 'Emily Watson',
    content: 'Great insights on why pilot projects fail to reach production. The distinction between model capability and infrastructure readiness is crucial. Would love to see more case studies in future posts.',
    createdAt: '2024-12-12T16:45:00Z',
    status: 'APPROVED',
  },
]

/**
 * Format date for display
 */
function formatCommentDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    return 'Today'
  } else if (diffInDays === 1) {
    return 'Yesterday'
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  }
}

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

/**
 * CommentsSection Component
 *
 * Features (Feature 42):
 * - Comment form with name, email, and comment fields
 * - Client-side validation for required fields
 * - Submit button with loading state
 * - Success message after submission
 * - List of existing comments (mock data)
 *
 * Accessibility:
 * - Proper form labels and ARIA attributes
 * - Focus management
 * - Error announcements for screen readers
 * - Keyboard accessible
 */
export function CommentsSection({ postSlug, postTitle }: CommentsSectionProps) {
  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [comment, setComment] = useState('')

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  // Display approved comments only
  const approvedComments = mockComments.filter((c) => c.status === 'APPROVED')

  /**
   * Validate form fields
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    // Validate name
    if (!name.trim()) {
      newErrors.name = 'Name is required'
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Validate comment
    if (!comment.trim()) {
      newErrors.comment = 'Comment is required'
    } else if (comment.trim().length < 10) {
      newErrors.comment = 'Comment must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [name, email, comment])

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()

      // Reset previous states
      setSubmitError(null)
      setSubmitSuccess(false)

      // Validate form
      if (!validateForm()) {
        return
      }

      setIsSubmitting(true)

      try {
        const response = await fetch('/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postSlug,
            name: name.trim(),
            email: email.trim(),
            content: comment.trim(),
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to submit comment')
        }

        // Success - clear form and show success message
        setName('')
        setEmail('')
        setComment('')
        setErrors({})
        setSubmitSuccess(true)

        // Hide success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false)
        }, 5000)
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : 'An error occurred. Please try again.'
        )
      } finally {
        setIsSubmitting(false)
      }
    },
    [postSlug, name, email, comment, validateForm]
  )

  /**
   * Clear field error on input change
   */
  const handleFieldChange = useCallback(
    (field: keyof FormErrors, value: string, setter: (value: string) => void) => {
      setter(value)
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    },
    [errors]
  )

  return (
    <section
      id="comments"
      className="mt-16 pt-12 border-t border-border-light dark:border-border-dark"
      aria-labelledby="comments-heading"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="p-2 rounded-lg bg-accent-primary/10">
          <MessageSquare className="w-5 h-5 text-accent-primary" aria-hidden="true" />
        </div>
        <h2
          id="comments-heading"
          className="font-heading text-2xl font-semibold text-text-primary dark:text-text-dark-primary"
        >
          Comments ({approvedComments.length})
        </h2>
      </motion.div>

      {/* Comment Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-12"
      >
        <div className="p-6 rounded-xl bg-light-panel dark:bg-dark-panel border border-border-light dark:border-border-dark">
          <h3 className="font-heading text-lg font-medium text-text-primary dark:text-text-dark-primary mb-4">
            Leave a Comment
          </h3>

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="comment-name"
                  className="block text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-1.5"
                >
                  Name <span className="text-accent-error">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User
                      className="h-4 w-4 text-text-muted dark:text-text-dark-muted"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="text"
                    id="comment-name"
                    name="name"
                    value={name}
                    onChange={(e) => handleFieldChange('name', e.target.value, setName)}
                    placeholder="Your name"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className={`
                      w-full pl-10 pr-4 py-2.5 rounded-lg
                      text-text-primary dark:text-text-dark-primary
                      bg-light-base dark:bg-dark-base
                      border transition-colors duration-200
                      placeholder:text-text-muted dark:placeholder:text-text-dark-muted
                      focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${
                        errors.name
                          ? 'border-accent-error focus:ring-accent-error'
                          : 'border-border-light dark:border-border-dark hover:border-accent-primary/50'
                      }
                    `}
                  />
                </div>
                <AnimatePresence>
                  {errors.name && (
                    <motion.p
                      id="name-error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="mt-1.5 text-sm text-accent-error flex items-center gap-1"
                      role="alert"
                    >
                      <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      {errors.name}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="comment-email"
                  className="block text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-1.5"
                >
                  Email <span className="text-accent-error">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail
                      className="h-4 w-4 text-text-muted dark:text-text-dark-muted"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="email"
                    id="comment-email"
                    name="email"
                    value={email}
                    onChange={(e) => handleFieldChange('email', e.target.value, setEmail)}
                    placeholder="your@email.com"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={`
                      w-full pl-10 pr-4 py-2.5 rounded-lg
                      text-text-primary dark:text-text-dark-primary
                      bg-light-base dark:bg-dark-base
                      border transition-colors duration-200
                      placeholder:text-text-muted dark:placeholder:text-text-dark-muted
                      focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${
                        errors.email
                          ? 'border-accent-error focus:ring-accent-error'
                          : 'border-border-light dark:border-border-dark hover:border-accent-primary/50'
                      }
                    `}
                  />
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      id="email-error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="mt-1.5 text-sm text-accent-error flex items-center gap-1"
                      role="alert"
                    >
                      <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Comment Field */}
            <div className="mb-4">
              <label
                htmlFor="comment-content"
                className="block text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-1.5"
              >
                Comment <span className="text-accent-error">*</span>
              </label>
              <textarea
                id="comment-content"
                name="comment"
                value={comment}
                onChange={(e) => handleFieldChange('comment', e.target.value, setComment)}
                placeholder="Share your thoughts..."
                rows={4}
                disabled={isSubmitting}
                aria-invalid={!!errors.comment}
                aria-describedby={errors.comment ? 'comment-error' : undefined}
                className={`
                  w-full px-4 py-2.5 rounded-lg resize-none
                  text-text-primary dark:text-text-dark-primary
                  bg-light-base dark:bg-dark-base
                  border transition-colors duration-200
                  placeholder:text-text-muted dark:placeholder:text-text-dark-muted
                  focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    errors.comment
                      ? 'border-accent-error focus:ring-accent-error'
                      : 'border-border-light dark:border-border-dark hover:border-accent-primary/50'
                  }
                `}
              />
              <AnimatePresence>
                {errors.comment && (
                  <motion.p
                    id="comment-error"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-1.5 text-sm text-accent-error flex items-center gap-1"
                    role="alert"
                  >
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    {errors.comment}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Error */}
            <AnimatePresence>
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="mb-4 p-3 rounded-lg bg-accent-error/10 border border-accent-error/20 flex items-center gap-2"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 text-accent-error flex-shrink-0" aria-hidden="true" />
                  <p className="text-sm text-accent-error">{submitError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="mb-4 p-3 rounded-lg bg-accent-success/10 border border-accent-success/20 flex items-center gap-2"
                  role="alert"
                  aria-live="polite"
                >
                  <Check
                    className="w-4 h-4 text-accent-success dark:text-accent-success-dark flex-shrink-0"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-accent-success dark:text-accent-success-dark">
                    Thank you for your comment! It will appear after moderation.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-text-muted dark:text-text-dark-muted">
                Your email will not be published.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                  text-sm font-medium text-white
                  bg-accent-primary hover:bg-accent-primary/90
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" aria-hidden="true" />
                    Submit Comment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Comments List */}
      <div className="space-y-6">
        {approvedComments.length > 0 ? (
          approvedComments.map((commentItem, index) => (
            <motion.article
              key={commentItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="p-5 rounded-xl bg-light-panel dark:bg-dark-panel border border-border-light dark:border-border-dark"
            >
              <header className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Avatar placeholder */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {commentItem.authorName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary dark:text-text-dark-primary">
                      {commentItem.authorName}
                    </h4>
                    <time
                      dateTime={commentItem.createdAt}
                      className="text-xs text-text-muted dark:text-text-dark-muted"
                    >
                      {formatCommentDate(commentItem.createdAt)}
                    </time>
                  </div>
                </div>
              </header>
              <p className="text-text-secondary dark:text-text-dark-secondary leading-relaxed">
                {commentItem.content}
              </p>
            </motion.article>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-12"
          >
            <MessageSquare
              className="w-12 h-12 mx-auto mb-4 text-text-muted dark:text-text-dark-muted opacity-50"
              aria-hidden="true"
            />
            <p className="text-text-secondary dark:text-text-dark-secondary">
              No comments yet. Be the first to share your thoughts!
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default CommentsSection
