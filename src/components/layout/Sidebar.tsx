import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  BriefcaseBusiness,
  History,
  Inbox,
  LayoutGrid,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'

const NAVIGATION_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
  { name: 'Tin tuyển dụng (Jobs)', path: '/jobs', icon: BriefcaseBusiness },
  { name: 'Kênh tuyển dụng', path: '/channels', icon: Send },
  { name: 'Hộp thư Email', path: '/inbox', icon: Inbox },
  { name: 'Báo cáo Thống kê', path: '/reports', icon: BarChart3 },
  { name: 'Quản lý Người dùng', path: '/users', icon: Users },
  { name: 'Nhật ký Hệ thống', path: '/audit-logs', icon: History },
]

export const Sidebar: React.FC = () => {
  const { currentUser } = useAuthStore()

  return (
    <aside className="w-full lg:w-72 border-b border-slate-800 bg-slate-950 p-5 text-slate-100 lg:min-h-screen lg:border-b-0 lg:border-r flex flex-col justify-between">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <BriefcaseBusiness size={22} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wide text-white">RCMS</h1>
            <p className="text-xs text-slate-400">Hệ thống quản lý tuyển dụng</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-8 space-y-1">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 rounded-2xl px-3.5 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Role & Current User Badge */}
      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1 text-cyan-400 font-medium">
            <ShieldCheck size={14} /> Vai trò hiện tại
          </span>
          <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
            {currentUser.role}
          </span>
        </div>
        <p className="mt-2 text-sm font-semibold text-white">
          {currentUser.name}
        </p>
        <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400">
          <Sparkles size={13} />
          <span className="font-semibold">Thử nghiệm</span>
        </div>
      </div>
    </aside>
  )
}
