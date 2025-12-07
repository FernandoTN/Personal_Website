import type { Metadata } from 'next'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ToastProvider } from '@/components/ui/Toast'

export const metadata: Metadata = {
  title: {
    default: 'Admin Dashboard',
    template: '%s | Admin',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <ToastProvider>
        <div className="min-h-screen bg-light-neutral-grey dark:bg-dark-base">
          {/* Sidebar - hidden on mobile for now */}
          <div className="hidden lg:block">
            <AdminSidebar />
          </div>

          {/* Main content area */}
          <div className="lg:pl-64">
            <AdminHeader />
            <main className="p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </ToastProvider>
    </SessionProvider>
  )
}
