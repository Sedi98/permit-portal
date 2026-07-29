import StatisticsCard from "@/components/StatisticsCard"
import { TickCircleIcon, DocumentTextIcon, VisaIcon, Edit2Icon } from "@/components/icons"
import { useStatistics } from "@/features/statistics/hooks"

const STATIC_STATS = [
  { icon: <VisaIcon />, label: "Viza", value: 87 },
  { icon: <Edit2Icon />, label: "İmza", value: 54 },
]

export default function StatisticsSection() {
  const { data } = useStatistics()

  const stats = data
    ? [
        { icon: <TickCircleIcon />, label: "İcra", value: data.data.in_progress },
        { icon: <DocumentTextIcon />, label: "Müraciət", value: data.data.pending },
        ...STATIC_STATS,
      ]
    : [
        { icon: <TickCircleIcon />, label: "İcra", value: "—" },
        { icon: <DocumentTextIcon />, label: "Müraciət", value: "—" },
        ...STATIC_STATS,
      ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 p-4">
      {stats.map((stat) => (
        <StatisticsCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} />
      ))}
    </div>
  )
}
