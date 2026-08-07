import * as React from "react";
import { ArrowLeft, Check, Download, Eye, X } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import TableLayout from "@/app/layouts/TableLayout";
import ApplicationExecutorsContainer from "@/components/ApplicationExecutorsContainer";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMe } from "@/features/auth/hooks";
import {
  useApplicationById,
  useAssignApplication,
  useChangeStatus,
  useDepartments,
  useFileDownload,
  useForwardApplication,
  usePrepareApplicationDocument,
  useReviewApplicationFile,
  useExecutors,
} from "@/features/applications/hooks";
import type { ApplicationStatus, AssignmentRole } from "@/features/applications/types";
import { useConfirmPayment } from "@/features/awaiting-payment/hooks";

const statusLabels: Record<ApplicationStatus, string> = {
  registered: "Qeydiyyata alındı",
  forwarded: "Şöbəyə yönləndirildi",
  assigned: "İcraçı təyin olundu",
  under_review: "Baxılmaqdadır",
  in_document_flow: "Sənəd dövriyyəsində",
  awaiting_payment: "Ödəniş gözlənilir",
  awaiting_revision: "Düzəliş gözlənilir",
  sent_for_approval: "Təsdiq gözləyir",
  completed: "İcra olundu",
  rejected: "İmtina edildi",
  suspended: "Dayandırıldı",
};

const statusBadgeVariants: Record<ApplicationStatus, React.ComponentProps<typeof StatusBadge>["variant"]> = {
  registered: "registered",
  forwarded: "registered",
  assigned: "assigned",
  under_review: "under_review",
  in_document_flow: "under_review",
  awaiting_payment: "sent_for_approval",
  awaiting_revision: "registered",
  sent_for_approval: "sent_for_approval",
  completed: "completed",
  rejected: "rejected",
  suspended: "suspended",
};

const assignmentLabels: Record<AssignmentRole, string> = {
  main: "Əsas icraçı",
  joint: "Müştərək icraçı",
  observer: "Nəzarət",
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("az-AZ", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function ApplicationManagePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const applicationId = id ? Number(id) : undefined;
  const { data, isLoading } = useApplicationById(applicationId);
  const { data: meData } = useMe();
  const { data: departmentsData } = useDepartments();
  const { data: executorsData } = useExecutors();
  const detail = data?.data;
  const me = meData?.data;
  const role = me?.role;

  const changeStatus = useChangeStatus(applicationId ?? 0);
  const forward = useForwardApplication(applicationId ?? 0);
  const assign = useAssignApplication(applicationId ?? 0);
  const prepareDocument = usePrepareApplicationDocument(applicationId ?? 0);
  const confirmPayment = useConfirmPayment(applicationId ?? 0);
  const downloadFile = useFileDownload();

  const [forwardDepartment, setForwardDepartment] = React.useState("");
  const [forwardNote, setForwardNote] = React.useState("");
  const [selectedExecutors, setSelectedExecutors] = React.useState<string[]>([]);
  const [assignmentRoles, setAssignmentRoles] = React.useState<Record<string, Exclude<AssignmentRole, "main">>>({});
  const [mainExecutor, setMainExecutor] = React.useState("");
  const [assignmentNote, setAssignmentNote] = React.useState("");
  const [documentType, setDocumentType] = React.useState("deficiency");
  const [documentBody, setDocumentBody] = React.useState("");

  const isSuperAdmin = role === "super_admin";
  const ownAssignment = detail?.assignees?.find((assignee) => assignee.user_id === me?.id);
  const isMainExecutor = isSuperAdmin || ownAssignment?.assignment_role === "main";
  const canForward = (role === "deputy_minister" || isSuperAdmin) && detail?.status === "registered";
  const canAssign = (role === "department_head" || isSuperAdmin) && detail?.status === "forwarded";
  const canReview = role === "executor" && isMainExecutor && detail?.status === "under_review";
  const canPrepareDocument = canReview;
  const canStartReview = role === "executor" && isMainExecutor && detail?.status === "assigned";
  const canConfirmPayment = role === "executor" && detail?.status === "awaiting_payment";

  const submitForward = () => {
    if (!forwardDepartment) return toast.error("Şöbə seçin");
    forward.mutate(
      { department_id: Number(forwardDepartment), ...(forwardNote ? { note: forwardNote } : {}) },
      { onSuccess: () => toast.success("Müraciət şöbəyə yönləndirildi"), onError: () => toast.error("Yönləndirmə zamanı xəta baş verdi") },
    );
  };

  const submitAssignment = () => {
    if (!mainExecutor || selectedExecutors.length === 0) return toast.error("Ən azı bir icraçı və əsas icraçı seçin");
    const assignees = selectedExecutors.map((userId) => ({
      user_id: Number(userId),
      assignment_role: (userId === mainExecutor ? "main" : (assignmentRoles[userId] ?? "joint")) as AssignmentRole,
    }));
    assign.mutate(
      { assignees, ...(assignmentNote ? { note: assignmentNote } : {}) },
      { onSuccess: () => toast.success("İcraçılar təyin edildi"), onError: () => toast.error("İcraçı təyinatı zamanı xəta baş verdi") },
    );
  };

  const startReview = () => {
    changeStatus.mutate({ status: "under_review" }, { onSuccess: () => toast.success("Müraciət baxılmağa başladı") });
  };

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="size-10 animate-spin rounded-full border-4 border-[#286aa6] border-t-transparent" /></div>;
  if (!detail || !applicationId) return <div className="p-6 text-sm text-destructive">Müraciət tapılmadı.</div>;

  return (
    <main className="space-y-5 md:space-y-8">
      <div className="flex items-center gap-3 p-4">
        <Button variant="ghost" className="gap-2 text-[#286AA6]" onClick={() => navigate(-1)}><ArrowLeft className="size-5" />Geri</Button>
        <h1 className="text-base font-semibold text-[#1F1F1F]">Müraciətin detalları</h1>
        <StatusBadge variant={statusBadgeVariants[detail.status]} label={statusLabels[detail.status]} />
      </div>

      <TableLayout className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[#1F1F1F]">Müraciət edən</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Info label="Ad, soyad, ata adı" value={`${detail.first_name} ${detail.last_name} ${detail.father_name}`.trim()} />
            <Info label="Müraciət nömrəsi" value={detail.application_no} />
            <Info label="FİN" value={detail.fin} />
            <Info label="Əlaqə" value={detail.phones.map((phone) => phone.phone).join(", ") || "—"} />
            <Info label="İcazə növü" value={detail.permit_service.name} />
            <Info label="Müraciət tarixi" value={formatDate(detail.submitted_at)} />
          </div>
        </section>

        <ApplicationExecutorsContainer
          executors={detail.assignees.map((assignee) => ({
            name: assignee.user?.name ?? `İstifadəçi #${assignee.user_id}`,
            date: "—",
            assignment: assignmentLabels[assignee.assignment_role],
          }))}
        />

        {detail.status_histories.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#1F1F1F]">Status tarixçəsi</h2>
            {detail.status_histories.map((history, index) => (
              <div key={`${history.created_at}-${index}`} className="rounded-lg border border-[#dfdfdf] p-4 text-sm">
                <p className="font-medium">{history.note || "Status dəyişdirildi"}</p>
                <p className="mt-1 text-[#797979]">{history.changed_by?.name ?? history.changed_by_user?.name ?? "Sistem"} · {formatDate(history.created_at)}</p>
              </div>
            ))}
          </section>
        )}

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#1F1F1F]">Yüklənmiş sənədlər</h2>
          {detail.files.map((file) => (
            <div key={file.id} className="flex items-center justify-between rounded-lg border border-[#dfdfdf] p-3">
              <div><p className="font-medium">{file.original_name}</p><p className="text-sm text-[#797979]">{file.document_type}</p></div>
              <div className="flex gap-2">
                {canReview && <FileReviewControls applicationId={applicationId} fileId={file.id} />}
                <Button size="icon" variant="outline" title="Bax" onClick={async () => window.open(await downloadFile(applicationId, file.id), "_blank")}><Eye className="size-4" /></Button>
                <Button size="icon" variant="outline" title="Endir" onClick={async () => { const url = await downloadFile(applicationId, file.id); const link = document.createElement("a"); link.href = url; link.download = file.original_name; link.click(); }}><Download className="size-4" /></Button>
              </div>
            </div>
          ))}
        </section>

        {canForward && <ActionCard title="Şöbəyə yönləndir"><Select value={forwardDepartment} onValueChange={setForwardDepartment}><SelectTrigger><SelectValue placeholder="Şöbə seçin" /></SelectTrigger><SelectContent>{(departmentsData?.data ?? []).map((department) => <SelectItem key={department.id} value={String(department.id)}>{department.name}</SelectItem>)}</SelectContent></Select><Textarea placeholder="Qeyd (könüllü)" value={forwardNote} onChange={(event) => setForwardNote(event.target.value)} /><Button onClick={submitForward} disabled={forward.isPending}>Göndər</Button></ActionCard>}

        {canAssign && <ActionCard title="İcraçı təyin et"><div className="space-y-3"><Label>İcraçılar</Label><div className="space-y-2">{(executorsData?.data ?? []).map((executor) => { const value = String(executor.id); const checked = selectedExecutors.includes(value); return <label key={executor.id} className="flex items-center gap-3 rounded-lg border border-[#dfdfdf] p-3 text-sm"><input type="checkbox" checked={checked} onChange={(event) => { setSelectedExecutors((current) => event.target.checked ? [...current, value] : current.filter((item) => item !== value)); if (!event.target.checked && mainExecutor === value) setMainExecutor(""); }} />{executor.name}</label>; })}</div><Label>Əsas icraçı</Label><Select value={mainExecutor} onValueChange={setMainExecutor}><SelectTrigger><SelectValue placeholder="Əsas icraçını seçin" /></SelectTrigger><SelectContent>{(executorsData?.data ?? []).filter((executor) => selectedExecutors.includes(String(executor.id))).map((executor) => <SelectItem key={executor.id} value={String(executor.id)}>{executor.name}</SelectItem>)}</SelectContent></Select>{selectedExecutors.filter((value) => value !== mainExecutor).map((value) => { const executor = executorsData?.data?.find((item) => String(item.id) === value); return <div key={value} className="flex items-center justify-between gap-3"><span className="text-sm">{executor?.name}</span><Select value={assignmentRoles[value] ?? "joint"} onValueChange={(next) => setAssignmentRoles((current) => ({ ...current, [value]: next as Exclude<AssignmentRole, "main"> }))}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="joint">Müştərək</SelectItem><SelectItem value="observer">Nəzarət</SelectItem></SelectContent></Select></div>; })}<Textarea placeholder="Qeyd (könüllü)" value={assignmentNote} onChange={(event) => setAssignmentNote(event.target.value)} /><Button onClick={submitAssignment} disabled={assign.isPending}>Yönləndir</Button></div></ActionCard>}

        {canStartReview && <Button onClick={startReview} disabled={changeStatus.isPending}>Baxılmağa başla</Button>}

        {canPrepareDocument && <ActionCard title="Sənəd hazırla"><Select value={documentType} onValueChange={setDocumentType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="deficiency">Çatışmazlıq</SelectItem><SelectItem value="permit">İcazə</SelectItem></SelectContent></Select><Textarea placeholder="Mətn" value={documentBody} onChange={(event) => setDocumentBody(event.target.value)} /><Button onClick={() => { if (!documentBody.trim()) return toast.error("Mətn yazın"); prepareDocument.mutate({ type: documentType, body: documentBody }, { onSuccess: () => toast.success("Sənəd hazırlandı") }); }} disabled={prepareDocument.isPending}>Sənədi göndər</Button></ActionCard>}
        {canConfirmPayment && <ActionCard title="Ödəniş təsdiqi"><Button onClick={() => confirmPayment.mutate({}, { onSuccess: () => toast.success("Ödəniş təsdiqləndi"), onError: () => toast.error("Ödəniş təsdiqlənərkən xəta baş verdi") })} disabled={confirmPayment.isPending}>Ödənişi təsdiqlə</Button></ActionCard>}
      </TableLayout>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) { return <div><p className="text-sm text-[#797979]">{label}</p><p className="mt-1 text-sm font-medium text-[#1F1F1F]">{value}</p></div>; }

function ActionCard({ title, children }: { title: string; children: React.ReactNode }) { return <section className="space-y-3 rounded-lg border border-[#dfdfdf] p-4"><h2 className="text-xl font-bold text-[#1F1F1F]">{title}</h2>{children}</section>; }

function FileReviewControls({ applicationId, fileId }: { applicationId: number; fileId: number }) {
  const review = useReviewApplicationFile(applicationId, fileId);
  const [showReject, setShowReject] = React.useState(false);
  const [note, setNote] = React.useState("");

  if (showReject) {
    return <div className="flex items-center gap-2"><Textarea className="min-h-10 w-48" placeholder="Rədd səbəbi" value={note} onChange={(event) => setNote(event.target.value)} /><Button size="sm" onClick={() => { if (!note.trim()) return toast.error("Rədd səbəbini yazın"); review.mutate({ review_status: "rejected", review_note: note }, { onSuccess: () => setShowReject(false) }); }}>Təsdiqlə</Button></div>;
  }

  return <><Button size="icon" variant="outline" title="Qəbul et" onClick={() => review.mutate({ review_status: "accepted" })} disabled={review.isPending}><Check className="size-4" /></Button><Button size="icon" variant="outline" title="Rədd et" onClick={() => setShowReject(true)} disabled={review.isPending}><X className="size-4" /></Button></>;
}
