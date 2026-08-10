import * as React from "react";
import { useNavigate } from "react-router";
import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";
import type { DateRange } from "react-day-picker";

import TableLayout from "@/app/layouts/TableLayout";
import PageTitle from "@/components/PageTitle";
import { DataTable } from "@/components/ui/data-table";
import { DatePickerWithRange } from "@/components/ui/range-picker";
import { PaginationContainer } from "@/components/PaginationContainer";
import StatusBadge from "@/components/StatusBadge";
import { EyeIcon } from "@/components/icons";
import { useApplications } from "@/features/applications/hooks";
import type {
  ApplicationListItem,
  ApplicationStatus,
  ApplicantType,
} from "@/features/applications/types";
import SearchSection from "@/pages/(dashboard)/applications/assigned/sections/SearchSection";

const statusLabels: Record<ApplicationStatus, string> = {
  registered: "Gözləmədə",
  forwarded: "Şöbəyə yönləndirilmiş",
  assigned: "Yönləndirilmiş",
  under_review: "İcrada",
  in_document_flow: "Sənəd dövriyyəsində",
  deficiency_confirmation: "Çatışmazlıq bildirişi təsdiqlənir",
  report_confirmation: "Xidməti məruzə təsdiqlənir",
  payment_confirmation: "Ödəniş tapşırığı təsdiqlənir",
  awaiting_payment: "Ödəniş gözlənilir",
  payment_review: "Ödəniş yoxlanılır",
  awaiting_revision: "Düzəliş gözlənilir",
  awaiting_signature: "İmza gözlənilir",
  sent_for_approval: "Təsdiq gözləyir",
  completed: "Tamamlanmış",
  rejected: "Geri qaytarılmış",
  suspended: "Dayandırılmış",
};

const statusBadgeVariants: Record<ApplicationStatus, React.ComponentProps<typeof StatusBadge>["variant"]> = {
  registered: "registered",
  forwarded: "registered",
  assigned: "assigned",
  under_review: "under_review",
  in_document_flow: "under_review",
  deficiency_confirmation: "sent_for_approval",
  report_confirmation: "sent_for_approval",
  payment_confirmation: "sent_for_approval",
  awaiting_payment: "sent_for_approval",
  payment_review: "under_review",
  awaiting_revision: "registered",
  awaiting_signature: "sent_for_approval",
  sent_for_approval: "sent_for_approval",
  completed: "completed",
  rejected: "rejected",
  suspended: "suspended",
};

function DetailButton({ applicationId }: { applicationId: number }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      aria-label="Ətraflı bax"
      onClick={() => navigate(`manage/${applicationId}`)}
      className="inline-flex size-12 items-center justify-center rounded-lg border border-[#dfdfdf] bg-white text-[#286aa6] transition-colors hover:bg-[#f7f9fc]"
    >
      <EyeIcon className="size-9" />
    </button>
  );
}

const columns: ColumnDef<ApplicationListItem>[] = [
  {
    header: "Müraciətin növü",
    accessorKey: "permit_service.category_label",
    id: "category_label",
    cell: ({ row }) => (
      <span className="line-clamp-2 max-w-[260px] text-sm font-normal leading-5 text-[#1f1f1f]">
        {row.original.permit_service.category_label}
      </span>
    ),
  },
  {
    header: "Müraciət edən",
    accessorKey: "applicant_full_name",
    cell: ({ row }) => (
      <span className="text-sm font-medium leading-5 text-[#1f1f1f]">
        {row.original.applicant_full_name}
      </span>
    ),
  },
  {
    header: "İcazənin adı",
    accessorKey: "permit_service.name",
    id: "name",
    cell: ({ row }) => <span className="text-sm text-[#1f1f1f]">{row.original.permit_service.name}</span>,
  },
  {
    header: "Müraciət tarixi",
    accessorKey: "permit_service.created_at",
    id: "created_at",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-sm text-[#797979]">
        {format(new Date(row.original.permit_service.created_at), "dd.MM.yyyy")}
      </span>
    ),
  },
  {
    header: "Müraciət nömrəsi",
    accessorKey: "application_no",
    id: "code",
    cell: ({ row }) => <span className="text-sm font-medium text-[#286aa6]">{row.original.application_no}</span>,
  },
  {
    header: "İcra vəziyyəti",
    accessorKey: "status",
    cell: ({ row }) => (
      <StatusBadge
        variant={statusBadgeVariants[row.original.status]}
        label={statusLabels[row.original.status]}
      />
    ),
  },
  {
    header: "Müraciətçinin tipi",
    accessorKey: "applicant_type",
    cell: ({ row }) => (
      <span className="text-sm text-[#1f1f1f]">
        {row.original.applicant_type === "legal" ? "Hüquqi şəxs" : "Fiziki şəxs"}
      </span>
    ),
  },
  {
    header: "Ətraflı",
    id: "details",
    cell: ({ row }) => <DetailButton applicationId={row.original.id} />,
  },
];

interface ApplicationListPageProps {
  title: string;
  initialStatus?: string;
  statusGroup?: string;
}

export default function ApplicationListPage({
  title,
  initialStatus = "all",
  statusGroup,
}: ApplicationListPageProps) {
  const showStatus = initialStatus === "assigned,under_review,in_document_flow";
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState(showStatus ? "assigned" : initialStatus);
  const [applicantType, setApplicantType] = React.useState("all");
  const [page, setPage] = React.useState(1);

  const params = React.useMemo(
    () => ({
      ...(search ? { search } : {}),
      ...(status !== "all" ? { status } : {}),
      ...(statusGroup ? { status_group: statusGroup } : {}),
      ...(applicantType !== "all" ? { applicant_type: applicantType as ApplicantType } : {}),
      ...(dateRange?.from ? { date_from: format(dateRange.from, "yyyy-MM-dd") } : {}),
      ...(dateRange?.to ? { date_to: format(dateRange.to, "yyyy-MM-dd") } : {}),
      page,
      per_page: 20,
    }),
    [applicantType, dateRange, page, search, status, statusGroup],
  );

  const { data: applicationsData, isLoading } = useApplications(params);
  const items = applicationsData?.data?.data ?? [];
  const currentPage = applicationsData?.data?.current_page ?? page;
  const totalPages = applicationsData?.data?.last_page ?? 1;
  const totalItems = applicationsData?.data?.total ?? 0;
  const itemsPerPage = applicationsData?.data?.per_page ?? 20;

  return (
    <div className="relative space-y-4">
      <h1 className="pl-4 text-base font-medium leading-6 text-stone-900">{title}</h1>
      <TableLayout className="space-y-5">
        <div className="flex items-start justify-between">
          <PageTitle title="Müraciətlər siyahısı" text={`Cəmi ${totalItems} müraciət tapıldı`} />
          <DatePickerWithRange
            value={dateRange}
            onChange={(value) => { setDateRange(value); setPage(1); }}
            placeholder="Tarix aralığı seç"
          />
        </div>
        <SearchSection
          search={search}
          onSearchChange={(value) => { setSearch(value); setPage(1); }}
          status={status}
          onStatusChange={(value) => { setStatus(value); setPage(1); }}
          applicantType={applicantType}
          onApplicantTypeChange={(value) => { setApplicantType(value); setPage(1); }}
          showStatus={showStatus}
        />
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="size-10 animate-spin rounded-full border-4 border-[#286aa6] border-t-transparent" />
          </div>
        ) : (
          <DataTable columns={columns} data={items} />
        )}
        <PaginationContainer
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setPage}
        />
      </TableLayout>
    </div>
  );
}
