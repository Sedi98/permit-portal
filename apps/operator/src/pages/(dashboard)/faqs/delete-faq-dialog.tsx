import { LoaderCircle } from "lucide-react";
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
import { useDeleteFaq } from "@/features/faqs/hooks";
import type { AdminFaq } from "@/features/faqs/types";

type DeleteFaqDialogProps = {
  faq: AdminFaq | null;
  onOpenChange: (open: boolean) => void;
};

export default function DeleteFaqDialog({ faq, onOpenChange }: DeleteFaqDialogProps) {
  const deleteMutation = useDeleteFaq();

  return (
    <Dialog
      open={faq !== null}
      onOpenChange={(open) => !deleteMutation.isPending && onOpenChange(open)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sualı sil</DialogTitle>
          <DialogDescription>
            “{faq?.question}” sualını silmək istədiyinizə əminsiniz? Bu əməliyyat geri
            qaytarıla bilməz.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={deleteMutation.isPending}
            onClick={() => onOpenChange(false)}
          >
            Ləğv et
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={!faq || deleteMutation.isPending}
            onClick={() => {
              if (!faq) return;
              deleteMutation.mutate(faq.id, {
                onSuccess: () => {
                  toast.success("Sual silindi");
                  onOpenChange(false);
                },
                onError: () => toast.error("Sual silinərkən xəta baş verdi"),
              });
            }}
          >
            {deleteMutation.isPending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : null}
            Sil
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
