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
 * Usage:
 * Wrap components that need access to useSession hook
 */
export function SessionProvider({ children }: SessionProviderProps) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}

export default SessionProvider
