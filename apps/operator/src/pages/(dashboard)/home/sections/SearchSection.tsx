import { SearchInput } from "@/components/ui/search-input"
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
      <SearchInput
        containerClassName="w-[400px]"
        placeholder="Müraciət edən və ya icazə adı üzrə axtarın..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />

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
