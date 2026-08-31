import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '@/layouts/DashboardLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Login from '@/pages/login'
import Dashboard from '@/pages/dashboard'
import ApprovalList from '@/pages/approval/list'
import ApprovalCreate from '@/pages/approval/create'
import ApprovalDetail from '@/pages/approval/detail'
import Profile from '@/pages/profile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="approval" element={<ApprovalList />} />
          <Route path="approval/create" element={<ApprovalCreate />} />
          <Route path="approval/detail/:id" element={<ApprovalDetail />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App