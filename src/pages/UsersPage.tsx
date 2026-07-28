import React, { useState } from 'react'
import { Plus, ShieldCheck, X } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { UserRole } from '../types'

const ROLES: UserRole[] = [
  'Admin',
  'HR Manager',
  'HR Recruiter',
  'TA Lead',
  'Hiring Manager',
]

export const UsersPage: React.FC = () => {
  const { users, currentUser, setCurrentUser, addUser, updateUserRole } =
    useAuthStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('IT')
  const [role, setRole] = useState<UserRole>('HR Recruiter')

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    addUser({
      name,
      email,
      department,
      role,
    })

    setName('')
    setEmail('')
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Quản lý Người dùng & Phân quyền RBAC (FR1, FR12)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý danh sách tài khoản doanh nghiệp, phân quyền vai trò (Role) và kiểm soát truy cập
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-cyan-700 transition"
        >
          <Plus size={18} /> Thêm Người dùng Mới
        </button>
      </div>

      {/* User List Table */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Danh sách Tài khoản Doanh nghiệp ({users.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-semibold">
                <th className="p-3.5 rounded-l-2xl">Họ và tên</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Phòng ban</th>
                <th className="p-3.5">Vai trò (Role)</th>
                <th className="p-3.5 rounded-r-2xl text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 font-bold text-cyan-800 text-xs">
                      {user.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{user.name}</p>
                      {currentUser.id === user.id && (
                        <span className="text-[10px] font-semibold text-cyan-600">
                          (Đang đăng nhập)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-600">{user.email}</td>
                  <td className="p-3.5 text-slate-600">{user.department}</td>
                  <td className="p-3.5">
                    {/* Role selector dropdown (FR12) */}
                    <select
                      value={user.role}
                      onChange={(e) =>
                        updateUserRole(user.id, e.target.value as UserRole)
                      }
                      className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-cyan-800 outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setCurrentUser(user)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                        currentUser.id === user.id
                          ? 'bg-emerald-100 text-emerald-800 cursor-default font-bold'
                          : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                      }`}
                    >
                      {currentUser.id === user.id
                        ? 'Phiên làm việc hiện tại'
                        : 'Kích hoạt phiên này'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC Permission Matrix Overview */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <ShieldCheck size={18} className="text-cyan-600" />
          Ma trận Phân quyền Quyền hạn (RBAC Matrix)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Quy định quyền thao tác của từng vai trò trên hệ thống RCMS
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-semibold">
                <th className="p-3">Tính năng / Quyền hạn</th>
                <th className="p-3 text-center">Admin</th>
                <th className="p-3 text-center">HR Manager</th>
                <th className="p-3 text-center">HR Recruiter</th>
                <th className="p-3 text-center">TA Lead</th>
                <th className="p-3 text-center">Hiring Manager</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="p-3 font-semibold">Tạo mới & Sửa Job (FR2)</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="p-3 text-center text-slate-300">✕</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Phê duyệt Tin tuyển dụng (Pending ➔ Published)</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="p-3 text-center text-slate-300">✕</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="p-3 text-center text-slate-300">✕</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Quản lý Cấu hình Kênh Tuyển dụng (FR3)</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="p-3 text-center text-slate-300">✕</td>
                <td className="p-3 text-center text-slate-300">✕</td>
                <td className="p-3 text-center text-slate-300">✕</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Quản lý Tài khoản & Phân quyền (FR12)</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="p-3 text-center text-slate-300">✕</td>
                <td className="p-3 text-center text-slate-300">✕</td>
                <td className="p-3 text-center text-slate-300">✕</td>
                <td className="p-3 text-center text-slate-300">✕</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Xem Báo cáo & Audit Logs (FR8, NFR-09)</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
                <td className="p-3 text-center text-emerald-600 font-bold">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Thêm Người dùng Doanh nghiệp Mới (FR12)
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Họ và tên người dùng *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email doanh nghiệp *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nva@thdcyber.vn"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Phòng ban
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none"
                  >
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Vai trò (Role)
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-cyan-600 px-5 py-2.5 font-semibold text-white hover:bg-cyan-700 shadow-md"
                >
                  Tạo người dùng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
