import ReactApexChart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'

interface ChartProps {
  type: 'line' | 'bar' | 'area' | 'donut' | 'pie' | 'radialBar'
  height?: number | string
  series: ApexOptions['series']
  options?: ApexOptions
}

export function Chart({ type, height = 350, series, options = {} }: ChartProps) {
  const defaultOptions: ApexOptions = {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: true, speed: 200 },
    },
    stroke: { width: 2.5, curve: 'smooth' },
    grid: { strokeDashArray: 3, borderColor: '#f1f1f1' },
    dataLabels: { enabled: false },
    xaxis: { axisBorder: { show: false }, axisTicks: { show: false } },
    tooltip: { theme: 'light' },
    legend: { show: false },
  }

  const mergedOptions = { ...defaultOptions, ...options }

  return (
    <div className="w-full">
      <ReactApexChart type={type} height={height} series={series} options={mergedOptions} />
    </div>
  )
}

export function useChart(options: ApexOptions): ApexOptions {
  return options
}
