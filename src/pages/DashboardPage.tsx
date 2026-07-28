import React from 'react'

const Link = ({
  to,
  ...props
}: { to: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a href={to} {...props} />
)

import {
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  Plus,
  TrendingUp,
  Users2,
} from 'lucide-react'
import { useJobStore } from '../store/useJobStore'
import { useChannelStore } from '../store/useChannelStore'
import { StatusBadge } from '../components/ui/StatusBadge'

export const DashboardPage: React.FC = () => {
  const { jobs, searchQuery } = useJobStore()
  const { channels } = useChannelStore()

  // Filter jobs based on global search
  const filteredJobs = jobs.filter(
    (job: { title: string; department: string }) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const openJobsCount = jobs.filter((j: { status: string }) => j.status === 'Published').length
  const pendingJobsCount = jobs.filter(
    (j: { status: string }) => j.status === 'Pending Approval'
  ).length
  const totalApplicants = jobs.reduce((acc: any, j: { applicantsCount: any }) => acc + j.applicantsCount, 0)
  const expiredJobsCount = jobs.filter((j: { status: string }) => j.status === 'Expired').length

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Vị trí đang mở (Open)
            </p>
            <div className="rounded-2xl bg-cyan-50 p-2.5 text-cyan-600">
              <BriefcaseBusiness size={20} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {openJobsCount}
          </p>
          <p className="mt-2 text-xs font-medium text-emerald-600 flex items-center gap-1">
            <TrendingUp size={14} /> +3 vị trí trong tuần này
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Chờ phê duyệt (Pending)
            </p>
            <div className="rounded-2xl bg-amber-50 p-2.5 text-amber-600">
              <Clock size={20} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {pendingJobsCount}
          </p>
          <p className="mt-2 text-xs font-medium text-amber-600">
            Cần Trưởng phòng HCNS/HR duyệt
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Tổng ứng viên (Candidates)
            </p>
            <div className="rounded-2xl bg-violet-50 p-2.5 text-violet-600">
              <Users2 size={20} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {totalApplicants.toLocaleString()}
          </p>
          <p className="mt-2 text-xs font-medium text-emerald-600">
            +18% so với tháng trước
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Sắp / Đã hết hạn (Expired)
            </p>
            <div className="rounded-2xl bg-rose-50 p-2.5 text-rose-600">
              <BarChart3 size={20} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {expiredJobsCount}
          </p>
          <p className="mt-2 text-xs font-medium text-slate-500">
            Cần gia hạn hoặc đóng tuyển
          </p>
        </div>
      </section>

      {/* Main Grid: Job Pipeline & Channel Performance */}
      <section className="grid gap-6 xl:grid-cols-3">
        {/* Left: Active Hiring Pipeline (2 cols) */}
        <div className="xl:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Tin bài tuyển dụng gần đây (FR2, FR5)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Danh sách tin tuyển dụng và trạng thái kênh phát hành
              </p>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              <Plus size={16} /> Tạo tin mới
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {filteredJobs.slice(0, 5).map((job) => (
              <div
                key={job.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 transition hover:bg-slate-100/80 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">
                      {job.title}
                    </h3>
                    <StatusBadge status={job.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {job.department} • {job.location} • Phụ trách:{' '}
                    <span className="font-medium text-slate-700">
                      {job.recruiterName}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <p className="font-bold text-slate-900">
                      {job.applicantsCount} ứng viên
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Hạn: {job.expiryDate || 'N/A'}
                    </p>
                  </div>
                  <Link
                    to="/jobs"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300"
                  >
                    Chi tiết ➔
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Channel Performance Overview (1 col) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Hiệu quả Kênh (FR3, FR8)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tỷ lệ ứng viên theo nguồn tuyển
                </p>
              </div>
              <Link
                to="/channels"
                className="text-xs font-semibold text-cyan-600 hover:underline"
              >
                Quản lý kênh
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {channels.map((channel: any) => (
                <div
                  key={channel.id}
                  className="rounded-2xl border border-slate-100 p-3.5 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">
                        {channel.name}
                      </p>
                      <p className="text-slate-400">{channel.category}</p>
                    </div>
                    <span className="font-semibold text-emerald-600">
                      {channel.trend}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>{channel.activeJobsCount} tin đang mở</span>
                    <span className="font-medium text-slate-700">
                      {channel.totalCandidates} ứng viên
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-cyan-50 p-4 border border-cyan-100 text-xs text-cyan-900">
            <p className="font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-cyan-600" />
              Nguồn tuyển hàng đầu:
            </p>
            <p className="mt-1 text-slate-600">
              <strong>LinkedIn</strong> đóng góp 52% số lượng ứng viên tiềm
              năng cho các vị trí IT.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}