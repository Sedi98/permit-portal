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
  fill: string
}

const defaultData: DonutData[] = [
  { category: "Elektrik enerjisi istehsalı", value: 282, fill: "#3A7EC8" },
  { category: "Günəş enerjisi", value: 215, fill: "#58A55C" },
  { category: "Külək enerjisi", value: 180, fill: "#F5A623" },
  { category: "Bioqaz", value: 130, fill: "#9B59B6" },
  { category: "Digər", value: 114, fill: "#E87676" },
]

const chartConfig = {
  "Elektrik enerjisi istehsalı": { label: "Elektrik enerjisi istehsalı", color: "#3A7EC8" },
  "Günəş enerjisi": { label: "Günəş enerjisi", color: "#58A55C" },
  "Külək enerjisi": { label: "Külək enerjisi", color: "#F5A623" },
  "Bioqaz": { label: "Bioqaz", color: "#9B59B6" },
  "Digər": { label: "Digər", color: "#E87676" },
} satisfies ChartConfig

type DonutTooltipProps = {
  active?: boolean
  payload?: { payload: DonutData }[]
  total: number
}

function DonutTooltip({ active, payload, total }: DonutTooltipProps) {
  if (!active || !payload?.length) return null

  const item = payload[0].payload
  const pct = ((item.value / total) * 100).toFixed(1)

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
  data = defaultData,
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
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[380px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<DonutTooltip total={total} />}
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

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-[5.5px] pointer-events-none z-0">
          <span className="text-xl font-medium leading-7 text-[#797979]">
            Cəmi
          </span>
          <span className="text-[40px] font-bold leading-[48px] text-[#1f1f1f]">
            {total}
          </span>
          <span className="text-xl font-normal leading-7 text-[#797979]">
            {totalLabel}
          </span>
        </div>
      </div>
    </Card>
  )
}
