import { mockApprovals } from '@/mock/approvals'
import { detectAnomaly } from './anomalyDetection'

interface AnomalyAlert {
    id: string
    department: string
    message: string
    type: 'warning' | 'danger'
    time: string
}

export function detectApprovals(): AnomalyAlert[] {
    const alerts: AnomalyAlert[] = []

    const byDepartment: Record<string, typeof mockApprovals> = {}
    mockApprovals.forEach((a) => {
        if (!byDepartment[a.department]) byDepartment[a.department] = []
        byDepartment[a.department].push(a)
    })

    Object.entries(byDepartment).forEach(([dept, approvals]) => {
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