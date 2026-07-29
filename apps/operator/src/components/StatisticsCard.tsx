import type { ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type StatisticsCardProps = {
  icon: ReactNode
  label: string
  value: string | number
  className?: string
}

export default function StatisticsCard({ icon, label, value, className }: StatisticsCardProps) {
  return (
    <Card
      size="sm"
      className={cn(
        "rounded-xl border-[0.8px] border-[#dfdfdf] bg-white p-5 shadow-none",
        "[--card-spacing:0px]",
        className
      )}
    >
      <div className="flex flex-col items-start gap-2">
        <div className="inline-flex size-8 items-center justify-center rounded-lg bg-[#f5f5f5]">
          <div className="size-5 text-[#1f1f1f]">{icon}</div>
        </div>
        <span className="text-sm font-medium leading-5 text-[#797979]">{label}</span>
        <span className="text-[32px] font-bold leading-9 text-[#1f1f1f]">{value}</span>
      </div>
    </Card>
  )
}
