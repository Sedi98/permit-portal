import * as React from "react"
import { Download, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import TableLayout from "@/app/layouts/TableLayout"
import ApplicationDonutChart from "@/components/ApplicationDonutChart"
import ApplicationStatsGrid from "@/components/ApplicationStatsGrid"
import ApplicationBarChart from "@/components/ApplicationBarChart"
import ApplicationSummaryStats from "@/components/ApplicationSummaryStats"

export default function BoardPage() {
  const [startDate, setStartDate] = React.useState<Date | undefined>()
  const [endDate, setEndDate] = React.useState<Date | undefined>()

  return (
    <div className="space-y-4 relative">
      <h1 className="text-stone-900 text-base font-medium leading-6 pl-4">
        Lövhə
      </h1>
      <TableLayout className="space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-base leading-6 text-[#1f1f1f] whitespace-nowrap">
            Lisenziya üçün müraciətlərin fəaliyyət sahələri üzrə bölgüsü
          </h2>
          <Button variant="outline" className="text-[#286AA6]">
            <Download className="size-6" />
            Yüklə
          </Button>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-1 w-[220px]">
              <Label className="text-sm font-medium leading-5 text-[#797979]">
                Başlanğıc tarix
              </Label>
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                placeholder="Başlanğıc tarix"
              />
            </div>
            <div className="flex flex-col gap-1 w-[220px]">
              <Label className="text-sm font-medium leading-5 text-[#797979]">
                Son tarix
              </Label>
              <DatePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="Son tarix"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Button
              variant="outline"
              className="px-4 py-3 h-auto text-base font-semibold leading-6 text-[#286AA6]"
            >
              Sıfırla
            </Button>
            <Button className="px-4 py-3 h-auto text-base font-semibold leading-6 bg-[#286AA6] hover:bg-[#286AA6]/80">
              Tətbiq et
            </Button>
          </div>
        </div>




        <ApplicationDonutChart />

        <ApplicationStatsGrid />



        <div className="flex items-center justify-between mt-10">
          <h2 className="font-bold text-base leading-6 text-[#1f1f1f] whitespace-nowrap">
            Verilmiş icazələrin illərə görə bölgüsü
          </h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-[6px]">
                <div className="bg-[#286aa6] rounded-[2px] size-[9px]" />
                <span className="text-sm font-medium leading-5 text-[#797979]">İcazə</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <div className="bg-[#a9c3db] rounded-[2px] size-[9px]" />
                <span className="text-sm font-medium leading-5 text-[#797979]">Müraciət</span>
              </div>
            </div>
            <Button variant="outline" className="px-3 py-2 h-auto text-base font-semibold leading-6 text-[#286AA6]">
              <Download className="size-6" />
              Yüklə
            </Button>
          </div>
        </div>



        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-normal leading-5 text-[#797979]">Göstərilir:</span>
            <div className="bg-[#eef4fb] rounded-[20px] px-[14px] py-[4px]">
              <span className="text-sm font-bold leading-5 text-[#286aa6]">2017 — 2024</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="bg-white border border-[#dfdfdf] rounded-lg size-10 flex items-center justify-center"
            >
              <ChevronLeft className="size-6 text-[#286aa6]" />
            </button>
            <button
              type="button"
              className="bg-white border border-[#dfdfdf] rounded-lg size-10 flex items-center justify-center"
            >
              <ChevronRight className="size-6 text-[#286aa6]" />
            </button>
          </div>
        </div>


        <ApplicationBarChart />

        <ApplicationSummaryStats />
      </TableLayout>
    </div>
  );
}
