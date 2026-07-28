import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useJobStore } from '../../store/useJobStore'
import { useChannelStore } from '../../store/useChannelStore'
import { useAuthStore } from '../../store/useAuthStore'
import { useAuditLogStore } from '../../store/useAuditLogStore'

export const AppLayout: React.FC = () => {
  const { fetchJobs } = useJobStore()
  const { fetchChannelsAndTracks } = useChannelStore()
  const { fetchUsers } = useAuthStore()
  const { fetchAuditLogs } = useAuditLogStore()

  useEffect(() => {
    // Initial fetch from PostgreSQL Database API on app startup
    fetchJobs()
    fetchChannelsAndTracks()
    fetchUsers()
    fetchAuditLogs()
  }, [fetchJobs, fetchChannelsAndTracks, fetchUsers, fetchAuditLogs])

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <Header />
          <Outlet />
        </main>
      </div>
    </div>
  )
}
