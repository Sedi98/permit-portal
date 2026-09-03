"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Download, LoaderCircle } from "lucide-react";

import PaymentStep from "@/app-pages/apply/steps/payment-step";
import { Button } from "@/components/ui/button";
import { getApplication } from "@/features/apply/api";
import {
  getApplicationDocumentDownloadUrl,
  payApplication,
} from "@/features/applications/api";

type ApplicationDetailPageProps = {
  applicationId: number;
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("az-AZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function ApplicationDetailPage({
  applicationId,
}: ApplicationDetailPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const applicationQuery = useQuery({
    queryKey: ["permit-application", applicationId],
    queryFn: () => getApplication(applicationId),
  });
  const payMutation = useMutation({
    mutationFn: () => payApplication(applicationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["permit-application", applicationId],
      });
    },
  });
  const application = applicationQuery.data?.data;

  if (applicationQuery.isPending) {
    return (
      <main className="flex min-h-[40vh] items-center justify-center" role="status">
        <LoaderCircle className="size-8 animate-spin text-[#286aa6]" aria-hidden="true" />
        <span className="sr-only">Müraciət yüklənir...</span>
      </main>
    );
  }

  if (applicationQuery.isError || !application) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-8 md:px-20">
        <p className="rounded-xl bg-[#fef1f1] p-4 text-sm text-[#d90b0b]" role="alert">
          Müraciət məlumatlarını yükləmək mümkün olmadı.
        </p>
      </main>
    );
  }

  const documents = application.documents ?? [];

  if (application.status === "awaiting_payment") {
    return (
      <main className="py-8">
        <PaymentStep
          applicationNumber={application.application_no ?? `Müraciət #${application.id}`}
          permitServiceName={application.permit_service?.name}
          invoiceNumber={application.invoice_no}
          paymentAmount={application.payment_amount}
          isSubmitting={payMutation.isPending}
          errorMessage={
            payMutation.isError ? "Ödənişi qeydə almaq mümkün olmadı." : undefined
          }
          onBack={() => router.push("/applications")}
          onSubmit={() => payMutation.mutate()}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-8 md:px-20">
      <Button asChild variant="ghost" className="w-fit gap-2 px-0 text-[#286aa6] hover:bg-transparent">
        <Link href="/applications">
          <ArrowLeft className="size-5" aria-hidden="true" />
          Müraciətlərə qayıt
        </Link>
      </Button>

      <section className="rounded-xl border border-[#dfdfdf] bg-white p-6" aria-labelledby="application-detail-title">
        <h1 id="application-detail-title" className="text-xl font-semibold text-[#1f1f1f]">
          {application.application_no ?? `Müraciət #${application.id}`}
        </h1>
        <p className="mt-2 text-sm text-[#797979]">{application.permit_service?.name}</p>

        {application.status === "payment_review" ? (
          <div className="mt-6 rounded-xl bg-[#eef4fb] p-5 text-sm text-[#286aa6]" role="status">
            Ödənişiniz qeydə alınıb və icraçı tərəfindən yoxlanılır.
            {application.paid_at ? ` Ödəniş tarixi: ${formatDate(application.paid_at)}.` : ""}
          </div>
        ) : null}

        {application.status === "completed" ? (
          <div className="mt-6 space-y-3">
            <h2 className="font-semibold text-[#1f1f1f]">Rəsmiləşdirilmiş sənədlər</h2>
            {documents.length > 0 ? documents.map((document) => (
              <div key={document.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#f9fafc] p-4">
                <div>
                  <p className="font-medium text-[#1f1f1f]">
                    {document.document_number ?? `Sənəd #${document.id}`}
                  </p>
                  <p className="mt-1 text-xs text-[#797979]">{formatDate(document.generated_at)}</p>
                </div>
                <Button
                  className="gap-2"
                  onClick={() => {
                    window.location.href = getApplicationDocumentDownloadUrl(
                      application.id,
                      document.id,
                    );
                  }}
                >
                  <Download className="size-4" aria-hidden="true" />
                  Endir
                </Button>
              </div>
            )) : (
              <p className="text-sm text-[#797979]">Endirilə bilən sənəd tapılmadı.</p>
            )}
          </div>
        ) : null}
      </section>
    </main>
  );
}
