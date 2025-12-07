'use client'

/**
 * Admin Publication Calendar Page
 *
 * Features:
 * - Visual 10-week publication calendar (Dec 8, 2025 - Feb 13, 2026)
 * - Color-coded posts by status (published=green, scheduled=yellow, draft=gray)
 * - Week-by-week view with theme labels
 * - Navigation between weeks
 * - Stats overview (total, published, scheduled, draft counts)
 *
 * Usage:
 * Navigate to /admin/calendar to view the publication schedule
 */

import { PublicationCalendar } from '@/components/admin/PublicationCalendar'

export default function AdminCalendarPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-text-primary dark:text-text-dark-primary">
          Publication Calendar
        </h1>
        <p className="mt-2 text-text-secondary dark:text-text-dark-secondary">
          View and manage your 10-week AI Agents Research publication schedule.
        </p>
      </div>

      {/* Calendar Component */}
      <PublicationCalendar />
    </div>
  )
}
