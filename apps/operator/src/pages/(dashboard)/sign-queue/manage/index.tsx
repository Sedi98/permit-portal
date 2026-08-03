import { ArrowLeft, Download, Eye } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import TableLayout from "@/app/layouts/TableLayout";
import { Button } from "@/components/ui/button";
import { useApplicationById, useFileDownload } from "@/features/applications/hooks";
import { useSignDocument, useSignQueue } from "@/features/sign-queue/hooks";
import type { QueueRow } from "@/components/QueueListPage";

export default function SignQueueManagePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const stateRow = useLocation().state as QueueRow | null;
  const { data: queueData } = useSignQueue({ per_page: 100 });
  const signId = Number(id);
  const queueItem = queueData?.data?.data.find((item) => item.id === signId);
  const row = stateRow ?? (queueItem ? {
    id: queueItem.id,
    applicationId: queueItem.application.id,
    applicationNo: queueItem.application.application_no,
    permitName: queueItem.application.permit_service.name,
    documentType: queueItem.type,
    documentBody: queueItem.body,
    executor: queueItem.prepared_by.name,
  } : null);
  const { data } = useApplicationById(row?.applicationId);
  const sign = useSignDocument();
  const downloadFile = useFileDownload();
  if (!row || !data?.data) return <div className="p-6 text-sm text-destructive">İmza məlumatı tapılmadı. Detalı siyahıdan açın.</div>;
  const application = data.data;
  return <main className="space-y-6 p-4"><Button variant="ghost" className="gap-2 text-[#286AA6]" onClick={() => navigate(-1)}><ArrowLeft className="size-5" />Geri</Button><TableLayout className="space-y-6"><h1 className="text-xl font-bold">İmza gözləyən sənəd</h1><div className="grid gap-4 md:grid-cols-2"><Info label="Müraciət edən" value={application.applicant_full_name} /><Info label="İcazə növü" value={row.permitName} /><Info label="Hazırlayan icraçı" value={row.executor ?? "—"} /><Info label="Sənəd növü" value={row.documentType ?? "—"} /></div><p className="whitespace-pre-wrap rounded-lg bg-[#f5f5f5] p-4 text-sm">{row.documentBody ?? "—"}</p><section><h2 className="mb-3 text-xl font-bold">Yüklənmiş sənədlər</h2>{application.files.map((file) => <div key={file.id} className="flex items-center justify-between border-b p-3"><span>{file.original_name}</span><div className="flex gap-2"><Button size="icon" variant="outline" onClick={async () => window.open(await downloadFile(application.id, file.id), "_blank")}><Eye className="size-4" /></Button><Button size="icon" variant="outline" onClick={async () => { const url = await downloadFile(application.id, file.id); const link = document.createElement("a"); link.href = url; link.download = file.original_name; link.click(); }}><Download className="size-4" /></Button></div></div>)}</section><div className="flex justify-end"><Button onClick={() => sign.mutate(Number(row.id), { onSuccess: () => { toast.success("Sənəd imzalandı"); navigate(-1); }, onError: () => toast.error("Sənəd imzalanarkən xəta baş verdi") })} disabled={sign.isPending}>İmzala</Button></div></TableLayout></main>;
}

function Info({ label, value }: { label: string; value: string }) { return <div><p className="text-sm text-[#797979]">{label}</p><p className="font-medium">{value}</p></div>; }
