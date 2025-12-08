'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
type TimePeriod = '7' | '14' | '30' | '90'

interface DailyData {
  date: string
  displayDate: string
  pageViews: number
  uniqueVisitors: number
  avgSessionDuration: number
  bounceRate: number
}

interface TopPage {
  path: string
  title: string
  views: number
  uniqueViews: number
}

interface TrafficSource {
  source: string
  visitors: number
  percentage: number
}

interface AnalyticsResponse {
  period: {
    days: number
    startDate: string
    endDate: string
    displayRange: string
  }
  overview: {
    totalPageViews: number
    totalUniqueVisitors: number
    avgBounceRate: number
    avgSessionDuration: number
    pageViewsChange: number
    visitorsChange: number
  }
  dailyData: DailyData[]
  topPages: TopPage[]
  trafficSources: TrafficSource[]
  dataSource: 'production' | 'no_data'
}

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  loading?: boolean
}

// ------------------------------------------------------------------
// Icons
// ------------------------------------------------------------------
const Icons = {
  Eye: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  ),
  ChartBar: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  Refresh: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  ),
  NoData: () => (
    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  ),
}

// ------------------------------------------------------------------
// MetricCard Component
// ------------------------------------------------------------------
function MetricCard({ title, value, change, icon, loading }: MetricCardProps) {
  return (
    <div className="bg-light-base dark:bg-dark-panel rounded-xl p-6 border border-border-light dark:border-border-dark">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wide">
            {title}
          </p>
          {loading ? (
            <div className="mt-2 h-9 w-20 bg-light-neutral-grey dark:bg-dark-deep-blue animate-pulse rounded" />
          ) : (
            <p className="mt-2 text-3xl font-bold text-text-primary dark:text-text-dark-primary">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          )}
          {change !== undefined && !loading && (
            <p className={`mt-2 text-sm font-medium ${change >= 0 ? 'text-accent-success' : 'text-accent-error'}`}>
              {change >= 0 ? '+' : ''}{change}% vs previous period
            </p>
          )}
        </div>
        <div className="p-3 rounded-lg bg-accent-primary/10 text-accent-primary">
          {icon}
        </div>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------
// TimePeriodSelector Component
// ------------------------------------------------------------------
function TimePeriodSelector({
  selected,
  onChange,
  disabled,
}: {
  selected: TimePeriod
  onChange: (period: TimePeriod) => void
  disabled?: boolean
}) {
  const periods: { value: TimePeriod; label: string }[] = [
    { value: '7', label: '7 Days' },
    { value: '14', label: '14 Days' },
    { value: '30', label: '30 Days' },
    { value: '90', label: '90 Days' },
  ]

  return (
    <div className="flex gap-2" data-testid="time-period-selector">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          disabled={disabled}
          data-testid={`period-${period.value}`}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150
            ${selected === period.value
              ? 'bg-accent-primary text-white'
              : 'bg-light-neutral-grey dark:bg-dark-deep-blue text-text-secondary dark:text-text-dark-secondary hover:bg-light-icy-blue dark:hover:bg-dark-panel'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {period.label}
        </button>
      ))}
    </div>
  )
}

// ------------------------------------------------------------------
// Custom Tooltip for Charts
// ------------------------------------------------------------------
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="bg-light-base dark:bg-dark-panel border border-border-light dark:border-border-dark rounded-lg p-3 shadow-lg">
      <p className="text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
        {label}
      </p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

// ------------------------------------------------------------------
// TopPages Component
// ------------------------------------------------------------------
function TopPages({ pages, loading }: { pages: TopPage[]; loading: boolean }) {
  const maxViews = pages.length > 0 ? Math.max(...pages.map(p => p.views)) : 0

  return (
    <div className="bg-light-base dark:bg-dark-panel rounded-xl p-6 border border-border-light dark:border-border-dark" data-testid="top-pages">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold text-text-primary dark:text-text-dark-primary">
          Top Pages
        </h3>
        <span className="text-xs px-2 py-1 rounded-full bg-accent-primary/10 text-accent-primary">
          By Views
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex justify-between mb-1">
                <div className="h-4 w-3/4 bg-light-neutral-grey dark:bg-dark-deep-blue rounded" />
                <div className="h-4 w-12 bg-light-neutral-grey dark:bg-dark-deep-blue rounded" />
              </div>
              <div className="h-2 bg-light-neutral-grey dark:bg-dark-deep-blue rounded-full" />
            </div>
          ))}
        </div>
      ) : pages.length === 0 ? (
        <div className="text-center py-8">
          <Icons.NoData />
          <p className="mt-4 text-text-muted dark:text-text-dark-muted">
            No page view data yet
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {pages.map((page, index) => (
            <div key={page.path} data-testid={`top-page-${index}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-xs font-medium text-text-secondary dark:text-text-dark-secondary w-5">
                    #{index + 1}
                  </span>
                  <span className="text-sm text-text-primary dark:text-text-dark-primary truncate">
                    {page.title}
                  </span>
                </div>
                <span className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary ml-2">
                  {page.views.toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-light-neutral-grey dark:bg-dark-deep-blue rounded-full overflow-hidden ml-7">
                <div
                  className="h-full rounded-full bg-accent-primary transition-all duration-500"
                  style={{ width: maxViews > 0 ? `${(page.views / maxViews) * 100}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ------------------------------------------------------------------
// TrafficSources Component
// ------------------------------------------------------------------
function TrafficSources({ sources, loading }: { sources: TrafficSource[]; loading: boolean }) {
  const sourceColors: Record<string, string> = {
    'Direct': 'bg-accent-primary',
    'Organic Search': 'bg-accent-success',
    'LinkedIn': 'bg-category-ai-agents',
    'Twitter/X': 'bg-accent-secondary',
    'Social': 'bg-accent-secondary',
    'Referral': 'bg-accent-warning',
    'Email': 'bg-category-research',
  }

  return (
    <div className="bg-light-base dark:bg-dark-panel rounded-xl p-6 border border-border-light dark:border-border-dark">
      <h3 className="font-heading text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-4">
        Traffic Sources
      </h3>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-3 h-3 rounded-full bg-light-neutral-grey dark:bg-dark-deep-blue" />
              <div className="flex-1 h-4 bg-light-neutral-grey dark:bg-dark-deep-blue rounded" />
              <div className="w-10 h-4 bg-light-neutral-grey dark:bg-dark-deep-blue rounded" />
            </div>
          ))}
        </div>
      ) : sources.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-text-muted dark:text-text-dark-muted">
            No traffic source data yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sources.map((source) => (
            <div key={source.source} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${sourceColors[source.source] || 'bg-gray-400'}`} />
              <span className="flex-1 text-sm text-text-primary dark:text-text-dark-primary">
                {source.source}
              </span>
              <span className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary">
                {source.percentage}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ------------------------------------------------------------------
// No Data State Component
// ------------------------------------------------------------------
function NoDataState() {
  return (
    <div className="bg-light-icy-blue dark:bg-dark-deep-blue rounded-xl p-8 border border-border-light dark:border-border-dark text-center">
      <div className="flex justify-center text-text-muted dark:text-text-dark-muted mb-4">
        <Icons.NoData />
      </div>
      <h3 className="text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-2">
        No Analytics Data Yet
      </h3>
      <p className="text-text-secondary dark:text-text-dark-secondary max-w-md mx-auto">
        Your site is now tracking page views. Data will appear here as visitors browse your website.
        Check back later to see your traffic statistics.
      </p>
    </div>
  )
}

// ------------------------------------------------------------------
// Analytics Page
// ------------------------------------------------------------------
export default function AdminAnalyticsPage() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('7')
  const [data, setData] = useState<AnalyticsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { status } = useSession()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  // Fetch analytics data
  const fetchAnalytics = useCallback(async (days: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/analytics?days=${days}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch analytics')
      }

      setData(result)
    } catch (err) {
      console.error('Analytics fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch data when period changes or on mount
  useEffect(() => {
    if (status === 'authenticated') {
      fetchAnalytics(timePeriod)
    }
  }, [timePeriod, status, fetchAnalytics])

  // Handle period change
  const handlePeriodChange = (period: TimePeriod) => {
    setTimePeriod(period)
  }

  // Format session duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.round(seconds % 60)
    return `${mins}m ${secs}s`
  }

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary" />
      </div>
    )
  }

  // Don't render if not authenticated
  if (status === 'unauthenticated') {
    return null
  }

  const overview = data?.overview
  const chartData = data?.dailyData?.map(d => ({
    date: d.displayDate,
    pageViews: d.pageViews,
    uniqueVisitors: d.uniqueVisitors,
  })) || []

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-text-primary dark:text-text-dark-primary">
            Analytics
          </h1>
          <p className="mt-1 text-text-secondary dark:text-text-dark-secondary" data-testid="date-range">
            {data?.period?.displayRange ? `Traffic overview for ${data.period.displayRange}` : 'Loading...'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <TimePeriodSelector
            selected={timePeriod}
            onChange={handlePeriodChange}
            disabled={loading}
          />
          <button
            onClick={() => fetchAnalytics(timePeriod)}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 bg-light-neutral-grey dark:bg-dark-deep-blue text-text-primary dark:text-text-dark-primary hover:bg-light-icy-blue dark:hover:bg-dark-panel border border-border-light dark:border-border-dark disabled:opacity-50"
          >
            <Icons.Refresh />
            Refresh
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-red-700 dark:text-red-300">{error}</p>
          <button
            onClick={() => fetchAnalytics(timePeriod)}
            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* No Data State */}
      {!loading && data?.dataSource === 'no_data' && <NoDataState />}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="metrics-grid">
        <MetricCard
          title="Page Views"
          value={overview?.totalPageViews ?? 0}
          change={overview?.pageViewsChange}
          icon={<Icons.Eye />}
          loading={loading}
        />
        <MetricCard
          title="Unique Visitors"
          value={overview?.totalUniqueVisitors ?? 0}
          change={overview?.visitorsChange}
          icon={<Icons.Users />}
          loading={loading}
        />
        <MetricCard
          title="Bounce Rate"
          value={`${overview?.avgBounceRate ?? 0}%`}
          icon={<Icons.ChartBar />}
          loading={loading}
        />
        <MetricCard
          title="Avg. Session"
          value={formatDuration(overview?.avgSessionDuration ?? 0)}
          icon={<Icons.Clock />}
          loading={loading}
        />
      </div>

      {/* Page Views Chart */}
      <div className="bg-light-base dark:bg-dark-panel rounded-xl p-6 border border-border-light dark:border-border-dark" data-testid="page-views-chart">
        <h3 className="font-heading text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-6">
          Page Views Over Time
        </h3>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-text-muted dark:text-text-dark-muted">
            No data for this period
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="pageViewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#233044" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  stroke="#8A96AA"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#8A96AA"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="pageViews"
                  name="Page Views"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#pageViewsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Visitors Chart */}
      <div className="bg-light-base dark:bg-dark-panel rounded-xl p-6 border border-border-light dark:border-border-dark" data-testid="visitors-chart">
        <h3 className="font-heading text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-6">
          Unique Visitors
        </h3>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-text-muted dark:text-text-dark-muted">
            No data for this period
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#233044" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  stroke="#8A96AA"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#8A96AA"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="uniqueVisitors"
                  name="Unique Visitors"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopPages pages={data?.topPages || []} loading={loading} />
        <TrafficSources sources={data?.trafficSources || []} loading={loading} />
      </div>

      {/* Data Source Info */}
      {data?.dataSource === 'production' && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-300">
            <span className="font-medium">Live Data:</span> Analytics are being tracked from your production website.
          </p>
        </div>
      )}
    </div>
  )
}
