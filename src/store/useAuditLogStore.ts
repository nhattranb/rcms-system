import { create } from 'zustand'
import { AuditLog } from '../types'
import { fetchFromApi } from '../services/api'

interface AuditLogStoreState {
  logs: AuditLog[]
  isLoading: boolean
  fetchAuditLogs: () => Promise<void>
}

export const useAuditLogStore = create<AuditLogStoreState>((set) => ({
  logs: [],
  isLoading: false,

  fetchAuditLogs: async () => {
    set({ isLoading: true })
    const logsData = await fetchFromApi<AuditLog[]>('/audit-logs')
    if (logsData) {
      set({ logs: logsData, isLoading: false })
    } else {
      set({ isLoading: false })
    }
  },
}))
