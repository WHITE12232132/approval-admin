import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, message, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

const { Title } = Typography

interface LoginForm {
  username: string
  password: string
}

// 模拟登录（后续替换为真实 API）
const mockLogin = (data: LoginForm): Promise<{ token: string; username: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.username === 'admin' && data.password === '123456') {
        resolve({ token: 'mock-jwt-token-xxx', username: '管理员' })
      } else {
        reject(new Error('用户名或密码错误'))
      }
    }, 800)
  })
}

export default function Login() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (values: LoginForm) => {
    setLoading(true)
    try {
      const result = await mockLogin(values)
      // 存储 token 和用户信息
      localStorage.setItem('token', result.token)
      localStorage.setItem('username', result.username)
      message.success('登录成功')
      navigate('/dashboard')
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : '登录失败'
      message.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card style={{ width: 400, borderRadius: 8 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={3} style={{ margin: 0 }}>审批管理系统</Title>
          <div style={{ color: '#999', marginTop: 8 }}>企业内部审批平台</div>
        </div>

        <Form
          name="login"
          onFinish={handleSubmit}
          size="large"
          initialValues={{ username: 'admin', password: '123456' }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名：admin"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码：123456"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', color: '#999', fontSize: 12 }}>
          测试账号：admin / 123456
        </div>
      </Card>
    </div>
  )
}
