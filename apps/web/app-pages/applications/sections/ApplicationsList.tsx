"use client";

import Link from "next/link";
import { useState } from "react";
import { CreditCard, Download, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { downloadApplicationDocument } from "@/features/applications/api";
import { applicationStatusOptions, type CitizenApplicationListItem } from "@/features/applications/types";

const statusLabels = Object.fromEntries(applicationStatusOptions) as Record<string, string>;
type StatusTone = "orange" | "blue" | "green" | "red" | "gray";
type StatusAction = "view" | "continue" | "pay" | "download" | "revision";
type StatusConfig = { tone: StatusTone; message: string; action: StatusAction };

const statusConfig: Record<string, StatusConfig> = {
  draft: { tone: "gray", message: "Müraciət tamamlanmayıb.", action: "continue" },
  registered: { tone: "blue", message: "Müraciətiniz qeydiyyata alındı. Tezliklə baxılacaq.", action: "view" },
  assigned: { tone: "blue", message: "Müraciətiniz icraçıya yönləndirildi.", action: "view" },
  deficiency_confirmation: { tone: "orange", message: "Çatışmazlıq bildirişi hazırlanır.", action: "view" },
  awaiting_revision: { tone: "orange", message: "Müraciət üzrə düzəliş tələb olunur.", action: "revision" },
  report_confirmation: { tone: "orange", message: "Müraciətiniz ekspertlər tərəfindən baxılır.", action: "view" },
  payment_confirmation: { tone: "blue", message: "Ödəniş tapşırığı hazırlanıb.", action: "pay" },
  awaiting_payment: { tone: "blue", message: "Ödəniş gözlənilir.", action: "pay" },
  payment_review: { tone: "blue", message: "Ödənişiniz yoxlanılır.", action: "view" },
  awaiting_signature: { tone: "blue", message: "Müraciət rəsmiləşdirilir.", action: "view" },
  completed: { tone: "green", message: "İcazə verildi. Sənədi yükləyə bilərsiniz.", action: "download" },
};

const nonNavigableStatuses = new Set([
  "registered",
  "assigned",
  "deficiency_confirmation",
  "report_confirmation",
  "payment_confirmation",
  "payment_review",
  "awaiting_signature",
]);

const toneClasses: Record<StatusTone, { dot: string; text: string }> = {
  orange: { dot: "bg-[#e97000]", text: "text-[#e97000]" },
  blue: { dot: "bg-[#286aa6]", text: "text-[#286aa6]" },
  green: { dot: "bg-[#34b443]", text: "text-[#34b443]" },
  red: { dot: "bg-[#d90b0b]", text: "text-[#d90b0b]" },
  gray: { dot: "bg-[#797979]", text: "text-[#797979]" },
};

const actionClassName = "inline-flex h-10 min-w-[98px] items-center justify-center gap-2 rounded-lg bg-[#286aa6] px-4 text-sm leading-5 font-semibold text-white transition-colors hover:bg-[#1f5688] focus-visible:ring-2 focus-visible:ring-[#286aa6] focus-visible:outline-none";
const iconButtonClassName = "inline-flex size-10 items-center justify-center rounded-lg border border-[#dfdfdf] bg-white text-[#286aa6] transition-colors hover:bg-[#f5f5f5] focus-visible:ring-2 focus-visible:ring-[#286aa6] focus-visible:outline-none";

type ApplicationsListProps = { applications: CitizenApplicationListItem[]; errorMessage?: string };

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("az-AZ", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

function getStatusConfig(status: string): StatusConfig {
  return statusConfig[status] ?? { tone: "red", message: "Müraciətin statusu yenilənir.", action: "view" };
}

async function downloadDocument(applicationId: number, documentId: number) {
  try {
    const blob = await downloadApplicationDocument(applicationId, documentId);
    const objectUrl = window.URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");

    downloadLink.href = objectUrl;
    downloadLink.download = "icaze.pdf";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    window.URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.error("PDF endirilərkən xəta baş verdi:", error);
  }
}

function StatusAction({ application, action }: { application: CitizenApplicationListItem; action: StatusAction }) {
  if (nonNavigableStatuses.has(application.status)) {
    return null;
  }

  if (action === "continue") {
    return <Button asChild className={actionClassName}><Link href={`/applications/${application.id}?status=draft`}>Davam et</Link></Button>;
  }
  if (action === "pay") {
    return <Button asChild className={actionClassName}><Link href={`/applications/${application.id}?action=payment`}><CreditCard className="size-4" aria-hidden="true" />Ödə</Link></Button>;
  }
  if (action === "download") {
    const document = application.documents?.[0];

    if (!document) {
      return null;
    }

    return (
      <Button
        className={actionClassName}
        onClick={() => void downloadDocument(application.id, document.id)}
      >
        <Download className="size-4" aria-hidden="true" />
        Endir
      </Button>
    );
  }
  if (action === "revision") {
    return <Button asChild className={actionClassName}><Link href={`/applications/${application.id}?section=deficiency`}>Bax</Link></Button>;
  }
  return <Button asChild className={actionClassName}><Link href={`/applications/${application.id}?status=${application.status}`}>Bax</Link></Button>;
}

function StatusIndicator({ status }: { status: string }) {
  const config = getStatusConfig(status);
  const tone = toneClasses[config.tone];
  return <span className={`flex items-center gap-2 text-sm leading-5 font-medium ${tone.text}`}><span className={`size-1.5 rounded-full ${tone.dot}`} aria-hidden="true" />{statusLabels[status] ?? status}</span>;
}

export default function ApplicationsList({ applications, errorMessage }: ApplicationsListProps) {
  const [visibleMessageIds, setVisibleMessageIds] = useState<Set<number>>(
    () => new Set(),
  );

  function toggleSystemMessage(applicationId: number) {
    setVisibleMessageIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(applicationId)) {
        nextIds.delete(applicationId);
      } else {
        nextIds.add(applicationId);
      }

      return nextIds;
    });
  }

  if (errorMessage) return <div role="alert" className="rounded-xl border border-[#dfdfdf] bg-white p-6 text-sm text-[#797979]">{errorMessage}</div>;
  if (applications.length === 0) return <div className="rounded-xl border border-[#dfdfdf] bg-white p-8 text-center text-sm text-[#797979]">Müraciət tapılmadı.</div>;

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#dfdfdf] bg-[#f5f5f5]">
      <div className="min-w-[960px]">
        <div className="grid grid-cols-[200px_1fr_200px_200px_160px] items-center gap-2 rounded-t-xl bg-[#f9fafc] px-8 py-5 text-base leading-6 font-semibold text-[#1f1f1f]">
          <span>Müraciət №</span><span>İcazə növü</span><span>Tarix</span><span>Status</span><span className="text-right">Əməliyyat</span>
        </div>
        {applications.map((application) => {
          const config = getStatusConfig(application.status);
          const isMessageVisible = visibleMessageIds.has(application.id);
          const messageId = `system-message-${application.id}`;
          return (
            <div key={application.id} className="border-t border-[#dfdfdf] bg-[#f5f5f5]">
              <div className="grid grid-cols-[200px_1fr_200px_200px_160px] items-center gap-2 px-8 py-4">
                <Link href={`/permissions/${application.permit_service.id}`} className="text-sm leading-5 font-semibold text-[#286aa6] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#286aa6]">{application.application_no}</Link>
                <Link href={`/permissions/${application.permit_service.id}`} className="min-w-0 truncate pr-3 text-sm leading-5 text-[#1f1f1f] hover:text-[#286aa6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#286aa6]">{application.permit_service.name}</Link>
                <time className="text-sm leading-5 font-medium text-[#797979]">{formatDate(application.submitted_at)}</time>
                <StatusIndicator status={application.status} />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    aria-label={isMessageVisible ? "Sistem mesajını gizlət" : "Sistem mesajını göstər"}
                    aria-controls={messageId}
                    aria-expanded={isMessageVisible}
                    className={iconButtonClassName}
                    onClick={() => toggleSystemMessage(application.id)}
                  >
                    {isMessageVisible ? (
                      <EyeOff className="size-5" strokeWidth={1.5} aria-hidden="true" />
                    ) : (
                      <Eye className="size-5" strokeWidth={1.5} aria-hidden="true" />
                    )}
                  </button>
                  <StatusAction application={application} action={config.action} />
                </div>
              </div>
              <div
                id={messageId}
                aria-hidden={!isMessageVisible}
                className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                  isMessageVisible ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="px-8 pb-4">
                    <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm leading-5">
                      <span className="text-[#797979]">Sistem mesajı</span>
                      <span className="text-[#1f1f1f]">· {config.message}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
