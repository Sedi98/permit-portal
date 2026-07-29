import { cn } from "@/lib/utils"

type StatItem = {
  label: string
  value: string
  valueColor: string
  subtitle: string
}

const defaultItems: StatItem[] = [
  { label: "Ümumi icazə (2017–2024)", value: "2,044", valueColor: "#286AA6", subtitle: "8 il ərzində" },
  { label: "Ümumi müraciət", value: "2,292", valueColor: "#4A8EC0", subtitle: "8 il ərzində" },
  { label: "İcra faizi", value: "89%", valueColor: "#2EAD7A", subtitle: "ortalama" },
  { label: "Ən yüksək il", value: "2024", valueColor: "#E0923A", subtitle: "401 icazə" },
]

type ApplicationSummaryStatsProps = {
  items?: StatItem[]
  className?: string
}

export default function ApplicationSummaryStats({
  items = defaultItems,
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
