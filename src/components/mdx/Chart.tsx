'use client'

import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export type ChartType = 'bar' | 'line' | 'pie'

export interface ChartDataPoint {
  name: string
  value: number
  [key: string]: string | number
}

export interface ChartProps {
  type: ChartType
  data: ChartDataPoint[]
  title?: string
  xAxisKey?: string
  yAxisKey?: string
  colors?: string[]
  height?: number
}

/**
 * Default color palette for charts
 */
const DEFAULT_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
]

/**
 * Custom tooltip component
 */
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-light-panel dark:bg-dark-panel border border-border-light dark:border-border-dark rounded-lg px-3 py-2 shadow-lg">
      {label && (
        <p className="text-sm font-medium text-text-primary dark:text-text-dark-primary mb-1">
          {label}
        </p>
      )}
      {payload.map((entry, index) => (
        <p key={index} className="text-sm text-text-secondary dark:text-text-dark-secondary">
          <span style={{ color: entry.color }}>{entry.name}: </span>
          <span className="font-medium">{entry.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  )
}

/**
 * Chart Component for MDX
 *
 * Renders interactive charts using Recharts library.
 *
 * Features:
 * - Three chart types: bar, line, pie
 * - Responsive sizing
 * - Custom color palette
 * - Tooltips on hover
 * - Legend support
 * - Dark mode compatible styling
 *
 * Usage in MDX:
 * ```mdx
 * <Chart
 *   type="bar"
 *   title="Monthly Sales"
 *   data={[
 *     { name: 'Jan', value: 400 },
 *     { name: 'Feb', value: 300 },
 *     { name: 'Mar', value: 600 },
 *   ]}
 * />
 * ```
 */
export function Chart({
  type,
  data,
  title,
  xAxisKey = 'name',
  yAxisKey = 'value',
  colors = DEFAULT_COLORS,
  height = 300,
}: ChartProps) {
  const chartColors = useMemo(() => {
    return data.map((_, index) => colors[index % colors.length])
  }, [data, colors])

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis
              dataKey={xAxisKey}
              tick={{ fill: 'currentColor', opacity: 0.6, fontSize: 12 }}
              axisLine={{ stroke: 'currentColor', opacity: 0.2 }}
              tickLine={{ stroke: 'currentColor', opacity: 0.2 }}
            />
            <YAxis
              tick={{ fill: 'currentColor', opacity: 0.6, fontSize: 12 }}
              axisLine={{ stroke: 'currentColor', opacity: 0.2 }}
              tickLine={{ stroke: 'currentColor', opacity: 0.2 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey={yAxisKey} radius={[4, 4, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index]} />
              ))}
            </Bar>
          </BarChart>
        )

      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis
              dataKey={xAxisKey}
              tick={{ fill: 'currentColor', opacity: 0.6, fontSize: 12 }}
              axisLine={{ stroke: 'currentColor', opacity: 0.2 }}
              tickLine={{ stroke: 'currentColor', opacity: 0.2 }}
            />
            <YAxis
              tick={{ fill: 'currentColor', opacity: 0.6, fontSize: 12 }}
              axisLine={{ stroke: 'currentColor', opacity: 0.2 }}
              tickLine={{ stroke: 'currentColor', opacity: 0.2 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey={yAxisKey}
              stroke={colors[0]}
              strokeWidth={2}
              dot={{ fill: colors[0], strokeWidth: 2 }}
              activeDot={{ r: 6, fill: colors[0] }}
            />
          </LineChart>
        )

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={100}
              fill="#8884d8"
              dataKey={yAxisKey}
              nameKey={xAxisKey}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        )

      default:
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={yAxisKey} />
          </BarChart>
        )
    }
  }

  const chartElement = renderChart()

  return (
    <div className="my-6 p-4 rounded-lg border border-border-light dark:border-border-dark bg-light-panel dark:bg-dark-panel">
      {title && (
        <h4 className="text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-4 text-center">
          {title}
        </h4>
      )}
      <div className="text-text-primary dark:text-text-dark-primary" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartElement}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Chart
