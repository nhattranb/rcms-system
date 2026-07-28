import React from 'react'
import { ShieldCheck, Terminal } from 'lucide-react'
import { useAuditLogStore } from '../store/useAuditLogStore'

export const AuditLogsPage: React.FC = () => {
  const { logs } = useAuditLogStore()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Nhật ký Hoạt động Hệ thống RCMS - Audit Logs
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tự động ghi vết hoạt động: Login, Create Job, Edit, Status Change, Publish & Send Email
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
            <Terminal size={16} className="text-cyan-600" />
            Nhật ký gần đây nhất ({logs.length} sự kiện)
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Tất cả dữ liệu được lưu vết tại đây.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-semibold">
                <th className="p-3.5 rounded-l-2xl">Thời gian</th>
                <th className="p-3.5">Người thực hiện</th>
                <th className="p-3.5">Hành động (Action)</th>
                <th className="p-3.5 rounded-r-2xl">Chi tiết thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-medium text-slate-500 font-mono text-[11px]">
                    {log.timestamp}
                  </td>
                  <td className="p-3.5 font-bold text-slate-900">
                    {log.userName}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        log.action.includes('Publish') || log.action.includes('Create')
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : log.action.includes('Login') || log.action.includes('Role')
                            ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                            : log.action.includes('Delete')
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-700">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
