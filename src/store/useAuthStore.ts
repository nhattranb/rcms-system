import { create } from 'zustand'
import { User, UserRole } from '../types'
import { INITIAL_USERS } from '../services/mockData'
import { useAuditLogStore } from './useAuditLogStore'

interface AuthStoreState {
  currentUser: User
  users: User[]
  setCurrentUser: (user: User) => void
  addUser: (userData: Omit<User, 'id' | 'avatar'>) => void
  updateUserRole: (userId: string, newRole: UserRole) => void
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  currentUser: INITIAL_USERS[0], // Default: Nhật Trần (HR Recruiter)
  users: INITIAL_USERS,

  setCurrentUser: (user) => {
    useAuditLogStore.getState().addLog({
      userId: user.id,
      userName: user.name,
      action: 'Login / Switch Role',
      details: `Chuyển người dùng sang ${user.name} (Vai trò: ${user.role})`,
    })
    set({ currentUser: user })
  },

  addUser: (userData) =>
    set((state) => {
      const avatar = userData.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()

      const newUser: User = {
        ...userData,
        id: `usr-${Date.now()}`,
        avatar,
      }

      useAuditLogStore.getState().addLog({
        userId: state.currentUser.id,
        userName: state.currentUser.name,
        action: 'Create User',
        details: `Tạo tài khoản người dùng mới: ${userData.name} (${userData.role})`,
      })

      return { users: [...state.users, newUser] }
    }),

  updateUserRole: (userId, newRole) =>
    set((state) => {
      const user = state.users.find((u) => u.id === userId)
      useAuditLogStore.getState().addLog({
        userId: state.currentUser.id,
        userName: state.currentUser.name,
        action: 'Update Role',
        details: `Thay đổi vai trò người dùng ${user?.name} sang ${newRole}`,
      })

      return {
        users: state.users.map((u) =>
          u.id === userId ? { ...u, role: newRole } : u
        ),
      }
    }),
}))
