'use client'

import { useState, useEffect, FormEvent } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

/**
 * Admin Login Page
 *
 * Features:
 * - Email and password form fields with validation
 * - Loading state during authentication
 * - Error messages for invalid credentials
 * - Redirect to /admin/dashboard on success
 *
 * Usage:
 * Navigate to /admin/login to access the admin login form
 */

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status } = useSession()

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [touched, setTouched] = useState({ email: false, password: false })

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/admin/dashboard')
    }
  }, [status, router])

  // Check for error from NextAuth callback or session expiration
  useEffect(() => {
    const error = searchParams.get('error')
    const expired = searchParams.get('expired')

    if (error === 'CredentialsSignin') {
      setErrors({ general: 'Invalid email or password. Please try again.' })
    } else if (error === 'SessionRequired') {
      // Session was required but user is not authenticated
      setErrors({ general: 'Your session has expired. Please sign in again.' })
    } else if (expired === 'true') {
      // Explicit session expiration redirect
      setErrors({ general: 'Your session has expired. Please sign in again.' })
    }
  }, [searchParams])

  /**
   * Validates email format
   */
  const validateEmail = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Email is required'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address'
    }
    return undefined
  }

  /**
   * Validates password
   */
  const validatePassword = (value: string): string | undefined => {
    if (!value) {
      return 'Password is required'
    }
    if (value.length < 6) {
      return 'Password must be at least 6 characters'
    }
    return undefined
  }

  /**
   * Validates entire form
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    const emailError = validateEmail(email)
    if (emailError) newErrors.email = emailError

    const passwordError = validatePassword(password)
    if (passwordError) newErrors.password = passwordError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handles field blur for validation
   */
  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }))

    if (field === 'email') {
      const error = validateEmail(email)
      setErrors((prev) => ({ ...prev, email: error }))
    } else {
      const error = validatePassword(password)
      setErrors((prev) => ({ ...prev, password: error }))
    }
  }

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Clear general error
    setErrors((prev) => ({ ...prev, general: undefined }))

    // Mark all fields as touched
    setTouched({ email: true, password: true })

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      })

      if (result?.error) {
        setErrors({ general: 'Invalid email or password. Please try again.' })
        setIsLoading(false)
        return
      }

      if (result?.ok) {
        // Successful authentication - redirect to dashboard
        router.push('/admin/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ general: 'An unexpected error occurred. Please try again.' })
      setIsLoading(false)
    }
  }

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-icy-blue dark:bg-dark-base">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-icy-blue dark:bg-dark-base px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-text-primary dark:text-text-dark-primary">
            Admin Login
          </h1>
          <p className="mt-2 text-text-secondary dark:text-text-dark-secondary">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-light-base dark:bg-dark-panel rounded-xl shadow-light p-8 border border-border-light dark:border-border-dark">
          {/* General Error Message */}
          {errors.general && (
            <div
              className="mb-6 p-4 rounded-lg bg-accent-error/10 border border-accent-error/30 text-accent-error dark:text-accent-error-dark"
              role="alert"
              aria-live="polite"
            >
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">{errors.general}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (touched.email) {
                    const error = validateEmail(e.target.value)
                    setErrors((prev) => ({ ...prev, email: error }))
                  }
                }}
                onBlur={() => handleBlur('email')}
                disabled={isLoading}
                aria-invalid={touched.email && !!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`
                  w-full px-4 py-3 rounded-lg
                  bg-light-neutral-grey dark:bg-dark-deep-blue
                  border transition-colors duration-200
                  text-text-primary dark:text-text-dark-primary
                  placeholder-text-muted dark:placeholder-text-dark-muted
                  focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    touched.email && errors.email
                      ? 'border-accent-error dark:border-accent-error-dark'
                      : 'border-border-light dark:border-border-dark'
                  }
                `}
                placeholder="admin@example.com"
              />
              {touched.email && errors.email && (
                <p
                  id="email-error"
                  className="mt-1.5 text-sm text-accent-error dark:text-accent-error-dark"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (touched.password) {
                    const error = validatePassword(e.target.value)
                    setErrors((prev) => ({ ...prev, password: error }))
                  }
                }}
                onBlur={() => handleBlur('password')}
                disabled={isLoading}
                aria-invalid={touched.password && !!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className={`
                  w-full px-4 py-3 rounded-lg
                  bg-light-neutral-grey dark:bg-dark-deep-blue
                  border transition-colors duration-200
                  text-text-primary dark:text-text-dark-primary
                  placeholder-text-muted dark:placeholder-text-dark-muted
                  focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    touched.password && errors.password
                      ? 'border-accent-error dark:border-accent-error-dark'
                      : 'border-border-light dark:border-border-dark'
                  }
                `}
                placeholder="Enter your password"
              />
              {touched.password && errors.password && (
                <p
                  id="password-error"
                  className="mt-1.5 text-sm text-accent-error dark:text-accent-error-dark"
                  role="alert"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full px-6 py-3 rounded-lg
                font-medium text-white
                bg-accent-primary hover:bg-accent-primary/90
                focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2
                focus:ring-offset-light-base dark:focus:ring-offset-dark-panel
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              `}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
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
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>
        </div>

        {/* Back to site link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-text-secondary dark:text-text-dark-secondary hover:text-accent-primary dark:hover:text-accent-primary transition-colors"
          >
            Back to main site
          </a>
        </div>
      </div>
    </div>
  )
}
