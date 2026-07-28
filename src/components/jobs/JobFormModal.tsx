import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { JobPosting } from '../../types'
import { useAuthStore } from '../../store/useAuthStore'

const jobSchema = z.object({
  title: z
    .string()
    .min(3, 'Tên vị trí phải có ít nhất 3 ký tự')
    .max(100, 'Tên vị trí quá dài'),
  department: z.string().min(1, 'Vui lòng chọn phòng ban'),
  location: z.string().min(2, 'Địa điểm không được để trống'),
  type: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship']),
  description: z
    .string()
    .min(10, 'Mô tả công việc phải có ít nhất 10 ký tự'),
  experience: z.string().optional(),
  skills: z.string().optional(),
  english: z.string().optional(),
  education: z.string().optional(),
  note: z.string().optional(),
  expiryDate: z.string().min(1, 'Vui lòng chọn ngày hết hạn'),
})

export type JobFormData = z.infer<typeof jobSchema>

interface JobFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitJob: (data: JobFormData, isDraft: boolean) => void
  editingJob?: JobPosting | null
}

export const JobFormModal: React.FC<JobFormModalProps> = ({
  isOpen,
  onClose,
  onSubmitJob,
  editingJob,
}) => {
  const { currentUser } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: editingJob?.title || '',
      department: editingJob?.department || 'IT',
      location: editingJob?.location || 'TP. Hồ Chí Minh',
      type: editingJob?.type || 'Full-time',
      description: editingJob?.description || '',
      experience: editingJob?.experience || '',
      skills: editingJob?.skills || '',
      english: editingJob?.english || '',
      education: editingJob?.education || '',
      note: editingJob?.note || '',
      expiryDate: editingJob?.expiryDate || '2026-08-30',
    },
  })

  React.useEffect(() => {
    if (editingJob) {
      reset({
        title: editingJob.title,
        department: editingJob.department,
        location: editingJob.location,
        type: editingJob.type,
        description: editingJob.description,
        experience: editingJob.experience || '',
        skills: editingJob.skills || '',
        english: editingJob.english || '',
        education: editingJob.education || '',
        note: editingJob.note || '',
        expiryDate: editingJob.expiryDate || '2026-08-30',
      })
    } else {
      reset({
        title: '',
        department: 'IT',
        location: 'TP. Hồ Chí Minh',
        type: 'Full-time',
        description: '',
        experience: '',
        skills: '',
        english: '',
        education: '',
        note: '',
        expiryDate: '2026-08-30',
      })
    }
  }, [editingJob, reset])

  if (!isOpen) return null

  const handleSave = (data: JobFormData, isDraft: boolean) => {
    onSubmitJob(data, isDraft)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {editingJob ? 'Chỉnh sửa Tin tuyển dụng (FR2)' : 'Tạo mới Vị trí Tuyển dụng (FR2)'}
            </h3>
            <p className="text-xs text-slate-500">
              Người tạo: <strong>{currentUser.name}</strong> ({currentUser.role})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-xl"
          >
            <X size={20} />
          </button>
        </div>

        <form className="space-y-4 text-xs">
          {/* Job Title */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tên vị trí tuyển dụng (Job Title) *
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder="Ví dụ: Senior Backend Engineer"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-cyan-500 focus:bg-white"
            />
            {errors.title && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Department, Location & Type */}
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Phòng ban (Department) *
              </label>
              <select
                {...register('department')}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-cyan-500"
              >
                <option value="IT">IT (Công nghệ Thông tin)</option>
                <option value="HR">HR (Nhân sự)</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Tài chính - Kế toán</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Địa điểm (Location) *
              </label>
              <input
                type="text"
                {...register('location')}
                placeholder="TP. Hồ Chí Minh / Hà Nội"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-cyan-500"
              />
              {errors.location && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Hình thức (Employment Type)
              </label>
              <select
                {...register('type')}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-cyan-500"
              >
                <option value="Full-time">Full-time (Toàn thời gian)</option>
                <option value="Part-time">Part-time (Bán thời gian)</option>
                <option value="Contract">Contract (Hợp đồng)</option>
                <option value="Internship">Internship (Thực tập)</option>
              </select>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Mô tả công việc (Job Description) *
            </label>
            <textarea
              rows={3}
              {...register('description')}
              placeholder="Nhập chi tiết nhiệm vụ và trách nhiệm công việc..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-cyan-500"
            />
            {errors.description && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Experience & Skills */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Yêu cầu Kinh nghiệm (Experience)
              </label>
              <input
                type="text"
                {...register('experience')}
                placeholder="Ví dụ: Từ 3 năm kinh nghiệm lập trình Backend"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kỹ năng chuyên môn (Skills)
              </label>
              <input
                type="text"
                {...register('skills')}
                placeholder="SQL, NoSQL, Microservices, Docker..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* English, Education & Expiry Date */}
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Trình độ Tiếng Anh
              </label>
              <input
                type="text"
                {...register('english')}
                placeholder="Đọc hiểu tốt / Giao tiếp trôi chảy"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Bằng cấp (Education)
              </label>
              <input
                type="text"
                {...register('education')}
                placeholder="Cử nhân CNTT hoặc tương đương"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Hạn nhận hồ sơ (Expiry Date) *
              </label>
              <input
                type="date"
                {...register('expiryDate')}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-cyan-500"
              />
              {errors.expiryDate && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">
                  {errors.expiryDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Note / Additional preferences */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Ghi chú / Ưu tiên tuyển dụng (Note)
            </label>
            <input
              type="text"
              {...register('note')}
              placeholder="Ưu tiên ứng viên có chứng chỉ AWS/Azure..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-cyan-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleSubmit((data) => handleSave(data, true))}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Lưu dưới dạng Bản nháp (Draft)
            </button>
            <button
              type="button"
              onClick={handleSubmit((data) => handleSave(data, false))}
              className="rounded-2xl bg-cyan-600 px-5 py-2.5 font-semibold text-white hover:bg-cyan-700 shadow-md transition"
            >
              Gửi phê duyệt (Submit Approval)
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
