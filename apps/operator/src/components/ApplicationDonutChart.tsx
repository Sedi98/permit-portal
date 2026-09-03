"use client"

import * as React from "react"
import { Pie, PieChart } from "recharts"

import { Card } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

type DonutData = {
  category: string
  value: number
  percentage: number
  fill: string
}

const chartConfig = {} satisfies ChartConfig

type DonutTooltipProps = {
  active?: boolean
  payload?: { payload: DonutData }[]
}

function DonutTooltip({ active, payload }: DonutTooltipProps) {
  if (!active || !payload?.length) return null

  const item = payload[0].payload
  const pct = item.percentage.toFixed(1)

  return (
    <div className="bg-white border z-50 border-[#dfdfdf] rounded-lg px-[17px] py-[13px] shadow-[0px_0px_16px_rgba(0,0,0,0.1)] flex flex-col gap-[10px] min-w-[200px]">
      <div className="flex items-center gap-[10px]">
        <div
          className="rounded-[4.5px] size-[9px] shrink-0"
          style={{ backgroundColor: item.fill }}
        />
        <span className="text-sm font-medium leading-5 text-[#797979] whitespace-nowrap">
          {item.category}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm leading-5">
        <span className="font-bold text-[#286aa6]">{pct}%</span>
        <span className="font-semibold text-[#797979]">{item.value} müraciət</span>
      </div>
    </div>
  )
}

type ApplicationDonutChartProps = {
  data?: DonutData[]
  totalLabel?: string
  className?: string
}

export default function ApplicationDonutChart({
  data = [],
  totalLabel = "müraciət",
  className,
}: ApplicationDonutChartProps) {
  const total = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr.value, 0),
    [data]
  )

  return (
    <Card className={cn("rounded-xl border-[0.8px] border-none bg-white p-5 shadow-none", className)}>
      <div className="relative">
        {data.length === 0 ? (
          <div className="flex h-[380px] items-center justify-center text-sm text-[#797979]">
            Seçilmiş dövr üzrə məlumat yoxdur
          </div>
        ) : (
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[380px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<DonutTooltip />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="category"
              innerRadius={120}
              outerRadius={170}
              strokeWidth={0}
            />
          </PieChart>
        </ChartContainer>
        )}

        {data.length > 0 ? <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-[5.5px] pointer-events-none z-0">
          <span className="text-xl font-medium leading-7 text-[#797979]">
            Cəmi
          </span>
          <span className="text-[40px] font-bold leading-[48px] text-[#1f1f1f]">
            {total}
          </span>
          <span className="text-xl font-normal leading-7 text-[#797979]">
            {totalLabel}
          </span>
        </div> : null}
      </div>
    </Card>
  )
}
