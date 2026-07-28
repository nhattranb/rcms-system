import { create } from 'zustand'
import { JobChannelPublishTrack, RecruitmentChannel } from '../types'
import { fetchFromApi } from '../services/api'

interface ChannelStoreState {
  channels: RecruitmentChannel[]
  publishTracks: JobChannelPublishTrack[]
  isLoading: boolean
  fetchChannelsAndTracks: () => Promise<void>
  togglePublishStatus: (
    jobId: string,
    channelId: string,
    userName?: string,
    userId?: string
  ) => Promise<void>
  addChannel: (
    channel: Omit<
      RecruitmentChannel,
      'id' | 'activeJobsCount' | 'totalCandidates'
    >,
    userName?: string,
    userId?: string
  ) => Promise<void>
  updateChannel: (
    id: string,
    updates: Partial<RecruitmentChannel>,
    userName?: string,
    userId?: string
  ) => Promise<void>
  deleteChannel: (id: string, userName?: string, userId?: string) => Promise<void>
}

export const useChannelStore = create<ChannelStoreState>((set) => ({
  channels: [],
  publishTracks: [],
  isLoading: false,

  fetchChannelsAndTracks: async () => {
    set({ isLoading: true })
    const channelsData = await fetchFromApi<RecruitmentChannel[]>('/channels')
    const tracksData = await fetchFromApi<JobChannelPublishTrack[]>('/publish-tracks')

    set({
      channels: channelsData || [],
      publishTracks: tracksData || [],
      isLoading: false,
    })
  },

  togglePublishStatus: async (jobId, channelId, userName = 'System', userId = 'usr-1') => {
    const updatedTrack = await fetchFromApi<JobChannelPublishTrack>(
      '/publish-tracks/toggle',
      {
        method: 'POST',
        body: JSON.stringify({ jobId, channelId, actorName: userName, actorId: userId }),
      }
    )

    if (updatedTrack) {
      set((state) => {
        const exists = state.publishTracks.some(
          (t) => t.jobId === jobId && t.channelId === channelId
        )
        if (exists) {
          return {
            publishTracks: state.publishTracks.map((t) =>
              t.jobId === jobId && t.channelId === channelId ? updatedTrack : t
            ),
          }
        } else {
          return { publishTracks: [...state.publishTracks, updatedTrack] }
        }
      })
    }
  },

  addChannel: async (channelData, userName = 'Admin', userId = 'usr-4') => {
    const createdChannel = await fetchFromApi<RecruitmentChannel>('/channels', {
      method: 'POST',
      body: JSON.stringify({ ...channelData, actorName: userName, actorId: userId }),
    })

    if (createdChannel) {
      set((state) => ({ channels: [...state.channels, createdChannel] }))
    }
  },

  updateChannel: async (id, updates, userName = 'Admin', userId = 'usr-4') => {
    const updatedChannel = await fetchFromApi<RecruitmentChannel>(`/channels/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...updates, actorName: userName, actorId: userId }),
    })

    if (updatedChannel) {
      set((state) => ({
        channels: state.channels.map((c) => (c.id === id ? updatedChannel : c)),
      }))
    }
  },

  deleteChannel: async (id) => {
    await fetchFromApi(`/channels/${id}`, { method: 'DELETE' })
    set((state) => ({ channels: state.channels.filter((c) => c.id !== id) }))
  },
}))
