import { useState, type ReactNode } from "react";
import { Check, Download, Eye, LoaderCircle, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { AppFile } from "@/features/applications/types";
import {
  useFileDownload,
  useReviewApplicationFile,
} from "@/features/applications/hooks";

export type RequiredDocument = AppFile;

interface RequiredDocumentsSectionProps {
  title?: string;
  subtitle?: string;
  documents: RequiredDocument[];
  applicationId?: number;
  canReview?: boolean;
  children?: ReactNode;
}

function DocumentRow({
  applicationId,
  canReview,
  document: file,
  index,
}: {
  applicationId?: number;
  canReview: boolean;
  document: RequiredDocument;
  index: number;
}) {
  const downloadFile = useFileDownload();
  const review = useReviewApplicationFile(applicationId ?? 0, file.id);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [reviewedStatus, setReviewedStatus] = useState(file.review_status);
  const isReviewed =
    reviewedStatus === "accepted" || reviewedStatus === "rejected";
  const rejectionReasonIsEmpty = rejectionReason.trim().length === 0;

  const submitReview = (reviewStatus: "accepted" | "rejected") => {
    if (!applicationId || isReviewed) return;

    const reviewNote = rejectionReason.trim();
    if (reviewStatus === "rejected" && !reviewNote) return;

    review.mutate(
      {
        review_status: reviewStatus,
        ...(reviewStatus === "rejected" ? { review_note: reviewNote } : {}),
      },
      {
        onSuccess: () => {
          setReviewedStatus(reviewStatus);
          setIsRejectDialogOpen(false);
          toast.success("Faylın yoxlama statusu yeniləndi");
        },
        onError: () => toast.error("Fayl yoxlanılarkən xəta baş verdi"),
      },
    );
  };

  const openFile = async (download: boolean) => {
    if (!applicationId) return;

    const url = await downloadFile(applicationId, file.id);
    if (!download) {
      window.open(url, "_blank");
      return;
    }

    const link = window.document.createElement("a");
    link.href = url;
    link.download = file.original_name;
    link.click();
  };

  return (
    <div
      className={`flex w-full items-center justify-between gap-3 rounded-xl p-3 ${
        index % 2 === 1 ? "bg-[#FEFEFE]" : ""
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[#EEF4FB]">
          <p className="text-sm font-bold leading-5 text-[#286AA6]">{index + 1}</p>
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-medium leading-6 text-[#1F1F1F]">
            {file.document_type}
          </p>
          <p className="truncate text-sm text-[#797979]">{file.original_name}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`${file.original_name} faylını aç`}
          onClick={() => openFile(false)}
        >
          <Eye className="size-6 text-primary" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`${file.original_name} faylını endir`}
          onClick={() => openFile(true)}
        >
          <Download className="size-6 text-primary" />
        </Button>

        {canReview ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="text-destructive hover:text-destructive"
              aria-label={`${file.original_name} faylını rədd et`}
              disabled={isReviewed || review.isPending}
              onClick={() => setIsRejectDialogOpen(true)}
            >
              <X className="size-5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="text-emerald-600 hover:text-emerald-600"
              aria-label={`${file.original_name} faylını qəbul et`}
              disabled={isReviewed || review.isPending}
              onClick={() => submitReview("accepted")}
            >
              {review.isPending && !isRejectDialogOpen ? (
                <LoaderCircle className="size-5 animate-spin" />
              ) : (
                <Check className="size-5" />
              )}
            </Button>
          </>
        ) : null}
      </div>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Faylı rədd et</DialogTitle>
            <DialogDescription>
              “{file.original_name}” faylının rədd səbəbini qeyd edin.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Textarea
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              placeholder="Rədd səbəbi"
              aria-label="Rədd səbəbi"
              aria-invalid={rejectionReasonIsEmpty}
              autoFocus
            />
            {rejectionReasonIsEmpty ? (
              <p className="text-sm text-destructive">Rədd səbəbi boş ola bilməz.</p>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={review.isPending}
              onClick={() => setIsRejectDialogOpen(false)}
            >
              Ləğv et
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={rejectionReasonIsEmpty || review.isPending}
              onClick={() => submitReview("rejected")}
            >
              {review.isPending ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : null}
              Rədd et
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function RequiredDocumentsSection({
  title = "Tələb olunan sənədlər",
  subtitle,
  documents,
  applicationId,
  canReview = false,
  children,
}: RequiredDocumentsSectionProps) {
  return (
    <div className="flex flex-col gap-3 ">
      <p className="text-[#1F1F1F] font-bold text-xl leading-7">{title}</p>
      {subtitle && (
        <p className="text-[#797979] text-base leading-6 font-normal">
          {subtitle}
        </p>
      )}
      <div className="flex flex-col w-full">
        {documents.map((document, index) => (
          <DocumentRow
            key={document.id}
            applicationId={applicationId}
            canReview={canReview}
            document={document}
            index={index}
          />
        ))}
      </div>
      {children}
    </div>
  );
}
