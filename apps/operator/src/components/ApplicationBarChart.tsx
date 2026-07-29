"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

const chartData = [
  { year: "2017", icaze: 45, muracit: 65 },
  { year: "2018", icaze: 85, muracit: 110 },
  { year: "2019", icaze: 130, muracit: 160 },
  { year: "2020", icaze: 95, muracit: 140 },
  { year: "2021", icaze: 155, muracit: 195 },
  { year: "2022", icaze: 185, muracit: 220 },
  { year: "2023", icaze: 218, muracit: 248 },
  { year: "2024", icaze: 380, muracit: 450 },
]

const chartConfig = {
  icaze: {
    label: "Verilmiş icazələr",
    color: "#286AA6",
  },
  muracit: {
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
              {entry.name === "icaze" ? "Verilmiş icazələr" : "Müraciət"}
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
  className?: string
}

export default function ApplicationBarChart({ className }: ApplicationBarChartProps) {
  return (
    <Card className={cn("rounded-xl border-[0.8px] border-none bg-white p-5 shadow-none", className)}>
      <ChartContainer config={chartConfig} className="w-full h-[300px]">
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
            domain={[0, 500]}
            ticks={[0, 125, 250, 375, 500]}
          />
          <ChartTooltip
            cursor={false}
            content={<BarTooltip />}
          />
          <Bar
            dataKey="icaze"
            fill="#286AA6"
            radius={4}
            barSize={24}
          />
          <Bar
            dataKey="muracit"
            fill="#A9C3DB"
            radius={4}
            barSize={24}
          />
        </BarChart>
      </ChartContainer>
    </Card>
  )
}
