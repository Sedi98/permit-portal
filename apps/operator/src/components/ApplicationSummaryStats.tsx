import { cn } from "@/lib/utils"

export type SummaryStatItem = {
  label: string
  value: string
  valueColor: string
  subtitle: string
}

type ApplicationSummaryStatsProps = {
  items: SummaryStatItem[]
  className?: string
}

export default function ApplicationSummaryStats({
  items,
  className,
}: ApplicationSummaryStatsProps) {
  return (
    <div
      className={cn(
        "border-t-[0.8px] border-[#f5f5f5] pt-5 grid grid-cols-2 md:grid-cols-4 gap-4",
        className
      )}
    >
      {items.map((item, idx) => (
        <div key={idx} className="relative flex flex-col items-center gap-[3px] text-center">
          {idx > 0 && (
            <div className="hidden md:block absolute left-[-8px] top-0 bottom-0 w-px bg-[#f5f5f5]" />
          )}
          <span className="text-sm font-medium leading-5 text-[#797979] whitespace-nowrap">
            {item.label}
          </span>
          <span
            className="text-2xl font-bold leading-8"
            style={{ color: item.valueColor }}
          >
            {item.value}
          </span>
          <span className="text-sm font-normal leading-5 text-[#797979] whitespace-nowrap">
            {item.subtitle}
          </span>
        </div>
      ))}
    </div>
  )
}
