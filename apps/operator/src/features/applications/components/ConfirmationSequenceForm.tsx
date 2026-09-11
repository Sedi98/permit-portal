import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  LoaderCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import NoteTextarea from "@/components/NoteTextarea";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCreateConfirmationSequence,
  useRoutingCandidates,
} from "@/features/applications/hooks";
import type {
  ConfirmationParticipantRole,
  ConfirmationSequenceType,
  RoutingCandidate,
} from "@/features/applications/types";

const roleLabels: Record<ConfirmationParticipantRole, string> = {
  visa: "Viza",
  sign: "İmza",
  approve: "Təsdiq",
};

const candidateRoleLabels: Partial<Record<NonNullable<RoutingCandidate["role"]>, string>> = {
  executor: "İcraçı",
  department_head: "Şöbə müdiri",
  deputy_minister: "Nazir müavini",
  super_admin: "Super admin",
};

const roleOrder: Record<ConfirmationParticipantRole, number> = {
  visa: 0,
  sign: 1,
  approve: 2,
};

interface SelectedParticipant {
  userId: number;
  role: ConfirmationParticipantRole;
}

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
  const [participantRole, setParticipantRole] =
    useState<ConfirmationParticipantRole>(roles[0]);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [isCandidatePickerOpen, setIsCandidatePickerOpen] = useState(false);
  const [participants, setParticipants] = useState<SelectedParticipant[]>([]);
  const candidateList = candidates.data?.data ?? [];
  const selectedCandidate = candidateList.find(
    (candidate) => String(candidate.id) === selectedCandidateId,
  );

  const addParticipant = () => {
    if (!selectedCandidate) {
      toast.error("İştirakçı seçin");
      return;
    }
    if (participants.some((participant) => participant.userId === selectedCandidate.id)) {
      toast.error("Bu iştirakçı artıq cədvələ əlavə edilib");
      return;
    }

    setParticipants((current) =>
      [...current, { userId: selectedCandidate.id, role: participantRole }].toSorted(
        (first, second) => roleOrder[first.role] - roleOrder[second.role],
      ),
    );
    setSelectedCandidateId("");
  };

  const moveParticipant = (index: number, direction: -1 | 1) => {
    setParticipants((current) => {
      const targetIndex = index + direction;
      if (
        targetIndex < 0 ||
        targetIndex >= current.length ||
        current[index].role !== current[targetIndex].role
      ) {
        return current;
      }

      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

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
    if (roles.some((role) => !participants.some((participant) => participant.role === role))) {
      toast.error("Bütün təsdiq iştirakçılarını seçin");
      return;
    }

    createSequence.mutate(
      {
        type,
        body: body.trim(),
        ...(type === "report" ? { title: title.trim() } : {}),
        ...(type === "payment" ? { amount: Number(amount) } : {}),
        participants: participants.map((participant) => ({
          role: participant.role,
          user_id: participant.userId,
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
      <div className="space-y-4 rounded-xl bg-[#f5f5f5] p-4">
        <h3 className="text-xl font-bold text-[#1F1F1F]">
          Təsdiq və İcra Cədvəli
        </h3>
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_auto] lg:items-end">
          <div className="space-y-2">
            <Label>İştirakçı</Label>
            <Popover open={isCandidatePickerOpen} onOpenChange={setIsCandidatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={isCandidatePickerOpen}
                  className="h-12 w-full justify-between bg-white px-4 font-normal"
                >
                  <span className="truncate text-left">
                    {selectedCandidate
                      ? `${selectedCandidate.name} — ${selectedCandidate.department?.name ?? "Şöbə yoxdur"} — ${selectedCandidate.role ? candidateRoleLabels[selectedCandidate.role] ?? selectedCandidate.role : "Vəzifə yoxdur"}`
                      : "İştirakçı axtarın"}
                  </span>
                  <ChevronsUpDown className="size-4 shrink-0 text-[#797979]" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-0">
                <Command>
                  <CommandInput placeholder="Ad, şöbə və ya vəzifə üzrə axtar..." />
                  <CommandList>
                    <CommandEmpty>İştirakçı tapılmadı.</CommandEmpty>
                    <CommandGroup>
                      {candidateList
                        .filter(
                          (candidate) =>
                            !participants.some(
                              (participant) => participant.userId === candidate.id,
                            ),
                        )
                        .map((candidate) => {
                          const department = candidate.department?.name ?? "Şöbə yoxdur";
                          const position = candidate.role
                            ? candidateRoleLabels[candidate.role] ?? candidate.role
                            : "Vəzifə yoxdur";

                          return (
                            <CommandItem
                              key={candidate.id}
                              value={`${candidate.name} ${department} ${position}`}
                              onSelect={() => {
                                setSelectedCandidateId(String(candidate.id));
                                setIsCandidatePickerOpen(false);
                              }}
                            >
                              <span className="min-w-0">
                                <span className="block truncate font-medium">
                                  {candidate.name}
                                </span>
                                <span className="block truncate text-xs text-[#797979]">
                                  {department} · {position}
                                </span>
                              </span>
                            </CommandItem>
                          );
                        })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="participant-role">Əməliyyat</Label>
            <Select
              value={participantRole}
              onValueChange={(value) =>
                setParticipantRole(value as ConfirmationParticipantRole)
              }
            >
              <SelectTrigger id="participant-role" className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {roleLabels[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="button" className="h-12 gap-2" onClick={addParticipant}>
            <Plus className="size-5" />
            Əlavə et
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#DFDFDF] bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">Sıra</TableHead>
                <TableHead>Ad</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="w-24 text-right">Əməliyyat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.length > 0 ? (
                participants.map((participant, index) => {
                  const candidate = candidateList.find(
                    (item) => item.id === participant.userId,
                  );
                  const previous = participants[index - 1];
                  const next = participants[index + 1];

                  return (
                    <TableRow key={participant.userId}>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            aria-label={`${candidate?.name ?? "İştirakçı"} yuxarı daşı`}
                            disabled={!previous || previous.role !== participant.role}
                            onClick={() => moveParticipant(index, -1)}
                          >
                            <ArrowUp className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            aria-label={`${candidate?.name ?? "İştirakçı"} aşağı daşı`}
                            disabled={!next || next.role !== participant.role}
                            onClick={() => moveParticipant(index, 1)}
                          >
                            <ArrowDown className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{candidate?.name ?? `İstifadəçi #${participant.userId}`}</p>
                        <p className="text-xs text-[#797979]">
                          {candidate?.department?.name ?? "Şöbə yoxdur"}
                          {candidate?.role
                            ? ` · ${candidateRoleLabels[candidate.role] ?? candidate.role}`
                            : ""}
                        </p>
                      </TableCell>
                      <TableCell>{roleLabels[participant.role]}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="gap-2 text-destructive hover:text-destructive"
                          onClick={() =>
                            setParticipants((current) =>
                              current.filter((item) => item.userId !== participant.userId),
                            )
                          }
                        >
                          <Trash2 className="size-4" />
                          Sil
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-[#797979]">
                    İştirakçı əlavə edilməyib.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
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
          Göndər
        </Button>
      </div>
    </section>
  );
}
