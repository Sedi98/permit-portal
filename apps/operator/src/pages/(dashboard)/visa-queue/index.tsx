import * as React from "react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

import QueueListPage, { visaQueueColumns } from "@/components/QueueListPage";
import { useVisaQueue } from "@/features/visa-queue/hooks";

export default function VisaQueuePage() {
  const [search, setSearch] = React.useState("");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [page, setPage] = React.useState(1);
  const params = React.useMemo(
    () => ({
      ...(search ? { search } : {}),
      ...(dateRange?.from ? { date_from: format(dateRange.from, "yyyy-MM-dd") } : {}),
      ...(dateRange?.to ? { date_to: format(dateRange.to, "yyyy-MM-dd") } : {}),
      page,
      per_page: 20,
    }),
    [dateRange, page, search],
  );
  const { data, isLoading } = useVisaQueue(params);
  const response = data?.data;

  return (
    <QueueListPage
      title="Viza gözləyən sənədlər"
      columns={visaQueueColumns}
      items={response?.data?.map((item) => ({
        id: item.id,
        applicationId: item.document.application.id,
        applicationNo: item.document.application.application_no,
        permitName: item.document.application.permit_service.name,
        documentType: item.document.type,
        documentBody: item.document.body,
        departmentName: item.department.name,
      })) ?? []}
      isLoading={isLoading}
      search={search}
      onSearchChange={(value) => { setSearch(value); setPage(1); }}
      dateRange={dateRange}
      onDateRangeChange={(value) => { setDateRange(value); setPage(1); }}
      currentPage={response?.current_page ?? page}
      totalPages={response?.last_page ?? 1}
      totalItems={response?.total ?? response?.data?.length ?? 0}
      itemsPerPage={20}
      onPageChange={setPage}
    />
  );
}
