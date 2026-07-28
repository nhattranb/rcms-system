import { create } from 'zustand'
import { AuditLog } from '../types'
import { INITIAL_AUDIT_LOGS } from '../services/mockData'

interface AuditLogStoreState {
  logs: AuditLog[]
  addLog: (logData: {
    userId: string
    userName: string
    action: string
    details: string
  }) => void
}

export const useAuditLogStore = create<AuditLogStoreState>((set) => ({
  logs: INITIAL_AUDIT_LOGS,

  addLog: ({ userId, userName, action, details }) =>
    set((state) => {
      const now = new Date()
      const timestamp = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString(
        'vi-VN',
        { hour: '2-digit', minute: '2-digit', second: '2-digit' }
      )}`

      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        timestamp,
        userId,
        userName,
        action,
        details,
      }

      return { logs: [newLog, ...state.logs] }
    }),
}))
