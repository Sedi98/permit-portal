import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useApproveConfirmationParticipant } from "@/features/confirmations/hooks";
import type {
  ConfirmationParticipant,
  ConfirmationSequence,
} from "@/features/applications/types";

const typeLabels = {
  deficiency: "Çatışmazlıq bildirişi",
  report: "Xidməti məruzə",
  payment: "Ödəniş tapşırığı",
};

const roleLabels = {
  visa: "Viza verən",
  sign: "İmzalayan",
  approve: "Təsdiqləyən",
};

function ParticipantRow({
  participant,
  canApprove,
}: {
  participant: ConfirmationParticipant;
  canApprove: boolean;
}) {
  const approve = useApproveConfirmationParticipant(participant.id);
  const isFinished =
    participant.status === "approved" || participant.status === "completed";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#F7F9FC] px-4 py-3">
      <div>
        <p className="text-sm font-medium">
          {participant.user?.name ?? `İstifadəçi #${participant.user_id}`}
        </p>
        <p className="text-xs text-[#797979]">
          {roleLabels[participant.role]} · {isFinished ? "Təsdiqlənib" : "Gözləyir"}
        </p>
      </div>
      {canApprove && !isFinished ? (
        <Button
          size="sm"
          disabled={approve.isPending}
          onClick={() =>
            approve.mutate({}, {
              onSuccess: () => toast.success("İştirakçı təsdiqi tamamlandı"),
              onError: () => toast.error("Təsdiq zamanı xəta baş verdi"),
            })
          }
        >
          {approve.isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
          Təsdiqlə
        </Button>
      ) : null}
    </div>
  );
}

export default function ConfirmationHistorySection({
  sequences,
  canApproveAny,
}: {
  sequences: ConfirmationSequence[];
  canApproveAny: boolean;
}) {
  if (sequences.length === 0) return null;

  return (
    <section className="mt-8 space-y-4" aria-labelledby="confirmation-history-title">
      <h2 id="confirmation-history-title" className="text-xl font-bold text-[#1F1F1F]">
        Təsdiq sənədləri
      </h2>
      {sequences.map((sequence) => (
        <article key={sequence.id} className="space-y-3 rounded-xl border border-[#DFDFDF] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">{sequence.title ?? typeLabels[sequence.type]}</h3>
              <p className="text-sm text-[#797979]">{typeLabels[sequence.type]} · {sequence.status ?? "—"}</p>
            </div>
            {sequence.amount != null ? (
              <span className="font-semibold text-primary">{sequence.amount} AZN</span>
            ) : null}
          </div>
          {sequence.body ? <p className="text-sm leading-6">{sequence.body}</p> : null}
          <div className="space-y-2">
            {(sequence.participants ?? []).map((participant) => (
              <ParticipantRow
                key={participant.id}
                participant={participant}
                canApprove={canApproveAny}
              />
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
