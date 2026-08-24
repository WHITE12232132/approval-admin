import { useUserStore } from '@/store/userStore'
import { Card, CardContent } from '@/components/ui/card'

export default function Profile() {
  const { username, role } = useUserStore()

  return (
    <div className="flex flex-col gap-4 w-full">
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold mb-4">个人中心</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center text-2xl text-violet-600">
              {username?.charAt(0) || '用户'}
            </div>
            <div>
              <p className="text-lg font-medium">{username}</p>
              <p className="text-sm text-gray-500">{role}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-sm font-medium text-gray-500 mb-3">基本信息</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400">用户名</p>
              <p className="text-sm">{username}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">角色</p>
              <p className="text-sm">{role}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">部门</p>
              <p className="text-sm">技术部</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">入职时间</p>
              <p className="text-sm">2024-01-01</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}