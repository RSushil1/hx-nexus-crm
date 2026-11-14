import {
  ResponsiveContainer,
  AreaChart as RechartsArea,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface AreaChartProps {
  data: { date: string; balance: number; [key: string]: any }[]
  dataKey?: string
  color?: string
  height?: number
  currency?: string
}

export function AreaChart({
  data,
  dataKey = 'balance',
  color = '#F59E0B',
  height = 220,
  currency = 'USD',
}: AreaChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsArea data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#202229" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#64748B"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#202229' }}
            tickFormatter={(val) => {
              const d = new Date(val)
              return isNaN(d.getTime()) ? val : `${d.getMonth() + 1}/${d.getDate()}`
            }}
          />
          <YAxis
            stroke="#64748B"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => formatCurrency(val, currency, true)}
            domain={['auto', 'auto']}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-card-bg border border-card-border p-2.5 rounded-lg shadow-xl text-xs flex flex-col gap-1">
                    <span className="text-text-muted">{label}</span>
                    <span className="text-accent font-bold text-sm">
                      {formatCurrency(payload[0].value as number, currency)}
                    </span>
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#grad-${dataKey})`}
          />
        </RechartsArea>
      </ResponsiveContainer>
    </div>
  )
}
