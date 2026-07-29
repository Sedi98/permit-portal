import { cn } from "@/lib/utils"

const variants = {
  registered: {
    className: "bg-[#fff4eb] text-[#e97000]",
    dot: "bg-[#e97000]",
  },
  assigned: {
    className: "bg-[#ebf5f5] text-[#0d9488]",
    dot: "bg-[#0d9488]",
  },
  under_review: {
    className: "bg-[#eef4fb] text-[#286aa6]",
    dot: "bg-[#286aa6]",
  },
  sent_for_approval: {
    className: "bg-[#f3edfc] text-[#7c3aed]",
    dot: "bg-[#7c3aed]",
  },
  completed: {
    className: "bg-[#effaf1] text-[#34b443]",
    dot: "bg-[#34b443]",
  },
  rejected: {
    className: "bg-[#fde8e8] text-[#dc2626]",
    dot: "bg-[#dc2626]",
  },
  suspended: {
    className: "bg-[#f0f0f0] text-[#6b7280]",
    dot: "bg-[#6b7280]",
  },
} as const

type StatusVariant = keyof typeof variants

type StatusBadgeProps = {
  variant: StatusVariant
  label: string
  className?: string
}

export default function StatusBadge({ variant, label, className }: StatusBadgeProps) {
  const style = variants[variant]
  return (
    <span className={cn("inline-flex items-center gap-[6px] rounded-[99px] px-[10px] py-[4px] text-xs font-medium leading-4 whitespace-nowrap", style.className, className)}>
      <span className={cn("size-[6px] rounded-full", style.dot)} />
      {label}
    </span>
  )
}
