import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BriefcaseBusiness,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
} from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const { users, isAuthenticated, login } = useAuthStore()

  const [email, setEmail] = useState('nhat.tran@thdcyber.vn')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login(email, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('')
    setError('')
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),linear-gradient(135deg,_#020617,_#0f172a)] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/80 shadow-2xl shadow-cyan-950/30 lg:flex-row">
        <div className="flex flex-1 flex-col justify-between bg-slate-950/70 p-8 sm:p-10 lg:p-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-300">
              <Sparkles size={16} /> RCMS UAT Login
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
              Quản lý tuyển dụng, mọi lúc, mọi nơi.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-400 sm:text-base">
              Đăng nhập để xem dashboard, quản lý tin tuyển dụng, kênh đăng tuyển và nhật ký hệ thống.
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400">
                <BriefcaseBusiness size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">RCMS Demo Workspace</p>
                <p className="text-xs text-slate-400">Tài khoản mẫu cho UAT nhanh</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {users.slice(0, 4).map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => fillDemoAccount(user.email)}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-left text-sm text-slate-300 transition hover:border-cyan-500/40 hover:bg-slate-800"
                >
                  <span>
                    <span className="font-semibold text-white">{user.name}</span>
                    <span className="ml-2 text-xs text-slate-500">({user.role})</span>
                  </span>
                  <span className="text-xs text-cyan-400">Chọn</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white p-8 text-slate-900 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
                  Đăng nhập
                </p>
                <h2 className="mt-2 text-2xl font-bold">Chào mừng trở lại</h2>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 text-cyan-600">
                <LockKeyhole size={18} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email doanh nghiệp
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 focus-within:border-cyan-500 focus-within:bg-white">
                  <Mail size={16} className="mr-2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Mật khẩu
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 focus-within:border-cyan-500 focus-within:bg-white">
                  <LockKeyhole size={16} className="mr-2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="Nhập mật khẩu demo"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="ml-2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error ? (
                <p className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập vào RCMS'}
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Mật khẩu demo</p>
              <p className="mt-1">Sử dụng mật khẩu: <span className="font-semibold text-cyan-700">rcms2026!</span></p>
              <p className="mt-2 text-xs text-slate-500">
                Tài khoản mẫu được lấy từ hệ thống demo hiện tại, có thể mở rộng sang DB thật sau này.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
