import React from 'react'
import { History, X } from 'lucide-react'
import { JobPosting } from '../../types'

interface JobTimelineDrawerProps {
  job: JobPosting | null
  onClose: () => void
}

export const JobTimelineDrawer: React.FC<JobTimelineDrawerProps> = ({
  job,
  onClose,
}) => {
  if (!job) return null

  // Synthesize events if timelineEvents is missing
  const timelineEvents = job.timelineEvents && job.timelineEvents.length > 0
    ? job.timelineEvents
    : [
        {
          id: 'ev-1',
          jobId: job.id,
          date: `${job.createdDate} 09:00`,
          action: 'Created',
          actor: job.recruiterName,
          note: 'Khởi tạo vị trí tuyển dụng mới',
        },
        {
          id: 'ev-2',
          jobId: job.id,
          date: `${job.updatedDate} 14:30`,
          action: job.status,
          actor: 'HR System',
          note: `Trạng thái hiện tại: ${job.status}`,
        },
      ]

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Created':
        return 'bg-slate-500 text-slate-100'
      case 'Approved':
      case 'Published':
        return 'bg-emerald-500 text-emerald-100'
      case 'Submitted Approval':
      case 'Pending Approval':
        return 'bg-amber-500 text-amber-100'
      case 'Closed':
        return 'bg-rose-500 text-rose-100'
      default:
        return 'bg-cyan-500 text-cyan-100'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
              <History size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Timeline Diễn biến Đăng tuyển (FR10)
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-[280px]">
                {job.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-xl"
          >
            <X size={20} />
          </button>
        </div>

        {/* Timeline Events List */}
        <div className="relative pl-6 space-y-6 text-xs border-l-2 border-slate-100 ml-3 py-2">
          {timelineEvents.map((ev) => (
            <div key={ev.id} className="relative group">
              {/* Dot Icon */}
              <span
                className={`absolute -left-[31px] top-0 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold shadow-sm ${getActionColor(
                  ev.action
                )}`}
              >
                ✓
              </span>

              <div className="bg-slate-50/90 rounded-2xl p-3.5 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">
                    {ev.action}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {ev.date}
                  </span>
                </div>
                <p className="text-slate-600">
                  Thực hiện bởi: <strong>{ev.actor}</strong>
                </p>
                {ev.note && (
                  <p className="text-slate-500 text-[11px] italic bg-white p-2 rounded-xl border border-slate-100 mt-1">
                    "{ev.note}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
          <span>Ngày hết hạn: <strong>{job.expiryDate || 'Chưa thiết lập'}</strong></span>
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-1.5 font-semibold text-slate-700 hover:bg-slate-100"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
