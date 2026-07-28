import React, { useState } from 'react'
import { Bell, ChevronDown, Search, UserCheck } from 'lucide-react'
import { useJobStore } from '../../store/useJobStore'
import { useAuthStore } from '../../store/useAuthStore'
import { useChannelStore } from '../../store/useChannelStore'

export const Header: React.FC = () => {
  const { jobs, searchQuery, setSearchQuery } = useJobStore()
  const { publishTracks } = useChannelStore()
  const { currentUser, users, setCurrentUser } = useAuthStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  // Dynamic FR11 Notification Synthesizer (4 events)
  const notifications: { text: string; type: string }[] = []

  // Event 1: Pending Approval Jobs
  jobs
    .filter((j) => j.status === 'Pending Approval')
    .forEach((j) => {
      notifications.push({
        text: `Vị trí "${j.title}" đang chờ duyệt từ bộ phận HCNS/HR`,
        type: 'pending',
      })
    })

  // Event 2: Expired or Expiring Jobs
  jobs
    .filter((j) => j.status === 'Expired')
    .forEach((j) => {
      notifications.push({
        text: `Vị trí "${j.title}" đã hết hạn nhận hồ sơ. Vui lòng chờ đợi dịp mở lại hoặc tạo mới.`,
        type: 'expired',
      })
    })

  // Event 3: Published Jobs missing enough channels (< 3 channels)
  jobs
    .filter((j) => j.status === 'Published')
    .forEach((j) => {
      const activeChannelsCount = publishTracks.filter(
        (t) => t.jobId === j.id && t.status === 'Published'
      ).length
      if (activeChannelsCount < 3) {
        notifications.push({
          text: `Bài đăng "${j.title}" chưa được xuất bản trên đủ các kênh quy định (Hiện mới có ${activeChannelsCount} kênh)`,
          type: 'channel',
        })
      }
    })

  // Event 4: Candidate Email Replies
  notifications.push({
    text: 'Có 1 email phản hồi mới từ ứng viên Backend Developer',
    type: 'email',
  })

  return (
    <header className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 mb-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600">
            Xin chào, {currentUser.name} ({currentUser.role})
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            Hệ thống Quản lý Kênh Tuyển dụng (RCMS)
          </h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Global Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm vị trí, phòng ban..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Notifications Button (FR11) */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-2xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 transition"
              title="Thông báo"
            >
              <Bell size={18} />
              {notifications.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-900">
                    Cảnh báo Tuyển dụng
                  </span>
                  <span className="text-[10px] bg-cyan-50 text-cyan-700 font-bold px-2 py-0.5 rounded-full">
                    {notifications.length} sự kiện
                  </span>
                </div>
                <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map((notif, index) => (
                    <div
                      key={index}
                      className="rounded-xl bg-slate-50 p-2.5 text-xs text-slate-700 hover:bg-cyan-50/50 cursor-pointer border border-slate-100"
                    >
                      • {notif.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role / User Switcher Dropdown (RBAC) */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 rounded-2xl bg-slate-900 px-3.5 py-2 text-white shadow-sm hover:bg-slate-800 transition"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 font-semibold text-cyan-300 text-xs">
                {currentUser.avatar}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400">{currentUser.role}</p>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50">
                <p className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Chuyển vai trò thử nghiệm (RBAC)
                </p>
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setCurrentUser(user)
                      setShowUserMenu(false)
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                      currentUser.id === user.id
                        ? 'bg-cyan-50 text-cyan-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-[10px] text-slate-500">{user.role}</p>
                    </div>
                    {currentUser.id === user.id && (
                      <UserCheck size={14} className="text-cyan-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
