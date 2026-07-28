import { create } from 'zustand'
import { User, UserRole } from '../types'
import { fetchFromApi } from '../services/api'

interface AuthStoreState {
  currentUser: User
  users: User[]
  isLoading: boolean
  fetchUsers: () => Promise<void>
  setCurrentUser: (user: User) => void
  addUser: (userData: Omit<User, 'id' | 'avatar'>) => Promise<void>
  updateUserRole: (userId: string, newRole: UserRole) => Promise<void>
}

const DEFAULT_USER: User = {
  id: 'usr-1',
  name: 'Nhật Trần',
  email: 'nhat.tran@thdcyber.vn',
  role: 'HR Recruiter',
  department: 'IT',
  avatar: 'NT',
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  currentUser: DEFAULT_USER,
  users: [DEFAULT_USER],
  isLoading: false,

  fetchUsers: async () => {
    set({ isLoading: true })
    const usersData = await fetchFromApi<User[]>('/users')
    if (usersData && usersData.length > 0) {
      set({
        users: usersData,
        currentUser: usersData.find((u) => u.id === get().currentUser.id) || usersData[0],
        isLoading: false,
      })
    } else {
      set({ isLoading: false })
    }
  },

  setCurrentUser: (user) => {
    set({ currentUser: user })
  },

  addUser: async (userData) => {
    const createdUser = await fetchFromApi<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })

    if (createdUser) {
      set((state) => ({ users: [...state.users, createdUser] }))
    }
  },

  updateUserRole: async (userId, newRole) => {
    const updatedUser = await fetchFromApi<User>(`/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role: newRole }),
    })

    if (updatedUser) {
      set((state) => ({
        users: state.users.map((u) => (u.id === userId ? updatedUser : u)),
        currentUser: state.currentUser.id === userId ? updatedUser : state.currentUser,
      }))
    }
  },
}))
