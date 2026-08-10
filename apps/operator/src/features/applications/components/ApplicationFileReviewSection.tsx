import { useState } from "react";
import { Check, LoaderCircle, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReviewApplicationFile } from "@/features/applications/hooks";
import type { AppFile } from "@/features/applications/types";

function FileReviewRow({
  applicationId,
  file,
}: {
  applicationId: number;
  file: AppFile;
}) {
  const [note, setNote] = useState(file.review_note ?? "");
  const review = useReviewApplicationFile(applicationId, file.id);
  const submitReview = (reviewStatus: "accepted" | "rejected") => {
    if (reviewStatus === "rejected" && !note.trim()) {
      toast.error("Rədd səbəbini yazın");
      return;
    }

    review.mutate(
      {
        review_status: reviewStatus,
        ...(reviewStatus === "rejected" ? { review_note: note.trim() } : {}),
      },
      {
        onSuccess: () => toast.success("Faylın yoxlama statusu yeniləndi"),
        onError: () => toast.error("Fayl yoxlanılarkən xəta baş verdi"),
      },
    );
  };

  return (
    <div className="space-y-3 rounded-xl border border-[#DFDFDF] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium text-[#1F1F1F]">{file.original_name}</p>
          <p className="text-sm text-[#797979]">{file.document_type}</p>
        </div>
        <span className="rounded-full bg-[#F5F5F5] px-3 py-1 text-xs text-[#797979]">
          {file.review_status === "accepted"
            ? "Qəbul edilib"
            : file.review_status === "rejected"
              ? "Rədd edilib"
              : "Yoxlanılmayıb"}
        </span>
      </div>
      <Input
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Rədd səbəbi"
        aria-label={`${file.original_name} üçün rədd səbəbi`}
      />
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          className="gap-2 text-destructive"
          disabled={review.isPending}
          onClick={() => submitReview("rejected")}
        >
          {review.isPending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <X className="size-4" />
          )}
          Rədd et
        </Button>
        <Button
          type="button"
          className="gap-2"
          disabled={review.isPending}
          onClick={() => submitReview("accepted")}
        >
          <Check className="size-4" />
          Qəbul et
        </Button>
      </div>
    </div>
  );
}

export default function ApplicationFileReviewSection({
  applicationId,
  files,
}: {
  applicationId: number;
  files: AppFile[];
}) {
  return (
    <section className="mt-8 space-y-4" aria-labelledby="file-review-title">
      <h2 id="file-review-title" className="text-xl font-bold text-[#1F1F1F]">
        Faylların yoxlanılması
      </h2>
      {files.length === 0 ? (
        <p className="text-sm text-[#797979]">Yoxlanılacaq fayl yoxdur.</p>
      ) : (
        files.map((file) => (
          <FileReviewRow key={file.id} applicationId={applicationId} file={file} />
        ))
      )}
    </section>
  );
}
