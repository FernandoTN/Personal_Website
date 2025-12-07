import type { Metadata } from 'next'

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
    <div className="min-h-screen bg-light-neutral-grey dark:bg-dark-base">
      {/* TODO: Add admin sidebar and header */}
      <main className="p-8">
        {children}
      </main>
    </div>
  )
}
