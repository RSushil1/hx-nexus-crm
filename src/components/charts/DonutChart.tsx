import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface DonutSegment {
  name: string
  value: number
  color: string
}

interface DonutChartProps {
  data: DonutSegment[]
  centerLabel?: string
  centerValue?: string
  height?: number
  currency?: string
}

export function DonutChart({
  data,
  centerLabel = 'Total',
  centerValue,
  height = 200,
  currency = 'USD',
}: DonutChartProps) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0)
  const displayVal = centerValue || formatCurrency(total, currency, true)

  return (
    <div className="relative flex items-center justify-center" style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as DonutSegment
                const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0'
                return (
                  <div className="bg-card-bg border border-card-border p-2.5 rounded-lg shadow-xl text-xs flex flex-col gap-1">
                    <span className="font-semibold text-text-primary">{item.name}</span>
                    <span className="text-accent font-bold">
                      {formatCurrency(item.value, currency)} ({pct}%)
                    </span>
                  </div>
                )
              }
              return null
            }}
          />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="65%"
            outerRadius="85%"
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xs text-text-muted">{centerLabel}</span>
        <span className="text-base font-bold text-text-primary tabular-nums">{displayVal}</span>
      </div>
    </div>
  )
}
