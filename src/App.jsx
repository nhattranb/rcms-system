import { useState } from 'react'
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  CircleCheckBig,
  Clock3,
  Inbox,
  LayoutGrid,
  MessageSquareText,
  Search,
  Send,
  Sparkles,
  TrendingUp,
  Users2,
} from 'lucide-react'
import JobPosting from './JobPosting'

const navigation = [
  { name: 'Dashboard', icon: LayoutGrid, key: 'dashboard' },
  { name: 'Job Postings', icon: BriefcaseBusiness, key: 'job-postings' },
  { name: 'Channels', icon: Send, key: 'channels' },
  { name: 'Email Inbox', icon: Inbox, key: 'inbox' },
  { name: 'Reports', icon: BarChart3, key: 'reports' },
]

const departments = ['IT', 'Marketing', 'HR']

const jobs = [
  {
    title: 'Backend Developer',
    department: 'IT',
    location: 'Hồ Chí Minh',
    status: ' Đã xuất bản',
    applicants: 48,
    channel: 'LinkedIn',
  },
  {
    title: 'HR Executive',
    department: 'HR',
    location: 'Hà Nội',
    status: 'Chờ phê duyệt',
    applicants: 19,
    channel: 'VietnamWorks',
  },
  {
    title: 'Digital Marketing Lead',
    department: 'Marketing',
    location: 'Đà Nẵng',
    status: 'Bản nháp',
    applicants: 8,
    channel: 'Facebook',
  },
]

const channels = [
  { name: 'LinkedIn', type: 'Nền tảng doanh nghiệp', candidates: 126, trend: '+18%' },
  { name: 'Facebook', type: 'Mạng xã hội', candidates: 94, trend: '+6%' },
  { name: 'TopCV', type: 'Job Board', candidates: 81, trend: '+11%' },
  { name: 'VietnamWorks', type: 'Job Board', candidates: 73, trend: '+4%' },
  { name: 'Referral', type: 'Nội bộ', candidates: 37, trend: '+9%' },
]

const inbox = [
  { sender: 'Phong Tran', topic: 'Phản hồi từ ứng viên cho vị trí Backend Developer', time: '8m ago' },
  { sender: 'HR Ops', topic: 'Yêu cầu phê duyệt cho vị trí HR Executive', time: '24m ago' },
  { sender: 'Recruiter Team', topic: 'Lead mới từ chiến dịch TopCV', time: '1h ago' },
]

const statusClasses = {
  Draft: 'bg-slate-100 text-slate-700',
  'Pending Approval': 'bg-amber-100 text-amber-700',
  Published: 'bg-emerald-100 text-emerald-700',
  Closed: 'bg-rose-100 text-rose-700',
}

function App() {
  const [activeView, setActiveView] = useState('dashboard')

  const renderView = () => {
    if (activeView === 'job-postings') {
      return <JobPosting />
    }

    return (
      <>
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Vị trí đang mở tuyển</p>
              <div className="rounded-2xl bg-cyan-50 p-2 text-cyan-600">
                <BriefcaseBusiness size={18} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-semibold">24</p>
            <p className="mt-2 text-sm text-emerald-600">+5 vị trí mới trong tuần này</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Tổng số đơn ứng tuyển</p>
              <div className="rounded-2xl bg-violet-50 p-2 text-violet-600">
                <Users2 size={18} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-semibold">1,248</p>
            <p className="mt-2 text-sm text-emerald-600">+12% vs tháng trước</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Tỷ lệ phê duyệt</p>
              <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-600">
                <TrendingUp size={18} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-semibold">82%</p>
            <p className="mt-2 text-sm text-slate-500">Trên tất cả các kênh</p>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Job Postings</p>
                <h2 className="text-lg font-semibold text-slate-900">Active hiring pipeline</h2>
              </div>
              <button
                onClick={() => setActiveView('job-postings')}
                className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-medium text-white"
              >
                New Posting
              </button>
            </div>
            <div className="mt-5 space-y-3">
              {jobs.map((job) => (
                <div key={job.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{job.title}</p>
                      <p className="text-sm text-slate-500">
                        {job.department} • {job.location} • {job.channel}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[job.status]}`}>
                        {job.status}
                      </span>
                      <span className="text-sm text-slate-500">{job.applicants} applicants</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Channels</p>
                <h2 className="text-lg font-semibold text-slate-900">Performance mix</h2>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {channels.map((channel) => (
                <div key={channel.name} className="rounded-2xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{channel.name}</p>
                      <p className="text-sm text-slate-500">{channel.type}</p>
                    </div>
                    <span className="text-sm font-medium text-emerald-600">{channel.trend}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{channel.candidates} candidates</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Email Inbox</p>
                <h2 className="text-lg font-semibold text-slate-900">Cập nhật mới nhất</h2>
              </div>
              <button className="rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-600">
                View all
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {inbox.map((item) => (
                <div key={item.topic} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
                  <div className="rounded-2xl bg-cyan-100 p-2 text-cyan-700">
                    <MessageSquareText size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{item.topic}</p>
                    <p className="text-sm text-slate-500">from {item.sender}</p>
                  </div>
                  <p className="text-sm text-slate-400">{item.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Phòng ban</p>
                <h2 className="text-lg font-semibold text-slate-900">Trọng tâm tuyển dụng</h2>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {departments.map((department, index) => (
                <div key={department} className="rounded-2xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CircleCheckBig size={16} className="text-emerald-500" />
                      <p className="font-semibold text-slate-900">{department}</p>
                    </div>
                    <p className="text-sm text-slate-500">{index === 0 ? '8 roles' : index === 1 ? '5 roles' : '3 roles'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full lg:w-72 border-b border-slate-200 bg-slate-950 p-6 text-slate-100 lg:min-h-screen lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-500/20 p-2 text-cyan-400">
              <BriefcaseBusiness size={20} />
            </div>
            <div>
              <p className="font-semibold">RCMS</p>
              <p className="text-xs text-slate-400">Hệ thống quản lý tuyển dụng</p>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = activeView === item.key || (activeView === 'dashboard' && item.key === 'dashboard')
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveView(item.key)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </button>
              )
            })}
          </nav>

          <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Sparkles size={16} className="text-cyan-400" />
              AI suggestions
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Có 03 vị trí đang chờ phê duyệt.
            </p>
          </div>
        </aside>

        <main className="flex-1 p-4 lg:p-8">
          <header className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-600">Chào buổi sáng, Nhat</p>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                  {activeView === 'job-postings'
                    ? 'Job Posting Center'
                    : 'Recruitment Channel Management Overview'}
                </h1>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                  <Search size={16} />
                  <input
                    className="w-full bg-transparent outline-none"
                    placeholder="Search roles"
                  />
                </label>
                <button className="rounded-2xl border border-slate-200 p-2 text-slate-600">
                  <Bell size={18} />
                </button>
                <div className="flex items-center gap-3 rounded-2xl bg-slate-900 px-3 py-2 text-white">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/20 font-semibold text-cyan-300">
                    LT
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Nhat Tran</p>
                    <p className="text-xs text-slate-400">HR Recruiter</p>
                  </div>
                  <ChevronDown size={16} className="text-slate-400" />
                </div>
              </div>
            </div>
          </header>

          {renderView()}
        </main>
      </div>
    </div>
  )
}

export default App
