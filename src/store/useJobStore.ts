import { create } from 'zustand'
import { JobPosting, JobStatus } from '../types'
import { fetchFromApi } from '../services/api'

interface JobStoreState {
  jobs: JobPosting[]
  isLoading: boolean
  searchQuery: string
  selectedDepartment: string
  selectedStatus: string
  selectedChannel: string
  fetchJobs: () => Promise<void>
  setSearchQuery: (query: string) => void
  setSelectedDepartment: (dept: string) => void
  setSelectedStatus: (status: string) => void
  setSelectedChannel: (channel: string) => void
  addJob: (
    job: Omit<
      JobPosting,
      'id' | 'createdDate' | 'updatedDate' | 'applicantsCount'
    >
  ) => Promise<void>
  updateJob: (id: string, updates: Partial<JobPosting>) => Promise<void>
  changeJobStatus: (
    id: string,
    newStatus: JobStatus,
    note?: string,
    actorName?: string
  ) => Promise<void>
  deleteJob: (id: string) => Promise<void>
}

export const useJobStore = create<JobStoreState>((set) => ({
  jobs: [],
  isLoading: false,
  searchQuery: '',
  selectedDepartment: 'All',
  selectedStatus: 'All',
  selectedChannel: 'All',

  fetchJobs: async () => {
    set({ isLoading: true })
    const data = await fetchFromApi<JobPosting[]>('/jobs')
    if (data) {
      set({ jobs: data, isLoading: false })
    } else {
      set({ isLoading: false })
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedDepartment: (dept) => set({ selectedDepartment: dept }),
  setSelectedStatus: (status) => set({ selectedStatus: status }),
  setSelectedChannel: (channel) => set({ selectedChannel: channel }),

  addJob: async (newJobData) => {
    const createdJob = await fetchFromApi<JobPosting>('/jobs', {
      method: 'POST',
      body: JSON.stringify(newJobData),
    })

    if (createdJob) {
      set((state) => ({ jobs: [createdJob, ...state.jobs] }))
    } else {
      // Fallback local create if server unreachable
      const today = new Date().toISOString().split('T')[0]
      const fallbackJob: JobPosting = {
        ...newJobData,
        id: `job-${Date.now()}`,
        applicantsCount: 0,
        createdDate: today,
        updatedDate: today,
        publishedChannels: [],
      }
      set((state) => ({ jobs: [fallbackJob, ...state.jobs] }))
    }
  },

  updateJob: async (id, updates) => {
    const updatedJob = await fetchFromApi<JobPosting>(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })

    if (updatedJob) {
      set((state) => ({
        jobs: state.jobs.map((j) => (j.id === id ? updatedJob : j)),
      }))
    } else {
      set((state) => ({
        jobs: state.jobs.map((j) =>
          j.id === id ? { ...j, ...updates } : j
        ),
      }))
    }
  },

  changeJobStatus: async (id, newStatus, note, actorName) => {
    const updatedJob = await fetchFromApi<JobPosting>(`/jobs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus, note, actorName }),
    })

    if (updatedJob) {
      set((state) => ({
        jobs: state.jobs.map((j) => (j.id === id ? updatedJob : j)),
      }))
    } else {
      set((state) => ({
        jobs: state.jobs.map((j) =>
          j.id === id ? { ...j, status: newStatus } : j
        ),
      }))
    }
  },

  deleteJob: async (id) => {
    await fetchFromApi(`/jobs/${id}`, { method: 'DELETE' })
    set((state) => ({ jobs: state.jobs.filter((j) => j.id !== id) }))
  },
}))
