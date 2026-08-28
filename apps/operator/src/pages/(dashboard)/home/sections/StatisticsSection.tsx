import StatisticsCard from "@/components/StatisticsCard"
import {
  DocumentTextIcon,
  Edit2Icon,
  TickCircleIcon,
  VisaIcon,
} from "@/components/icons"
import { useStatistics } from "@/features/statistics/hooks"
import type { StatisticsData } from "@/features/statistics/types"

const STATISTICS_ITEMS: Array<{
  field: keyof StatisticsData
  label: string
  icon: typeof DocumentTextIcon
}> = [
  { field: "pending", label: "Yeni daxil olan", icon: DocumentTextIcon },
  { field: "in_progress", label: "İcrada olan", icon: TickCircleIcon },
  { field: "pending_visa", label: "Vizada olan", icon: VisaIcon },
  { field: "pending_signature", label: "İmzada olan", icon: Edit2Icon },
]

export default function StatisticsSection() {
  const { data, isError, isLoading } = useStatistics()
  const statistics = data?.data

  return (
    <div
      className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-4"
      aria-busy={isLoading}
    >
      {isError ? (
        <p className="col-span-full text-sm text-destructive">
          Statistika məlumatları yüklənmədi.
        </p>
      ) : null}
      {STATISTICS_ITEMS.map(({ field, label, icon: Icon }) => (
        <StatisticsCard
          key={field}
          icon={<Icon />}
          label={label}
          value={statistics?.[field] ?? "—"}
        />
      ))}
    </div>
  )
}
