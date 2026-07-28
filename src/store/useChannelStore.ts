import { create } from 'zustand'
import { JobChannelPublishTrack, RecruitmentChannel } from '../types'
import {
  INITIAL_CHANNELS,
  INITIAL_PUBLISH_TRACKS,
} from '../services/mockData'
import { useAuditLogStore } from './useAuditLogStore'

interface ChannelStoreState {
  channels: RecruitmentChannel[]
  publishTracks: JobChannelPublishTrack[]
  togglePublishStatus: (
    jobId: string,
    channelId: string,
    userName?: string,
    userId?: string
  ) => void
  addChannel: (
    channel: Omit<
      RecruitmentChannel,
      'id' | 'activeJobsCount' | 'totalCandidates'
    >,
    userName?: string,
    userId?: string
  ) => void
  updateChannel: (
    id: string,
    updates: Partial<RecruitmentChannel>,
    userName?: string,
    userId?: string
  ) => void
  deleteChannel: (id: string, userName?: string, userId?: string) => void
}

export const useChannelStore = create<ChannelStoreState>((set) => ({
  channels: INITIAL_CHANNELS,
  publishTracks: INITIAL_PUBLISH_TRACKS,

  togglePublishStatus: (jobId, channelId, userName = 'System', userId = 'usr-1') =>
    set((state) => {
      const channel = state.channels.find((c) => c.id === channelId)
      const existing = state.publishTracks.find(
        (t) => t.jobId === jobId && t.channelId === channelId
      )

      const nextStatus = existing
        ? existing.status === 'Published'
          ? 'Draft'
          : 'Published'
        : 'Published'

      // Log Audit Event
      useAuditLogStore.getState().addLog({
        userId,
        userName,
        action: 'Publish Track',
        details: `Cập nhật trạng thái phát hành kênh ${channel?.name || channelId} thành ${nextStatus}`,
      })

      if (existing) {
        return {
          publishTracks: state.publishTracks.map((t) =>
            t.jobId === jobId && t.channelId === channelId
              ? {
                  ...t,
                  status: nextStatus,
                  publishedDate:
                    nextStatus === 'Published'
                      ? new Date().toISOString().split('T')[0]
                      : t.publishedDate,
                }
              : t
          ),
        }
      } else {
        const newTrack: JobChannelPublishTrack = {
          jobId,
          channelId,
          status: 'Published',
          publishedDate: new Date().toISOString().split('T')[0],
        }
        return { publishTracks: [...state.publishTracks, newTrack] }
      }
    }),

  addChannel: (channelData, userName = 'Admin', userId = 'usr-4') =>
    set((state) => {
      const newChannel: RecruitmentChannel = {
        ...channelData,
        id: `chn-${Date.now()}`,
        activeJobsCount: 0,
        totalCandidates: 0,
      }

      useAuditLogStore.getState().addLog({
        userId,
        userName,
        action: 'Add Channel',
        details: `Thêm kênh tuyển dụng mới: ${channelData.name} (${channelData.category})`,
      })

      return { channels: [...state.channels, newChannel] }
    }),

  updateChannel: (id, updates, userName = 'Admin', userId = 'usr-4') =>
    set((state) => {
      const channel = state.channels.find((c) => c.id === id)
      useAuditLogStore.getState().addLog({
        userId,
        userName,
        action: 'Update Channel',
        details: `Cập nhật cấu hình kênh tuyển dụng: ${channel?.name || id}`,
      })

      return {
        channels: state.channels.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      }
    }),

  deleteChannel: (id, userName = 'Admin', userId = 'usr-4') =>
    set((state) => {
      const channel = state.channels.find((c) => c.id === id)
      useAuditLogStore.getState().addLog({
        userId,
        userName,
        action: 'Delete Channel',
        details: `Xóa kênh tuyển dụng: ${channel?.name || id}`,
      })

      return {
        channels: state.channels.filter((c) => c.id !== id),
      }
    }),
}))
