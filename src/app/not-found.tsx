import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found.',
}

/**
 * Custom 404 Not Found Page
 *
 * Displayed when a user navigates to a non-existent route.
 * Provides a helpful message and navigation back to the homepage.
 *
 * Features:
 * - Clear "Page Not Found" title
 * - Helpful message explaining the situation
 * - Link to navigate back to the homepage
 * - Consistent styling with the rest of the site
 * - Responsive design for all viewports
 * - Dark mode support
 */
export default function NotFound() {
  return (
    <section className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-16 md:py-24">
      <div className="container-wide">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Status */}
          <div className="mb-6">
            <span className="inline-block text-8xl md:text-9xl font-bold text-accent-primary/20 dark:text-accent-primary/30">
              404
            </span>
          </div>

          {/* Title */}
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary dark:text-text-dark-primary mb-4">
            Page Not Found
          </h1>

          {/* Description */}
          <p className="text-lg text-text-secondary dark:text-text-dark-secondary mb-8 max-w-md mx-auto">
            Sorry, the page you are looking for does not exist or may have been moved.
          </p>

          {/* Navigation Options */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary CTA - Go Home */}
            <Link
              href="/"
              className="
                inline-flex items-center gap-2 px-8 py-3
                text-base font-semibold
                rounded-lg
                bg-accent-primary hover:bg-accent-primary/90
                text-white
                shadow-light hover:shadow-glow
                transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-accent-primary focus-visible:ring-offset-2
              "
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go to Homepage
            </Link>

            {/* Secondary CTA - Contact */}
            <Link
              href="/contact"
              className="
                inline-flex items-center gap-2 px-8 py-3
                text-base font-semibold
                rounded-lg
                border border-border-light dark:border-border-dark
                bg-light-base dark:bg-dark-panel
                text-text-primary dark:text-text-dark-primary
                hover:border-accent-primary dark:hover:border-accent-primary
                hover:text-accent-primary dark:hover:text-accent-primary
                transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-accent-primary focus-visible:ring-offset-2
              "
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contact Me
            </Link>
          </div>

          {/* Additional Navigation Links */}
          <div className="mt-12 pt-8 border-t border-border-light dark:border-border-dark">
            <p className="text-sm text-text-tertiary dark:text-text-dark-tertiary mb-4">
              Or explore other sections:
            </p>
            <nav
              className="flex flex-wrap items-center justify-center gap-4"
              aria-label="Additional navigation"
            >
              <Link
                href="/about"
                className="text-sm text-text-secondary dark:text-text-dark-secondary hover:text-accent-primary dark:hover:text-accent-primary transition-colors"
              >
                About
              </Link>
              <span className="text-text-tertiary dark:text-text-dark-tertiary" aria-hidden="true">
                /
              </span>
              <Link
                href="/projects"
                className="text-sm text-text-secondary dark:text-text-dark-secondary hover:text-accent-primary dark:hover:text-accent-primary transition-colors"
              >
                Projects
              </Link>
              <span className="text-text-tertiary dark:text-text-dark-tertiary" aria-hidden="true">
                /
              </span>
              <Link
                href="/blog"
                className="text-sm text-text-secondary dark:text-text-dark-secondary hover:text-accent-primary dark:hover:text-accent-primary transition-colors"
              >
                Blog
              </Link>
              <span className="text-text-tertiary dark:text-text-dark-tertiary" aria-hidden="true">
                /
              </span>
              <Link
                href="/research"
                className="text-sm text-text-secondary dark:text-text-dark-secondary hover:text-accent-primary dark:hover:text-accent-primary transition-colors"
              >
                Research
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </section>
  )
}
