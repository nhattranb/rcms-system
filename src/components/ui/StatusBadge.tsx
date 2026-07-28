import React from 'react'
import { JobStatus } from '../../types'

interface StatusBadgeProps {
  status: JobStatus | string
  size?: 'sm' | 'md'
}

const STATUS_STYLES: Record<string, string> = {
  Draft: 'bg-slate-100 text-slate-700 border-slate-200',
  'Pending Approval': 'bg-amber-50 text-amber-700 border-amber-200',
  Published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Paused: 'bg-orange-50 text-orange-700 border-orange-200',
  Expired: 'bg-rose-50 text-rose-700 border-rose-200',
  Closed: 'bg-slate-200 text-slate-800 border-slate-300',
  Filled: 'bg-blue-50 text-blue-700 border-blue-200',
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Inactive: 'bg-slate-100 text-slate-600 border-slate-200',
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const styleClass =
    STATUS_STYLES[status] || 'bg-slate-100 text-slate-700 border-slate-200'
  const paddingClass =
    size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${paddingClass} ${styleClass}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === 'Published' || status === 'Active'
            ? 'bg-emerald-500'
            : status === 'Pending Approval'
              ? 'bg-amber-500 font-bold animate-pulse'
              : status === 'Expired'
                ? 'bg-rose-500'
                : 'bg-slate-400'
        }`}
      />
      {status}
    </span>
  )
}
