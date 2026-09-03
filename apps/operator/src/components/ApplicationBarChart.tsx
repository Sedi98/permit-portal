"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

export type ApplicationBarChartItem = {
  year: number
  issued: number
  applications: number
}

const chartConfig = {
  issued: {
    label: "Verilmiş icazələr",
    color: "#286AA6",
  },
  applications: {
    label: "Müraciət",
    color: "#A9C3DB",
  },
} satisfies ChartConfig

type BarTooltipProps = {
  active?: boolean
  payload?: { name: string; value: number; fill: string }[]
  label?: string
}

function BarTooltip({ active, payload, label }: BarTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-white border border-[#dfdfdf] rounded-lg px-4 py-3 shadow-[0px_0px_16px_rgba(0,0,0,0.1)] flex flex-col gap-3 min-w-[180px]">
      <span className="text-base font-medium leading-6 text-[#1f1f1f]">{label}-il</span>
      <div className="flex flex-col gap-3">
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-[6px] w-full">
            <div
              className="rounded-[2px] size-[9px] shrink-0"
              style={{ backgroundColor: entry.fill }}
            />
            <span className="flex-1 text-sm font-medium leading-5 text-[#797979] min-w-px">
              {entry.name === "issued" ? "Verilmiş icazələr" : "Müraciət"}
            </span>
            <span className="text-sm font-medium leading-5 text-[#1f1f1f] text-center whitespace-nowrap">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

type ApplicationBarChartProps = {
  data: ApplicationBarChartItem[]
  className?: string
}

export default function ApplicationBarChart({ data, className }: ApplicationBarChartProps) {
  if (data.length === 0) {
    return <div className="flex h-[300px] items-center justify-center text-sm text-[#797979]">Seçilmiş illər üzrə məlumat yoxdur</div>
  }

  return (
    <Card className={cn("rounded-xl border-[0.8px] border-none bg-white p-5 shadow-none", className)}>
      <ChartContainer config={chartConfig} className="w-full h-[300px]">
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#797979", fontSize: 14, fontWeight: 400 }}
            tickMargin={10}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#797979", fontSize: 14, fontWeight: 400 }}
            tickMargin={10}
            allowDecimals={false}
          />
          <ChartTooltip
            cursor={false}
            content={<BarTooltip />}
          />
          <Bar
            dataKey="issued"
            fill="#286AA6"
            radius={4}
            barSize={24}
          />
          <Bar
            dataKey="applications"
            fill="#A9C3DB"
            radius={4}
            barSize={24}
          />
        </BarChart>
      </ChartContainer>
    </Card>
  )
}
