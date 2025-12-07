'use client'

import { useState, useCallback, useMemo } from 'react'

/**
 * Contact Page Component
 *
 * Features:
 * - Contact form with fields: name, email, subject (optional), message
 * - Client-side validation using useState with real-time error messages
 * - Required field validation for name, email, message
 * - Email format validation using regex pattern
 * - Submit button that shows validation state (disabled until valid)
 * - Social links section (GitHub, LinkedIn, Email)
 * - Responsive design with Tailwind CSS
 *
 * Accessibility:
 * - Proper form labels and aria-describedby for error messages
 * - Focus management for form fields
 * - Keyboard navigation support
 * - Screen reader friendly error announcements
 */

// Form field types
interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

interface FormTouched {
  name: boolean
  email: boolean
  subject: boolean
  message: boolean
}

// Email validation regex pattern
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// Social links data
const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/FernandoTN',
    icon: (
      <svg
        className="h-6 w-6"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
    description: 'View my open source projects',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/fernandotn/',
    icon: (
      <svg
        className="h-6 w-6"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
          clipRule="evenodd"
        />
      </svg>
    ),
    description: 'Connect with me professionally',
  },
  {
    label: 'Email',
    href: 'mailto:fertorresnavarrete@gmail.com',
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
        />
      </svg>
    ),
    description: 'fertorresnavarrete@gmail.com',
  },
]

// Initial form state
const initialFormData: FormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

const initialTouched: FormTouched = {
  name: false,
  email: false,
  subject: false,
  message: false,
}

export default function ContactPage() {
  // Form state
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [touched, setTouched] = useState<FormTouched>(initialTouched)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Validate a single field
  const validateField = useCallback((name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) {
          return 'Name is required'
        }
        if (value.trim().length < 2) {
          return 'Name must be at least 2 characters'
        }
        return undefined

      case 'email':
        if (!value.trim()) {
          return 'Email is required'
        }
        if (!EMAIL_REGEX.test(value.trim())) {
          return 'Please enter a valid email address'
        }
        return undefined

      case 'message':
        if (!value.trim()) {
          return 'Message is required'
        }
        if (value.trim().length < 10) {
          return 'Message must be at least 10 characters'
        }
        return undefined

      default:
        return undefined
    }
  }, [])

  // Compute errors based on current form data
  const errors: FormErrors = useMemo(() => {
    return {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      message: validateField('message', formData.message),
    }
  }, [formData, validateField])

  // Check if form is valid
  const isFormValid = useMemo(() => {
    return !errors.name && !errors.email && !errors.message
  }, [errors])

  // Handle input change
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  // Handle field blur (mark as touched)
  const handleBlur = useCallback((
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }, [])

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true,
    })

    // Validate form
    if (!isFormValid) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Simulate API call (replace with actual API endpoint)
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setSubmitStatus('success')
      setFormData(initialFormData)
      setTouched(initialTouched)
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, isFormValid])

  // Get error message to display (only if field is touched)
  const getFieldError = (fieldName: keyof FormErrors) => {
    return touched[fieldName] ? errors[fieldName] : undefined
  }

  return (
    <main className="container-narrow py-16">
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="font-heading text-4xl font-bold mb-4 text-text-primary dark:text-text-dark-primary">
          Get in Touch
        </h1>
        <p className="text-lg text-text-secondary dark:text-text-dark-secondary max-w-2xl mx-auto">
          Have a question or want to work together? Fill out the form below or reach out
          through any of my social channels. I&apos;ll get back to you as soon as possible.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Contact Form */}
        <div className="card">
          <h2 className="font-heading text-2xl font-semibold mb-6 text-text-primary dark:text-text-dark-primary">
            Send a Message
          </h2>

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div
              className="mb-6 p-4 rounded-md bg-accent-success/10 border border-accent-success/20 text-accent-success"
              role="alert"
              aria-live="polite"
            >
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">Message sent successfully!</span>
              </div>
              <p className="mt-1 text-sm opacity-90">
                Thank you for reaching out. I&apos;ll get back to you soon.
              </p>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div
              className="mb-6 p-4 rounded-md bg-accent-error/10 border border-accent-error/20 text-accent-error"
              role="alert"
              aria-live="polite"
            >
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
                <span className="font-medium">Failed to send message</span>
              </div>
              <p className="mt-1 text-sm opacity-90">
                Please try again later or reach out via email directly.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2"
              >
                Name <span className="text-accent-error">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-describedby={getFieldError('name') ? 'name-error' : undefined}
                aria-invalid={!!getFieldError('name')}
                className={`input ${
                  getFieldError('name')
                    ? 'border-accent-error focus:border-accent-error focus:ring-accent-error'
                    : ''
                }`}
                placeholder="Your full name"
              />
              {getFieldError('name') && (
                <p
                  id="name-error"
                  className="mt-2 text-sm text-accent-error"
                  role="alert"
                >
                  {getFieldError('name')}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2"
              >
                Email <span className="text-accent-error">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-describedby={getFieldError('email') ? 'email-error' : undefined}
                aria-invalid={!!getFieldError('email')}
                className={`input ${
                  getFieldError('email')
                    ? 'border-accent-error focus:border-accent-error focus:ring-accent-error'
                    : ''
                }`}
                placeholder="you@example.com"
              />
              {getFieldError('email') && (
                <p
                  id="email-error"
                  className="mt-2 text-sm text-accent-error"
                  role="alert"
                >
                  {getFieldError('email')}
                </p>
              )}
            </div>

            {/* Subject Field (Optional) */}
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2"
              >
                Subject <span className="text-text-muted dark:text-text-dark-muted">(optional)</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                className="input"
                placeholder="What is this regarding?"
              />
            </div>

            {/* Message Field */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2"
              >
                Message <span className="text-accent-error">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={5}
                aria-describedby={getFieldError('message') ? 'message-error' : undefined}
                aria-invalid={!!getFieldError('message')}
                className={`input resize-none ${
                  getFieldError('message')
                    ? 'border-accent-error focus:border-accent-error focus:ring-accent-error'
                    : ''
                }`}
                placeholder="Your message..."
              />
              {getFieldError('message') && (
                <p
                  id="message-error"
                  className="mt-2 text-sm text-accent-error"
                  role="alert"
                >
                  {getFieldError('message')}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="btn-primary w-full px-6 py-3 text-base font-medium"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
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
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>

        {/* Social Links Section */}
        <div className="space-y-8">
          <div className="card">
            <h2 className="font-heading text-2xl font-semibold mb-6 text-text-primary dark:text-text-dark-primary">
              Connect With Me
            </h2>
            <p className="text-text-secondary dark:text-text-dark-secondary mb-6">
              Prefer to connect another way? Find me on these platforms or send me an email directly.
            </p>

            <div className="space-y-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.label !== 'Email' ? '_blank' : undefined}
                  rel={link.label !== 'Email' ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border-light dark:border-border-dark
                    hover:bg-light-icy-blue dark:hover:bg-dark-panel transition-colors duration-200
                    group"
                  aria-label={
                    link.label === 'Email'
                      ? `Send email to ${link.description}`
                      : `Visit ${link.label} profile (opens in new tab)`
                  }
                >
                  <span className="flex-shrink-0 text-text-secondary dark:text-text-dark-secondary group-hover:text-accent-primary transition-colors duration-200">
                    {link.icon}
                  </span>
                  <div className="min-w-0">
                    <span className="block font-medium text-text-primary dark:text-text-dark-primary group-hover:text-accent-primary transition-colors duration-200">
                      {link.label}
                    </span>
                    <span className="block text-sm text-text-secondary dark:text-text-dark-secondary truncate">
                      {link.description}
                    </span>
                  </div>
                  <svg
                    className="h-5 w-5 flex-shrink-0 ml-auto text-text-muted dark:text-text-dark-muted group-hover:text-accent-primary transition-colors duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Additional Info Card */}
          <div className="card bg-light-icy-blue dark:bg-dark-deep-blue border-accent-primary/20">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-2 rounded-full bg-accent-primary/10">
                <svg
                  className="h-6 w-6 text-accent-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary dark:text-text-dark-primary mb-1">
                  Response Time
                </h3>
                <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                  I typically respond within 24-48 hours. For urgent matters,
                  please reach out via LinkedIn.
                </p>
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="card">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-2 rounded-full bg-accent-secondary/10 dark:bg-accent-secondary-dark/10">
                <svg
                  className="h-6 w-6 text-accent-secondary dark:text-accent-secondary-dark"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary dark:text-text-dark-primary mb-1">
                  Based in
                </h3>
                <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                  Stanford, California
                </p>
                <p className="text-xs text-text-muted dark:text-text-dark-muted mt-1">
                  MSx &apos;26 at Stanford Graduate School of Business
                </p>
              </div>
            </div>
          </div>

          {/* Resume Download Card */}
          <div className="card">
            <h2 className="font-heading text-2xl font-semibold mb-4 text-text-primary dark:text-text-dark-primary">
              Download Resume
            </h2>
            <p className="text-text-secondary dark:text-text-dark-secondary mb-6">
              Get a copy of my resume to learn more about my professional background and experience.
            </p>
            <a
              href="/Fernando_Torres_Resume.pdf"
              download="Fernando_Torres_Resume.pdf"
              className="inline-flex items-center justify-center gap-3 w-full px-6 py-4 rounded-lg
                bg-accent-primary hover:bg-accent-primary/90
                text-white font-medium text-base
                transition-all duration-200
                hover:shadow-lg hover:shadow-accent-primary/25
                focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2
                dark:focus:ring-offset-dark-bg
                group"
              aria-label="Download Fernando Torres Resume as PDF"
            >
              <svg
                className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              <span>Download Resume (PDF)</span>
            </a>
            <p className="mt-3 text-xs text-center text-text-muted dark:text-text-dark-muted">
              Fernando_Torres_Resume.pdf
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
