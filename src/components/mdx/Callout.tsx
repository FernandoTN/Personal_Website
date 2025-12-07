'use client'

import { ReactNode } from 'react'
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type CalloutType = 'info' | 'warning' | 'success' | 'error'

export interface CalloutProps {
  type?: CalloutType
  title?: string
  children: ReactNode
}

const calloutStyles: Record<
  CalloutType,
  {
    container: string
    icon: string
    title: string
    IconComponent: typeof Info
  }
> = {
  info: {
    container:
      'bg-accent-primary/5 border-accent-primary/30 dark:bg-accent-primary/10 dark:border-accent-primary/40',
    icon: 'text-accent-primary',
    title: 'text-accent-primary dark:text-accent-primary',
    IconComponent: Info,
  },
  warning: {
    container:
      'bg-accent-warning/5 border-accent-warning/30 dark:bg-accent-warning/10 dark:border-accent-warning-dark/40',
    icon: 'text-accent-warning dark:text-accent-warning-dark',
    title: 'text-accent-warning dark:text-accent-warning-dark',
    IconComponent: AlertTriangle,
  },
  success: {
    container:
      'bg-accent-success/5 border-accent-success/30 dark:bg-accent-success/10 dark:border-accent-success-dark/40',
    icon: 'text-accent-success dark:text-accent-success-dark',
    title: 'text-accent-success dark:text-accent-success-dark',
    IconComponent: CheckCircle,
  },
  error: {
    container:
      'bg-accent-error/5 border-accent-error/30 dark:bg-accent-error/10 dark:border-accent-error-dark/40',
    icon: 'text-accent-error dark:text-accent-error-dark',
    title: 'text-accent-error dark:text-accent-error-dark',
    IconComponent: XCircle,
  },
}

const defaultTitles: Record<CalloutType, string> = {
  info: 'Note',
  warning: 'Warning',
  success: 'Success',
  error: 'Error',
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const styles = calloutStyles[type]
  const displayTitle = title ?? defaultTitles[type]
  const IconComponent = styles.IconComponent

  return (
    <div
      className={cn(
        'my-6 rounded-lg border-l-4 p-4',
        styles.container
      )}
      role="note"
      aria-label={`${type} callout: ${displayTitle}`}
    >
      <div className="flex items-start gap-3">
        <div className={cn('flex-shrink-0 mt-0.5', styles.icon)}>
          <IconComponent className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn('font-semibold mb-1', styles.title)}>
            {displayTitle}
          </p>
          <div className="text-text-secondary dark:text-text-dark-secondary text-sm [&>p]:mb-2 [&>p:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Callout
