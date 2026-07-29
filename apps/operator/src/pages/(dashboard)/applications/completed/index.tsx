import * as React from "react"
import { useNavigate } from "react-router";
import { format } from "date-fns"
import type { ColumnDef } from "@tanstack/react-table";
import type { DateRange } from "react-day-picker";
import TableLayout from "@/app/layouts/TableLayout";
import PageTitle from "@/components/PageTitle";
import { DataTable } from "@/components/ui/data-table";
import StatusBadge from "@/components/StatusBadge";
import { EyeIcon } from "@/components/icons";
import { DatePickerWithRange } from "@/components/ui/range-picker";
import { PaginationContainer } from "@/components/PaginationContainer";
import { useApplications } from "@/features/applications/hooks";
import type { ApplicationListItem, ApplicationStatus } from "@/features/applications/types";
import SearchSection from "./sections/SearchSection";

const statusLabels: Record<ApplicationStatus, string> = {
  registered: "Gözləmədə",
  assigned: "Yönləndirilmiş",
  under_review: "İcrada",
  sent_for_approval: "Təsdiq gözləyir",
  completed: "Tamamlanmış",
  rejected: "Geri qaytarılmış",
  suspended: "Dayandırılmış",
};

function ActionCell({ id }: { id: number }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(`/noncompliance-notices/gonderilenler/${id}`)}
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
    cell: ({ row }) => (
      <span className="text-sm font-normal leading-5 text-[#1f1f1f]">
        {row.original.permit_service.name}
      </span>
    ),
  },
  {
    header: "Müraciət tarixi",
    accessorKey: "permit_service.created_at",
    id: "created_at",
    cell: ({ row }) => (
      <span className="text-sm font-normal leading-5 text-[#797979] whitespace-nowrap">
        {format(new Date(row.original.permit_service.created_at), "dd.MM.yyyy")}
      </span>
    ),
  },
  {
    header: "Müraciət nömrəsi",
    accessorKey: "application_no",
    id: "code",
    cell: ({ row }) => (
      <span className="text-sm font-medium leading-5 text-[#286aa6]">
        {row.original.application_no}
      </span>
    ),
  },
  {
    header: "İcra vəziyyəti",
    accessorKey: "status",
    cell: ({ row }) => (
      <StatusBadge
        variant={row.original.status}
        label={statusLabels[row.original.status]}
      />
    ),
  },
  {
    header: "Müraciətçinin tipi",
    accessorKey: "applicant_type",
    cell: ({ row }) => (
      <span className="text-sm font-normal leading-5 text-[#1f1f1f]">
        {row.original.applicant_type === "legal" ? "Hüquqi şəxs" : "Fiziki şəxs"}
      </span>
    ),
  },
  {
    header: "Ətraflı",
    id: "etrafli",
    cell: ({ row }) => <ActionCell id={row.original.id} />,
  },
];

export default function CompletedApplicationsPage() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [searchInput, setSearchInput] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("completed");
  const [applicantType, setApplicantType] = React.useState("all");
  const [page, setPage] = React.useState(1);

  const changeStatus = React.useCallback((value: string) => {
    setStatus(value);
    setPage(1);
  }, []);

  const changeApplicantType = React.useCallback((value: string) => {
    setApplicantType(value);
    setPage(1);
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const params = React.useMemo(() => ({
    ...(search ? { search } : {}),
    ...(status !== "all" ? { status: status as ApplicationStatus } : {}),
    ...(applicantType !== "all" ? { applicant_type: applicantType as "physical" | "legal" } : {}),
    page,
    per_page: 20,
  }), [search, status, applicantType, page]);

  const { data: applicationsData, isLoading } = useApplications(params);

  const items = applicationsData?.data?.data ?? [];
  const currentPage = applicationsData?.data?.current_page ?? 1;
  const totalPages = applicationsData?.data?.last_page ?? 1;
  const totalItems = applicationsData?.data?.total ?? 0;
  const itemsPerPage = applicationsData?.data?.per_page ?? 20;

  return (
    <div className="space-y-4 relative">
      <h1 className="text-stone-900 text-base font-medium leading-6 pl-4">
        İcra edilmişlər
      </h1>

      <TableLayout className="space-y-5">
        <div className="flex justify-between items-start">
          <PageTitle
            title="Müraciətlər siyahısı"
            text={`Cəmi ${totalItems} müraciət tapıldı`}
          />

          <DatePickerWithRange
            value={dateRange}
            onChange={setDateRange}
            placeholder="Tarix aralığı seç"
          />
        </div>

        <SearchSection
          search={searchInput}
          onSearchChange={setSearchInput}
          status={status}
          onStatusChange={changeStatus}
          applicantType={applicantType}
          onApplicantTypeChange={changeApplicantType}
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
