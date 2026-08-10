import { format } from "date-fns";
import { Eye, LoaderCircle, PenLine } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import TableLayout from "@/app/layouts/TableLayout";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import {
  useAwaitingSignatureApplications,
  useSignApplication,
} from "@/features/applications/hooks";
import type { ApplicationListItem } from "@/features/applications/types";

export default function AwaitingSignaturePage() {
  const navigate = useNavigate();
  const applications = useAwaitingSignatureApplications();
  const sign = useSignApplication();
  const responseData = applications.data?.data;
  const items: ApplicationListItem[] = Array.isArray(responseData)
    ? responseData
    : (responseData?.data ?? []);

  return (
    <div className="space-y-4">
      <h1 className="pl-4 text-base font-medium text-stone-900">
        İmzalanmamış icazələr
      </h1>
      <TableLayout className="space-y-5">
        <PageTitle
          title="İmza gözləyən müraciətlər"
          text={`Cəmi ${items.length} müraciət tapıldı`}
        />
        {applications.isLoading ? (
          <div className="flex justify-center py-20">
            <LoaderCircle className="size-9 animate-spin text-primary" />
          </div>
        ) : applications.isError ? (
          <div className="rounded-lg bg-destructive/5 p-6 text-center text-sm text-destructive">
            Müraciətlər yüklənmədi.
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#DFDFDF] p-12 text-center text-sm text-[#797979]">
            İmza gözləyən müraciət yoxdur.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#DFDFDF] bg-white p-5"
              >
                <div>
                  <p className="font-semibold text-[#1F1F1F]">
                    {item.application_no}
                  </p>
                  <p className="mt-1 text-sm text-[#797979]">
                    {item.permit_service.name} · {item.applicant_full_name}
                  </p>
                  <p className="mt-1 text-xs text-[#797979]">
                    {format(new Date(item.submitted_at), "dd.MM.yyyy")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() =>
                      navigate(`/applications/completed/manage/${item.id}`)
                    }
                  >
                    <Eye className="size-4" />
                    Önizlə
                  </Button>
                  <Button
                    className="gap-2"
                    disabled={sign.isPending}
                    onClick={() =>
                      sign.mutate(item.id, {
                        onSuccess: () => toast.success("İcazə imzalandı"),
                        onError: () => toast.error("İmzalama zamanı xəta baş verdi"),
                      })
                    }
                  >
                    <PenLine className="size-4" />
                    İmzala
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </TableLayout>
    </div>
  );
}
