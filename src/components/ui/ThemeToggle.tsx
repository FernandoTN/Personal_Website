'use client'

import { useTheme } from '@/hooks/useTheme'

interface ThemeToggleProps {
  /** Additional CSS classes */
  className?: string
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Show label text */
  showLabel?: boolean
}

/**
 * Theme toggle button component for switching between light and dark modes.
 * Persists preference to localStorage and respects system preference.
 *
 * Usage:
 * <ThemeToggle />
 * <ThemeToggle size="lg" showLabel />
 *
 * Accessibility:
 * - Uses button element with aria-label
 * - Supports keyboard navigation (Enter/Space)
 * - Announces current theme state to screen readers
 */
export function ThemeToggle({
  className = '',
  size = 'md',
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const isDark = theme === 'dark'

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={toggleTheme}
        className={`
          ${sizeClasses[size]}
          relative inline-flex items-center justify-center
          rounded-lg border border-border-light dark:border-border-dark
          bg-light-neutral-grey dark:bg-dark-panel
          text-text-secondary dark:text-text-dark-secondary
          hover:bg-light-icy-blue dark:hover:bg-dark-deep-blue
          hover:text-text-primary dark:hover:text-text-dark-primary
          transition-all duration-200
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-accent-primary focus-visible:ring-offset-2
          focus-visible:ring-offset-light-base dark:focus-visible:ring-offset-dark-base
        `}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-pressed={isDark}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {/* Sun icon - shown in dark mode */}
        <svg
          className={`
            ${iconSizes[size]}
            absolute transition-all duration-300
            ${isDark ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}
          `}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>

        {/* Moon icon - shown in light mode */}
        <svg
          className={`
            ${iconSizes[size]}
            absolute transition-all duration-300
            ${isDark ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'}
          `}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </button>

      {showLabel && (
        <span className="text-sm text-text-secondary dark:text-text-dark-secondary">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </div>
  )
}

export default ThemeToggle
