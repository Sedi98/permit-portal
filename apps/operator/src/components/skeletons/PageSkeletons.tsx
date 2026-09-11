import TableLayout from "@/app/layouts/TableLayout";
import { Skeleton } from "@/components/ui/skeleton";

const rows = Array.from({ length: 6 }, (_, index) => index);
const cards = Array.from({ length: 4 }, (_, index) => index);

function PageHeadingSkeleton({ width = "w-36" }: { width?: string }) {
  return <Skeleton className={`ml-4 h-6 ${width}`} />;
}

function TableRowsSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#f5f5f5]">
      <div
        className="grid gap-6 bg-[#f5f5f5] px-4 py-3"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: columns }, (_, index) => (
          <Skeleton key={index} className="h-5 w-24" />
        ))}
      </div>
      {rows.map((row) => (
        <div
          key={row}
          className="grid gap-6 border-t border-[#f5f5f5] px-4 py-4"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }, (_, index) => (
            <Skeleton key={index} className="h-5 w-full max-w-32" />
          ))}
        </div>
      ))}
    </div>
  );
}

function ListPageSkeleton({
  titleWidth,
  columns = 5,
  filters = 2,
}: {
  titleWidth?: string;
  columns?: number;
  filters?: number;
}) {
  return (
    <div className="relative space-y-4" role="status" aria-label="Səhifə yüklənir">
      <PageHeadingSkeleton width={titleWidth} />
      <TableLayout className="space-y-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-5 w-40" />
          </div>
          <Skeleton className="h-12 w-36 rounded-lg" />
        </div>
        {filters > 0 ? (
          <div className="flex gap-4">
            <Skeleton className="h-12 w-[400px] rounded-lg" />
            {Array.from({ length: filters - 1 }, (_, index) => (
              <Skeleton key={index} className="h-12 w-[200px] rounded-lg" />
            ))}
          </div>
        ) : null}
        <TableRowsSkeleton columns={columns} />
        <div className="flex items-center justify-between border-t border-[#f5f5f5] px-6 py-4">
          <Skeleton className="h-5 w-44" />
          <div className="flex gap-3"><Skeleton className="size-10" /><Skeleton className="size-10" /></div>
        </div>
      </TableLayout>
    </div>
  );
}

function CardListPageSkeleton({ titleWidth }: { titleWidth?: string }) {
  return (
    <div className="space-y-4" role="status" aria-label="Səhifə yüklənir">
      <PageHeadingSkeleton width={titleWidth} />
      <TableLayout className="space-y-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1"><Skeleton className="h-6 w-52" /><Skeleton className="h-5 w-40" /></div>
          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>
        {cards.map((card) => (
          <div key={card} className="flex items-center justify-between rounded-xl border border-[#DFDFDF] p-5">
            <div className="space-y-2"><Skeleton className="h-6 w-52" /><Skeleton className="h-5 w-80" /><Skeleton className="h-4 w-24" /></div>
            <div className="flex gap-2"><Skeleton className="h-10 w-28" /><Skeleton className="h-10 w-24" /></div>
          </div>
        ))}
      </TableLayout>
    </div>
  );
}

function FormPageSkeleton({ wide = false }: { wide?: boolean }) {
  return (
    <div className="space-y-4" role="status" aria-label="Form yüklənir">
      <div className="flex items-center gap-3 p-4"><Skeleton className="size-6" /><Skeleton className="h-6 w-12" /><Skeleton className="h-6 w-48" /></div>
      <TableLayout className={`mx-auto space-y-6 ${wide ? "max-w-6xl" : "max-w-4xl"}`}>
        <Skeleton className="h-7 w-56" />
        <div className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: wide ? 10 : 6 }, (_, index) => (
            <div key={index} className="space-y-2"><Skeleton className="h-5 w-32" /><Skeleton className="h-12 w-full rounded-lg" /></div>
          ))}
        </div>
        <div className="flex justify-end gap-3"><Skeleton className="h-12 w-28" /><Skeleton className="h-12 w-36" /></div>
      </TableLayout>
    </div>
  );
}

export function LoginPageSkeleton() {
  return <div className="flex min-h-screen items-center justify-center bg-[#F7F9FC]" role="status" aria-label="Giriş səhifəsi yüklənir"><div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8"><Skeleton className="mx-auto size-16" /><Skeleton className="mx-auto h-8 w-48" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div></div>;
}

export function HomePageSkeleton() {
  return <div className="space-y-4" role="status" aria-label="Əsas səhifə yüklənir"><PageHeadingSkeleton /><div className="grid gap-4 md:grid-cols-4">{cards.map((card) => <Skeleton key={card} className="h-28 rounded-xl" />)}</div><TableLayout className="space-y-5"><div className="flex items-start justify-between"><div className="space-y-1"><Skeleton className="h-6 w-52" /><Skeleton className="h-5 w-40" /></div><Skeleton className="h-12 w-[240px]" /></div><div className="flex gap-4"><Skeleton className="h-12 w-[400px]" /><Skeleton className="h-12 w-[200px]" /><Skeleton className="h-12 w-[200px]" /></div><TableRowsSkeleton columns={8} /></TableLayout></div>;
}

export function BoardPageSkeleton() {
  return <div className="space-y-4" role="status" aria-label="Lövhə yüklənir"><PageHeadingSkeleton /><TableLayout className="space-y-6"><div className="flex justify-between"><Skeleton className="h-6 w-96" /><Skeleton className="h-10 w-28" /></div><div className="flex justify-between"><div className="flex gap-6"><Skeleton className="h-16 w-[220px]" /><Skeleton className="h-16 w-[220px]" /></div><Skeleton className="h-12 w-52" /></div><div className="grid gap-6 lg:grid-cols-2"><Skeleton className="h-[360px] rounded-xl" /><Skeleton className="h-[360px] rounded-xl" /></div><div className="grid gap-4 md:grid-cols-4">{cards.map((card) => <Skeleton key={card} className="h-28 rounded-xl" />)}</div></TableLayout></div>;
}

export function NotificationsPageSkeleton() { return <CardListPageSkeleton titleWidth="w-28" />; }
export function VisaQueuePageSkeleton() { return <ListPageSkeleton titleWidth="w-52" columns={6} />; }
export function SignQueuePageSkeleton() { return <ListPageSkeleton titleWidth="w-52" columns={6} />; }
export function AwaitingSignaturePageSkeleton() { return <CardListPageSkeleton titleWidth="w-44" />; }
export function ConfirmationQueuePageSkeleton() { return <CardListPageSkeleton titleWidth="w-64" />; }
export function ConfirmationHistoryPageSkeleton() { return <ListPageSkeleton titleWidth="w-44" columns={6} filters={0} />; }
export function ReportsPageSkeleton() { return <ListPageSkeleton titleWidth="w-24" columns={5} />; }
export function UsersPageSkeleton() { return <ListPageSkeleton titleWidth="w-32" columns={6} />; }
export function PermitServicesPageSkeleton() { return <ListPageSkeleton titleWidth="w-40" columns={5} />; }
export function ServiceRatingsPageSkeleton() { return <ListPageSkeleton titleWidth="w-40" columns={6} />; }
export function FaqsPageSkeleton() { return <CardListPageSkeleton titleWidth="w-20" />; }
export function UserCreatePageSkeleton() { return <FormPageSkeleton />; }
export function UserManagePageSkeleton() { return <FormPageSkeleton />; }
export function PermitServiceManagePageSkeleton() { return <FormPageSkeleton wide />; }
export function ContactSettingsPageSkeleton() { return <FormPageSkeleton />; }
export function VisaQueueManagePageSkeleton() { return <FormPageSkeleton wide />; }
export function SignQueueManagePageSkeleton() { return <FormPageSkeleton wide />; }
