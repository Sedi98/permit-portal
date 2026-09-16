import * as React from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Download, LoaderCircle } from "lucide-react";

import TableLayout from "@/app/layouts/TableLayout";
import ApplicationBarChart from "@/components/ApplicationBarChart";
import ApplicationDonutChart from "@/components/ApplicationDonutChart";
import ApplicationStatsGrid, { type StatsItem } from "@/components/ApplicationStatsGrid";
import ApplicationSummaryStats, { type SummaryStatItem } from "@/components/ApplicationSummaryStats";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { useDashboardStatistics } from "@/features/statistics/hooks";

const YEAR_RANGE_SIZE = 8;
const CHART_COLORS = ["#3A7EC8", "#2EAD7A", "#E0923A", "#8A62C4", "#D45C6A", "#3BAEC6", "#7A8FA6", "#C4A43A"];

function chunkRows(items: StatsItem[]) {
  const rows: StatsItem[][] = [];
  for (let index = 0; index < items.length; index += 3) rows.push(items.slice(index, index + 3));
  return rows;
}

export default function BoardPage() {
  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [appliedDates, setAppliedDates] = React.useState<{ startDate?: string; endDate?: string }>({});
  const [endYear, setEndYear] = React.useState(currentYear);
  const startYear = endYear - YEAR_RANGE_SIZE + 1;
  const statisticsQuery = useDashboardStatistics({ ...appliedDates, startYear, endYear });
  const statistics = statisticsQuery.data?.data;

  const permitServiceData = React.useMemo(
    () => (statistics?.by_permit_service ?? []).map((item, index) => ({
      category: item.permit_service_name,
      value: item.count,
      percentage: item.percentage,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    })),
    [statistics?.by_permit_service],
  );
  const statsRows = React.useMemo(
    () => chunkRows(permitServiceData.map((item) => ({
      label: item.category,
      color: item.fill,
      percentage: `${item.percentage.toFixed(1)}%`,
      count: item.value,
    }))),
    [permitServiceData],
  );
  const yearCount = endYear - startYear + 1;
  const summaryItems: SummaryStatItem[] = statistics ? [
    { label: `Ümumi icazə (${startYear}–${endYear})`, value: statistics.summary.total_issued.toLocaleString("az-AZ"), valueColor: "#286AA6", subtitle: `${yearCount} il ərzində` },
    { label: "Ümumi müraciət", value: statistics.summary.total_applications.toLocaleString("az-AZ"), valueColor: "#4A8EC0", subtitle: `${yearCount} il ərzində` },
    { label: "İcra faizi", value: `${statistics.summary.execution_rate}%`, valueColor: "#2EAD7A", subtitle: "ortalama" },
    { label: "Ən yüksək il", value: statistics.summary.top_year?.toString() ?? "—", valueColor: "#E0923A", subtitle: `${statistics.summary.top_year_count.toLocaleString("az-AZ")} icazə` },
  ] : [];

  function applyDateFilter() {
    setAppliedDates({
      ...(startDate ? { startDate: format(startDate, "yyyy-MM-dd") } : {}),
      ...(endDate ? { endDate: format(endDate, "yyyy-MM-dd") } : {}),
    });
  }

  function resetDateFilter() {
    setStartDate(undefined);
    setEndDate(undefined);
    setAppliedDates({});
  }

  function printStatistics() {
    window.print();
  }

  return (
    <div className="relative space-y-4 print:space-y-0">
      <h1 className="pl-4 text-base font-medium leading-6 text-stone-900 print:hidden">Lövhə</h1>
      <TableLayout className="space-y-5 print:p-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-base font-bold leading-6 text-[#1f1f1f]">Lisenziya üçün müraciətlərin fəaliyyət sahələri üzrə bölgüsü</h2>
          <Button
            type="button"
            variant="outline"
            className="text-[#286AA6] print:hidden"
            onClick={printStatistics}
            disabled={statisticsQuery.isLoading || !statistics}
          >
            <Download className="size-6" />Yüklə
          </Button>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-6 print:hidden">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex w-[220px] flex-col gap-1">
              <Label className="text-sm font-medium text-[#797979]">Başlanğıc tarix</Label>
              <DatePicker key={startDate?.toISOString() ?? "empty-start"} value={startDate} onChange={setStartDate} placeholder="Başlanğıc tarix" disabled={endDate ? { after: endDate } : undefined} />
            </div>
            <div className="flex w-[220px] flex-col gap-1">
              <Label className="text-sm font-medium text-[#797979]">Son tarix</Label>
              <DatePicker key={endDate?.toISOString() ?? "empty-end"} value={endDate} onChange={setEndDate} placeholder="Son tarix" disabled={startDate ? { before: startDate } : undefined} />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Button variant="outline" className="h-auto px-4 py-3 text-base font-semibold text-[#286AA6]" onClick={resetDateFilter}>Sıfırla</Button>
            <Button className="h-auto bg-[#286AA6] px-4 py-3 text-base font-semibold hover:bg-[#286AA6]/80" onClick={applyDateFilter}>Tətbiq et</Button>
          </div>
        </div>

        {statisticsQuery.isLoading ? (
          <div className="flex min-h-[440px] items-center justify-center" role="status"><LoaderCircle className="size-8 animate-spin text-[#286AA6]" /><span className="sr-only">Statistika yüklənir</span></div>
        ) : statisticsQuery.isError ? (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700" role="alert">Statistika yüklənərkən xəta baş verdi.</div>
        ) : (
          <>
            <ApplicationDonutChart data={permitServiceData} />
            {statsRows.length > 0 ? <ApplicationStatsGrid rows={statsRows} /> : null}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-base font-bold text-[#1f1f1f]">Verilmiş icazələrin illərə görə bölgüsü</h2>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 text-sm font-medium text-[#797979]">
                  <span className="flex items-center gap-[6px]"><i className="size-[9px] rounded-[2px] bg-[#286aa6]" />İcazə</span>
                  <span className="flex items-center gap-[6px]"><i className="size-[9px] rounded-[2px] bg-[#a9c3db]" />Müraciət</span>
                </div>
                <Button variant="outline" className="h-auto px-3 py-2 text-base font-semibold text-[#286AA6] print:hidden" disabled title="Excel ixracı hələ mövcud deyil"><Download className="size-6" />Yüklə</Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-[#797979]">Göstərilir:<span className="rounded-[20px] bg-[#eef4fb] px-[14px] py-1 font-bold text-[#286aa6]">{startYear} — {endYear}</span></div>
              <div className="flex items-center gap-4 print:hidden">
                <Button type="button" size="icon" variant="outline" aria-label="Əvvəlki illər" onClick={() => setEndYear((year) => year - YEAR_RANGE_SIZE)}><ChevronLeft className="size-6 text-[#286aa6]" /></Button>
                <Button type="button" size="icon" variant="outline" aria-label="Sonrakı illər" disabled={endYear >= currentYear} onClick={() => setEndYear((year) => Math.min(currentYear, year + YEAR_RANGE_SIZE))}><ChevronRight className="size-6 text-[#286aa6]" /></Button>
              </div>
            </div>
            <ApplicationBarChart data={statistics?.by_year ?? []} />
            <ApplicationSummaryStats items={summaryItems} />
          </>
        )}
      </TableLayout>
    </div>
  );
}
