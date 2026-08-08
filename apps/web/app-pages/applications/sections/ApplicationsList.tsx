import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  applicationStatusOptions,
  type CitizenApplicationListItem,
} from "@/features/applications/types";

const statusLabels = Object.fromEntries(applicationStatusOptions) as Record<string, string>;

const processStatuses = new Set([
  "registered",
  "assigned",
  "deficiency_confirmation",
  "report_confirmation",
  "payment_confirmation",
  "payment_review",
  "awaiting_signature",
]);

const actionClassName =
  "inline-flex h-10 items-center justify-center rounded-lg bg-[#286aa6] px-4 text-sm leading-5 font-semibold text-white transition-colors hover:bg-[#286aa6]/90 focus-visible:ring-2 focus-visible:ring-[#286aa6] focus-visible:outline-none";

type ApplicationsListProps = {
  applications: CitizenApplicationListItem[];
  errorMessage?: string;
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("az-AZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function StatusAction({ application }: { application: CitizenApplicationListItem }) {
  if (application.status === "draft") {
    return (
      <Button asChild className={actionClassName}>
        <Link href={`/applications/${application.id}`}>Davam et</Link>
      </Button>
    );
  }

  if (application.status === "awaiting_revision") {
    return (
      <Button asChild className={actionClassName}>
        <Link href={`/applications/${application.id}?section=deficiency`}>Çatışmazlığa bax</Link>
      </Button>
    );
  }

  if (application.status === "awaiting_payment") {
    return (
      <Button asChild className={actionClassName}>
        <Link href={`/applications/${application.id}?action=payment`}>Ödəniş et</Link>
      </Button>
    );
  }

  if (application.status === "completed") {
    return (
      <Button asChild className={actionClassName}>
        <Link href={`/applications/${application.id}?action=download`}>Sənədə bax</Link>
      </Button>
    );
  }

  if (processStatuses.has(application.status)) {
    return <span className="text-sm leading-5 text-[#797979]">Prosesdədir</span>;
  }

  return null;
}

export default function ApplicationsList({ applications, errorMessage }: ApplicationsListProps) {
  if (errorMessage) {
    return (
      <div role="alert" className="rounded-xl border border-[#dfdfdf] bg-white p-6 text-sm text-[#797979]">
        {errorMessage}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="rounded-xl border border-[#dfdfdf] bg-white p-8 text-center text-sm text-[#797979]">
        Müraciət tapılmadı.
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {applications.map((application) => (
        <article key={application.id} className="rounded-xl border border-[#dfdfdf] bg-white p-5 sm:p-6">
          <Link
            href={`/applications/${application.id}`}
            className="group block rounded-lg focus-visible:ring-2 focus-visible:ring-[#286aa6] focus-visible:outline-none"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm leading-5 text-[#797979]">Müraciət № {application.application_no}</p>
                <h2 className="mt-1 text-base leading-6 font-semibold text-[#1f1f1f] group-hover:text-[#286aa6]">
                  {application.permit_service.name}
                </h2>
              </div>
              <span className="w-fit rounded-full bg-[#f5f5f5] px-3 py-1 text-sm leading-5 font-medium text-[#286aa6]">
                {statusLabels[application.status] ?? application.status}
              </span>
            </div>
          </Link>

          <div className="mt-5 flex flex-col gap-4 border-t border-[#dfdfdf] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <time className="text-sm leading-5 text-[#797979]">
              Göndərilmə tarixi: {formatDate(application.submitted_at)}
            </time>
            <StatusAction application={application} />
          </div>
        </article>
      ))}
    </div>
  );
}
