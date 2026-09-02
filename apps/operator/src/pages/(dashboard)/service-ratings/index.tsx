import { useState } from "react";
import { format, parseISO } from "date-fns";
import { LoaderCircle, Star } from "lucide-react";

import TableLayout from "@/app/layouts/TableLayout";
import PageTitle from "@/components/PageTitle";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useServiceRatingsStatistics } from "@/features/service-ratings/hooks";
import type { RatingPeriod } from "@/features/service-ratings/types";

export default function ServiceRatingsPage() {
  const [period, setPeriod] = useState<RatingPeriod>("monthly");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const fromDate = from ? parseISO(from) : undefined;
  const toDate = to ? parseISO(to) : undefined;

  const handleFromChange = (date: Date | undefined) => {
    if (date && toDate && date > toDate) return;
    setFrom(date ? format(date, "yyyy-MM-dd") : "");
  };

  const handleToChange = (date: Date | undefined) => {
    if (date && fromDate && date < fromDate) return;
    setTo(date ? format(date, "yyyy-MM-dd") : "");
  };

  const statistics = useServiceRatingsStatistics({
    period,
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
  });
  const data = statistics.data?.data;
  const maxRatingCount = data
    ? Math.max(...Object.values(data.ratings), 1)
    : 1;

  return (
    <div className="space-y-4">
      <h1 className="pl-4 text-base font-medium text-stone-900">
        Xidmət məmnuniyyəti
      </h1>
      <TableLayout className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <PageTitle
            title="Qiymətləndirmə statistikası"
            text="Vətəndaşların xidmət qiymətləndirmələri"
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <Label>Dövr</Label>
              <Select
                value={period}
                onValueChange={(value) => setPeriod(value as RatingPeriod)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Günlük</SelectItem>
                  <SelectItem value="monthly">Aylıq</SelectItem>
                  <SelectItem value="yearly">İllik</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Başlanğıc</Label>
              <DatePicker
                value={fromDate}
                onChange={handleFromChange}
                placeholder="Başlanğıc tarix"
                disabled={toDate ? { after: toDate } : undefined}
              />
            </div>
            <div className="space-y-1">
              <Label>Son</Label>
              <DatePicker
                value={toDate}
                onChange={handleToChange}
                placeholder="Son tarix"
                disabled={fromDate ? { before: fromDate } : undefined}
              />
            </div>
          </div>
        </div>

        {statistics.isLoading ? (
          <div className="flex justify-center py-20">
            <LoaderCircle className="size-9 animate-spin text-primary" />
          </div>
        ) : statistics.isError || !data ? (
          <div className="rounded-lg bg-destructive/5 p-6 text-center text-sm text-destructive">
            Qiymətləndirmə statistikası yüklənmədi.
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["Ümumi qiymətləndirmə", data.totalRatings],
                ["Orta qiymət", data.averageRating.toFixed(1)],
                ["Cari ay", data.currentMonthAverage.toFixed(1)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-[#DFDFDF] p-5">
                  <p className="text-sm text-[#797979]">{label}</p>
                  <p className="mt-2 text-3xl font-bold text-[#1F1F1F]">{value}</p>
                </div>
              ))}
            </div>

            <section className="space-y-4" aria-labelledby="ratings-distribution-title">
              <h2 id="ratings-distribution-title" className="text-xl font-bold">
                Qiymət bölgüsü
              </h2>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = data.ratings[String(rating) as keyof typeof data.ratings];
                return (
                  <div key={rating} className="grid grid-cols-[80px_1fr_60px] items-center gap-3">
                    <span className="flex items-center gap-1 text-sm">
                      {rating} <Star className="size-4 fill-amber-400 text-amber-400" />
                    </span>
                    <div className="h-3 overflow-hidden rounded-full bg-[#F0F0F0]">
                      <div
                        className="h-full rounded-full bg-[#286AA6]"
                        style={{ width: `${(count / maxRatingCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-right text-sm text-[#797979]">{count}</span>
                  </div>
                );
              })}
            </section>

            <section className="space-y-3" aria-labelledby="ratings-trend-title">
              <h2 id="ratings-trend-title" className="text-xl font-bold">
                Dinamika
              </h2>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {data.trend.map((item) => (
                  <div key={item.period} className="rounded-lg bg-[#F7F9FC] p-4">
                    <p className="text-sm text-[#797979]">{item.period}</p>
                    <p className="mt-1 text-lg font-semibold">{item.average.toFixed(1)}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </TableLayout>
    </div>
  );
}
