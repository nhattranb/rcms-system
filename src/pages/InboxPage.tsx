import React, { useEffect, useState } from 'react'
import { CheckCheck, Mail, Send, User } from 'lucide-react'
import { EmailLog } from '../types'
import { useAuthStore } from '../store/useAuthStore'
import { fetchFromApi } from '../services/api'

const EMAIL_TEMPLATES = [
  {
    name: 'Mẫu Lịch phỏng vấn Vòng 1',
    content:
      'Chào bạn,\n\nBộ phận HR xin gửi lời mời phỏng vấn vòng 1 vị trí tuyển dụng vào lúc 14h00 ngày 30/07/2026 tại văn phòng THD Cyber Security...\n\nTrân trọng,',
  },
  {
    name: 'Mẫu Thư cảm ơn nộp CV',
    content:
      'Chào bạn,\n\nCảm ơn bạn đã quan tâm và nộp hồ sơ ứng tuyển vào công ty chúng tôi. HR đã nhận được CV và sẽ liên hệ lại trong vòng 3 ngày làm việc...\n\nTrân trọng,',
  },
  {
    name: 'Mẫu Thư Đề xuất Nhận việc (Offer Letter)',
    content:
      'Chào bạn,\n\nChúc mừng bạn! Công ty trân trọng gửi lời mời nhận việc vị trí tuyển dụng với mức lương và đãi ngộ như thảo luận...\n\nTrân trọng,',
  },
]

export const InboxPage: React.FC = () => {
  const { currentUser } = useAuthStore()
  const [emails, setEmails] = useState<EmailLog[]>([])
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    async function loadEmails() {
      const data = await fetchFromApi<EmailLog[]>('/emails')
      if (data && data.length > 0) {
        setEmails(data)
        setSelectedEmail(data[0])
      }
    }
    loadEmails()
  }, [])

  const handleSelectTemplate = (templateContent: string) => {
    setReplyText(templateContent)
  }

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || !selectedEmail) return

    const newEmailData = {
      jobId: selectedEmail.jobId,
      jobTitle: selectedEmail.jobTitle,
      sender: `${currentUser.name} (${currentUser.role})`,
      recipient: selectedEmail.sender,
      recipientEmail: selectedEmail.recipientEmail,
      topic: `Re: ${selectedEmail.topic}`,
      content: replyText,
      status: 'Sent',
      actorId: currentUser.id,
    }

    const createdEmail = await fetchFromApi<EmailLog>('/emails', {
      method: 'POST',
      body: JSON.stringify(newEmailData),
    })

    if (createdEmail) {
      setEmails([createdEmail, ...emails])
      setSelectedEmail(createdEmail)
    }
    setReplyText('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Hộp thư & Tích hợp Email Trao đổi Ứng viên (FR9 - Live DB)
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Gửi email trực tiếp cho ứng viên, xem lịch sử email từ PostgreSQL database và tự động ghi log
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Email List Column */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Hộp thư ({emails.length})
            </h3>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              PostgreSQL Connected
            </span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {emails.map((email) => (
              <div
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className={`p-3.5 rounded-2xl cursor-pointer transition border text-xs ${
                  selectedEmail?.id === email.id
                    ? 'bg-cyan-50/90 border-cyan-300 text-cyan-900 font-semibold shadow-sm'
                    : 'bg-slate-50/70 border-slate-100 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <User size={13} className="text-slate-400" />
                    {email.sender}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {email.time}
                  </span>
                </div>
                <p className="font-medium mt-1 truncate">{email.topic}</p>
                <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-slate-400">
                  <span className="truncate max-w-[160px]">
                    Job: {email.jobTitle || 'General'}
                  </span>
                  <span
                    className={`font-semibold ${
                      email.status === 'Replied'
                        ? 'text-emerald-600'
                        : 'text-slate-500'
                    }`}
                  >
                    {email.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail & Reply Column */}
        {selectedEmail ? (
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-800">
                    {selectedEmail.jobTitle || 'Tin tuyển dụng'}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCheck size={16} /> Trạng thái: {selectedEmail.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-3">
                  {selectedEmail.topic}
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                  <span>
                    Từ: <strong>{selectedEmail.sender}</strong> (
                    {selectedEmail.recipientEmail})
                  </span>
                  <span>Thời gian: {selectedEmail.time}</span>
                </div>
              </div>

              {/* Email Message Content */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 text-xs text-slate-800 leading-relaxed min-h-[160px] whitespace-pre-line border border-slate-100">
                {selectedEmail.content}
              </div>
            </div>

            {/* Quick Reply & Template Selection */}
            <form
              onSubmit={handleSendReply}
              className="space-y-3 border-t border-slate-100 pt-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Mail size={14} className="text-cyan-600" /> Soạn email gửi ứng viên:
                </h4>
                {/* Template selector */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-400 font-medium">Mẫu nhanh:</span>
                  <select
                    onChange={(e) => {
                      if (e.target.value) handleSelectTemplate(e.target.value)
                    }}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 outline-none"
                  >
                    <option value="">-- Chọn Mẫu Email --</option>
                    {EMAIL_TEMPLATES.map((tmpl, idx) => (
                      <option key={idx} value={tmpl.content}>
                        {tmpl.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Nhập nội dung thư phản hồi ứng viên..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs outline-none focus:border-cyan-500 focus:bg-white"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">
                  Gửi từ tài khoản: <strong>{currentUser.email}</strong>
                </span>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-5 py-2 text-xs font-semibold text-white hover:bg-cyan-700 shadow-md transition"
                >
                  <Send size={14} /> Gửi Email Phản hồi (PostgreSQL DB)
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-400 text-xs">
            Chưa chọn email nào
          </div>
        )}
      </div>
    </div>
  )
}
