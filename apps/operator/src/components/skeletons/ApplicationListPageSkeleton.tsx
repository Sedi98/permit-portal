import TableLayout from "@/app/layouts/TableLayout";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const skeletonColumnWidths = [
  "w-40",
  "w-32",
  "w-44",
  "w-24",
  "w-28",
  "w-32",
  "w-24",
  "w-12",
];

interface ApplicationListPageSkeletonProps {
  title?: string;
  showStatus?: boolean;
}

export default function ApplicationListPageSkeleton({
  title,
  showStatus = false,
}: ApplicationListPageSkeletonProps) {
  return (
    <div className="relative space-y-4" role="status" aria-label="Müraciətlər yüklənir">
      {title ? (
        <h1 className="pl-4 text-base font-medium leading-6 text-stone-900">{title}</h1>
      ) : (
        <Skeleton className="ml-4 h-6 w-40" />
      )}
      <TableLayout className="space-y-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-5 w-36" />
          </div>
          <Skeleton className="h-12 w-[240px] rounded-lg" />
        </div>

        <div className="flex gap-4">
          <Skeleton className="h-12 w-[400px] rounded-lg" />
          <Skeleton className="h-12 w-[200px] rounded-lg" />
          {showStatus ? <Skeleton className="h-12 w-[200px] rounded-lg" /> : null}
        </div>

        <div className="overflow-hidden rounded-lg border border-[#f5f5f5]">
          <Table>
            <TableHeader>
              <TableRow>
                {skeletonColumnWidths.map((width, index) => (
                  <TableHead key={index}>
                    <Skeleton className={`h-5 ${width}`} />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 6 }, (_, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={rowIndex % 2 === 1 ? "bg-[#fefefe]" : undefined}
                >
                  {skeletonColumnWidths.map((width, columnIndex) => (
                    <TableCell key={columnIndex}>
                      <Skeleton
                        className={columnIndex === 7 ? "size-12 rounded-lg" : `h-5 ${width}`}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex w-full items-center justify-between border-t border-[#f5f5f5] px-6 py-4">
          <Skeleton className="h-5 w-44" />
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-lg" />
            <Skeleton className="h-6 w-4" />
            <Skeleton className="size-10 rounded-lg" />
          </div>
        </div>
      </TableLayout>
    </div>
  );
}
