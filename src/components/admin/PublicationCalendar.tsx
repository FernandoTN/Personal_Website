'use client'

import { useState, useEffect, useMemo, useCallback, DragEvent } from 'react'

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface Post {
  id: string
  slug: string
  title: string
  excerpt: string | null
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED'
  publishedAt: string | null
  scheduledFor: string | null
  category: string | null
  seriesOrder: number | null
  series: {
    id: string
    name: string
    slug: string
  } | null
}

interface WeekInfo {
  weekNumber: number
  startDate: string
  endDate: string
  theme: string
  postCount: number
  dates: string[]
}

interface CalendarData {
  success: boolean
  startDate: string
  endDate: string
  calendarData: Record<string, Post[]>
  unscheduledDrafts: Post[]
  weeks: WeekInfo[]
  totalPosts: number
  publishedCount: number
  scheduledCount: number
  draftCount: number
}

interface RescheduleDialogProps {
  isOpen: boolean
  post: Post | null
  fromDate: string | null
  toDate: string | null
  isLoading: boolean
  onConfirm: () => void
  onCancel: () => void
}

// ------------------------------------------------------------------
// Helper Functions
// ------------------------------------------------------------------
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function formatMonthDay(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function getDayName(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

function isToday(dateString: string): boolean {
  const today = new Date().toISOString().split('T')[0]
  return dateString === today
}

function isPast(dateString: string): boolean {
  const today = new Date().toISOString().split('T')[0]
  return dateString < today
}

// ------------------------------------------------------------------
// Reschedule Confirmation Dialog Component
// ------------------------------------------------------------------
function RescheduleDialog({
  isOpen,
  post,
  fromDate,
  toDate,
  isLoading,
  onConfirm,
  onCancel,
}: RescheduleDialogProps) {
  if (!isOpen || !post) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className="relative z-10 w-full max-w-md mx-4 bg-light-base dark:bg-dark-panel rounded-xl shadow-xl border border-border-light dark:border-border-dark"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reschedule-dialog-title"
      >
        <div className="p-6">
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
            <svg
              className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          {/* Title */}
          <h3
            id="reschedule-dialog-title"
            className="text-lg font-heading font-semibold text-center text-text-primary dark:text-text-dark-primary mb-2"
          >
            Reschedule Post
          </h3>

          {/* Description */}
          <div className="text-center mb-6">
            <p className="text-text-secondary dark:text-text-dark-secondary mb-3">
              Are you sure you want to reschedule this post?
            </p>
            <div className="p-3 bg-light-neutral-grey dark:bg-dark-deep-blue rounded-lg">
              <p className="font-medium text-text-primary dark:text-text-dark-primary truncate">
                {post.title}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2 text-sm">
                <span className="text-text-tertiary dark:text-text-dark-tertiary">
                  {fromDate ? formatDate(fromDate) : 'Unscheduled'}
                </span>
                <svg className="w-4 h-4 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span className="font-medium text-accent-primary">
                  {toDate ? formatDate(toDate) : 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg
                bg-light-neutral-grey dark:bg-dark-deep-blue
                text-text-primary dark:text-text-dark-primary
                hover:bg-border-light dark:hover:bg-dark-muted
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg
                bg-accent-primary text-white
                hover:bg-accent-primary/90
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                'Confirm Reschedule'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------
// Status Badge Component
// ------------------------------------------------------------------
function StatusBadge({ status }: { status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' }) {
  const styles = {
    PUBLISHED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    SCHEDULED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    DRAFT: 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-400',
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  )
}

// ------------------------------------------------------------------
// Category Badge Component
// ------------------------------------------------------------------
function CategoryBadge({ category }: { category: string | null }) {
  if (!category) return null

  const categoryColors: Record<string, string> = {
    ANCHOR: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    THEME: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    EMERGENT: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
    PRACTITIONER: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    PROTOTYPE: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
    CONFERENCE: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    METHODOLOGY: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  }

  const style = categoryColors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-400'

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${style}`}>
      {category.charAt(0) + category.slice(1).toLowerCase()}
    </span>
  )
}

// ------------------------------------------------------------------
// Draggable Post Card Component
// ------------------------------------------------------------------
interface DraggablePostCardProps {
  post: Post
  onDragStart: (post: Post, sourceDate: string | null) => void
}

function DraggablePostCard({ post, onDragStart }: DraggablePostCardProps) {
  const statusColors = {
    PUBLISHED: 'border-l-green-500',
    SCHEDULED: 'border-l-yellow-500',
    DRAFT: 'border-l-gray-400',
  }

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', post.id)
    // Determine source date based on status
    const sourceDate = post.status === 'SCHEDULED'
      ? post.scheduledFor
      : post.status === 'PUBLISHED'
        ? post.publishedAt
        : null
    onDragStart(post, sourceDate)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`
        p-2 rounded-lg bg-light-base dark:bg-dark-panel
        border border-border-light dark:border-border-dark
        border-l-4 ${statusColors[post.status]}
        hover:shadow-md transition-all cursor-grab active:cursor-grabbing
        hover:ring-2 hover:ring-accent-primary/30
      `}
      data-post-id={post.id}
      data-testid="draggable-post-card"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-text-primary dark:text-text-dark-primary truncate">
            {post.seriesOrder && (
              <span className="text-text-tertiary dark:text-text-dark-tertiary mr-1">
                #{post.seriesOrder}
              </span>
            )}
            {post.title}
          </h4>
          <div className="flex items-center gap-1 mt-1">
            <StatusBadge status={post.status} />
            <CategoryBadge category={post.category} />
          </div>
        </div>
        {/* Drag handle indicator */}
        <div className="flex-shrink-0 opacity-50">
          <svg className="w-4 h-4 text-text-tertiary" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------
// Droppable Day Cell Component
// ------------------------------------------------------------------
interface DroppableDayCellProps {
  dateString: string
  posts: Post[]
  onDragStart: (post: Post, sourceDate: string | null) => void
  onDrop: (targetDate: string) => void
  isDragActive: boolean
}

function DroppableDayCell({
  dateString,
  posts,
  onDragStart,
  onDrop,
  isDragActive,
}: DroppableDayCellProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const today = isToday(dateString)
  const past = isPast(dateString)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (!isDragOver) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    // Only set false if we're actually leaving the cell (not entering a child)
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDragOver(false)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    onDrop(dateString)
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-date={dateString}
      data-testid="calendar-day-cell"
      className={`
        min-h-[120px] p-2 border rounded-lg transition-all
        ${isDragOver
          ? 'border-accent-primary border-2 bg-accent-primary/10 ring-2 ring-accent-primary/30'
          : 'border-border-light dark:border-border-dark'
        }
        ${isDragActive && !isDragOver ? 'opacity-75' : ''}
        ${today && !isDragOver ? 'bg-accent-primary/5 border-accent-primary' : ''}
        ${past && !today && !isDragOver ? 'bg-light-neutral-grey/50 dark:bg-dark-deep-blue/30' : ''}
        ${!past && !today && !isDragOver ? 'bg-light-base dark:bg-dark-panel' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={`
            text-xs font-medium
            ${today ? 'text-accent-primary' : 'text-text-secondary dark:text-text-dark-secondary'}
          `}
        >
          {getDayName(dateString)}
        </span>
        <span
          className={`
            text-sm font-semibold
            ${today ? 'bg-accent-primary text-white px-1.5 py-0.5 rounded' : ''}
            ${!today ? 'text-text-primary dark:text-text-dark-primary' : ''}
          `}
        >
          {formatMonthDay(dateString)}
        </span>
      </div>

      <div className="space-y-1">
        {posts.map((post) => (
          <DraggablePostCard key={post.id} post={post} onDragStart={onDragStart} />
        ))}
      </div>

      {/* Drop zone indicator when dragging */}
      {isDragOver && (
        <div className="mt-2 p-2 border-2 border-dashed border-accent-primary rounded-lg text-center">
          <span className="text-xs text-accent-primary font-medium">Drop here</span>
        </div>
      )}
    </div>
  )
}

// ------------------------------------------------------------------
// Week Row Component with Drag-Drop Support
// ------------------------------------------------------------------
interface WeekRowProps {
  week: WeekInfo
  calendarData: Record<string, Post[]>
  onDragStart: (post: Post, sourceDate: string | null) => void
  onDrop: (targetDate: string) => void
  isDragActive: boolean
}

function WeekRow({ week, calendarData, onDragStart, onDrop, isDragActive }: WeekRowProps) {
  return (
    <div className="mb-6">
      {/* Week Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-lg font-heading font-semibold text-text-primary dark:text-text-dark-primary">
            Week {week.weekNumber}
          </span>
          <span className="text-sm text-text-secondary dark:text-text-dark-secondary">
            {week.theme}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-tertiary dark:text-text-dark-tertiary">
            {formatDate(week.startDate)} - {formatDate(week.endDate)}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent-primary/10 text-accent-primary">
            {week.postCount} posts
          </span>
        </div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {week.dates.map((dateString) => (
          <DroppableDayCell
            key={dateString}
            dateString={dateString}
            posts={calendarData[dateString] || []}
            onDragStart={onDragStart}
            onDrop={onDrop}
            isDragActive={isDragActive}
          />
        ))}
      </div>
    </div>
  )
}

// ------------------------------------------------------------------
// Stats Cards Component
// ------------------------------------------------------------------
function StatsCards({ data }: { data: CalendarData }) {
  const stats = [
    {
      label: 'Total Posts',
      value: data.totalPosts,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      color: 'text-accent-primary bg-accent-primary/10',
    },
    {
      label: 'Published',
      value: data.publishedCount,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    },
    {
      label: 'Scheduled',
      value: data.scheduledCount,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30',
    },
    {
      label: 'Drafts',
      value: data.draftCount,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      ),
      color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700/50',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-light-base dark:bg-dark-panel rounded-xl p-4 border border-border-light dark:border-border-dark"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.color}`}>{stat.icon}</div>
            <div>
              <p className="text-2xl font-heading font-bold text-text-primary dark:text-text-dark-primary">
                {stat.value}
              </p>
              <p className="text-sm text-text-secondary dark:text-text-dark-secondary">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ------------------------------------------------------------------
// Legend Component
// ------------------------------------------------------------------
function Legend() {
  const items = [
    { label: 'Published', color: 'bg-green-500' },
    { label: 'Scheduled', color: 'bg-yellow-500' },
    { label: 'Draft', color: 'bg-gray-400' },
  ]

  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary">Legend:</span>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded ${item.color}`} />
          <span className="text-sm text-text-secondary dark:text-text-dark-secondary">{item.label}</span>
        </div>
      ))}
      <div className="ml-auto flex items-center gap-2 text-sm text-text-tertiary dark:text-text-dark-tertiary">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
        </svg>
        <span>Drag posts to reschedule</span>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------
// Toast Notification Component
// ------------------------------------------------------------------
interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
        ${type === 'success'
          ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
          : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
        }
      `}
    >
      {type === 'success' ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

// ------------------------------------------------------------------
// Main PublicationCalendar Component
// ------------------------------------------------------------------
export function PublicationCalendar() {
  const [data, setData] = useState<CalendarData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'week' | 'all'>('all')

  // Drag-and-drop state
  const [draggedPost, setDraggedPost] = useState<Post | null>(null)
  const [dragSourceDate, setDragSourceDate] = useState<string | null>(null)
  const [dropTargetDate, setDropTargetDate] = useState<string | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  // Dialog state
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [isRescheduling, setIsRescheduling] = useState(false)

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Fetch calendar data
  const fetchCalendarData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/calendar')
      const result = await response.json()

      if (result.success) {
        setData(result)
      } else {
        setError(result.error || 'Failed to load calendar data')
      }
    } catch (err) {
      console.error('Failed to fetch calendar data:', err)
      setError('Failed to load calendar data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCalendarData()
  }, [fetchCalendarData])

  // Find which week is current
  useEffect(() => {
    if (data?.weeks) {
      const today = new Date().toISOString().split('T')[0]
      const currentIndex = data.weeks.findIndex(
        (week) => today >= week.startDate && today <= week.endDate
      )
      if (currentIndex !== -1) {
        setCurrentWeekIndex(currentIndex)
      }
    }
  }, [data])

  // Navigation handlers
  const goToPreviousWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(currentWeekIndex - 1)
    }
  }

  const goToNextWeek = () => {
    if (data && currentWeekIndex < data.weeks.length - 1) {
      setCurrentWeekIndex(currentWeekIndex + 1)
    }
  }

  // Visible weeks based on view mode
  const visibleWeeks = useMemo(() => {
    if (!data) return []
    if (viewMode === 'all') return data.weeks
    return [data.weeks[currentWeekIndex]]
  }, [data, viewMode, currentWeekIndex])

  // Drag-and-drop handlers
  const handleDragStart = useCallback((post: Post, sourceDate: string | null) => {
    setDraggedPost(post)
    setDragSourceDate(sourceDate)
    setIsDragActive(true)
  }, [])

  const handleDrop = useCallback((targetDate: string) => {
    if (draggedPost && targetDate !== dragSourceDate) {
      setDropTargetDate(targetDate)
      setShowRescheduleDialog(true)
    }
    setIsDragActive(false)
  }, [draggedPost, dragSourceDate])

  // Handle global drag end (in case drop is cancelled)
  useEffect(() => {
    const handleDragEnd = () => {
      if (!showRescheduleDialog) {
        setDraggedPost(null)
        setDragSourceDate(null)
        setIsDragActive(false)
      }
    }

    document.addEventListener('dragend', handleDragEnd)
    return () => document.removeEventListener('dragend', handleDragEnd)
  }, [showRescheduleDialog])

  // Confirm reschedule
  const confirmReschedule = async () => {
    if (!draggedPost || !dropTargetDate) return

    setIsRescheduling(true)

    try {
      const response = await fetch('/api/admin/calendar', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: draggedPost.id,
          newDate: dropTargetDate,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setToast({ message: `Post rescheduled to ${formatDate(dropTargetDate)}`, type: 'success' })
        // Refresh calendar data
        await fetchCalendarData()
      } else {
        setToast({ message: result.error || 'Failed to reschedule post', type: 'error' })
      }
    } catch (err) {
      console.error('Failed to reschedule post:', err)
      setToast({ message: 'Failed to reschedule post', type: 'error' })
    } finally {
      setIsRescheduling(false)
      setShowRescheduleDialog(false)
      setDraggedPost(null)
      setDragSourceDate(null)
      setDropTargetDate(null)
    }
  }

  // Cancel reschedule
  const cancelReschedule = () => {
    setShowRescheduleDialog(false)
    setDraggedPost(null)
    setDragSourceDate(null)
    setDropTargetDate(null)
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary"></div>
          <p className="text-text-secondary dark:text-text-dark-secondary">Loading calendar...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
        <svg
          className="mx-auto h-12 w-12 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-red-800 dark:text-red-200">{error}</h3>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  // No data state
  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary dark:text-text-dark-secondary">No calendar data available.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Stats Cards */}
      <StatsCards data={data} />

      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-text-primary dark:text-text-dark-primary">
            Publication Schedule
          </h2>
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary mt-1">
            {formatDate(data.startDate)} - {formatDate(data.endDate)} ({data.weeks.length} weeks, {data.totalPosts} posts)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-light-neutral-grey dark:bg-dark-deep-blue rounded-lg p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`
                px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                ${viewMode === 'week'
                  ? 'bg-light-base dark:bg-dark-panel text-text-primary dark:text-text-dark-primary shadow-sm'
                  : 'text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark-primary'
                }
              `}
            >
              Week View
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`
                px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                ${viewMode === 'all'
                  ? 'bg-light-base dark:bg-dark-panel text-text-primary dark:text-text-dark-primary shadow-sm'
                  : 'text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark-primary'
                }
              `}
            >
              All Weeks
            </button>
          </div>

          {/* Week Navigation (only in week view) */}
          {viewMode === 'week' && (
            <div className="flex items-center gap-1">
              <button
                onClick={goToPreviousWeek}
                disabled={currentWeekIndex === 0}
                className={`
                  p-2 rounded-lg transition-colors
                  ${currentWeekIndex === 0
                    ? 'text-text-tertiary dark:text-text-dark-tertiary cursor-not-allowed'
                    : 'text-text-secondary dark:text-text-dark-secondary hover:bg-light-neutral-grey dark:hover:bg-dark-deep-blue hover:text-text-primary dark:hover:text-text-dark-primary'
                  }
                `}
                aria-label="Previous week"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <span className="text-sm font-medium text-text-primary dark:text-text-dark-primary min-w-[80px] text-center">
                Week {currentWeekIndex + 1} of {data.weeks.length}
              </span>
              <button
                onClick={goToNextWeek}
                disabled={currentWeekIndex >= data.weeks.length - 1}
                className={`
                  p-2 rounded-lg transition-colors
                  ${currentWeekIndex >= data.weeks.length - 1
                    ? 'text-text-tertiary dark:text-text-dark-tertiary cursor-not-allowed'
                    : 'text-text-secondary dark:text-text-dark-secondary hover:bg-light-neutral-grey dark:hover:bg-dark-deep-blue hover:text-text-primary dark:hover:text-text-dark-primary'
                  }
                `}
                aria-label="Next week"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <Legend />

      {/* Calendar Grid with Drag-Drop Support */}
      <div className="space-y-2">
        {visibleWeeks.map((week) => (
          <WeekRow
            key={week.weekNumber}
            week={week}
            calendarData={data.calendarData}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            isDragActive={isDragActive}
          />
        ))}
      </div>

      {/* Unscheduled Drafts (also draggable) */}
      {data.unscheduledDrafts.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-heading font-semibold text-text-primary dark:text-text-dark-primary mb-4">
            Unscheduled Drafts ({data.unscheduledDrafts.length})
          </h3>
          <p className="text-sm text-text-tertiary dark:text-text-dark-tertiary mb-4">
            Drag drafts to a date to schedule them
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.unscheduledDrafts.map((post) => (
              <DraggablePostCard key={post.id} post={post} onDragStart={handleDragStart} />
            ))}
          </div>
        </div>
      )}

      {/* Reschedule Confirmation Dialog */}
      <RescheduleDialog
        isOpen={showRescheduleDialog}
        post={draggedPost}
        fromDate={dragSourceDate}
        toDate={dropTargetDate}
        isLoading={isRescheduling}
        onConfirm={confirmReschedule}
        onCancel={cancelReschedule}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default PublicationCalendar
