import React, { useState } from 'react'
import {
  BriefcaseBusiness,
  Calendar,
  CheckCircle2,
  Edit,
  History,
  MapPin,
  Plus,
  Send,
  Trash2,
  User,
} from 'lucide-react'
import { useJobStore } from '../store/useJobStore'
import { useChannelStore } from '../store/useChannelStore'
import { useAuthStore } from '../store/useAuthStore'
import { JobPosting, JobStatus } from '../types'
import { StatusBadge } from '../components/ui/StatusBadge'
import { JobFilterBar } from '../components/jobs/JobFilterBar'
import { JobFormModal, JobFormData } from '../components/jobs/JobFormModal'
import { JobTimelineDrawer } from '../components/jobs/JobTimelineDrawer'
import { JobStatusDialog } from '../components/jobs/JobStatusDialog'

export const JobsPage: React.FC = () => {
  const {
    jobs,
    searchQuery,
    setSearchQuery,
    selectedDepartment,
    setSelectedDepartment,
    selectedStatus,
    setSelectedStatus,
    addJob,
    updateJob,
    changeJobStatus,
    deleteJob,
  } = useJobStore()

  const { channels, publishTracks, togglePublishStatus } = useChannelStore()
  const { currentUser } = useAuthStore()

  // Extra Filter States (Recruiter, Location)
  const [recruiterFilter, setRecruiterFilter] = useState('All')
  const [locationFilter, setLocationFilter] = useState('All')

  // Modal & Drawer States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null)
  const [selectedTimelineJob, setSelectedTimelineJob] =
    useState<JobPosting | null>(null)

  // Status Change Dialog State
  const [statusDialogJob, setStatusDialogJob] = useState<JobPosting | null>(null)
  const [targetStatus, setTargetStatus] = useState<JobStatus | null>(null)

  // Multi-Criteria Filtering Logic (FR6)
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.recruiterName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDept =
      selectedDepartment === 'All' || job.department === selectedDepartment
    const matchesStatus =
      selectedStatus === 'All' || job.status === selectedStatus
    const matchesRecruiter =
      recruiterFilter === 'All' || job.recruiterName === recruiterFilter
    const matchesLocation =
      locationFilter === 'All' || job.location.includes(locationFilter)

    return (
      matchesSearch &&
      matchesDept &&
      matchesStatus &&
      matchesRecruiter &&
      matchesLocation
    )
  })

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedDepartment('All')
    setSelectedStatus('All')
    setRecruiterFilter('All')
    setLocationFilter('All')
  }

  const handleOpenCreateModal = () => {
    setEditingJob(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEditModal = (job: JobPosting) => {
    setEditingJob(job)
    setIsFormModalOpen(true)
  }

  const handleSubmitJobForm = (formData: JobFormData, isDraft: boolean) => {
    const status: JobStatus = isDraft ? 'Draft' : 'Pending Approval'

    if (editingJob) {
      updateJob(editingJob.id, {
        ...formData,
        status: isDraft ? 'Draft' : editingJob.status,
      })
    } else {
      addJob({
        ...formData,
        status,
        recruiterId: currentUser.id,
        recruiterName: currentUser.name,
        publishedChannels: [],
      })
    }
  }

  const handlePromptStatusChange = (job: JobPosting, newStatus: JobStatus) => {
    setStatusDialogJob(job)
    setTargetStatus(newStatus)
  }

  const handleConfirmStatusChange = (
    jobId: string,
    newStatus: JobStatus,
    note?: string
  ) => {
    changeJobStatus(jobId, newStatus, note, currentUser.name)
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Quản lý Tin bài Tuyển dụng (FR2, FR5, FR6, FR10)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tạo mới, validate form, chuyển đổi trạng thái vòng đời tin bài và tra cứu đa tiêu chí
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-cyan-700 transition"
        >
          <Plus size={18} /> Đăng tin tuyển dụng mới (FR2)
        </button>
      </div>

      {/* Advanced Filter Toolbar (FR6) */}
      <JobFilterBar
        recruiterFilter={recruiterFilter}
        setRecruiterFilter={setRecruiterFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        onResetFilters={handleResetFilters}
        totalCount={jobs.length}
        filteredCount={filteredJobs.length}
      />

      {/* Job Card List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 space-y-3">
            <BriefcaseBusiness size={40} className="mx-auto text-slate-300" />
            <p className="font-semibold text-slate-700 text-sm">
              Không tìm thấy vị trí tuyển dụng phù hợp với bộ lọc.
            </p>
            <button
              onClick={handleResetFilters}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-cyan-600 hover:bg-cyan-50"
            >
              Xóa bộ lọc để xem tất cả
            </button>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-lg font-bold text-slate-900">
                      {job.title}
                    </h3>
                    <StatusBadge status={job.status} />
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600 font-medium">
                      {job.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <BriefcaseBusiness size={14} className="text-cyan-600" />{' '}
                      {job.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-slate-400" />{' '}
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={14} className="text-slate-400" /> Recruiter:{' '}
                      <strong>{job.recruiterName}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-slate-400" /> Tạo:{' '}
                      {job.createdDate}
                    </span>
                  </div>

                  {/* Skills tags preview */}
                  {job.skills && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.skills.split(',').map((skill, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Action Menu & Status Controls */}
                <div className="flex flex-col items-end gap-3 border-t border-slate-100 pt-3 lg:border-t-0 lg:pt-0">
                  <div className="flex items-center gap-2">
                    {/* Status Workflow Selector (FR5) */}
                    <select
                      value={job.status}
                      onChange={(e) =>
                        handlePromptStatusChange(
                          job,
                          e.target.value as JobStatus
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      <option value="Draft">Trạng thái: Draft (Nháp)</option>
                      <option value="Pending Approval">
                        Pending Approval (Chờ duyệt)
                      </option>
                      <option value="Published">Xuất bản (Published)</option>
                      <option value="Paused">Tạm dừng (Paused)</option>
                      <option value="Expired">Hết hạn (Expired)</option>
                      <option value="Closed">Đóng tuyển (Closed)</option>
                      <option value="Filled">Đã trúng tuyển (Filled)</option>
                    </select>

                    <button
                      onClick={() => handleOpenEditModal(job)}
                      className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 hover:text-cyan-600 transition"
                      title="Chỉnh sửa (FR2)"
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      onClick={() => setSelectedTimelineJob(job)}
                      className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 hover:text-cyan-600 transition"
                      title="Xem Timeline Diễn biến (FR10)"
                    >
                      <History size={15} />
                    </button>
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="rounded-xl border border-slate-200 p-2 text-rose-600 hover:bg-rose-50 transition"
                      title="Xóa vị trí"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">
                      {job.applicantsCount} ứng viên nộp CV
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Hạn: {job.expiryDate || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Multi-Channel Publishing Matrix (FR4 - Publish Tracking) */}
              <div className="mt-4 border-t border-slate-100 pt-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                  <Send size={12} /> Kênh đăng tuyển (Publish Tracking):
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {channels.map((ch) => {
                    const isPublished = publishTracks.some(
                      (t) =>
                        t.jobId === job.id &&
                        t.channelId === ch.id &&
                        t.status === 'Published'
                    )
                    return (
                      <button
                        key={ch.id}
                        onClick={() => togglePublishStatus(job.id, ch.id)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-medium border transition ${
                          isPublished
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold'
                            : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <CheckCircle2
                          size={13}
                          className={
                            isPublished ? 'text-emerald-600' : 'text-slate-300'
                          }
                        />
                        {ch.name}: {isPublished ? 'Published' : 'Draft'}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form Modal (FR2) */}
      <JobFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmitJob={handleSubmitJobForm}
        editingJob={editingJob}
      />

      {/* Timeline Drawer (FR10) */}
      <JobTimelineDrawer
        job={selectedTimelineJob}
        onClose={() => setSelectedTimelineJob(null)}
      />

      {/* Status Change Dialog (FR5) */}
      <JobStatusDialog
        job={statusDialogJob}
        targetStatus={targetStatus}
        onClose={() => {
          setStatusDialogJob(null)
          setTargetStatus(null)
        }}
        onConfirmStatusChange={handleConfirmStatusChange}
      />
    </div>
  )
}
