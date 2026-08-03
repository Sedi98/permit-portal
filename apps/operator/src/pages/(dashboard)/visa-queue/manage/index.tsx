import * as React from "react";
import { ArrowLeft, Download, Eye } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import TableLayout from "@/app/layouts/TableLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useApplicationById, useFileDownload } from "@/features/applications/hooks";
import { useApproveVisa, useReturnVisa, useVisaQueue } from "@/features/visa-queue/hooks";
import type { QueueRow } from "@/components/QueueListPage";

export default function VisaQueueManagePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const stateRow = location.state as QueueRow | null;
  const visaId = Number(id);
  const { data: queueData } = useVisaQueue({ per_page: 100 });
  const queueItem = queueData?.data?.data.find((item) => item.id === visaId);
  const row = stateRow ?? (queueItem ? {
    id: queueItem.id,
    applicationId: queueItem.document.application.id,
    applicationNo: queueItem.document.application.application_no,
    permitName: queueItem.document.application.permit_service.name,
    documentType: queueItem.document.type,
    documentBody: queueItem.document.body,
    departmentName: queueItem.department.name,
  } : null);
  const { data } = useApplicationById(row?.applicationId);
  const approve = useApproveVisa();
  const returnVisa = useReturnVisa();
  const downloadFile = useFileDownload();
  const [note, setNote] = React.useState("");

  if (!row || !data?.data) return <div className="p-6 text-sm text-destructive">Viza məlumatı tapılmadı. Detalı siyahıdan açın.</div>;
  const application = data.data;
  const submit = (action: "approve" | "return") => {
    if (action === "return" && !note.trim()) return toast.error("Geri qaytarma səbəbini yazın");
    const mutation = action === "approve" ? approve : returnVisa;
    mutation.mutate({ visaId, payload: note ? { note } : {} }, { onSuccess: () => { toast.success(action === "approve" ? "Viza verildi" : "Sənəd geri qaytarıldı"); navigate(-1); }, onError: () => toast.error("Əməliyyat zamanı xəta baş verdi") });
  };

  return <main className="space-y-6 p-4"><Button variant="ghost" className="gap-2 text-[#286AA6]" onClick={() => navigate(-1)}><ArrowLeft className="size-5" />Geri</Button><TableLayout className="space-y-6"><section className="grid gap-4 md:grid-cols-2"><Info label="Müraciət edən" value={application.applicant_full_name} /><Info label="İcazə növü" value={application.permit_service.name} /></section><section><h2 className="mb-3 text-xl font-bold">Yüklənmiş sənədlər</h2>{application.files.map((file) => <div key={file.id} className="flex items-center justify-between border-b p-3"><span>{file.original_name}</span><div className="flex gap-2"><Button size="icon" variant="outline" onClick={async () => window.open(await downloadFile(application.id, file.id), "_blank")}><Eye className="size-4" /></Button><Button size="icon" variant="outline" onClick={async () => { const url = await downloadFile(application.id, file.id); const link = document.createElement("a"); link.href = url; link.download = file.original_name; link.click(); }}><Download className="size-4" /></Button></div></div>)}</section><section className="space-y-3"><h2 className="text-xl font-bold">Baxılan sənəd</h2><Info label="Növ" value={row.documentType ?? "—"} /><p className="whitespace-pre-wrap rounded-lg bg-[#f5f5f5] p-4 text-sm">{row.documentBody ?? "—"}</p><Info label="Şöbə" value={row.departmentName ?? "—"} /><Textarea placeholder="Qeyd" value={note} onChange={(event) => setNote(event.target.value)} /><div className="flex justify-end gap-3"><Button variant="outline" onClick={() => submit("return")} disabled={returnVisa.isPending}>Geri qaytar</Button><Button onClick={() => submit("approve")} disabled={approve.isPending}>Viza ver</Button></div></section></TableLayout></main>;
}

function Info({ label, value }: { label: string; value: string }) { return <div><p className="text-sm text-[#797979]">{label}</p><p className="font-medium">{value}</p></div>; }
