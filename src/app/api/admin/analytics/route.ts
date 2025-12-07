import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { subDays, format, eachDayOfInterval, startOfDay } from 'date-fns'

// Generate mock analytics data for the given time period
function generateMockAnalyticsData(days: number) {
  const endDate = new Date()
  const startDate = subDays(endDate, days - 1)

  const dateRange = eachDayOfInterval({ start: startDate, end: endDate })

  // Generate daily data with realistic patterns
  const dailyData = dateRange.map((date, index) => {
    // Add some variance - weekends have lower traffic
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const basePageViews = isWeekend ? 80 : 150
    const baseVisitors = isWeekend ? 45 : 95

    // Add random variance and slight upward trend
    const trendMultiplier = 1 + (index / dateRange.length) * 0.2
    const randomVariance = 0.7 + Math.random() * 0.6

    const pageViews = Math.round(basePageViews * trendMultiplier * randomVariance)
    const uniqueVisitors = Math.round(baseVisitors * trendMultiplier * randomVariance)
    const avgSessionDuration = Math.round((120 + Math.random() * 180) * 10) / 10
    const bounceRate = Math.round((35 + Math.random() * 25) * 10) / 10

    return {
      date: format(date, 'yyyy-MM-dd'),
      displayDate: format(date, 'MMM d'),
      pageViews,
      uniqueVisitors,
      avgSessionDuration,
      bounceRate,
    }
  })

  // Calculate totals
  const totalPageViews = dailyData.reduce((sum, d) => sum + d.pageViews, 0)
  const totalUniqueVisitors = dailyData.reduce((sum, d) => sum + d.uniqueVisitors, 0)
  const avgBounceRate = Math.round(dailyData.reduce((sum, d) => sum + d.bounceRate, 0) / dailyData.length * 10) / 10
  const avgSessionDuration = Math.round(dailyData.reduce((sum, d) => sum + d.avgSessionDuration, 0) / dailyData.length * 10) / 10

  // Generate top pages data
  const topPages = [
    { path: '/', title: 'Homepage', views: Math.round(totalPageViews * 0.25), uniqueViews: Math.round(totalUniqueVisitors * 0.28) },
    { path: '/research', title: 'AI Agents Research', views: Math.round(totalPageViews * 0.18), uniqueViews: Math.round(totalUniqueVisitors * 0.20) },
    { path: '/blog', title: 'Blog', views: Math.round(totalPageViews * 0.15), uniqueViews: Math.round(totalUniqueVisitors * 0.16) },
    { path: '/blog/eight-pillars-framework', title: 'Eight Pillars Framework', views: Math.round(totalPageViews * 0.12), uniqueViews: Math.round(totalUniqueVisitors * 0.13) },
    { path: '/about', title: 'About', views: Math.round(totalPageViews * 0.10), uniqueViews: Math.round(totalUniqueVisitors * 0.11) },
    { path: '/projects', title: 'Projects', views: Math.round(totalPageViews * 0.08), uniqueViews: Math.round(totalUniqueVisitors * 0.09) },
    { path: '/blog/system-integration', title: 'System Integration Deep Dive', views: Math.round(totalPageViews * 0.06), uniqueViews: Math.round(totalUniqueVisitors * 0.07) },
    { path: '/contact', title: 'Contact', views: Math.round(totalPageViews * 0.04), uniqueViews: Math.round(totalUniqueVisitors * 0.05) },
  ]

  // Generate traffic sources
  const trafficSources = [
    { source: 'Organic Search', visitors: Math.round(totalUniqueVisitors * 0.35), percentage: 35 },
    { source: 'Direct', visitors: Math.round(totalUniqueVisitors * 0.28), percentage: 28 },
    { source: 'LinkedIn', visitors: Math.round(totalUniqueVisitors * 0.20), percentage: 20 },
    { source: 'Twitter/X', visitors: Math.round(totalUniqueVisitors * 0.10), percentage: 10 },
    { source: 'Referral', visitors: Math.round(totalUniqueVisitors * 0.07), percentage: 7 },
  ]

  // Calculate comparison with previous period
  const previousTotalViews = Math.round(totalPageViews * (0.8 + Math.random() * 0.3))
  const previousTotalVisitors = Math.round(totalUniqueVisitors * (0.8 + Math.random() * 0.3))

  const pageViewsChange = Math.round(((totalPageViews - previousTotalViews) / previousTotalViews) * 100 * 10) / 10
  const visitorsChange = Math.round(((totalUniqueVisitors - previousTotalVisitors) / previousTotalVisitors) * 100 * 10) / 10

  return {
    period: {
      days,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      displayRange: `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`,
    },
    overview: {
      totalPageViews,
      totalUniqueVisitors,
      avgBounceRate,
      avgSessionDuration,
      pageViewsChange,
      visitorsChange,
    },
    dailyData,
    topPages,
    trafficSources,
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get time period from query params (default to 7 days)
    const searchParams = request.nextUrl.searchParams
    const daysParam = searchParams.get('days')
    const days = daysParam ? parseInt(daysParam, 10) : 7

    // Validate days parameter
    const validDays = [7, 14, 30, 90]
    const normalizedDays = validDays.includes(days) ? days : 7

    // Generate mock data
    const analyticsData = generateMockAnalyticsData(normalizedDays)

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
