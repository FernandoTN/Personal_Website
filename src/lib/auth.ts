import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

/**
 * NextAuth configuration for admin authentication
 * Uses credentials provider with environment variables for admin access
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Get admin credentials from environment variables
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        // Validate environment variables are set
        if (!adminEmail || !adminPassword) {
          console.error('Admin credentials not configured in environment variables')
          return null
        }

        // Validate provided credentials
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Check if credentials match
        const emailMatch = credentials.email.toLowerCase() === adminEmail.toLowerCase()
        const passwordMatch = credentials.password === adminPassword

        if (emailMatch && passwordMatch) {
          // Return user object on successful authentication
          return {
            id: '1',
            email: adminEmail,
            name: 'Admin',
            role: 'admin',
          }
        }

        // Return null for invalid credentials
        return null
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add role to token on initial sign in
      if (user) {
        token.role = (user as { role?: string }).role
      }
      return token
    },
    async session({ session, token }) {
      // Add role to session
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
}
