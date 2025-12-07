'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface TimelineEvent {
  id: string
  title: string
  description: string | null
  date: string
  endDate: string | null
  type: string
  company: string | null
  location: string | null
  icon: string | null
  color: string | null
  displayOrder: number
}

type EventType = 'all' | 'work' | 'education' | 'achievement'

// ------------------------------------------------------------------
// Icons
// ------------------------------------------------------------------
const Icons = {
  Plus: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  Edit: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
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
  Refresh: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  ),
  Timeline: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  ),
  Briefcase: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
    </svg>
  ),
  Academic: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
    </svg>
  ),
  Trophy: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
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
function FilterTabs({ current, onChange, counts }: { current: EventType; onChange: (type: EventType) => void; counts: { all: number; work: number; education: number; achievement: number } }) {
  const tabs: { value: EventType; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: counts.all },
    { value: 'work', label: 'Work', count: counts.work },
    { value: 'education', label: 'Education', count: counts.education },
    { value: 'achievement', label: 'Achievement', count: counts.achievement },
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
// Event Row Component
// ------------------------------------------------------------------
function EventRow({ event, onEdit, onDelete, isLoading }: { event: TimelineEvent; onEdit: (event: TimelineEvent) => void; onDelete: (id: string) => void; isLoading: boolean }) {
  const typeColors = {
    work: 'bg-accent-primary/10 text-accent-primary border-accent-primary/20',
    education: 'bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20',
    achievement: 'bg-accent-warning/10 text-accent-warning border-accent-warning/20',
  }

  const typeIcons = {
    work: <Icons.Briefcase />,
    education: <Icons.Academic />,
    achievement: <Icons.Trophy />,
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="bg-light-base dark:bg-dark-panel rounded-xl border border-border-light dark:border-border-dark p-5 hover:shadow-light dark:hover:shadow-glow transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColors[event.type as keyof typeof typeColors] || typeColors.work}`}>
            {typeIcons[event.type as keyof typeof typeIcons] || typeIcons.work}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text-primary dark:text-text-dark-primary">{event.title}</h3>
            {event.company && (
              <p className="text-sm text-text-secondary dark:text-text-dark-secondary mt-0.5">{event.company}</p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full border capitalize ${typeColors[event.type as keyof typeof typeColors] || typeColors.work}`}>
                {event.type}
              </span>
              <span className="text-sm text-text-muted dark:text-text-dark-muted">
                {formatDate(event.date)}
                {event.endDate && ` - ${formatDate(event.endDate)}`}
                {!event.endDate && ' - Present'}
              </span>
              {event.location && (
                <span className="text-sm text-text-muted dark:text-text-dark-muted">
                  | {event.location}
                </span>
              )}
            </div>
            {event.description && (
              <p className="mt-3 text-sm text-text-secondary dark:text-text-dark-secondary line-clamp-2">
                {event.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(event)}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 transition-colors disabled:opacity-50"
          >
            <Icons.Edit />
            Edit
          </button>
          <button
            onClick={() => onDelete(event.id)}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-accent-error/10 text-accent-error hover:bg-accent-error/20 transition-colors disabled:opacity-50"
          >
            <Icons.Trash />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------
// Event Form Modal Component
// ------------------------------------------------------------------
function EventFormModal({
  isOpen,
  onClose,
  onSubmit,
  event,
  isLoading,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<TimelineEvent>) => void
  event: TimelineEvent | null
  isLoading: boolean
}) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    date: '',
    endDate: '',
    type: 'work',
    location: '',
    displayOrder: 0,
  })

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        company: event.company || '',
        description: event.description || '',
        date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
        endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
        type: event.type,
        location: event.location || '',
        displayOrder: event.displayOrder,
      })
    } else {
      setFormData({
        title: '',
        company: '',
        description: '',
        date: '',
        endDate: '',
        type: 'work',
        location: '',
        displayOrder: 0,
      })
    }
  }, [event, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title: formData.title,
      company: formData.company || null,
      description: formData.description || null,
      date: formData.date,
      endDate: formData.endDate || null,
      type: formData.type,
      location: formData.location || null,
      displayOrder: formData.displayOrder,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
        <div className="relative bg-light-base dark:bg-dark-panel rounded-xl shadow-xl w-full max-w-lg p-6 border border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary dark:text-text-dark-primary">
              {event ? 'Edit Event' : 'Add Event'}
            </h2>
            <button onClick={onClose} className="text-text-muted dark:text-text-dark-muted hover:text-text-primary dark:hover:text-text-dark-primary">
              <Icons.X />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue text-text-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="e.g., Software Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-1">
                Company / Institution
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue text-text-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="e.g., Stanford University"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue text-text-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue text-text-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
                <p className="text-xs text-text-muted dark:text-text-dark-muted mt-1">Leave empty for current</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-1">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue text-text-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                >
                  <option value="work">Work</option>
                  <option value="education">Education</option>
                  <option value="achievement">Achievement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue text-text-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border-light dark:border-border-dark bg-light-base dark:bg-dark-deep-blue text-text-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none"
                placeholder="Brief description of the role or achievement..."
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-border-light dark:border-border-dark text-text-secondary dark:text-text-dark-secondary hover:bg-light-neutral-grey dark:hover:bg-dark-deep-blue transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-accent-primary text-white hover:bg-accent-primary/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : event ? 'Save Changes' : 'Add Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------
// Main Admin Timeline Page
// ------------------------------------------------------------------
export default function AdminTimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [filter, setFilter] = useState<EventType>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isActing, setIsActing] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null)
  const { status } = useSession()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  // Fetch events
  const fetchEvents = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/timeline')
      if (!res.ok) throw new Error('Failed to fetch timeline events')
      const data = await res.json()
      setEvents(data.events || [])
    } catch (error) {
      console.error('Error fetching timeline events:', error)
      setToast({ message: 'Failed to load timeline events', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchEvents()
    }
  }, [status, fetchEvents])

  // Handle add event
  const handleAddEvent = () => {
    setEditingEvent(null)
    setIsModalOpen(true)
  }

  // Handle edit event
  const handleEditEvent = (event: TimelineEvent) => {
    setEditingEvent(event)
    setIsModalOpen(true)
  }

  // Handle form submit (create or update)
  const handleFormSubmit = async (data: Partial<TimelineEvent>) => {
    setIsActing(true)
    try {
      if (editingEvent) {
        // Update existing event
        const res = await fetch(`/api/admin/timeline/${editingEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error('Failed to update event')
        const result = await res.json()
        setEvents((prev) => prev.map((e) => (e.id === editingEvent.id ? result.event : e)))
        setToast({ message: 'Event updated successfully', type: 'success' })
      } else {
        // Create new event
        const res = await fetch('/api/admin/timeline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error('Failed to create event')
        const result = await res.json()
        setEvents((prev) => [result.event, ...prev])
        setToast({ message: 'Event created successfully', type: 'success' })
      }
      setIsModalOpen(false)
      setEditingEvent(null)
    } catch (error) {
      console.error('Error saving event:', error)
      setToast({ message: 'Failed to save event', type: 'error' })
    } finally {
      setIsActing(false)
    }
  }

  // Handle delete event
  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this timeline event?')) return
    setIsActing(true)
    try {
      const res = await fetch(`/api/admin/timeline/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete event')
      setEvents((prev) => prev.filter((e) => e.id !== id))
      setToast({ message: 'Event deleted successfully', type: 'success' })
    } catch (error) {
      console.error('Error deleting event:', error)
      setToast({ message: 'Failed to delete event', type: 'error' })
    } finally {
      setIsActing(false)
    }
  }

  // Filter events
  const filteredEvents = filter === 'all' ? events : events.filter((e) => e.type === filter)

  // Calculate counts
  const counts = {
    all: events.length,
    work: events.filter((e) => e.type === 'work').length,
    education: events.filter((e) => e.type === 'education').length,
    achievement: events.filter((e) => e.type === 'achievement').length,
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
            Timeline Events
          </h1>
          <p className="mt-1 text-text-secondary dark:text-text-dark-secondary">
            Manage career and education timeline
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchEvents}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-light-neutral-grey dark:bg-dark-deep-blue text-text-primary dark:text-text-dark-primary hover:bg-light-icy-blue dark:hover:bg-dark-panel transition-colors disabled:opacity-50"
          >
            <Icons.Refresh />
            Refresh
          </button>
          <button
            onClick={handleAddEvent}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-accent-primary text-white hover:bg-accent-primary/90 transition-colors"
          >
            <Icons.Plus />
            Add Event
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-light-base dark:bg-dark-panel rounded-xl border border-border-light dark:border-border-dark p-4">
          <p className="text-sm text-text-muted dark:text-text-dark-muted">Total Events</p>
          <p className="text-2xl font-bold text-text-primary dark:text-text-dark-primary mt-1">
            {counts.all}
          </p>
        </div>
        <div className="bg-light-base dark:bg-dark-panel rounded-xl border border-border-light dark:border-border-dark p-4">
          <p className="text-sm text-text-muted dark:text-text-dark-muted">Work Experience</p>
          <p className="text-2xl font-bold text-accent-primary mt-1">
            {counts.work}
          </p>
        </div>
        <div className="bg-light-base dark:bg-dark-panel rounded-xl border border-border-light dark:border-border-dark p-4">
          <p className="text-sm text-text-muted dark:text-text-dark-muted">Education</p>
          <p className="text-2xl font-bold text-accent-secondary mt-1">
            {counts.education}
          </p>
        </div>
        <div className="bg-light-base dark:bg-dark-panel rounded-xl border border-border-light dark:border-border-dark p-4">
          <p className="text-sm text-text-muted dark:text-text-dark-muted">Achievements</p>
          <p className="text-2xl font-bold text-accent-warning mt-1">
            {counts.achievement}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <FilterTabs current={filter} onChange={setFilter} counts={counts} />

      {/* Events List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12 bg-light-base dark:bg-dark-panel rounded-xl border border-border-light dark:border-border-dark">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-light-neutral-grey dark:bg-dark-deep-blue mb-4">
            <Icons.Timeline />
          </div>
          <h3 className="text-lg font-medium text-text-primary dark:text-text-dark-primary mb-1">
            No events found
          </h3>
          <p className="text-text-muted dark:text-text-dark-muted">
            {filter === 'all'
              ? 'Add your first timeline event to get started'
              : `No ${filter} events yet`}
          </p>
          <button
            onClick={handleAddEvent}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-accent-primary text-white hover:bg-accent-primary/90 transition-colors"
          >
            <Icons.Plus />
            Add Event
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <EventRow
              key={event.id}
              event={event}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              isLoading={isActing}
            />
          ))}
        </div>
      )}

      {/* Event Form Modal */}
      <EventFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingEvent(null)
        }}
        onSubmit={handleFormSubmit}
        event={editingEvent}
        isLoading={isActing}
      />

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
