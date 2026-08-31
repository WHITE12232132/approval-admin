import { Navigate } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useUserStore()
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}
