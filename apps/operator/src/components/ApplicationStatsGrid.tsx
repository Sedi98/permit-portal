import { cn } from "@/lib/utils"

type StatsItem = {
  label: string
  color: string
  percentage: string
  count: number
}

const defaultRows: StatsItem[][] = [
  [
    { label: "Elektrik enerjisi istehsalı", color: "#3A7EC8", percentage: "30.6%", count: 282 },
    { label: "Neft-qaz hasilatı", color: "#2EAD7A", percentage: "16.4%", count: 179 },
    { label: "Bərpa olunan enerji", color: "#E0923A", percentage: "16.4%", count: 151 },
  ],
  [
    { label: "İstilik enerjisi", color: "#8A62C4", percentage: "12.2%", count: 112 },
    { label: "Yanacaq distribusiyası", color: "#D45C6A", percentage: "8.3%", count: 76 },
    { label: "Enerji xidmətləri", color: "#3BAEC6", percentage: "6.2%", count: 57 },
  ],
  [
    { label: "Enerji xidmətləri", color: "#3BAEC6", percentage: "6.2%", count: 57 },
    { label: "Enerji auditi", color: "#7A8FA6", percentage: "4.1%", count: 38 },
    { label: "Digər fəaliyyət növləri", color: "#C4A43A", percentage: "2.8%", count: 26 },
  ],
]

function StatsCell({ item, roundTop, roundBottom }: { item: StatsItem; roundTop?: "left" | "right"; roundBottom?: "left" | "right" }) {
  return (
    <div
      className={cn(
        "bg-white flex flex-1 gap-[10px] items-center min-w-px px-4 py-[6px]",
        roundTop === "left" && "rounded-tl-[8px]",
        roundTop === "right" && "rounded-tr-[8px]",
        roundBottom === "left" && "rounded-bl-[8px]",
        roundBottom === "right" && "rounded-br-[8px]"
      )}
    >
      <div
        className="rounded-[4.5px] size-[9px] shrink-0"
        style={{ backgroundColor: item.color }}
      />
      <span className="flex-1 min-w-px text-sm font-normal leading-5 text-[#1f1f1f]">
        {item.label}
      </span>
      <div className="flex items-center gap-2 text-sm leading-5 shrink-0">
        <span
          className="font-bold"
          style={{ color: item.color }}
        >
          {item.percentage}
        </span>
        <span className="font-semibold text-[#797979]">
          {item.count}
        </span>
      </div>
    </div>
  )
}

type ApplicationStatsGridProps = {
  rows?: StatsItem[][]
  className?: string
}

export default function ApplicationStatsGrid({
  rows = defaultRows,
  className,
}: ApplicationStatsGridProps) {
  return (
    <div
      className={cn(
        "bg-[#f5f5f5] border border-[#f5f5f5] rounded-[8px] flex flex-col gap-px",
        className
      )}
    >
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-px items-center w-full">
          {row.map((item, colIdx) => {
            const isFirstRow = rowIdx === 0
            const isLastRow = rowIdx === rows.length - 1
            const isFirstCol = colIdx === 0
            const isLastCol = colIdx === row.length - 1
            return (
              <StatsCell
                key={colIdx}
                item={item}
                roundTop={isFirstRow ? (isFirstCol ? "left" : isLastCol ? "right" : undefined) : undefined}
                roundBottom={isLastRow ? (isFirstCol ? "left" : isLastCol ? "right" : undefined) : undefined}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
