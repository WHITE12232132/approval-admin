import { useState } from 'react'
// useLocation	获取当前 URL 信息
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Button, Avatar, Dropdown, theme } from 'antd'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LogoutOutlined,
} from '@ant-design/icons'
import { useUserStore } from '@/store/userStore'
// 解构出 顶部栏 侧边栏 内容区
const { Header, Sider, Content } = Layout

// 侧边栏数据


const menuConfig: Record<string, { path: string; label: string; icon: string }[]> = {
    employee: [
        { path: '/dashboard', label: '数据看板', icon: '📊' },
        { path: '/approval', label: '我的审批', icon: '📋' },
        { path: '/approval/create', label: '发起审批', icon: '➕' },
        { path: '/profile', label: '个人中心', icon: '👤' },
    ],
    manager: [
        { path: '/dashboard', label: '数据看板', icon: '📊' },
        { path: '/approval', label: '审批管理', icon: '📋' },
        { path: '/approval/create', label: '发起审批', icon: '➕' },
        { path: '/profile', label: '个人中心', icon: '👤' },
    ],
    hr: [
        { path: '/dashboard', label: '数据看板', icon: '📊' },
        { path: '/approval', label: '审批管理', icon: '📋' },
        { path: '/approval/create', label: '发起审批', icon: '➕' },
        { path: '/profile', label: '个人中心', icon: '👤' },
    ],
    finance: [
        { path: '/dashboard', label: '数据看板', icon: '📊' },
        { path: '/approval', label: '审批管理', icon: '📋' },
        { path: '/profile', label: '个人中心', icon: '👤' },
    ],
}

export default function DashboardLayout() {
    const { role, username } = useUserStore()
    //定义折叠状态
    const [collapsed, setCollapsed] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const menuItems = menuConfig[role] || menuConfig.employee
    //ant design 主题颜色token
    const { token } = theme.useToken()

    // 用户下拉菜单数据
    const userMenuItems = [
        { key: 'profile', icon: <UserOutlined />, label: '个人中心' },
        { key: 'logout', icon: <LogoutOutlined />, label: '退出登录' },
    ]

    //点击回调函数
    const handleUserMenuClick = ({ key }: { key: string }) => {
        if (key === 'logout') {
            localStorage.removeItem('token')
            navigate('/login')
        } else if (key === 'profile') {
            navigate('/profile')
        }
    }

    return (
        // 100vh = 视口高度的 100%  Ant Design定义layout里  flex-direction: row
        <Layout style={{ minHeight: '100vh' }}>
            {/* 侧边栏按钮默认不隐藏，允许折叠 绑定折叠布尔值到变量 */}
            <Sider trigger={null} collapsible collapsed={collapsed}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-center text-white font-bold">
                    {collapsed ? '审批' : '审批管理系统'}
                </div>
                {/* 菜单 */}
                <div className="flex flex-col gap-1 px-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${location.pathname === item.path
                                    ? 'bg-violet-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-700'
                                }`}
                        >
                            <span>{item.icon}</span>
                            {!collapsed && <span>{item.label}</span>}
                        </button>
                    ))}
                </div>
            </Sider>

            {/* 右侧内容 */}
            <Layout>
                {/* 顶栏 */}
                <Header style={{
                    padding: '0 24px',
                    background: token.colorBgContainer,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <Button
                        // 无边框按钮，只显示图标
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                    />
                    <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }}>
                        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Avatar icon={<UserOutlined />} />
                            <span>{username}</span>
                        </div>
                    </Dropdown>
                </Header>

                {/* 内容区 */}
                <Content style={{ margin: 24, padding: 24, background: token.colorBgContainer, borderRadius: 8 }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}