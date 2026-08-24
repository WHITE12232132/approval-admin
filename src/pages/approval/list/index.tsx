import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'
import { useMemo } from 'react'

const tabs = ['全部', '待审批', '我发起的', '已完成']

const mockData = Array.from({ length: 1000 }, (_, i) => ({
  id: String(i + 1),
  title: `审批申请 - 用户${i + 1}`,
  type: ['请假', '报销', '采购', '通用'][i % 4],
  status: ['待审批', '已完成', '已驳回'][i % 3],
  time: `2024-01-${String((i % 28) + 1).padStart(2, '0')}`,
}))



export default function ApprovalList() {
  const [activeTab, setActiveTab] = useState('全部')
  const navigate = useNavigate()
  const parentRef = useRef<HTMLDivElement>(null)

  const options = useMemo(() => ({
    count: mockData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  }), [])
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer(options)

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
          <div
            ref={parentRef}
            className="h-[400px] overflow-auto"
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const item = mockData[virtualRow.index]
                return (
                  <div
                    key={item.id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="flex items-center border-b hover:bg-gray-50 px-4"
                  >
                    <div className="flex-1 text-sm font-medium">{item.title}</div>
                    <div className="w-20">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">{item.type}</span>
                    </div>
                    <div className="w-20">
                      <span className={`px-2 py-1 text-xs rounded-full ${item.status === '待审批' ? 'bg-yellow-100 text-yellow-600' :
                        item.status === '已完成' ? 'bg-green-100 text-green-600' :
                          'bg-red-100 text-red-600'
                        }`}>{item.status}</span>
                    </div>
                    <div className="w-24 text-sm text-gray-500">{item.time}</div>
                    <div className="w-16 text-right">
                      <button
                        onClick={() => navigate(`/approval/detail/${item.id}`)}
                        className="text-violet-600 hover:underline text-sm"
                      >
                        查看
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>


        </CardContent>
      </Card>
    </div>
  )
}
