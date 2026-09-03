"use client";

import { Download, LoaderCircle, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { getApplication } from "@/features/apply/api";
import { getApplicationDocumentDownloadUrl } from "@/features/applications/api";
import { Button } from "@/components/ui/button";

type NotificationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  date: string;
  message: string;
  applicationId: number;
  documentId?: number;
};

const applicationStatusLabels: Record<string, string> = {
  registered: "Qeydiyyata alındı",
  assigned: "İcraçıya həvalə edilib",
  deficiency_confirmation: "Çatışmazlıq bildirişi hazırlanır",
  awaiting_revision: "Düzəliş gözlənilir",
  report_confirmation: "Baxılır",
  payment_confirmation: "Ödəniş tapşırığı hazırlanır",
  awaiting_payment: "Ödəniş gözlənilir",
  payment_review: "Ödəniş yoxlanılır",
  awaiting_signature: "Rəsmiləşdirilir",
  completed: "İcazə verildi",
};

function InfoRow({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 text-sm leading-5">
      <dt className="shrink-0 text-[#797979]">{label}</dt>
      <dd
        className={`min-w-0 flex-1 break-words text-right ${
          accent ? "font-semibold text-[#286aa6]" : "font-medium text-[#1f1f1f]"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

export default function NotificationDialog({
  open,
  onOpenChange,
  title,
  date,
  message,
  applicationId,
  documentId,
}: NotificationDialogProps) {
  const applicationQuery = useQuery({
    queryKey: ["permit-application", applicationId],
    queryFn: () => getApplication(applicationId),
    enabled: open,
  });
  const application = applicationQuery.data?.data;
  const applicantName = application?.applicant_full_name?.trim() || [
    application?.last_name,
    application?.first_name,
    application?.father_name,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] !max-w-[640px] gap-0 overflow-y-auto rounded-xl bg-white p-0 sm:!max-w-[640px]"
      >
        <div className="flex items-start justify-between border-b border-[#dfdfdf] px-6 pt-5 pb-[21px]">
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-base leading-6 font-semibold text-[#1f1f1f]">
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm leading-5 text-[#797979]">
              {date}
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <button
              type="button"
              aria-label="Bağla"
              className="-mt-1 -mr-1 flex size-12 shrink-0 items-center justify-center rounded-lg p-3 text-[#286aa6] transition-colors hover:bg-[#f9fafc] focus-visible:ring-2 focus-visible:ring-[#286aa6] focus-visible:outline-none"
            >
              <X className="size-6" strokeWidth={1.5} />
            </button>
          </DialogClose>
        </div>

        <div className="flex flex-col gap-6 px-6 py-5">
          <p className="text-base leading-6 font-medium text-[#286aa6]">{message}</p>

          <section className="flex flex-col gap-3" aria-labelledby="application-info-title">
            <h2 id="application-info-title" className="text-sm leading-5 font-semibold text-[#1f1f1f]">
              Müraciət məlumatları
            </h2>
            <dl className="flex flex-col gap-3 rounded-xl bg-[#f9fafc] p-5">
              {applicationQuery.isPending ? (
                <div
                  className="flex items-center justify-center py-2 text-[#286aa6]"
                  role="status"
                >
                  <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
                  <span className="sr-only">Müraciət məlumatları yüklənir...</span>
                </div>
              ) : applicationQuery.isError ? (
                <p className="text-sm leading-5 text-[#d90b0b]" role="alert">
                  Müraciət məlumatlarını yükləmək mümkün olmadı.
                </p>
              ) : application ? (
                <>
                  {application.application_no ? (
                    <InfoRow
                      label="Müraciət nömrəsi:"
                      value={application.application_no}
                      accent
                    />
                  ) : null}
                  {application.permit_service?.name ? (
                    <InfoRow
                      label="İcazə növü:"
                      value={application.permit_service.name}
                    />
                  ) : null}
                  {applicantName ? (
                    <InfoRow label="Müraciət edən:" value={applicantName} />
                  ) : null}
                  {application.legal_entity_name ? (
                    <InfoRow
                      label="Hüquqi şəxs:"
                      value={application.legal_entity_name}
                    />
                  ) : null}
                  {application.status ? (
                    <InfoRow
                      label="Status:"
                      value={
                        applicationStatusLabels[application.status] ??
                        application.status
                      }
                    />
                  ) : null}
                </>
              ) : null}
            </dl>
          </section>

          <section className="flex flex-col gap-3" aria-labelledby="contact-info-title">
            <h2 id="contact-info-title" className="text-sm leading-5 font-semibold text-[#1f1f1f]">
              Əlaqə
            </h2>
            <dl className="flex flex-col gap-3 rounded-xl bg-[#f9fafc] p-5">
              <InfoRow label="Tel:" value="(+99412) 974" />
              <InfoRow label="E-poçt:" value="minenergy@minenergy.az" />
            </dl>
          </section>

          {documentId ? (
            <Button
              className="h-12 gap-2 self-end"
              onClick={() => {
                window.location.href = getApplicationDocumentDownloadUrl(
                  applicationId,
                  documentId,
                );
              }}
            >
              <Download className="size-4" aria-hidden="true" />
              İcazəni endir
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
