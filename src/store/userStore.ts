import { create } from 'zustand'

type Role = 'employee' | 'manager' | 'hr' | 'finance'

interface UserState {
  username: string
  role: Role
  isLoggedIn: boolean
  setUser: (username: string, role: Role) => void
  logout: () => void
}
//  create 这个函数内部： 1. 创建了 set 函数  2. 把 set 作为参数，传给回调函数
export const useUserStore = create<UserState>((set) => ({
  username: '',
  role: 'employee',
  isLoggedIn: false,
  setUser: (username, role) => set({ username, role, isLoggedIn: true }),
  logout: () => set({ username: '', role: 'employee', isLoggedIn: false }),
}))