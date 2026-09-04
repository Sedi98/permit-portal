import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Download, LoaderCircle } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import TableLayout from "@/app/layouts/TableLayout";
import PageTitle from "@/components/PageTitle";
import { PaginationContainer } from "@/components/PaginationContainer";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useManagedPermitServices } from "@/features/permit-services/hooks";
import { downloadReportsExport } from "@/features/reports/api";
import { useReports } from "@/features/reports/hooks";
import type {
  ReportItem,
  ReportParams,
  ReportStatus,
} from "@/features/reports/types";

const reportStatuses: Array<{ value: ReportStatus; label: string }> = [
  { value: "completed", label: "Tamamlanmış" },
  { value: "registered", label: "Qeydiyyata alındı" },
  { value: "assigned", label: "İcraya yönləndirilib" },
  { value: "awaiting_revision", label: "Düzəliş tələb olunur" },
  { value: "awaiting_payment", label: "Ödəniş gözlənilir" },
  { value: "rejected", label: "İmtina edilib" },
  { value: "unprocessed", label: "Baxılmamış saxlanılıb" },
];

const pageSizes: ReportParams["per_page"][] = [20, 50, 100];

const columns: ColumnDef<ReportItem>[] = [
  { header: "Sıra sayı", accessorKey: "row_number" },
  {
    header: "İcazə verən orqanın adı və ünvanı",
    accessorKey: "issuing_authority",
    cell: ({ row }) => (
      <span className="block min-w-72 whitespace-pre-line">
        {row.original.issuing_authority}
      </span>
    ),
  },
  {
    header: "İcazənin sahibi barədə məlumatlar",
    accessorKey: "owner_info",
    cell: ({ row }) => (
      <span className="block min-w-80 whitespace-normal">{row.original.owner_info}</span>
    ),
  },
  {
    header: "VÖEN",
    accessorKey: "voen",
    cell: ({ row }) => row.original.voen || "—",
  },
  {
    header: "İcazənin verildiyi tarix və qeydiyyat nömrəsi",
    accessorKey: "issued_info",
    cell: ({ row }) => <span className="block min-w-56">{row.original.issued_info}</span>,
  },
  {
    header: "İcazənin müddəti",
    accessorKey: "validity_period",
    cell: ({ row }) => row.original.validity_period || "—",
  },
  {
    header: "İcazədə göstərilmiş hərəkət",
    accessorKey: "action",
    cell: ({ row }) => (
      <span className="block min-w-72 whitespace-normal">{row.original.action}</span>
    ),
  },
  { header: "Əlavənin tarixi/nömrəsi", accessorKey: "addendum_info" },
  {
    header: "Yenidən rəsmiləşdirmə tarixi/nömrəsi",
    accessorKey: "reissued_info",
  },
  { header: "Dublikat tarixi/nömrəsi", accessorKey: "duplicate_info" },
  {
    header: "Dayandırılma/bərpa tarixi/nömrəsi",
    accessorKey: "suspension_info",
  },
  { header: "Ləğv tarixi/nömrəsi", accessorKey: "cancellation_info" },
];

export default function ReportsPage() {
  const [permitServiceId, setPermitServiceId] = useState("all");
  const [status, setStatus] = useState<ReportStatus>("completed");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<ReportParams["per_page"]>(20);
  const [isExporting, setIsExporting] = useState(false);

  const params = useMemo<ReportParams>(
    () => ({
      ...(permitServiceId !== "all"
        ? { permit_service_id: Number(permitServiceId) }
        : {}),
      ...(dateFrom ? { date_from: format(dateFrom, "yyyy-MM-dd") } : {}),
      ...(dateTo ? { date_to: format(dateTo, "yyyy-MM-dd") } : {}),
      status,
      per_page: perPage,
      page,
    }),
    [dateFrom, dateTo, page, perPage, permitServiceId, status],
  );

  const reportsQuery = useReports(params);
  const permitServicesQuery = useManagedPermitServices();
  const response = reportsQuery.data?.data;
  const items = response?.data ?? [];

  const exportToExcel = async () => {
    setIsExporting(true);

    try {
      const blob = await downloadReportsExport({
        permit_service_id: params.permit_service_id,
        date_from: params.date_from,
        date_to: params.date_to,
      });
      const objectUrl = window.URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");

      downloadLink.href = objectUrl;
      downloadLink.download = "hesabatlar.xlsx";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Hesabat faylını endirmək mümkün olmadı:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="pl-4 text-base font-medium leading-6 text-stone-900">
        Hesabatlar
      </h1>

      <TableLayout className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <PageTitle
            title="Hesabatlar"
            text={`Cəmi ${response?.total ?? 0} hesabat tapıldı`}
          />
          <Button
            type="button"
            className="h-12 gap-2 px-4"
            onClick={() => void exportToExcel()}
            disabled={isExporting}
          >
            {isExporting ? (
              <LoaderCircle className="size-5 animate-spin" />
            ) : (
              <Download className="size-5" />
            )}
            {isExporting ? "Yüklənir..." : "Excel-ə yüklə"}
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="space-y-1">
            <Label>İcazə növü</Label>
            <Select
              value={permitServiceId}
              onValueChange={(value) => {
                setPermitServiceId(value);
                setPage(1);
              }}
            >
              <SelectTrigger disabled={permitServicesQuery.isLoading}>
                <SelectValue placeholder="İcazə növünü seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün icazələr</SelectItem>
                {permitServicesQuery.data?.data.map((service) => (
                  <SelectItem key={service.id} value={String(service.id)}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Başlanğıc tarixi</Label>
            <DatePicker
              value={dateFrom}
              onChange={(value) => {
                setDateFrom(value);
                setPage(1);
              }}
              placeholder="Başlanğıc tarix"
              disabled={dateTo ? { after: dateTo } : undefined}
            />
          </div>

          <div className="space-y-1">
            <Label>Son tarix</Label>
            <DatePicker
              value={dateTo}
              onChange={(value) => {
                setDateTo(value);
                setPage(1);
              }}
              placeholder="Son tarix"
              disabled={dateFrom ? { before: dateFrom } : undefined}
            />
          </div>

          <div className="space-y-1">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value as ReportStatus);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reportStatuses.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Səhifədə</Label>
            <Select
              value={String(perPage)}
              onValueChange={(value) => {
                setPerPage(Number(value) as ReportParams["per_page"]);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizes.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {reportsQuery.isLoading ? (
          <div className="flex justify-center py-20" role="status">
            <LoaderCircle className="size-9 animate-spin text-primary" />
            <span className="sr-only">Hesabatlar yüklənir...</span>
          </div>
        ) : reportsQuery.isError ? (
          <div className="rounded-lg bg-destructive/5 p-6 text-center text-sm text-destructive">
            Hesabatları yükləmək mümkün olmadı.
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#DFDFDF] p-12 text-center text-sm text-[#797979]">
            Seçilmiş filtrlərə uyğun hesabat tapılmadı.
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={items}
            className="[&_table]:min-w-[2400px]"
          />
        )}

        <PaginationContainer
          currentPage={response?.current_page ?? page}
          totalPages={response?.last_page ?? 1}
          totalItems={response?.total ?? 0}
          itemsPerPage={response?.per_page ?? perPage}
          itemLabel="hesabatın"
          onPageChange={setPage}
        />
      </TableLayout>
    </div>
  );
}
