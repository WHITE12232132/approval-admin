import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { useUserStore } from '@/store/userStore'

interface LoginForm {
  username: string
  password: string
}


const roleMap: Record<string, { username: string; role: 'employee' | 'manager' | 'hr' | 'finance' }> = {
  admin: { username: '张三', role: 'employee' },
  manager: { username: '李经理', role: 'manager' },
  hr: { username: '王HR', role: 'hr' },
  finance: { username: '赵财务', role: 'finance' },
}

const mockLogin = (data: LoginForm): Promise<{ token: string; username: string; role: 'employee' | 'manager' | 'hr' | 'finance' }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = roleMap[data.username]
      if (user && data.password === '123456') {
        resolve({ token: 'mock-jwt-token-xxx', username: user.username, role: user.role })
      } else {
        reject(new Error('用户名或密码错误'))
      }
    }, 800)
  })
}

export default function Login() {

  const { setUser } = useUserStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<LoginForm>({ username: '', password: '' })
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await mockLogin(form)
      localStorage.setItem('token', result.token)
      localStorage.setItem('username', result.username)
      setUser(result.username, result.role)
      navigate('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '登录失败'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600">
      <Card className="w-[400px]">
        <CardContent>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">审批管理系统</h1>
            <p className="text-gray-500 mt-2">企业内部审批平台</p>
          </div>
          {/* 按钮触发函数 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="请输入用户名"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="请输入密码"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <div className="text-center text-gray-400 text-xs mt-4 space-y-1">
            <p>测试账号（密码均为 123456）：</p>
            <p>admin → 员工 | manager → 经理 | hr → HR | finance → 财务</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
