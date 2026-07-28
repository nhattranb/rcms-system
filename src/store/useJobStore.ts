import { create } from 'zustand'
import { JobPosting, JobStatus, RecruitmentTimelineEvent } from '../types'
import { INITIAL_JOBS } from '../services/mockData'
import { useAuditLogStore } from './useAuditLogStore'

interface JobStoreState {
  jobs: JobPosting[]
  searchQuery: string
  selectedDepartment: string
  selectedStatus: string
  selectedChannel: string
  setSearchQuery: (query: string) => void
  setSelectedDepartment: (dept: string) => void
  setSelectedStatus: (status: string) => void
  setSelectedChannel: (channel: string) => void
  addJob: (
    job: Omit<
      JobPosting,
      'id' | 'createdDate' | 'updatedDate' | 'applicantsCount'
    >
  ) => void
  updateJob: (id: string, updates: Partial<JobPosting>) => void
  changeJobStatus: (
    id: string,
    newStatus: JobStatus,
    note?: string,
    actorName?: string
  ) => void
  deleteJob: (id: string) => void
}

export const useJobStore = create<JobStoreState>((set) => ({
  jobs: INITIAL_JOBS,
  searchQuery: '',
  selectedDepartment: 'All',
  selectedStatus: 'All',
  selectedChannel: 'All',

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedDepartment: (dept) => set({ selectedDepartment: dept }),
  setSelectedStatus: (status) => set({ selectedStatus: status }),
  setSelectedChannel: (channel) => set({ selectedChannel: channel }),

  addJob: (newJobData) =>
    set((state) => {
      const today = new Date().toISOString().split('T')[0]
      const jobId = `job-${Date.now()}`
      const newEvent: RecruitmentTimelineEvent = {
        id: `ev-${Date.now()}`,
        jobId,
        date: `${today} ${new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        })}`,
        action: newJobData.status === 'Draft' ? 'Created' : 'Submitted Approval',
        actor: newJobData.recruiterName,
        note:
          newJobData.status === 'Draft'
            ? 'Khởi tạo bản nháp mới'
            : 'Gửi đề xuất phê duyệt tin tuyển dụng mới',
      }

      const newJob: JobPosting = {
        ...newJobData,
        id: jobId,
        applicantsCount: 0,
        createdDate: today,
        updatedDate: today,
        timelineEvents: [newEvent],
      }

      // Log Audit Event (NFR-09)
      useAuditLogStore.getState().addLog({
        userId: newJobData.recruiterId || 'usr-1',
        userName: newJobData.recruiterName || 'HR Recruiter',
        action: 'Create Job',
        details: `Tạo vị trí tuyển dụng mới: "${newJobData.title}" (Phòng ${newJobData.department})`,
      })

      return { jobs: [newJob, ...state.jobs] }
    }),

  updateJob: (id, updates) =>
    set((state) => ({
      jobs: state.jobs.map((job) => {
        if (job.id !== id) return job
        const today = new Date().toISOString().split('T')[0]
        const updateEvent: RecruitmentTimelineEvent = {
          id: `ev-${Date.now()}`,
          jobId: id,
          date: `${today} ${new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}`,
          action: 'Updated',
          actor: updates.recruiterName || job.recruiterName,
          note: 'Chỉnh sửa nội dung tin tuyển dụng',
        }

        useAuditLogStore.getState().addLog({
          userId: job.recruiterId,
          userName: job.recruiterName,
          action: 'Edit Job',
          details: `Cập nhật thông tin công việc: "${job.title}"`,
        })

        return {
          ...job,
          ...updates,
          updatedDate: today,
          timelineEvents: [updateEvent, ...(job.timelineEvents || [])],
        }
      }),
    })),

  changeJobStatus: (id, newStatus, note, actorName) =>
    set((state) => ({
      jobs: state.jobs.map((job) => {
        if (job.id !== id) return job
        const today = new Date().toISOString().split('T')[0]
        const newEvent: RecruitmentTimelineEvent = {
          id: `ev-${Date.now()}`,
          jobId: id,
          date: `${today} ${new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}`,
          action: newStatus,
          actor: actorName || job.recruiterName,
          note: note || `Chuyển trạng thái sang ${newStatus}`,
        }

        useAuditLogStore.getState().addLog({
          userId: job.recruiterId,
          userName: actorName || job.recruiterName,
          action: 'Status Change',
          details: `Đổi trạng thái bài đăng "${job.title}" từ ${job.status} sang ${newStatus}`,
        })

        return {
          ...job,
          status: newStatus,
          updatedDate: today,
          timelineEvents: [newEvent, ...(job.timelineEvents || [])],
        }
      }),
    })),

  deleteJob: (id) =>
    set((state) => {
      const job = state.jobs.find((j) => j.id === id)
      if (job) {
        useAuditLogStore.getState().addLog({
          userId: job.recruiterId,
          userName: job.recruiterName,
          action: 'Delete Job',
          details: `Xóa vị trí tuyển dụng: "${job.title}"`,
        })
      }
      return { jobs: state.jobs.filter((j) => j.id !== id) }
    }),
}))
