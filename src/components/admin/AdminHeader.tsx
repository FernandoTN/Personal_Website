'use client'

import { useSession, signOut } from 'next-auth/react'

// ------------------------------------------------------------------
// AdminHeader Component
// ------------------------------------------------------------------
export function AdminHeader() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 bg-light-base/80 dark:bg-dark-panel/80 backdrop-blur-md border-b border-border-light dark:border-border-dark">
      <div className="flex items-center gap-4">
        {/* Mobile menu button placeholder */}
        <button
          type="button"
          className="lg:hidden p-2 rounded-lg text-text-secondary dark:text-text-dark-secondary hover:bg-light-neutral-grey dark:hover:bg-dark-deep-blue"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          type="button"
          className="p-2 rounded-lg text-text-secondary dark:text-text-dark-secondary hover:bg-light-neutral-grey dark:hover:bg-dark-deep-blue relative"
          aria-label="View notifications"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-error rounded-full" />
        </button>

        {/* User menu */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center">
            <span className="text-accent-primary text-sm font-medium">
              {session?.user?.name?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
          <span className="hidden sm:block text-sm font-medium text-text-primary dark:text-text-dark-primary">
            {session?.user?.name || 'Admin'}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary dark:text-text-dark-secondary hover:bg-light-neutral-grey dark:hover:bg-dark-deep-blue transition-colors"
            aria-label="Sign out"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
