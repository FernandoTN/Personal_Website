'use client'

/**
 * NewsletterSignup component with email validation and submission handling.
 *
 * Features:
 * - Email input with real-time validation
 * - Submit button with loading state
 * - Error messages for empty/invalid email
 * - Success message after subscription
 * - Already subscribed handling
 * - Accessible form with ARIA attributes
 * - Responsive design with Tailwind CSS
 * - Dark mode support
 *
 * Usage:
 * <NewsletterSignup />
 * <NewsletterSignup className="my-custom-class" />
 * <NewsletterSignup variant="compact" />
 *
 * Accessibility:
 * - Form has accessible label
 * - Error messages linked via aria-describedby
 * - Loading state announced via aria-busy
 * - Success/error messages have role="alert"
 */

import { useState, useCallback, FormEvent, ChangeEvent } from 'react'

// Props interface
interface NewsletterSignupProps {
  /** Additional CSS classes */
  className?: string
  /** Variant for different layouts */
  variant?: 'default' | 'compact'
  /** Optional source tracking */
  source?: string
}

// Email validation regex pattern
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// Form state types
type FormStatus = 'idle' | 'loading' | 'success' | 'error' | 'already_subscribed'

interface FormState {
  email: string
  status: FormStatus
  errorMessage: string
}

// Validate email format
function validateEmail(email: string): { valid: boolean; message: string } {
  const trimmedEmail = email.trim()

  if (!trimmedEmail) {
    return { valid: false, message: 'Email is required' }
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return { valid: false, message: 'Please enter a valid email address' }
  }

  return { valid: true, message: '' }
}

export function NewsletterSignup({
  className = '',
  variant = 'default',
  source = 'website',
}: NewsletterSignupProps) {
  // Form state
  const [formState, setFormState] = useState<FormState>({
    email: '',
    status: 'idle',
    errorMessage: '',
  })

  // Handle email input change
  const handleEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormState((prev) => ({
      ...prev,
      email: value,
      // Clear error when user starts typing
      status: prev.status === 'error' ? 'idle' : prev.status,
      errorMessage: prev.status === 'error' ? '' : prev.errorMessage,
    }))
  }, [])

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      // Validate email
      const validation = validateEmail(formState.email)
      if (!validation.valid) {
        setFormState((prev) => ({
          ...prev,
          status: 'error',
          errorMessage: validation.message,
        }))
        return
      }

      // Set loading state
      setFormState((prev) => ({ ...prev, status: 'loading', errorMessage: '' }))

      try {
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formState.email.trim(),
            source,
          }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setFormState({
            email: '',
            status: 'success',
            errorMessage: '',
          })
        } else if (response.status === 409 || data.alreadySubscribed) {
          setFormState((prev) => ({
            ...prev,
            status: 'already_subscribed',
            errorMessage: '',
          }))
        } else {
          setFormState((prev) => ({
            ...prev,
            status: 'error',
            errorMessage: data.error || 'Something went wrong. Please try again.',
          }))
        }
      } catch {
        setFormState((prev) => ({
          ...prev,
          status: 'error',
          errorMessage: 'Network error. Please check your connection and try again.',
        }))
      }
    },
    [formState.email, source]
  )

  // Reset form to try again
  const handleReset = useCallback(() => {
    setFormState({
      email: '',
      status: 'idle',
      errorMessage: '',
    })
  }, [])

  const { email, status, errorMessage } = formState
  const isLoading = status === 'loading'
  const showError = status === 'error' && errorMessage
  const showSuccess = status === 'success'
  const showAlreadySubscribed = status === 'already_subscribed'

  // Success state UI
  if (showSuccess) {
    return (
      <div
        className={`
          rounded-lg bg-green-50 p-4 dark:bg-green-900/20
          ${className}
        `}
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-center gap-3">
          <svg
            className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <p className="text-sm font-medium text-green-800 dark:text-green-200">
            Thanks for subscribing! Check your inbox for a confirmation email.
          </p>
        </div>
      </div>
    )
  }

  // Already subscribed state UI
  if (showAlreadySubscribed) {
    return (
      <div
        className={`
          rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20
          ${className}
        `}
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-center gap-3">
          <svg
            className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              You&apos;re already subscribed!
            </p>
            <button
              onClick={handleReset}
              className="mt-1 text-xs text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            >
              Try a different email
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Default/compact variant styles
  const isCompact = variant === 'compact'

  return (
    <div className={className}>
      {!isCompact && (
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-text-primary dark:text-text-dark-primary">
            Subscribe to my newsletter
          </h3>
          <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary">
            Get notified about new articles and insights on AI, technology, and more.
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`
          flex gap-2
          ${isCompact ? 'flex-row' : 'flex-col sm:flex-row'}
        `}
        aria-label="Newsletter signup form"
        noValidate
      >
        <div className="relative flex-1">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            disabled={isLoading}
            aria-invalid={showError ? 'true' : 'false'}
            aria-describedby={showError ? 'newsletter-error' : undefined}
            className={`
              w-full rounded-lg border px-4 py-2.5
              text-sm text-text-primary dark:text-text-dark-primary
              placeholder:text-text-tertiary dark:placeholder:text-text-dark-tertiary
              bg-light-base dark:bg-dark-elevated
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-1
              disabled:cursor-not-allowed disabled:opacity-60
              ${
                showError
                  ? 'border-red-500 dark:border-red-400'
                  : 'border-border-light dark:border-border-dark hover:border-accent-primary/50'
              }
            `}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className={`
            inline-flex items-center justify-center gap-2
            rounded-lg bg-accent-primary px-5 py-2.5
            text-sm font-medium text-white
            transition-all duration-200
            hover:bg-accent-primary/90
            focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-60
            ${isCompact ? 'flex-shrink-0' : 'w-full sm:w-auto'}
          `}
        >
          {isLoading ? (
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
              <span>Subscribing...</span>
            </>
          ) : (
            <span>Subscribe</span>
          )}
        </button>
      </form>

      {/* Error message */}
      {showError && (
        <p
          id="newsletter-error"
          className="mt-2 text-sm text-red-600 dark:text-red-400"
          role="alert"
          aria-live="polite"
        >
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export default NewsletterSignup
