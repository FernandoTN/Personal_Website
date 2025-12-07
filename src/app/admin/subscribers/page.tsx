'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface Subscriber {
  id: string
  email: string
  name: string | null
  status: 'ACTIVE' | 'UNSUBSCRIBED'
  subscribedAt: string
  unsubscribedAt: string | null
  source: string | null
}

type FilterStatus = 'all' | 'ACTIVE' | 'UNSUBSCRIBED'

// ------------------------------------------------------------------
// Icons
// ------------------------------------------------------------------
const Icons = {
  Search: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  ),
  Download: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  ),
  Refresh: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  ),
  Users: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  X: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
}

// ------------------------------------------------------------------
// Toast Component
// ------------------------------------------------------------------
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${type === 'success' ? 'bg-accent-success text-white' : 'bg-accent-error text-white'}`}>
      {type === 'success' ? <Icons.Check /> : <Icons.X />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-75"><Icons.X /></button>
    </div>
  )
}

// ------------------------------------------------------------------
// Filter Tabs Component
// ------------------------------------------------------------------
function FilterTabs({ current, onChange, counts }: { current: FilterStatus; onChange: (status: FilterStatus) => void; counts: { all: number; active: number; unsubscribed: number } }) {
  const tabs: { value: FilterStatus; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: counts.all },
    { value: 'ACTIVE', label: 'Active', count: counts.active },
    { value: 'UNSUBSCRIBED', label: 'Unsubscribed', count: counts.unsubscribed },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            current === tab.value
              ? 'bg-accent-primary text-white'
              : 'bg-light-neutral-grey dark:bg-dark-deep-blue text-text-secondary dark:text-text-dark-secondary hover:bg-light-icy-blue dark:hover:bg-dark-panel'
          }`}
        >
          {tab.label}
          <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${current === tab.value ? 'bg-white/20' : 'bg-border-light dark:bg-border-dark'}`}>
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  )
}

// ------------------------------------------------------------------
// Subscriber Row Component
// ------------------------------------------------------------------
function SubscriberRow({ subscriber }: { subscriber: Subscriber }) {
  const statusColors = {
    ACTIVE: 'bg-accent-success/10 text-accent-success border-accent-success/20',
    UNSUBSCRIBED: 'bg-accent-error/10 text-accent-error border-accent-error/20',
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <tr className="border-b border-border-light dark:border-border-dark hover:bg-light-icy-blue dark:hover:bg-dark-deep-blue/50 transition-colors">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary font-semibold flex-shrink-0">
            {subscriber.email.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-text-primary dark:text-text-dark-primary truncate">
              {subscriber.email}
            </p>
            {subscriber.name && (
              <p className="text-sm text-text-muted dark:text-text-dark-muted truncate">
                {subscriber.name}
              </p>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-text-secondary dark:text-text-dark-secondary">
        {formatDate(subscriber.subscribedAt)}
      </td>
      <td className="px-4 py-4 text-sm text-text-secondary dark:text-text-dark-secondary">
        {subscriber.source || '-'}
      </td>
      <td className="px-4 py-4">
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${statusColors[subscriber.status]}`}>
          {subscriber.status === 'ACTIVE' ? 'Active' : 'Unsubscribed'}
        </span>
      </td>
    </tr>
  )
}

// ------------------------------------------------------------------
// Main Admin Subscribers Page
// ------------------------------------------------------------------
export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const { status } = useSession()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  // Fetch subscribers
  const fetchSubscribers = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/subscribers')
      if (!res.ok) throw new Error('Failed to fetch subscribers')
      const data = await res.json()
      setSubscribers(data.subscribers || [])
    } catch (error) {
      console.error('Error fetching subscribers:', error)
      setToast({ message: 'Failed to load subscribers', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSubscribers()
    }
  }, [status, fetchSubscribers])

  // Export CSV handler
  const handleExportCSV = async () => {
    setIsExporting(true)
    try {
      const res = await fetch('/api/admin/subscribers?export=csv')
      if (!res.ok) throw new Error('Failed to export subscribers')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      setToast({ message: 'CSV exported successfully', type: 'success' })
    } catch (error) {
      console.error('Error exporting subscribers:', error)
      setToast({ message: 'Failed to export subscribers', type: 'error' })
    } finally {
      setIsExporting(false)
    }
  }

  // Filter subscribers based on status and search
  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesFilter = filter === 'all' || sub.status === filter
    const matchesSearch = searchQuery === '' ||
      sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.name && sub.name.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  // Calculate counts
  const counts = {
    all: subscribers.length,
    active: subscribers.filter((s) => s.status === 'ACTIVE').length,
    unsubscribed: subscribers.filter((s) => s.status === 'UNSUBSCRIBED').length,
  }

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-text-primary dark:text-text-dark-primary">
            Subscribers
          </h1>
          <p className="mt-1 text-text-secondary dark:text-text-dark-secondary">
            Manage newsletter subscribers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSubscribers}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-light-neutral-grey dark:bg-dark-deep-blue text-text-primary dark:text-text-dark-primary hover:bg-light-icy-blue dark:hover:bg-dark-panel transition-colors disabled:opacity-50"
          >
            <Icons.Refresh />
            Refresh
          </button>
          <button
            onClick={handleExportCSV}
            disabled={isExporting || subscribers.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-accent-primary text-white hover:bg-accent-primary/90 transition-colors disabled:opacity-50"
          >
            <Icons.Download />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-light-base dark:bg-dark-panel rounded-xl border border-border-light dark:border-border-dark p-4">
          <p className="text-sm text-text-muted dark:text-text-dark-muted">Total Subscribers</p>
          <p className="text-2xl font-bold text-text-primary dark:text-text-dark-primary mt-1">
            {counts.all}
          </p>
        </div>
        <div className="bg-light-base dark:bg-dark-panel rounded-xl border border-border-light dark:border-border-dark p-4">
          <p className="text-sm text-text-muted dark:text-text-dark-muted">Active</p>
          <p className="text-2xl font-bold text-accent-success mt-1">
            {counts.active}
          </p>
        </div>
        <div className="bg-light-base dark:bg-dark-panel rounded-xl border border-border-light dark:border-border-dark p-4">
          <p className="text-sm text-text-muted dark:text-text-dark-muted">Unsubscribed</p>
          <p className="text-2xl font-bold text-accent-error mt-1">
            {counts.unsubscribed}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <FilterTabs current={filter} onChange={setFilter} counts={counts} />

        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted dark:text-text-dark-muted">
            <Icons.Search />
          </div>
          <input
            type="text"
            placeholder="Search subscribers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-panel text-text-primary dark:text-text-dark-primary placeholder-text-muted dark:placeholder-text-dark-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-colors"
          />
        </div>
      </div>

      {/* Subscribers Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary" />
        </div>
      ) : filteredSubscribers.length === 0 ? (
        <div className="text-center py-12 bg-light-base dark:bg-dark-panel rounded-xl border border-border-light dark:border-border-dark">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-light-neutral-grey dark:bg-dark-deep-blue mb-4">
            <Icons.Users />
          </div>
          <h3 className="text-lg font-medium text-text-primary dark:text-text-dark-primary mb-1">
            No subscribers found
          </h3>
          <p className="text-text-muted dark:text-text-dark-muted">
            {searchQuery
              ? 'No subscribers match your search criteria'
              : filter === 'ACTIVE'
              ? 'No active subscribers yet'
              : filter === 'UNSUBSCRIBED'
              ? 'No unsubscribed users'
              : 'No subscribers have signed up yet'}
          </p>
        </div>
      ) : (
        <div className="bg-light-base dark:bg-dark-panel rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-light-neutral-grey dark:bg-dark-deep-blue">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider">
                    Subscribed
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark">
                {filteredSubscribers.map((subscriber) => (
                  <SubscriberRow key={subscriber.id} subscriber={subscriber} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-4 py-3 border-t border-border-light dark:border-border-dark bg-light-neutral-grey/50 dark:bg-dark-deep-blue/50">
            <p className="text-sm text-text-muted dark:text-text-dark-muted">
              Showing {filteredSubscribers.length} of {subscribers.length} subscribers
            </p>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
