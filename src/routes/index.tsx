import { createBrowserRouter, Navigate } from 'react-router-dom'
// 导入页面组件（先写占位，后面再改）
import Login from '@/pages/login'
import Dashboard from '@/pages/dashboard'
import ApprovalList from '@/pages/approval/list'
import ApprovalCreate from '@/pages/approval/create'
import ApprovalDetail from '@/pages/approval/detail'
import Profile from '@/pages/profile'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  // 嵌套路由。path: '/' 是父路由，children 里的子路由会渲染在父路由的 <Outlet /> 
  {
    path: '/',
    element: <div>布局组件（待实现）</div>,
    children: [
      // 默认路由，并重定向不可回退。
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      {
        path: 'approval',
        children: [
          { index: true, element: <ApprovalList /> },
          { path: 'create', element: <ApprovalCreate /> },
          { path: 'detail/:id', element: <ApprovalDetail /> },
        ],
      },
      { path: 'profile', element: <Profile /> },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
])

export default router