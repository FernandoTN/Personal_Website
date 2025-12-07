'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'

interface NavItem {
  label: string
  href: string
}

interface NavigationProps {
  /** Additional CSS classes */
  className?: string
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Research', href: '/research' },
  { label: 'Contact', href: '/contact' },
]

/**
 * Main navigation component with responsive design and theme toggle.
 * Includes mobile hamburger menu and desktop horizontal nav.
 *
 * Usage:
 * <Navigation />
 *
 * Accessibility:
 * - Uses semantic nav element with aria-label
 * - Indicates current page with aria-current
 * - Mobile menu supports keyboard navigation
 */
export function Navigation({ className = '' }: NavigationProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        border-b border-border-light dark:border-border-dark
        bg-light-base/95 dark:bg-dark-base/95 backdrop-blur-md
        ${className}
      `}
      aria-label="Main navigation"
    >
      <div className="container-wide">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-heading font-bold text-text-primary dark:text-text-dark-primary hover:text-accent-primary transition-colors"
          >
            <span>Fernando Torres</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    isActive(item.href)
                      ? 'bg-accent-primary/10 text-accent-primary'
                      : 'text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark-primary hover:bg-light-neutral-grey dark:hover:bg-dark-panel'
                  }
                `}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle size="sm" />

            {/* Mobile menu button */}
            <MobileMenuButton />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown - controlled by MobileMenuButton */}
      <MobileMenu navItems={navItems} isActive={isActive} />
    </nav>
  )
}

/**
 * Mobile menu button component with hamburger icon animation
 */
function MobileMenuButton() {
  const handleClick = () => {
    const mobileMenu = document.getElementById('mobile-menu')
    const isExpanded = mobileMenu?.classList.contains('max-h-96')

    if (mobileMenu) {
      mobileMenu.classList.toggle('max-h-0')
      mobileMenu.classList.toggle('max-h-96')
      mobileMenu.classList.toggle('opacity-0')
      mobileMenu.classList.toggle('opacity-100')
    }

    // Toggle aria-expanded on button
    const button = document.getElementById('mobile-menu-button')
    if (button) {
      button.setAttribute('aria-expanded', String(!isExpanded))
    }
  }

  return (
    <button
      id="mobile-menu-button"
      type="button"
      className="
        md:hidden
        h-10 w-10
        inline-flex items-center justify-center
        rounded-lg border border-border-light dark:border-border-dark
        bg-light-neutral-grey dark:bg-dark-panel
        text-text-secondary dark:text-text-dark-secondary
        hover:bg-light-icy-blue dark:hover:bg-dark-deep-blue
        hover:text-text-primary dark:hover:text-text-dark-primary
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-accent-primary focus-visible:ring-offset-2
      "
      onClick={handleClick}
      aria-label="Toggle navigation menu"
      aria-expanded="false"
      aria-controls="mobile-menu"
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  )
}

interface MobileMenuProps {
  navItems: NavItem[]
  isActive: (href: string) => boolean
}

/**
 * Mobile menu dropdown component
 */
function MobileMenu({ navItems, isActive }: MobileMenuProps) {
  return (
    <div
      id="mobile-menu"
      className="
        md:hidden
        overflow-hidden transition-all duration-300 ease-in-out
        max-h-0 opacity-0
        border-t border-border-light dark:border-border-dark
        bg-light-base dark:bg-dark-base
      "
      aria-labelledby="mobile-menu-button"
    >
      <div className="container-wide py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              block px-4 py-3 rounded-md text-base font-medium transition-colors
              ${
                isActive(item.href)
                  ? 'bg-accent-primary/10 text-accent-primary'
                  : 'text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark-primary hover:bg-light-neutral-grey dark:hover:bg-dark-panel'
              }
            `}
            aria-current={isActive(item.href) ? 'page' : undefined}
            onClick={() => {
              // Close menu after navigation
              const mobileMenu = document.getElementById('mobile-menu')
              if (mobileMenu) {
                mobileMenu.classList.add('max-h-0', 'opacity-0')
                mobileMenu.classList.remove('max-h-96', 'opacity-100')
              }
              const button = document.getElementById('mobile-menu-button')
              if (button) {
                button.setAttribute('aria-expanded', 'false')
              }
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Navigation
