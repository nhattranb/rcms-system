import React, { useState } from 'react'
import {
  BarChart3,
  Calendar,
  Download,
  PieChart,
  TrendingUp,
  Users2,
} from 'lucide-react'
import { useChannelStore } from '../store/useChannelStore'
import { useJobStore } from '../store/useJobStore'

export const ReportsPage: React.FC = () => {
  const { channels } = useChannelStore()
  const { jobs } = useJobStore()

  const [timeRange, setTimeRange] = useState('This Month')
  const [department, setDepartment] = useState('All')

  // Total applicants across all jobs
  const totalApplicants = jobs.reduce((sum, j) => sum + j.applicantsCount, 0)

  // Export report handler simulation
  const handleExportReport = () => {
    alert(
      `Đã sinh và tải xuống báo cáo tuyển dụng thời gian thực (${timeRange} - Phòng ban: ${department}) dưới định dạng Excel/PDF!`
    )
  }

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls (FR8) */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Báo cáo & Thống kê Tuyển dụng Thời gian thực (FR8)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Báo cáo thời gian thực về tình hình tuyển dụng theo thời gian, recruiter, phòng ban và hiệu quả kênh
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range Filter */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none shadow-sm"
          >
            <option value="This Week">Tuần này</option>
            <option value="This Month">Tháng này (Tháng 7/2026)</option>
            <option value="This Quarter">Quý này (Q3/2026)</option>
            <option value="This Year">Năm 2026</option>
          </select>

          {/* Department Filter */}
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none shadow-sm"
          >
            <option value="All">Tất cả Phòng ban</option>
            <option value="IT">Công nghệ Thông tin</option>
            <option value="HR">Nhân sự</option>
            <option value="Marketing">Marketing</option>
          </select>

          <button
            onClick={handleExportReport}
            className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-cyan-700 transition"
          >
            <Download size={15} /> Xuất Báo cáo (Export)
          </button>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Tổng số ứng viên
            </span>
            <Users2 size={20} className="text-cyan-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-3">
            {totalApplicants.toLocaleString()}
          </p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">
            +18% so với kỳ trước
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Thời gian tuyển TB
            </span>
            <Calendar size={20} className="text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-3">21 Ngày</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">
            Giảm 4 ngày (Tối ưu 16%)
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Kênh hiệu quả nhất
            </span>
            <PieChart size={20} className="text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-3">LinkedIn</p>
          <p className="text-xs text-slate-500 mt-1">Đóng góp 52% hồ sơ CV</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Tỷ lệ hoàn thành chỉ tiêu
            </span>
            <TrendingUp size={20} className="text-violet-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-3">84%</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">
            Đạt kế hoạch tuyển dụng Q3
          </p>
        </div>
      </div>

      {/* Main Breakdown: Top Sources & Department Report */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Left: Top Recruitment Sources Percentage (FR8 example in BRD: LinkedIn 52%, TopCV 28%, Facebook 20%) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Top Nguồn Ứng viên Dự tuyển (Channel Breakdown - FR8)
              </h3>
              <p className="text-xs text-slate-500">
                Tỷ lệ đóng góp ứng viên theo từng kênh truyền thông tuyển dụng
              </p>
            </div>
            <BarChart3 size={18} className="text-cyan-600" />
          </div>

          <div className="space-y-4 pt-1">
            {channels.map((ch) => {
              // Standard percentage mapping based on BRD specs
              const sharePercent =
                ch.name.includes('LinkedIn')
                  ? 52
                  : ch.name.includes('TopCV')
                    ? 28
                    : ch.name.includes('Facebook')
                      ? 20
                      : ch.name.includes('VietnamWorks')
                        ? 15
                        : ch.name.includes('Referral')
                          ? 10
                          : 8

              return (
                <div key={ch.id} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-900 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-cyan-500" />
                      {ch.name} ({ch.category})
                    </span>
                    <span className="text-cyan-700 font-bold">
                      {sharePercent}% ({ch.totalCandidates} ứng viên)
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        sharePercent >= 50
                          ? 'bg-cyan-600'
                          : sharePercent >= 25
                            ? 'bg-emerald-500'
                            : 'bg-violet-500'
                      }`}
                      style={{ width: `${sharePercent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Department & Recruiter Hiring Performance */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Báo cáo theo Phòng ban & Recruiter (FR8)
              </h3>
              <p className="text-xs text-slate-500">
                Tiến độ tuyển dụng và số lượng tin bài theo người phụ trách
              </p>
            </div>
            <Users2 size={18} className="text-violet-600" />
          </div>

          <div className="space-y-3 pt-1">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-900">
                <span>Phòng IT (Công nghệ Thông tin)</span>
                <span className="text-cyan-700">12 vị trí tuyển</span>
              </div>
              <p className="text-xs text-slate-500">
                Recruiters: <strong>Nhật Trần (8 jobs)</strong>, <strong>Minh Vũ (4 jobs)</strong>
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-600 pt-1">
                <span>Đã tuyển: <strong>9/12</strong></span>
                <span>Ứng viên: <strong>91 CV</strong></span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-900">
                <span>Phòng HR (Nhân sự)</span>
                <span className="text-cyan-700">5 vị trí tuyển</span>
              </div>
              <p className="text-xs text-slate-500">
                Recruiters: <strong>Lan Nguyễn (5 jobs)</strong>
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-600 pt-1">
                <span>Đã tuyển: <strong>3/5</strong></span>
                <span>Ứng viên: <strong>38 CV</strong></span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-900">
                <span>Phòng Marketing</span>
                <span className="text-cyan-700">3 vị trí tuyển</span>
              </div>
              <p className="text-xs text-slate-500">
                Recruiters: <strong>Nhật Trần (3 jobs)</strong>
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-600 pt-1">
                <span>Đã tuyển: <strong>1/3</strong></span>
                <span>Ứng viên: <strong>18 CV</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
