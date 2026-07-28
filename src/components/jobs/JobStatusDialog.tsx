import React, { useState } from 'react'
import { ShieldCheck, X } from 'lucide-react'
import { JobPosting, JobStatus } from '../../types'

interface JobStatusDialogProps {
  job: JobPosting | null
  targetStatus: JobStatus | null
  onClose: () => void
  onConfirmStatusChange: (
    jobId: string,
    newStatus: JobStatus,
    note?: string
  ) => void
}

export const JobStatusDialog: React.FC<JobStatusDialogProps> = ({
  job,
  targetStatus,
  onClose,
  onConfirmStatusChange,
}) => {
  const [note, setNote] = useState('')

  if (!job || !targetStatus) return null

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirmStatusChange(job.id, targetStatus, note)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-cyan-600" />
            <h3 className="text-base font-bold text-slate-900">
              Xác nhận Chuyển trạng thái Tin tuyển dụng (FR5)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-xl"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleConfirm} className="space-y-4 text-xs">
          <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100 space-y-1">
            <p className="font-bold text-slate-900">{job.title}</p>
            <p className="text-slate-500">
              Trạng thái hiện tại: <strong>{job.status}</strong> ➔ Chuyển thành:{' '}
              <strong className="text-cyan-700">{targetStatus}</strong>
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Ghi chú / Lý do chuyển trạng thái (Timeline Note)
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: Đã có ứng viên phù hợp trúng tuyển / Tạm dừng theo chỉ đạo HR Manager..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-cyan-600 px-4 py-2 font-semibold text-white hover:bg-cyan-700 shadow-md"
            >
              Xác nhận chuyển trạng thái
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
