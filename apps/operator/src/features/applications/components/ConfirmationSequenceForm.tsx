import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import NoteTextarea from "@/components/NoteTextarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateConfirmationSequence,
  useRoutingCandidates,
} from "@/features/applications/hooks";
import type {
  ConfirmationParticipantRole,
  ConfirmationSequenceType,
} from "@/features/applications/types";

const roleLabels: Record<ConfirmationParticipantRole, string> = {
  visa: "Viza verən",
  sign: "İmzalayan",
  approve: "Təsdiqləyən",
};

function getRoles(type: ConfirmationSequenceType): ConfirmationParticipantRole[] {
  return type === "report" ? ["visa", "sign", "approve"] : ["visa", "sign"];
}

const typeLabels: Record<ConfirmationSequenceType, string> = {
  deficiency: "Çatışmazlıq bildirişi",
  report: "Xidməti məruzə",
  payment: "Ödəniş tapşırığı",
};

export default function ConfirmationSequenceForm({
  applicationId,
  type,
}: {
  applicationId: number;
  type: ConfirmationSequenceType;
}) {
  const candidates = useRoutingCandidates();
  const createSequence = useCreateConfirmationSequence(applicationId);
  const roles = getRoles(type);
  const [body, setBody] = useState("");
  const [title, setTitle] = useState(type === "report" ? "Xidməti məruzə" : "");
  const [amount, setAmount] = useState("");
  const [participants, setParticipants] = useState<
    Partial<Record<ConfirmationParticipantRole, string>>
  >({});
  const selectedParticipantIds = new Set(Object.values(participants));

  const submit = () => {
    if (!body.trim()) {
      toast.error("Mətni yazın");
      return;
    }
    if (type === "report" && !title.trim()) {
      toast.error("Başlığı yazın");
      return;
    }
    if (type === "payment" && (!amount || Number(amount) <= 0)) {
      toast.error("Ödəniş məbləğini yazın");
      return;
    }
    if (roles.some((role) => !participants[role])) {
      toast.error("Bütün təsdiq iştirakçılarını seçin");
      return;
    }

    createSequence.mutate(
      {
        type,
        body: body.trim(),
        ...(type === "report" ? { title: title.trim() } : {}),
        ...(type === "payment" ? { amount: Number(amount) } : {}),
        participants: roles.map((role) => ({
          role,
          user_id: Number(participants[role]),
        })),
      },
      {
        onSuccess: () => toast.success(`${typeLabels[type]} yaradıldı`),
        onError: () => toast.error("Sənəd yaradılarkən xəta baş verdi"),
      },
    );
  };

  return (
    <section className="mt-8 space-y-5" aria-labelledby="sequence-form-title">
      <h2 id="sequence-form-title" className="text-xl font-bold text-[#1F1F1F]">
        {typeLabels[type]} hazırla
      </h2>
      {type === "report" ? (
        <div className="space-y-2">
          <Label htmlFor="sequence-title">Başlıq</Label>
          <Input
            id="sequence-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
      ) : null}
      {type === "payment" ? (
        <div className="space-y-2">
          <Label htmlFor="payment-amount">Ödəniş (AZN)</Label>
          <Input
            id="payment-amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>
      ) : null}
      <NoteTextarea value={body} onChange={(event) => setBody(event.target.value)} />
      <div className="grid gap-4 md:grid-cols-3">
        {roles.map((role) => (
          <div key={role} className="space-y-2">
            <Label>{roleLabels[role]}</Label>
            <Select
              value={participants[role] ?? ""}
              onValueChange={(value) =>
                setParticipants((current) => ({ ...current, [role]: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="İştirakçı seçin" />
              </SelectTrigger>
              <SelectContent>
                {(candidates.data?.data ?? [])
                  .filter((candidate) => {
                    const candidateId = String(candidate.id);
                    return (
                      participants[role] === candidateId ||
                      !selectedParticipantIds.has(candidateId)
                    );
                  })
                  .map((candidate) => (
                    <SelectItem key={candidate.id} value={String(candidate.id)}>
                      {candidate.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
      {candidates.isError ? (
        <p className="text-sm text-destructive">
          Təsdiq iştirakçıları yüklənmədi.
        </p>
      ) : null}
      <div className="flex justify-end">
        <Button disabled={createSequence.isPending || candidates.isLoading} onClick={submit}>
          {createSequence.isPending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : null}
          Hazırla
        </Button>
      </div>
    </section>
  );
}
