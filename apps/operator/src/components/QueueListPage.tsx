import { useNavigate } from "react-router";
import type { ColumnDef } from "@tanstack/react-table";
import type { DateRange } from "react-day-picker";
import { Search } from "lucide-react";

import TableLayout from "@/app/layouts/TableLayout";
import PageTitle from "@/components/PageTitle";
import { DataTable } from "@/components/ui/data-table";
import { DatePickerWithRange } from "@/components/ui/range-picker";
import { PaginationContainer } from "@/components/PaginationContainer";
import { Input } from "@/components/ui/input";
import { EyeIcon } from "@/components/icons";

export type QueueRow = {
  id: number;
  applicationId: number;
  applicationNo: string;
  permitName: string;
  documentType?: string;
  documentBody?: string;
  executor?: string;
  departmentName?: string;
};

function DetailButton({ row }: { row: QueueRow }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      aria-label="Ətraflı bax"
      onClick={() => navigate(`manage/${row.id}`, { state: row })}
      className="inline-flex size-12 items-center justify-center rounded-lg border border-[#dfdfdf] bg-white text-[#286aa6] transition-colors hover:bg-[#f7f9fc]"
    >
      <EyeIcon className="size-9" />
    </button>
  );
}

const queueColumns: ColumnDef<QueueRow>[] = [
  {
    header: "Müraciət nömrəsi",
    accessorKey: "applicationNo",
    cell: ({ row }) => <span className="text-sm font-medium text-[#286aa6]">{row.original.applicationNo}</span>,
  },
  {
    header: "İcazə növü",
    accessorKey: "permitName",
    cell: ({ row }) => <span className="text-sm text-[#1f1f1f]">{row.original.permitName}</span>,
  },
  {
    header: "Sənəd növü",
    accessorKey: "documentType",
    cell: ({ row }) => <span className="text-sm text-[#1f1f1f]">{row.original.documentType ?? "—"}</span>,
  },
  {
    header: "Hazırlayan icraçı",
    accessorKey: "executor",
    cell: ({ row }) => <span className="text-sm text-[#1f1f1f]">{row.original.executor ?? "—"}</span>,
  },
  {
    header: "Ətraflı",
    id: "details",
    cell: ({ row }) => <DetailButton row={row.original} />,
  },
];

export const visaQueueColumns: ColumnDef<QueueRow>[] = [
  queueColumns[0],
  queueColumns[1],
  queueColumns[4],
];

export interface QueueListPageProps {
  title: string;
  columns?: ColumnDef<QueueRow>[];
  items: QueueRow[];
  isLoading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  dateRange?: DateRange;
  onDateRangeChange: (value: DateRange | undefined) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function QueueListPage({
  title,
  columns = queueColumns,
  items,
  isLoading,
  search,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: QueueListPageProps) {

  return (
    <div className="relative space-y-4">
      <h1 className="pl-4 text-base font-medium leading-6 text-stone-900">{title}</h1>
      <TableLayout className="space-y-5">
        <div className="flex items-start justify-between">
          <PageTitle title="Siyahı" text={`Cəmi ${totalItems} nəticə tapıldı`} />
          <DatePickerWithRange value={dateRange} onChange={onDateRangeChange} placeholder="Tarix aralığı seç" />
        </div>
        <div className="flex w-[400px] items-center gap-3 rounded-lg bg-[#f5f5f5] px-4 py-3">
          <Search className="size-5 shrink-0 text-[#797979]" />
          <Input
            placeholder="Axtar..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-auto rounded-none border-none bg-transparent px-0 py-0 text-base shadow-none placeholder:text-[#797979]"
          />
        </div>
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
          onPageChange={onPageChange}
        />
      </TableLayout>
    </div>
  );
}
