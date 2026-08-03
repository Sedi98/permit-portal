import PageTitle from "@/components/PageTitle";
import TableLayout from "@/app/layouts/TableLayout";

export default function ManagementPlaceholder({ title }: { title: string }) {
  return (
    <div className="space-y-4">
      <h1 className="pl-4 text-base font-medium leading-6 text-stone-900">{title}</h1>
      <TableLayout>
        <PageTitle title="Ətraflı məlumat" text="Bu səhifə API inteqrasiyasından sonra hazırlanacaq." />
        <div className="mt-8 rounded-lg border border-dashed border-[#dfdfdf] px-6 py-16 text-center text-sm text-[#797979]">
          İdarəetmə səhifəsi üçün placeholder
        </div>
      </TableLayout>
    </div>
  );
}
