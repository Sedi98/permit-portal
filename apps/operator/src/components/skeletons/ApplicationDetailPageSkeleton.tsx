import TableLayout from "@/app/layouts/TableLayout";
import { Skeleton } from "@/components/ui/skeleton";

const previewRows = Array.from({ length: 5 }, (_, index) => index);
const steps = Array.from({ length: 6 }, (_, index) => index);

function TableSectionSkeleton({ columns }: { columns: number }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-7 w-52" />
      <div className="overflow-hidden rounded-lg border border-[#DFDFDF]">
        <div className="grid gap-6 bg-[#F8F8F8] px-4 py-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }, (_, index) => (
            <Skeleton key={index} className="h-5 w-24" />
          ))}
        </div>
        <div className="grid gap-6 border-t border-[#f5f5f5] px-4 py-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }, (_, index) => (
            <Skeleton key={index} className="h-5 w-32" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ApplicationDetailPageSkeleton() {
  return (
    <main className="space-y-5 md:space-y-10" role="status" aria-label="Müraciətin detalları yüklənir">
      <div className="p-4">
        <div className="flex items-center gap-3 px-4 py-3">
          <Skeleton className="size-6" />
          <Skeleton className="h-6 w-12" />
          <Skeleton className="ml-3 h-6 w-40" />
        </div>

        <div className="flex items-center gap-4 rounded-xl bg-white p-6">
          {steps.map((step) => (
            <div key={step} className="contents">
              {step > 0 ? <Skeleton className="h-0.5 w-14 shrink-0" /> : null}
              <div className="flex shrink-0 flex-col items-center gap-2">
                <Skeleton className="size-10 rounded-full" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-4xl rounded-xl border border-[#DFDFDF] bg-white">
        <div className="flex items-center justify-between p-10 pb-0">
          <div className="space-y-1">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-12 w-28 rounded-lg" />
        </div>
        <div className="flex flex-col items-center gap-5 p-10 pt-5">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-6 w-[360px]" />
            <Skeleton className="h-8 w-28" />
          </div>
          <div className="w-full">
            {previewRows.map((row) => (
              <div key={row} className="flex items-center justify-between border-b border-[#DFDFDF] py-[14px]">
                <Skeleton className="h-5 w-52" />
                <Skeleton className="h-5 w-40" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <TableLayout>
        <section className="flex flex-col gap-8 bg-[#FEFEFE] p-6">
          <TableSectionSkeleton columns={3} />
          <TableSectionSkeleton columns={4} />
        </section>
      </TableLayout>

      <TableLayout>
        <div className="space-y-4 p-6">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-5 w-80" />
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="flex items-center justify-between rounded-xl border border-[#DFDFDF] p-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-56" />
                <Skeleton className="h-4 w-36" />
              </div>
              <Skeleton className="h-10 w-28 rounded-lg" />
            </div>
          ))}
        </div>
      </TableLayout>
    </main>
  );
}
