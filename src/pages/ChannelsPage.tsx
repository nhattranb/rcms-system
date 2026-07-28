import React, { useState } from 'react'
import {
  CheckCircle2,
  Edit,
  Plus,
  Send,
  Trash2,
  X,
} from 'lucide-react'
import { useChannelStore } from '../store/useChannelStore'
import { useJobStore } from '../store/useJobStore'
import { useAuthStore } from '../store/useAuthStore'
import { RecruitmentChannel } from '../types'

export const ChannelsPage: React.FC = () => {
  const {
    channels,
    publishTracks,
    togglePublishStatus,
    addChannel,
    updateChannel,
    deleteChannel,
  } = useChannelStore()
  const { jobs } = useJobStore()
  const { currentUser } = useAuthStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingChannel, setEditingChannel] =
    useState<RecruitmentChannel | null>(null)

  const [name, setName] = useState('')
  const [category, setCategory] = useState<any>('Social Media')
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active')

  const handleOpenAdd = () => {
    setEditingChannel(null)
    setName('')
    setCategory('Social Media')
    setStatus('Active')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (channel: RecruitmentChannel) => {
    setEditingChannel(channel)
    setName(channel.name)
    setCategory(channel.category)
    setStatus(channel.status)
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    if (editingChannel) {
      updateChannel(
        editingChannel.id,
        { name, category, status },
        currentUser.name,
        currentUser.id
      )
    } else {
      addChannel(
        { name, category, trend: '+0%', status },
        currentUser.name,
        currentUser.id
      )
    }

    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Quản lý Kênh Tuyển dụng & Publish Tracking (FR3, FR4)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cấu hình danh mục kênh đăng tuyển và quản lý ma trận phát hành bài viết
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-cyan-700 transition"
        >
          <Plus size={18} /> Thêm Kênh Tuyển dụng Mới (FR3)
        </button>
      </div>

      {/* Channel Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 font-bold border border-cyan-100">
                  {channel.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {channel.name}
                  </h3>
                  <p className="text-xs text-slate-400">{channel.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(channel)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                  title="Sửa kênh"
                >
                  <Edit size={15} />
                </button>
                <button
                  onClick={() =>
                    deleteChannel(channel.id, currentUser.name, currentUser.id)
                  }
                  className="p-1 text-rose-400 hover:text-rose-600 rounded-lg"
                  title="Xóa kênh"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  channel.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                Trạng thái: {channel.status}
              </span>
              <span className="text-xs font-semibold text-emerald-600">
                Xu hướng: {channel.trend}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="rounded-xl bg-slate-50 p-2.5">
                <p className="text-slate-400 text-[11px]">Tin đang mở</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">
                  {channel.activeJobsCount}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5">
                <p className="text-slate-400 text-[11px]">Tổng ứng viên</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">
                  {channel.totalCandidates}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Publish Tracking Matrix Table (FR4) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Send size={18} className="text-cyan-600" />
            Ma trận Theo dõi Đăng tuyển trên Kênh (Publish Tracking Matrix - FR4)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Nhấp trực tiếp vào ô để chuyển đổi trạng thái bài đăng (`Published` ➔ `Draft`) cho từng vị trí
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-semibold">
                <th className="p-3.5 rounded-l-2xl">Vị trí Tuyển dụng</th>
                <th className="p-3.5">Phòng ban</th>
                <th className="p-3.5">Trạng thái Tin</th>
                {channels.map((ch) => (
                  <th key={ch.id} className="p-3.5 text-center">
                    {ch.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5 font-bold text-slate-900">
                    {job.title}
                  </td>
                  <td className="p-3.5 text-slate-500">{job.department}</td>
                  <td className="p-3.5 font-semibold text-slate-700">
                    {job.status}
                  </td>
                  {channels.map((ch) => {
                    const track = publishTracks.find(
                      (t) => t.jobId === job.id && t.channelId === ch.id
                    )
                    const isPublished = track?.status === 'Published'

                    return (
                      <td key={ch.id} className="p-3.5 text-center">
                        <button
                          onClick={() =>
                            togglePublishStatus(
                              job.id,
                              ch.id,
                              currentUser.name,
                              currentUser.id
                            )
                          }
                          className={`px-3 py-1.5 rounded-xl font-medium transition text-[11px] inline-flex items-center gap-1 ${
                            isPublished
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold shadow-sm'
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          <CheckCircle2
                            size={12}
                            className={
                              isPublished
                                ? 'text-emerald-600'
                                : 'text-slate-300'
                            }
                          />
                          {isPublished ? 'Published' : 'Draft'}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Channel */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingChannel ? 'Chỉnh sửa Kênh Tuyển dụng' : 'Thêm Kênh Tuyển dụng Mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tên Kênh đăng tuyển *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: LinkedIn, TopCV, CareerBuilder..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Loại danh mục
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none"
                  >
                    <option value="Social Media">Social Media</option>
                    <option value="Job Board">Job Board</option>
                    <option value="Company Website">Company Website</option>
                    <option value="Employee Referral">Employee Referral</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Trạng thái hoạt động
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none"
                  >
                    <option value="Active">Active (Hoạt động)</option>
                    <option value="Inactive">Inactive (Tạm ngưng)</option>
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
                  {editingChannel ? 'Cập nhật' : 'Thêm kênh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
