import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Role = 'employee' | 'manager' | 'hr' | 'finance'

interface UserState {
  username: string
  role: Role
  isLoggedIn: boolean
  setUser: (username: string, role: Role) => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      username: '',
      role: 'employee',
      isLoggedIn: false,
      setUser: (username, role) => set({ username, role, isLoggedIn: true }),
      logout: () => set({ username: '', role: 'employee', isLoggedIn: false }),
    }),
    {
      name: 'user-storage', // localStorage key
    }
  )
)