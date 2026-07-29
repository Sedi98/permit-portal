import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import type { ApplicationStatus, ApplicantType } from "@/features/applications/types"

const statusOptions: { value: ApplicationStatus | "all"; label: string }[] = [
  { value: "all", label: "Hamısı" },
  { value: "registered", label: "Gözləmədə" },
  { value: "assigned", label: "Yönləndirilmiş" },
  { value: "under_review", label: "İcrada" },
  { value: "sent_for_approval", label: "Təsdiq gözləyir" },
  { value: "completed", label: "Tamamlanmış" },
  { value: "rejected", label: "Geri qaytarılmış" },
]

const applicantTypeOptions: { value: ApplicantType | "all"; label: string }[] = [
  { value: "all", label: "Hamısı" },
  { value: "physical", label: "Fiziki şəxs" },
  { value: "legal", label: "Hüquqi şəxs" },
]

interface SearchSectionProps {
  search: string
  onSearchChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  applicantType: string
  onApplicantTypeChange: (value: string) => void
}

export default function SearchSection({
  search,
  onSearchChange,
  status,
  onStatusChange,
  applicantType,
  onApplicantTypeChange,
}: SearchSectionProps) {
  return (
    <div className="flex gap-4">
      <div className="flex items-center gap-3 bg-[#f5f5f5] rounded-lg px-4 py-3 w-[400px]">
        <Search className="size-5 text-[#797979] shrink-0" />
        <Input
          placeholder="Müraciət edən və ya icazə adı üzrə axtarın... "
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-transparent border-none px-0 py-0 rounded-none shadow-none h-auto text-base text-[#1F1F1F] placeholder:text-[#797979]"
        />
      </div>

      <div className="w-[200px]">
        <Select value={applicantType} onValueChange={onApplicantTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {applicantTypeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-[200px]">
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
