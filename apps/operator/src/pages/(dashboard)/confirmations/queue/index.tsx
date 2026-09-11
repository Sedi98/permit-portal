import { useState } from "react";
import { Eye, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import TableLayout from "@/app/layouts/TableLayout";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getConfirmationErrorMessage } from "@/features/confirmations/errors";
import {
  useApproveConfirmationParticipant,
  useConfirmationQueue,
} from "@/features/confirmations/hooks";
import type {
  ConfirmationQueueItem,
  ConfirmationRole,
  ConfirmationType,
} from "@/features/confirmations/types";

interface ConfirmationQueuePageProps {
  title: string;
  type: ConfirmationType;
  role: ConfirmationRole;
}

function getSequence(item: ConfirmationQueueItem) {
  return item.confirmation_sequence ?? item.sequence;
}

function getApplication(item: ConfirmationQueueItem) {
  const sequence = getSequence(item);
  return (
    item.permit_application ??
    item.application ??
    sequence?.permit_application ??
    sequence?.application
  );
}

function ConfirmationQueueRow({
  item,
}: {
  item: ConfirmationQueueItem;
}) {
  const navigate = useNavigate();
  const [note, setNote] = useState("");
  const participantId = item.participant_id ?? item.id;
  const approve = useApproveConfirmationParticipant(participantId);
  const sequence = getSequence(item);
  const application = getApplication(item);

  return (
    <article className="space-y-4 rounded-xl border border-[#DFDFDF] bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-[#797979]">
            {application?.application_no ?? `İştirakçı #${participantId}`}
          </p>
          <h2 className="font-semibold text-[#1F1F1F]">
            {sequence?.title ?? application?.permit_service?.name ?? "Təsdiq sənədi"}
          </h2>
          {application?.applicant_full_name ? (
            <p className="text-sm text-[#797979]">
              {application.applicant_full_name}
            </p>
          ) : null}
        </div>
        {application?.id ? (
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() =>
              navigate(`/applications/assigned/manage/${application.id}`)
            }
          >
            <Eye className="size-4" />
            Müraciətə bax
          </Button>
        ) : null}
      </div>
      {sequence?.body ? (
        <p className="rounded-lg bg-[#F7F9FC] p-4 text-sm leading-6 text-[#1F1F1F]">
          {sequence.body}
        </p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Qeyd (könüllü)"
          aria-label="Təsdiq qeydi"
        />
        <Button
          className="sm:w-36"
          disabled={approve.isPending}
          onClick={() =>
            approve.mutate(
              note.trim() ? { note: note.trim() } : {},
              {
                onSuccess: () => toast.success("Təsdiqləndi"),
                onError: (error) =>
                  toast.error(
                    getConfirmationErrorMessage(
                      error,
                      "Təsdiq zamanı xəta baş verdi",
                    ),
                  ),
              },
            )
          }
        >
          {approve.isPending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : null}
          Təsdiqlə
        </Button>
      </div>
    </article>
  );
}

export default function ConfirmationQueuePage({
  title,
  type,
  role,
}: ConfirmationQueuePageProps) {
  const params = { type, role };
  const queue = useConfirmationQueue(params);
  const responseData = queue.data?.data;
  const items = Array.isArray(responseData)
    ? responseData
    : (responseData?.data ?? []);

  return (
    <div className="space-y-4">
      <h1 className="pl-4 text-base font-medium text-stone-900">{title}</h1>
      <TableLayout className="space-y-5">
        <PageTitle
          title="Təsdiq növbəsi"
          text={`Cəmi ${items.length} sənəd tapıldı`}
        />
        {queue.isLoading ? (
          <div className="flex justify-center py-20">
            <LoaderCircle className="size-9 animate-spin text-primary" />
          </div>
        ) : queue.isError ? (
          <div className="rounded-lg bg-destructive/5 p-6 text-center text-sm text-destructive">
            Təsdiq növbəsi yüklənmədi.
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#DFDFDF] p-12 text-center text-sm text-[#797979]">
            Gözləyən sənəd yoxdur.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <ConfirmationQueueRow
                key={item.participant_id ?? item.id}
                item={item}
              />
            ))}
          </div>
        )}
      </TableLayout>
    </div>
  );
}
