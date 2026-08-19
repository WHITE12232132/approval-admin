import { useState } from 'react'
// useLocation	获取当前 URL 信息
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Button, Avatar, Dropdown, theme } from 'antd'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    FileTextOutlined,
    UserOutlined,
    LogoutOutlined,
} from '@ant-design/icons'

// 解构出 顶部栏 侧边栏 内容区
const { Header, Sider, Content } = Layout

// 侧边栏数据
const menuItems = [
    {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: '数据看板',
    },
    {
        key: '/approval',
        icon: <FileTextOutlined />,
        label: '审批管理',
        children: [
            { key: '/approval', label: '审批列表' },
            { key: '/approval/create', label: '发起审批' },
        ],
    },
    {
        key: '/profile',
        icon: <UserOutlined />,
        label: '个人中心',
    },
]

export default function DashboardLayout() {
    //定义折叠状态
    const [collapsed, setCollapsed] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
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
                <div style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: collapsed ? 16 : 20,
                    fontWeight: 'bold',
                }}>
                    {collapsed ? '审批' : '审批管理系统'}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    defaultOpenKeys={['/approval']}
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                />
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
                            <span>管理员</span>
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