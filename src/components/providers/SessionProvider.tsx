'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface SessionProviderProps {
  children: ReactNode
}

/**
 * NextAuth Session Provider wrapper
 * Provides session context to client components
 *
 * Security features:
 * - refetchInterval: Checks session validity every 5 minutes
 * - refetchOnWindowFocus: Validates session when user returns to tab
 * - This ensures expired sessions are detected promptly
 *
 * Usage:
 * Wrap components that need access to useSession hook
 */
export function SessionProvider({ children }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider
      refetchInterval={5 * 60} // Check session every 5 minutes
      refetchOnWindowFocus={true} // Check session when window regains focus
    >
      {children}
    </NextAuthSessionProvider>
  )
}

export default SessionProvider
