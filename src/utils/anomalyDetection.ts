//累加后求均值
function mean(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0) / arr.length
}
//计算标准差
function std(arr: number[]): number {
    const avg = mean(arr)
    return Math.sqrt(arr.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / arr.length)
}

export function detectAnomaly(data: number[], windowSize: number = 7): boolean {
    if (data.length < windowSize) return false

    const window = data.slice(-windowSize)
    const avg = mean(window)
    const sigma = std(window)
    const latest = data[data.length - 1]

    // 超过 2σ 就是异常
    return Math.abs(latest - avg) > 2 * sigma
}