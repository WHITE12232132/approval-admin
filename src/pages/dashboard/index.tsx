import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Chart } from '@/components/chart'

const quickStats = [
  { label: '待审批', value: '8', color: '#3b82f6', trend: '+12%', up: true },
  { label: '我发起的', value: '15', color: '#f59e42', trend: '+8%', up: true },
  { label: '已完成', value: '42', color: '#10b981', trend: '+25%', up: true },
  { label: '已驳回', value: '3', color: '#ef4444', trend: '-5%', up: false },
]

const monthlyData = {
  series: [{ name: '审批数量', data: [30, 40, 35, 50, 49, 70, 91, 60, 50, 55, 60, 65] }],
  categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
}

const pieData = {
  series: [25, 35, 20, 10],
  labels: ['请假', '报销', '采购', '通用'],
}

const recentApprovals = [
  { id: '1', title: '请假申请 - 张三', type: '请假', status: '待审批', time: '2024-01-15' },
  { id: '2', title: '报销申请 - 李四', type: '报销', status: '已完成', time: '2024-01-14' },
  { id: '3', title: '采购申请 - 王五', type: '采购', status: '待审批', time: '2024-01-13' },
  { id: '4', title: '请假申请 - 赵六', type: '请假', status: '已驳回', time: '2024-01-12' },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('全部')
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 顶部四个统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">{stat.label}</span>
                <span className="text-xs font-bold text-gray-400">{stat.trend}</span>
              </div>
              <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="w-full h-10">
                <Chart
                  type="bar"
                  height={40}
                  series={[{ data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 20)) }]}
                  options={{
                    chart: { sparkline: { enabled: true } },
                    colors: [stat.color],
                    grid: { show: false },
                    yaxis: { show: false },
                    tooltip: { enabled: false },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 月度趋势 + 审批类型分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold">审批趋势</span>
              <span className="flex items-center gap-1 text-green-500 font-bold text-sm">+5.44%</span>
            </div>
            <Chart
              type="area"
              height={280}
              series={monthlyData.series}
              options={{
                xaxis: { categories: monthlyData.categories },
                colors: ['#3b82f6'],
                fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0 } },
              }}
            />
          </CardContent>
        </Card>
        <Card className="flex flex-col p-6">
          <span className="text-sm font-semibold mb-4">审批类型分布</span>
          <div className="flex-1 flex flex-col items-center justify-center">
            <Chart
              type="donut"
              height={200}
              series={pieData.series}
              options={{
                labels: pieData.labels,
                colors: ['#3b82f6', '#f59e42', '#10b981', '#ef4444'],
                plotOptions: { pie: { donut: { size: '70%' } } },
              }}
            />
            <div className="w-full mt-4">
              {pieData.labels.map((label, i) => (
                <div key={label} className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ background: ['#3b82f6', '#f59e42', '#10b981', '#ef4444'][i] }} />
                    <span className="text-sm">{label}</span>
                  </div>
                  <span className="font-bold">{pieData.series[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* 最近审批列表 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold">最近审批</span>
            <div className="flex gap-2">
              {['全部', '待审批', '已完成', '已驳回'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                    activeTab === tab ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
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
              {recentApprovals.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 font-medium">{item.title}</td>
                  <td className="py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">{item.type}</span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.status === '待审批' ? 'bg-yellow-100 text-yellow-600' :
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
