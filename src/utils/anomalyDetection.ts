//累加后求均值
function mean(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0) / arr.length
}
//计算标准差
function std(arr: number[]): number {
    const avg = mean(arr)
    return Math.sqrt(arr.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / arr.length)
}

/**
 * 检测各部门近7天请假率异常（2σ原则）
 */
export function detectAnomaly(data: number[], windowSize: number = 7): boolean {
    if (data.length < windowSize) return false

    const window = data.slice(-windowSize)
    const avg = mean(window)
    const sigma = std(window)
    const latest = data[data.length - 1]

    // 超过 2σ 就是异常
    return Math.abs(latest - avg) > 2 * sigma
}

/**
 * 检测同一审批人连续驳回 ≥ threshold 次
 */
export function detectConsecutiveRejects(
    approvals: { approver: string; status: string }[],
    threshold: number = 3
): { approver: string; count: number }[] {
    const alerts: { approver: string; count: number }[] = []

    // 按审批人分组，保留顺序
    const byApprover: Record<string, string[]> = {}
    approvals.forEach(a => {
        if (!byApprover[a.approver]) byApprover[a.approver] = []
        byApprover[a.approver].push(a.status)
    })

    // 检测连续驳回
    Object.entries(byApprover).forEach(([approver, statuses]) => {
        let count = 0
        let maxCount = 0
        for (const status of statuses) {
            if (status === '已驳回') {
                count++
                maxCount = Math.max(maxCount, count)
            } else {
                count = 0
            }
        }
        if (maxCount >= threshold) {
            alerts.push({ approver, count: maxCount })
        }
    })

    return alerts
}