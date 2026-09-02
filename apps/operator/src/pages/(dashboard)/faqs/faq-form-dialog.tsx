import { LoaderCircle } from "lucide-react";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateFaq, useUpdateFaq } from "@/features/faqs/hooks";
import type { AdminFaq, CreateFaqPayload } from "@/features/faqs/types";

type FaqFormDialogProps = {
  open: boolean;
  faq: AdminFaq | null;
  onOpenChange: (open: boolean) => void;
};

type FormErrors = Partial<Record<"question" | "answer" | "display_order", string>>;

export default function FaqFormDialog({ open, faq, onOpenChange }: FaqFormDialogProps) {
  const create = useCreateFaq();
  const update = useUpdateFaq();
  const [question, setQuestion] = useState(faq?.question ?? "");
  const [answer, setAnswer] = useState(faq?.answer ?? "");
  const [displayOrder, setDisplayOrder] = useState(String(faq?.display_order ?? 0));
  const [isActive, setIsActive] = useState(faq?.is_active ?? true);
  const [errors, setErrors] = useState<FormErrors>({});
  const isEdit = faq !== null;
  const isPending = create.isPending || update.isPending;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();
    const parsedOrder = Number(displayOrder);
    const nextErrors: FormErrors = {};

    if (!trimmedQuestion) {
      nextErrors.question = "Sual məcburidir.";
    } else if (trimmedQuestion.length > 500) {
      nextErrors.question = "Sual maksimum 500 simvol ola bilər.";
    }

    if (!trimmedAnswer) {
      nextErrors.answer = "Cavab məcburidir.";
    }

    if (!Number.isInteger(parsedOrder) || parsedOrder < 0) {
      nextErrors.display_order = "Sıra sıfır və ya müsbət tam ədəd olmalıdır.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const payload: CreateFaqPayload = {
      question: trimmedQuestion,
      answer: trimmedAnswer,
      display_order: parsedOrder,
      is_active: isActive,
    };
    const options = {
      onSuccess: () => {
        toast.success(isEdit ? "Sual yeniləndi" : "Sual yaradıldı");
        onOpenChange(false);
      },
      onError: () => {
        toast.error(
          isEdit
            ? "Sual yenilənərkən xəta baş verdi"
            : "Sual yaradılarkən xəta baş verdi",
        );
      },
    };

    if (faq) {
      update.mutate({ id: faq.id, payload }, options);
    } else {
      create.mutate(payload, options);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !isPending && onOpenChange(nextOpen)}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Sualı redaktə et" : "Yeni sual"}</DialogTitle>
          <DialogDescription>
            Sualın mətnini, cavabını, göstərilmə sırasını və aktivlik vəziyyətini daxil edin.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="faq-question">Sual</Label>
              <span className="text-xs text-[#797979]">{question.length} / 500</span>
            </div>
            <Input
              id="faq-question"
              value={question}
              maxLength={500}
              onChange={(event) => {
                setQuestion(event.target.value);
                setErrors((current) => ({ ...current, question: undefined }));
              }}
              aria-invalid={!!errors.question}
              aria-describedby={errors.question ? "faq-question-error" : undefined}
              required
            />
            {errors.question ? (
              <p id="faq-question-error" className="text-sm text-destructive">
                {errors.question}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="faq-answer">Cavab</Label>
            <Textarea
              id="faq-answer"
              value={answer}
              onChange={(event) => {
                setAnswer(event.target.value);
                setErrors((current) => ({ ...current, answer: undefined }));
              }}
              aria-invalid={!!errors.answer}
              aria-describedby={errors.answer ? "faq-answer-error" : undefined}
              required
            />
            {errors.answer ? (
              <p id="faq-answer-error" className="text-sm text-destructive">
                {errors.answer}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="faq-display-order">Göstərilmə sırası</Label>
              <Input
                id="faq-display-order"
                type="number"
                min="0"
                step="1"
                value={displayOrder}
                onChange={(event) => {
                  setDisplayOrder(event.target.value);
                  setErrors((current) => ({ ...current, display_order: undefined }));
                }}
                aria-invalid={!!errors.display_order}
                aria-describedby={errors.display_order ? "faq-display-order-error" : undefined}
                required
              />
              {errors.display_order ? (
                <p id="faq-display-order-error" className="text-sm text-destructive">
                  {errors.display_order}
                </p>
              ) : null}
            </div>

            <label className="flex items-center gap-3 self-end rounded-lg border border-[#DFDFDF] p-3">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
                className="size-4 accent-[#286aa6]"
              />
              Aktivdir
            </label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Ləğv et
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
              {isEdit ? "Yadda saxla" : "Əlavə et"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
