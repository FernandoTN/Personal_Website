'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

/**
 * Custom hook for requiring authentication on admin pages
 *
 * Security features:
 * - Redirects unauthenticated users to login page
 * - Adds expired=true parameter when session expires mid-session
 * - Returns session status and data for component use
 *
 * OWASP Reference:
 * - A07:2021 Identification and Authentication Failures
 * - Ensures proper session management and timeout handling
 *
 * Usage:
 * const { session, status, isLoading, isAuthenticated } = useRequireAuth()
 *
 * @returns Object with session data and status information
 */
export function useRequireAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Redirect to login if not authenticated
    // This handles both initial access without login and session expiration
    if (status === 'unauthenticated') {
      // Add expired=true parameter to indicate session expiration
      // The login page will display appropriate message
      router.push('/admin/login?expired=true')
    }
  }, [status, router])

  return {
    session,
    status,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  }
}

export default useRequireAuth
