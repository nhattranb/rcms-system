import { create } from 'zustand'
import { User, UserRole } from '../types'
import { fetchFromApi } from '../services/api'
import { INITIAL_USERS } from '../services/mockData'

interface AuthStoreState {
  currentUser: User
  users: User[]
  isLoading: boolean
  isAuthenticated: boolean
  fetchUsers: () => Promise<void>
  setCurrentUser: (user: User) => void
  addUser: (userData: Omit<User, 'id' | 'avatar'>) => Promise<void>
  updateUserRole: (userId: string, newRole: UserRole) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const DEFAULT_USER: User = INITIAL_USERS[0]

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  currentUser: DEFAULT_USER,
  users: INITIAL_USERS,
  isLoading: false,
  isAuthenticated: false,

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
    set({ currentUser: user, isAuthenticated: true })
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

  login: async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase()
    const matchedUser = get().users.find((user) => user.email.toLowerCase() === normalizedEmail)

    if (!matchedUser) {
      throw new Error('Email không tồn tại trong hệ thống demo.')
    }

    if (password !== 'rcms2026!') {
      throw new Error('Mật khẩu không đúng. Vui lòng thử mật khẩu demo: rcms2026!.')
    }

    set({ currentUser: matchedUser, isAuthenticated: true })
  },

  logout: () => {
    set({ isAuthenticated: false, currentUser: DEFAULT_USER })
  },
}))
