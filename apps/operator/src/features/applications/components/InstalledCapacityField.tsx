import { useState } from "react";
import { isAxiosError } from "axios";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateTradeDetail } from "@/features/applications/hooks";

function getErrorMessage(error: unknown) {
  if (!isAxiosError<{ message?: string }>(error)) return "Ümumi qoyuluş gücü yenilənərkən xəta baş verdi.";
  return error.response?.data?.message ?? "Ümumi qoyuluş gücü yenilənərkən xəta baş verdi.";
}

export default function InstalledCapacityField({ applicationId, value, canEdit }: { applicationId: number; value?: string | null; canEdit: boolean }) {
  const update = useUpdateTradeDetail(applicationId);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");

  const save = () => {
    const installedCapacity = draft.trim();
    if (!installedCapacity) return;
    if (installedCapacity === (value ?? "")) return setIsEditing(false);
    update.mutate({ installed_capacity: installedCapacity }, {
      onSuccess: () => { toast.success("Ümumi qoyuluş gücü yeniləndi"); setDraft(installedCapacity); setIsEditing(false); },
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  return <div className="mt-2 rounded-xl border border-[#DFDFDF] p-4">
    <div className="flex items-center justify-between gap-3">
      <label htmlFor="installed-capacity" className="text-sm text-[#797979]">Ümumi qoyuluş gücü</label>
      {canEdit && !isEditing ? <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => { setDraft(value ?? ""); setIsEditing(true); }}><Pencil className="size-4" />Redaktə et</Button> : null}
    </div>
    {isEditing ? <>
      <Input id="installed-capacity" className="mt-2" value={draft} onChange={(event) => setDraft(event.target.value)} />
      <div className="mt-3 flex justify-end gap-2"><Button type="button" variant="outline" disabled={update.isPending} onClick={() => { setDraft(value ?? ""); setIsEditing(false); }}>Ləğv et</Button><Button type="button" disabled={update.isPending || !draft.trim()} onClick={save}>{update.isPending ? "Yadda saxlanılır..." : "Yadda saxla"}</Button></div>
    </> : <p className="mt-1 font-medium">{value || "—"}</p>}
  </div>;
}
