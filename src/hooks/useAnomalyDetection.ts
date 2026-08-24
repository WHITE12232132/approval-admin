import { useState } from 'react'
import { mockApprovals } from '@/mock/approvals'
import { detectAnomaly } from '@/utils/anomalyDetection'
//检查每个部门的请假数据，发现异常就生成预警。
function detectApprovals(): AnomalyAlert[] {
  const alerts: AnomalyAlert[] = []

  // 按部门分组
  const byDepartment: Record<string, typeof mockApprovals> = {}
  mockApprovals.forEach((a) => {
    if (!byDepartment[a.department]) byDepartment[a.department] = []
    byDepartment[a.department].push(a)
  })

  // 检测每个部门
  Object.entries(byDepartment).forEach(([dept, approvals]) => {
    // 统计每天的请假数
    const dailyCount: Record<string, number> = {}
    approvals.forEach((a) => {
      if (a.type === '请假') {
        dailyCount[a.date] = (dailyCount[a.date] || 0) + 1
      }
    })

    const counts = Object.values(dailyCount)
    if (detectAnomaly(counts)) {
      alerts.push({
        id: dept,
        department: dept,
        message: `${dept}近 7 天请假率异常偏高`,
        type: 'danger',
        time: new Date().toLocaleString(),
      })
    }
  })

  return alerts
}

interface AnomalyAlert {
    id: string
    department: string
    message: string
    type: 'warning' | 'danger'
    time: string
}

export function useAnomalyDetection() {
  const [alerts] = useState<AnomalyAlert[]>(() => detectApprovals())
  return { alerts }
}