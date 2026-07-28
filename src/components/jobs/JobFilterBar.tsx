import React from 'react'
import { Filter, RefreshCw, Search } from 'lucide-react'
import { useJobStore } from '../../store/useJobStore'

interface JobFilterBarProps {
  recruiterFilter: string
  setRecruiterFilter: (recruiter: string) => void
  locationFilter: string
  setLocationFilter: (loc: string) => void
  onResetFilters: () => void
  totalCount: number
  filteredCount: number
}

export const JobFilterBar: React.FC<JobFilterBarProps> = ({
  recruiterFilter,
  setRecruiterFilter,
  locationFilter,
  setLocationFilter,
  onResetFilters,
  totalCount,
  filteredCount,
}) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedDepartment,
    setSelectedDepartment,
    selectedStatus,
    setSelectedStatus,
  } = useJobStore()

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedDepartment !== 'All' ||
    selectedStatus !== 'All' ||
    recruiterFilter !== 'All' ||
    locationFilter !== 'All'

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Filter size={15} className="text-cyan-600" />
          Bộ lọc Tìm kiếm Nâng cao (FR6)
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">
            Hiển thị <strong>{filteredCount}</strong> / {totalCount} vị trí
          </span>
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl transition"
            >
              <RefreshCw size={12} /> Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 text-xs">
        {/* Search Keyword Input */}
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tiêu đề, phòng..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-2 outline-none focus:border-cyan-500 focus:bg-white"
          />
        </div>

        {/* Department Select */}
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-700 outline-none focus:border-cyan-500"
        >
          <option value="All">Tất cả Phòng ban</option>
          <option value="IT">Công nghệ Thông tin (IT)</option>
          <option value="HR">Nhân sự (HR)</option>
          <option value="Marketing">Marketing</option>
        </select>

        {/* Status Select */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-700 outline-none focus:border-cyan-500"
        >
          <option value="All">Tất cả Trạng thái</option>
          <option value="Draft">Draft (Bản nháp)</option>
          <option value="Pending Approval">Pending Approval (Chờ duyệt)</option>
          <option value="Published">Published (Đã xuất bản)</option>
          <option value="Paused">Paused (Tạm dừng)</option>
          <option value="Expired">Expired (Hết hạn)</option>
          <option value="Closed">Closed (Đã đóng)</option>
          <option value="Filled">Filled (Đã có người)</option>
        </select>

        {/* Recruiter Select */}
        <select
          value={recruiterFilter}
          onChange={(e) => setRecruiterFilter(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-700 outline-none focus:border-cyan-500"
        >
          <option value="All">Tất cả Recruiter</option>
          <option value="Nhật Trần">Nhật Trần</option>
          <option value="Lan Nguyễn">Lan Nguyễn</option>
          <option value="Minh Vũ">Minh Vũ</option>
        </select>

        {/* Location Select */}
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-700 outline-none focus:border-cyan-500"
        >
          <option value="All">Tất cả Địa điểm</option>
          <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
          <option value="Hà Nội">Hà Nội</option>
          <option value="Đà Nẵng">Đà Nẵng</option>
        </select>
      </div>
    </div>
  )
}
