import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'

const tabs = ['全部', '待审批', '我发起的', '已完成']

const mockData = [
  { id: '1', title: '请假申请 - 张三', type: '请假', status: '待审批', time: '2024-01-15' },
  { id: '2', title: '报销申请 - 李四', type: '报销', status: '已完成', time: '2024-01-14' },
  { id: '3', title: '采购申请 - 王五', type: '采购', status: '待审批', time: '2024-01-13' },
  { id: '4', title: '请假申请 - 赵六', type: '请假', status: '已驳回', time: '2024-01-12' },
]



export default function ApprovalList() {
  const [activeTab, setActiveTab] = useState('全部')
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-4 w-full">
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${activeTab === tab
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button
              onClick={() => navigate('/approval/create')}
              className="px-4 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700"
            >
              + 发起审批
            </button>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="搜索审批标题..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="py-3 font-medium">标题</th>
                <th className="py-3 font-medium">类型</th>
                <th className="py-3 font-medium">状态</th>
                <th className="py-3 font-medium">时间</th>
                <th className="py-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 font-medium">{item.title}</td>
                  <td className="py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">{item.type}</span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${item.status === '待审批' ? 'bg-yellow-100 text-yellow-600' :
                      item.status === '已完成' ? 'bg-green-100 text-green-600' :
                        'bg-red-100 text-red-600'
                      }`}>{item.status}</span>
                  </td>
                  <td className="py-3 text-gray-500">{item.time}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => navigate(`/approval/detail/${item.id}`)}
                      className="text-violet-600 hover:underline"
                    >
                      查看
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          

        </CardContent>
      </Card>
    </div>
  )
}
