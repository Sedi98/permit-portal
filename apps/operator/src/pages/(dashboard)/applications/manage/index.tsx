import { useState } from "react";
import { isAxiosError } from "axios";
import { format } from "date-fns";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { toast } from "sonner";

import TableLayout from "@/app/layouts/TableLayout";
import A4Preview, { type A4PreviewField } from "@/components/A4Preview";
import ApplicationExecutorsContainer from "@/components/ApplicationExecutorsContainer";
import ApplicationDetailPageSkeleton from "@/components/skeletons/ApplicationDetailPageSkeleton";
import NoteTextarea from "@/components/NoteTextarea";
import RequiredDocumentsSection from "@/components/RequiredDocumentsSection";
import Stepper from "@/components/Stepper";
import { Button } from "@/components/ui/button";
import type { Option } from "@/components/ui/multi-select";
import { useMe } from "@/features/auth/hooks";
import {
  useApplicationById,
  useApplicationDocumentDownload,
  useConfirmPaymentReceived,
  useRouteApplication,
  useRoutingCandidates,
} from "@/features/applications/hooks";
import type {
  ApplicationDetail,
  ApplicationStatus,
} from "@/features/applications/types";

import ApplicationAssignSection from "@/features/applications/components/ApplicationAssignSection";
import ConfirmationHistorySection from "@/features/applications/components/ConfirmationHistorySection";
import ConfirmationSequenceForm from "@/features/applications/components/ConfirmationSequenceForm";
import TradeDetailSection from "@/features/applications/components/TradeDetailSection";
import InstalledCapacityField from "@/features/applications/components/InstalledCapacityField";

const APPLICATION_STEPS = [
  { label: "Sahə seçimi" },
  { label: "Sənədlər" },
  { label: "İcraya vermə" },
  { label: "Yoxlama" },
  { label: "Ödəniş" },
  { label: "Müraciətin nəticəsi" },
];

const PAYMENT_FREE_APPLICATION_STEPS = APPLICATION_STEPS.filter(
  (step) => step.label !== "Ödəniş",
);

const userRoleLabels = {
  super_admin: "Super admin",
  executor: "İcraçı",
  department_head: "Şöbə müdiri",
  deputy_minister: "Nazir müavini",
};

const assignmentRoleLabels = {
  main: "Əsas icraçı",
  joint: "Müştərək icraçı",
  observer: "Nəzarətçi",
};

function getActiveStep(status: ApplicationStatus, requiresPayment: boolean) {
  if (status === "completed") return requiresPayment ? 5 : 4;
  if (status === "awaiting_signature") return requiresPayment ? 5 : 4;
  if (
    status === "payment_confirmation" ||
    status === "awaiting_payment" ||
    status === "payment_review"
  ) {
    return 4;
  }
  if (
    status === "assigned" ||
    status === "under_review" ||
    status === "deficiency_confirmation" ||
    status === "awaiting_revision" ||
    status === "report_confirmation" ||
    status === "in_document_flow"
  ) {
    return 3;
  }
  return 2;
}

function getApplicationFields(detail: ApplicationDetail): A4PreviewField[] {
  const contact = detail.phones.map((phone) => phone.phone).join(", ");

  if (detail.applicant_type === "physical") {
    return [
      {
        label: "Şəxsin soyadı, adı, ata adı",
        value:
          detail.applicant_full_name ||
          `${detail.last_name} ${detail.first_name} ${detail.father_name}`.trim(),
      },
      { label: "Ş/V sənədin seriyası və nömrəsi", value: detail.id_series },
      { label: "Şəxsin fərdi identifikasiya nömrəsi", value: detail.fin },
      { label: "E-poçt", value: detail.email },
      { label: "Əlaqə", value: contact },
    ];
  }

  return [
    {
      label: "Hüquqi şəxsin adı",
      value: detail.legal_entity_name ?? detail.applicant_full_name,
    },
    { label: "Qeydiyyat ünvanı", value: detail.legal_address ?? "" },
    { label: "VÖEN", value: detail.voen ?? "" },
    { label: "E-poçt", value: detail.email },
    { label: "Əlaqə", value: contact },
  ];
}

export default function ApplicationDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isReadOnly = searchParams.get("readonly") === "1";
  const applicationId = id ? Number(id) : undefined;
  const applicationQuery = useApplicationById(applicationId);
  const meQuery = useMe();
  const detail = applicationQuery.data?.data;
  const me = meQuery.data?.data;
  const isSuperAdmin = me?.role === "super_admin";
  const requiresPayment = detail?.permit_service.requires_payment !== false;
  const isCurrentAssignee =
    detail?.assignees.some((assignee) => assignee.user_id === me?.id) ?? false;
  const canRoute =
    !isReadOnly &&
    !!detail &&
    ((detail.status === "registered" &&
      (me?.role === "deputy_minister" || isSuperAdmin)) ||
      (detail.status === "assigned" && (isCurrentAssignee || isSuperAdmin)));
  const canReviewFiles =
    !isReadOnly &&
    !!detail &&
    detail.status === "assigned" &&
    (isCurrentAssignee || isSuperAdmin);
  const candidatesQuery = useRoutingCandidates(canRoute);
  const routeMutation = useRouteApplication(applicationId ?? 0);
  const confirmPayment = useConfirmPaymentReceived(applicationId ?? 0);
  const downloadDocument = useApplicationDocumentDownload();
  const [selectedPeople, setSelectedPeople] = useState<Option[]>([]);
  const [selectedExecutor, setSelectedExecutor] = useState("");
  const [note, setNote] = useState("");

  const candidateOptions =
    candidatesQuery.data?.data.map((candidate) => ({
      value: String(candidate.id),
      label: candidate.name,
    })) ?? [];

  const handlePeopleChange = (people: Option[]) => {
    setSelectedPeople(people);
    setSelectedExecutor((current) =>
      people.some((person) => person.value === current)
        ? current
        : (people[0]?.value ?? ""),
    );
  };

  const handleRoute = () => {
    if (!selectedExecutor) {
      toast.error("Əsas icraçını seçin");
      return;
    }

    routeMutation.mutate(
      {
        main_user_id: Number(selectedExecutor),
        joint_user_ids: selectedPeople
          .filter((person) => person.value !== selectedExecutor)
          .map((person) => Number(person.value)),
        ...(note.trim() ? { note: note.trim() } : {}),
      },
      {
        onSuccess: () => {
          toast.success("Müraciət yönləndirildi");
          setNote("");
          setSelectedPeople([]);
          setSelectedExecutor("");
        },
        onError: () => {
          toast.error("Müraciət yönləndirilərkən xəta baş verdi");
        },
      },
    );
  };

  if (applicationQuery.isLoading || meQuery.isLoading) {
    return <ApplicationDetailPageSkeleton />;
  }

  if (!applicationId || applicationQuery.isError || !detail) {
    return (
      <div className="p-6 text-sm text-destructive">
        Müraciət məlumatları yüklənmədi.
      </div>
    );
  }

  const fields = getApplicationFields(detail);
  const historyNotes = detail.status_histories
    .filter((history) => history.note?.trim())
    .map((history) => {
      const author = history.changed_by ?? history.changed_by_user;
      const assignee = detail.assignees.find(
        (item) => item.user_id === author?.id,
      );
      const assigneeRole = assignee
        ? (assignee.assignment_role_label ??
          assignmentRoleLabels[assignee.assignment_role])
        : undefined;

      return {
        role:
          assigneeRole ??
          (author?.role ? userRoleLabels[author.role] : "—"),
        name: author?.name ?? assignee?.user?.name ?? "—",
        date: format(new Date(history.created_at), "dd.MM.yyyy"),
        note: history.note?.trim() ?? "",
      };
    });
  const confirmationSequences =
    detail.confirmationSequences ?? detail.confirmation_sequences ?? [];
  const hasCompletedReport = confirmationSequences.some(
    (sequence) => sequence.type === "report" && sequence.status === "completed",
  );
  const allFilesReviewed =
    detail.files.length > 0 &&
    detail.files.every(
      (file) =>
        file.review_status === "accepted" || file.review_status === "rejected",
    );
  const hasRejectedFile = detail.files.some(
    (file) => file.review_status === "rejected",
  );
  const nextSequenceType = !allFilesReviewed
    ? null
    : hasRejectedFile
      ? ("deficiency" as const)
      : !hasCompletedReport
        ? ("report" as const)
        : requiresPayment
          ? ("payment" as const)
          : null;
  const tradeDetail = detail.tradeDetail ?? detail.trade_detail;
  const serviceCode = detail.permit_service.code;
  const isTradePermit = serviceCode === "PS-001" || serviceCode === "PS-002";
  const canEditSpecialFields =
    !isReadOnly &&
    (isCurrentAssignee || isSuperAdmin) &&
    (detail.status === "payment_review" ||
      (!requiresPayment && detail.status === "assigned"));
  const hasRequiredSignatureFields =
    !isTradePermit ||
    (Boolean(tradeDetail?.permit_duration?.trim()) &&
      Boolean(tradeDetail?.contract_number?.trim()));
  const canSendToSignature =
    !isReadOnly &&
    !requiresPayment &&
    detail.status === "assigned" &&
    hasCompletedReport &&
    (isCurrentAssignee || isSuperAdmin);

  return (
    <main className="space-y-5 md:space-y-10">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="h-auto gap-2 rounded-lg px-4 py-3 text-base font-semibold leading-6 text-[#286AA6]"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="size-6" />
            Geri
          </Button>
          <h1 className="text-base font-semibold leading-6 text-[#1F1F1F]">
            Müraciətin detalları
          </h1>
        </div>

        <Stepper
          steps={
            requiresPayment ? APPLICATION_STEPS : PAYMENT_FREE_APPLICATION_STEPS
          }
          activeStep={getActiveStep(detail.status, requiresPayment)}
        />
      </div>

      <A4Preview
        date={format(new Date(detail.created_at), "dd.MM.yyyy")}
        srn={detail.application_no}
        title={`${detail.permit_service.name} üçün müraciət`}
        applicationTitle="Ə R İ Z Ə"
        fields={fields}
      />

      {isTradePermit && tradeDetail ? (
        <TableLayout>
          <TradeDetailSection
            applicationId={applicationId}
            serviceCode={serviceCode}
            tradeDetail={tradeDetail}
            canEdit={canEditSpecialFields}
          />
        </TableLayout>
      ) : null}

      <TableLayout>
        <ApplicationExecutorsContainer
          executors={detail.assignees.map((assignee) => ({
            role:
              assignee.assignment_role_label ??
              assignmentRoleLabels[assignee.assignment_role],
            name: assignee.user?.name ?? `İstifadəçi #${assignee.user_id}`,
            date: assignee.created_at
              ? format(new Date(assignee.created_at), "dd.MM.yyyy")
              : "—",
          }))}
          notes={historyNotes}
        />

        {canRoute ? (
          <section className="mt-8 space-y-5" aria-labelledby="routing-title">
            <h2 id="routing-title" className="text-xl font-bold text-[#1F1F1F]">
              İcraçıya yönləndir
            </h2>
            {candidatesQuery.isLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="size-8 animate-spin rounded-full border-3 border-[#286aa6] border-t-transparent" />
              </div>
            ) : candidatesQuery.isError ? (
              <div className="flex flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
                <p className="text-sm text-destructive">
                  Yönləndirmə namizədləri yüklənmədi.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => candidatesQuery.refetch()}
                >
                  <RefreshCw className="size-4" />
                  Yenidən yoxla
                </Button>
              </div>
            ) : (
              <>
                <ApplicationAssignSection
                  availablePeople={candidateOptions}
                  selectedPeople={selectedPeople}
                  onPeopleChange={handlePeopleChange}
                  selectedExecutor={selectedExecutor}
                  onExecutorChange={setSelectedExecutor}
                />
                <NoteTextarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                />
                <div className="flex justify-end">
                  <Button
                    className="mt-4 h-12 w-[160px]"
                    disabled={routeMutation.isPending || !selectedExecutor}
                    onClick={handleRoute}
                  >
                    Yönləndir
                  </Button>
                </div>
              </>
            )}
          </section>
        ) : null}

        {canReviewFiles && nextSequenceType ? (
          <ConfirmationSequenceForm
            applicationId={applicationId}
            type={nextSequenceType}
          />
        ) : null}

        <ConfirmationHistorySection
          sequences={confirmationSequences}
          canApproveAny={!isReadOnly && isSuperAdmin}
        />

        {canSendToSignature ? (
          <section className="mt-8 space-y-4" aria-labelledby="signature-title">
            <h2 id="signature-title" className="text-xl font-bold text-[#1F1F1F]">
              İmzaya göndərilmə
            </h2>
            <p className="text-sm text-[#797979]">
              Bu icazə dövlət rüsumu tələb etmir və birbaşa imzaya göndərilə bilər.
            </p>
            <div className="flex justify-end">
              <Button
                disabled={confirmPayment.isPending || !hasRequiredSignatureFields}
                onClick={() =>
                  confirmPayment.mutate(undefined, {
                    onSuccess: () => toast.success("Müraciət imzaya göndərildi"),
                    onError: (error) =>
                      toast.error(getApiErrorMessage(error, "Müraciət imzaya göndərilərkən xəta baş verdi")),
                  })
                }
              >
                İmzaya göndər
              </Button>
            </div>
            {!hasRequiredSignatureFields ? (
              <p className="text-sm text-destructive">
                İmzaya göndərmək üçün icazənin müddəti və müqavilənin nömrəsi doldurulmalıdır.
              </p>
            ) : null}
          </section>
        ) : null}

        {!isReadOnly && detail.status === "payment_review" &&
        (isCurrentAssignee || isSuperAdmin) ? (
          <section className="mt-8 space-y-4" aria-labelledby="payment-review-title">
            <h2 id="payment-review-title" className="text-xl font-bold text-[#1F1F1F]">
              Ödənişin yoxlanılması
            </h2>
            <div className="grid gap-4 rounded-xl border border-[#DFDFDF] p-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-[#797979]">Hesab-faktura</p>
                <p className="font-medium">{detail.invoice_no ?? "—"}</p>
              </div>
              <div>
                <p className="text-sm text-[#797979]">Məbləğ</p>
                <p className="font-medium">{detail.payment_amount ?? "—"} AZN</p>
              </div>
              <div>
                <p className="text-sm text-[#797979]">Ödəniş tarixi</p>
                <p className="font-medium">
                  {detail.paid_at
                    ? format(new Date(detail.paid_at), "dd.MM.yyyy HH:mm")
                    : "—"}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                disabled={confirmPayment.isPending || !hasRequiredSignatureFields}
                onClick={() =>
                  confirmPayment.mutate(undefined, {
                    onSuccess: () => toast.success("Ödəniş təsdiqləndi"),
                    onError: (error) =>
                      toast.error(getApiErrorMessage(error, "Ödəniş təsdiqlənərkən xəta baş verdi")),
                  })
                }
              >
                Ödənişi təsdiqlə
              </Button>
            </div>
            {!hasRequiredSignatureFields ? (
              <p className="text-sm text-destructive">
                Ödənişi təsdiqləyib imzaya göndərmək üçün icazənin müddəti və müqavilənin nömrəsi doldurulmalıdır.
              </p>
            ) : null}
          </section>
        ) : null}
      </TableLayout>

      <TableLayout>
        <RequiredDocumentsSection
          subtitle={detail.permit_service.name}
          applicationId={detail.id}
          documents={detail.files}
          canReview={canReviewFiles}
        >
          {serviceCode === "PS-003" ? (
            <InstalledCapacityField
              applicationId={detail.id}
              value={detail.installed_capacity}
              canEdit={canEditSpecialFields}
            />
          ) : null}
        </RequiredDocumentsSection>
      </TableLayout>

      {detail.status === "completed" && detail.documents.length > 0 ? (
        <TableLayout>
          <section className="space-y-4" aria-labelledby="permit-documents-title">
            <h2 id="permit-documents-title" className="text-xl font-bold text-[#1F1F1F]">
              Rəsmiləşdirilmiş icazə
            </h2>
            {detail.documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between rounded-xl border border-[#DFDFDF] p-4"
              >
                <span className="font-medium">
                  {document.document_number ?? `Sənəd #${document.id}`}
                </span>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={async () => {
                    const url = await downloadDocument(detail.id, document.id);
                    const link = window.document.createElement("a");
                    link.href = url;
                    link.download = `${detail.application_no}.pdf`;
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="size-4" />
                  Endir
                </Button>
              </div>
            ))}
          </section>
        </TableLayout>
      ) : null}
    </main>
  );
}

function getApiErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError<{ message?: string }>(error)) return fallback;
  return error.response?.data?.message ?? fallback;
}
