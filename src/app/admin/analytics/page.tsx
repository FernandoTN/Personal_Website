'use client'

import { useState, useEffect } from 'react'
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
type TimePeriod = '7' | '30' | '90'

interface AnalyticsData {
  date: string
  pageViews: number
  uniqueVisitors: number
}

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
}

// ------------------------------------------------------------------
// Generate Mock Data
// ------------------------------------------------------------------
function generateMockData(days: number): AnalyticsData[] {
  const data: AnalyticsData[] = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Generate realistic-looking data with some variance
    const baseViews = 150 + Math.floor(Math.random() * 100)
    const weekendFactor = [0, 6].includes(date.getDay()) ? 0.6 : 1
    const pageViews = Math.floor(baseViews * weekendFactor + Math.random() * 50)
    const uniqueVisitors = Math.floor(pageViews * (0.65 + Math.random() * 0.15))

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      pageViews,
      uniqueVisitors,
    })
  }

  return data
}

function calculateTotals(data: AnalyticsData[]) {
  const totalViews = data.reduce((sum, d) => sum + d.pageViews, 0)
  const totalVisitors = data.reduce((sum, d) => sum + d.uniqueVisitors, 0)
  const avgViewsPerDay = Math.round(totalViews / data.length)
  const bounceRate = Math.round(35 + Math.random() * 15) // Mock bounce rate
  const avgSessionDuration = `${Math.floor(2 + Math.random() * 2)}m ${Math.floor(Math.random() * 60)}s`

  return {
    totalViews,
    totalVisitors,
    avgViewsPerDay,
    bounceRate,
    avgSessionDuration,
  }
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
  ArrowTrendingUp: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
    </svg>
  ),
}

// ------------------------------------------------------------------
// MetricCard Component
// ------------------------------------------------------------------
function MetricCard({ title, value, change, icon }: MetricCardProps) {
  return (
    <div className="bg-light-base dark:bg-dark-panel rounded-xl p-6 border border-border-light dark:border-border-dark">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wide">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-text-primary dark:text-text-dark-primary">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change !== undefined && (
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
  onChange
}: {
  selected: TimePeriod
  onChange: (period: TimePeriod) => void
}) {
  const periods: { value: TimePeriod; label: string }[] = [
    { value: '7', label: '7 Days' },
    { value: '30', label: '30 Days' },
    { value: '90', label: '90 Days' },
  ]

  return (
    <div className="flex gap-2" data-testid="time-period-selector">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          data-testid={`period-${period.value}`}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150
            ${selected === period.value
              ? 'bg-accent-primary text-white'
              : 'bg-light-neutral-grey dark:bg-dark-deep-blue text-text-secondary dark:text-text-dark-secondary hover:bg-light-icy-blue dark:hover:bg-dark-panel'
            }
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
  label
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
// Top Pages Component (Mock) - includes blog posts and AI Agents series
// ------------------------------------------------------------------
interface TopPageData {
  path: string
  views: number
  title: string
  type: 'page' | 'blog' | 'series'
  series?: string
}

function TopPages() {
  const [selectedPage, setSelectedPage] = useState<TopPageData | null>(null)

  // Mock data including static pages, blog posts, and AI Agents series
  const pages: TopPageData[] = [
    { path: '/', views: 1245, title: 'Home', type: 'page' },
    { path: '/blog/ai-agents-research-overview', views: 1156, title: 'AI Agents Research Overview', type: 'blog', series: 'AI Agents' },
    { path: '/blog', views: 892, title: 'Blog', type: 'page' },
    { path: '/blog/system-integration-92-percent', views: 743, title: 'The 92% Problem: System Integration', type: 'blog', series: 'AI Agents' },
    { path: '/blog/demo-production-chasm', views: 698, title: 'The Demo-Production Chasm', type: 'blog', series: 'AI Agents' },
    { path: '/projects', views: 654, title: 'Projects', type: 'page' },
    { path: '/blog/coding-agent-exception', views: 621, title: 'The Coding Agent Exception', type: 'blog', series: 'AI Agents' },
    { path: '/blog/40-percent-context-rule', views: 589, title: 'The 40% Context Rule', type: 'blog', series: 'AI Agents' },
    { path: '/blog/why-95-fail', views: 534, title: 'Why 95% of Agentic AI Projects Fail', type: 'blog', series: 'AI Agents' },
    { path: '/about', views: 432, title: 'About', type: 'page' },
    { path: '/blog/mcp-tool-cliff', views: 387, title: 'MCP Reality Check: 25-Tool Cliff', type: 'blog', series: 'AI Agents' },
    { path: '/research', views: 287, title: 'Research', type: 'page' },
  ]

  // Calculate AI Agents series total views
  const aiAgentsPosts = pages.filter(p => p.series === 'AI Agents')
  const aiAgentsTotalViews = aiAgentsPosts.reduce((sum, p) => sum + p.views, 0)

  const maxViews = Math.max(...pages.map(p => p.views))

  // Get type badge color
  const getTypeBadgeClass = (type: TopPageData['type']) => {
    switch (type) {
      case 'blog':
        return 'bg-category-ai-agents/20 text-category-ai-agents'
      case 'series':
        return 'bg-accent-secondary/20 text-accent-secondary'
      default:
        return 'bg-light-neutral-grey dark:bg-dark-deep-blue text-text-secondary dark:text-text-dark-secondary'
    }
  }

  return (
    <div className="bg-light-base dark:bg-dark-panel rounded-xl p-6 border border-border-light dark:border-border-dark" data-testid="top-pages">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold text-text-primary dark:text-text-dark-primary">
          Top Performing Content
        </h3>
        <span className="text-xs px-2 py-1 rounded-full bg-accent-primary/10 text-accent-primary">
          By Views
        </span>
      </div>

      {/* AI Agents Series Summary */}
      <div className="mb-4 p-3 rounded-lg bg-category-ai-agents/10 border border-category-ai-agents/20" data-testid="ai-agents-series">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icons.ArrowTrendingUp />
            <span className="text-sm font-medium text-text-primary dark:text-text-dark-primary">
              AI Agents Series
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-category-ai-agents/20 text-category-ai-agents">
              {aiAgentsPosts.length} posts
            </span>
          </div>
          <span className="text-sm font-bold text-category-ai-agents">
            {aiAgentsTotalViews.toLocaleString()} total views
          </span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {pages.map((page, index) => (
          <button
            key={page.path}
            onClick={() => setSelectedPage(selectedPage?.path === page.path ? null : page)}
            className="w-full text-left group"
            data-testid={`top-page-${index}`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xs font-medium text-text-secondary dark:text-text-dark-secondary w-5">
                  #{index + 1}
                </span>
                <span className="text-sm text-text-primary dark:text-text-dark-primary truncate group-hover:text-accent-primary transition-colors">
                  {page.title}
                </span>
                {page.type !== 'page' && (
                  <span className={`text-xs px-1.5 py-0.5 rounded ${getTypeBadgeClass(page.type)}`}>
                    {page.series || page.type}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary ml-2">
                {page.views.toLocaleString()}
              </span>
            </div>
            <div className="h-2 bg-light-neutral-grey dark:bg-dark-deep-blue rounded-full overflow-hidden ml-7">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  page.series === 'AI Agents'
                    ? 'bg-category-ai-agents'
                    : 'bg-accent-primary'
                }`}
                style={{ width: `${(page.views / maxViews) * 100}%` }}
              />
            </div>

            {/* Expanded details when clicked */}
            {selectedPage?.path === page.path && (
              <div className="mt-3 ml-7 p-3 rounded-lg bg-light-icy-blue dark:bg-dark-deep-blue border border-border-light dark:border-border-dark" data-testid="page-details">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-text-secondary dark:text-text-dark-secondary">Page Path</p>
                    <p className="font-medium text-text-primary dark:text-text-dark-primary">{page.path}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary dark:text-text-dark-secondary">Type</p>
                    <p className="font-medium text-text-primary dark:text-text-dark-primary capitalize">{page.type}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary dark:text-text-dark-secondary">Avg. Time on Page</p>
                    <p className="font-medium text-text-primary dark:text-text-dark-primary">
                      {page.type === 'blog' ? '4m 32s' : '1m 15s'}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-secondary dark:text-text-dark-secondary">Bounce Rate</p>
                    <p className="font-medium text-text-primary dark:text-text-dark-primary">
                      {page.type === 'blog' ? '28%' : '45%'}
                    </p>
                  </div>
                </div>
                <a
                  href={page.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm text-accent-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Page
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ------------------------------------------------------------------
// Traffic Sources Component (Mock)
// ------------------------------------------------------------------
function TrafficSources() {
  const sources = [
    { name: 'Direct', percentage: 35, color: 'bg-accent-primary' },
    { name: 'Organic Search', percentage: 28, color: 'bg-accent-success' },
    { name: 'Social Media', percentage: 22, color: 'bg-accent-secondary' },
    { name: 'Referral', percentage: 10, color: 'bg-accent-warning' },
    { name: 'Email', percentage: 5, color: 'bg-category-research' },
  ]

  return (
    <div className="bg-light-base dark:bg-dark-panel rounded-xl p-6 border border-border-light dark:border-border-dark">
      <h3 className="font-heading text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-4">
        Traffic Sources
      </h3>
      <div className="space-y-3">
        {sources.map((source) => (
          <div key={source.name} className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${source.color}`} />
            <span className="flex-1 text-sm text-text-primary dark:text-text-dark-primary">
              {source.name}
            </span>
            <span className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary">
              {source.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ------------------------------------------------------------------
// Analytics Page
// ------------------------------------------------------------------
export default function AdminAnalyticsPage() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('7')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([])
  const [totals, setTotals] = useState({
    totalViews: 0,
    totalVisitors: 0,
    avgViewsPerDay: 0,
    bounceRate: 0,
    avgSessionDuration: '0m 0s',
  })
  const { status } = useSession()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  // Generate data when time period changes
  useEffect(() => {
    const days = parseInt(timePeriod)
    const data = generateMockData(days)
    setAnalyticsData(data)
    setTotals(calculateTotals(data))
  }, [timePeriod])

  // Calculate date range for display
  const getDateRange = () => {
    const days = parseInt(timePeriod)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days + 1)

    const formatDate = (date: Date) => date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })

    return `${formatDate(startDate)} - ${formatDate(endDate)}`
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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-text-primary dark:text-text-dark-primary">
            Analytics
          </h1>
          <p className="mt-1 text-text-secondary dark:text-text-dark-secondary" data-testid="date-range">
            Traffic overview for {getDateRange()}
          </p>
        </div>
        <TimePeriodSelector selected={timePeriod} onChange={setTimePeriod} />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="metrics-grid">
        <MetricCard
          title="Page Views"
          value={totals.totalViews}
          change={Math.floor(Math.random() * 20) - 5}
          icon={<Icons.Eye />}
        />
        <MetricCard
          title="Unique Visitors"
          value={totals.totalVisitors}
          change={Math.floor(Math.random() * 20) - 5}
          icon={<Icons.Users />}
        />
        <MetricCard
          title="Avg. Views/Day"
          value={totals.avgViewsPerDay}
          icon={<Icons.ChartBar />}
        />
        <MetricCard
          title="Avg. Session"
          value={totals.avgSessionDuration}
          icon={<Icons.Clock />}
        />
      </div>

      {/* Page Views Chart */}
      <div className="bg-light-base dark:bg-dark-panel rounded-xl p-6 border border-border-light dark:border-border-dark" data-testid="page-views-chart">
        <h3 className="font-heading text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-6">
          Page Views Over Time
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData}>
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
      </div>

      {/* Visitors Chart */}
      <div className="bg-light-base dark:bg-dark-panel rounded-xl p-6 border border-border-light dark:border-border-dark" data-testid="visitors-chart">
        <h3 className="font-heading text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-6">
          Unique Visitors
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData}>
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
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopPages />
        <TrafficSources />
      </div>

      {/* Note about mock data */}
      <div className="bg-light-icy-blue dark:bg-dark-deep-blue rounded-xl p-4 border border-border-light dark:border-border-dark">
        <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
          <span className="font-medium">Note:</span> This dashboard displays mock data for demonstration purposes.
          Connect to a real analytics provider (Google Analytics, Plausible, etc.) to view actual traffic data.
        </p>
      </div>
    </div>
  )
}
