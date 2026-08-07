"use client";

import { Clock3, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export type DraftCardProps = {
  title: string;
  currentStep?: number;
  totalSteps?: number;
  progress?: number;
  updatedAt: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onContinue?: () => void;
};

export default function DraftCard({
  title,
  currentStep = 2,
  totalSteps = 5,
  progress = 80,
  updatedAt,
  onEdit,
  onDelete,
  onContinue,
}: DraftCardProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const stepMarkers = Array.from({ length: totalSteps + 1 }, (_, index) => index);

  return (
    <article className="flex w-full flex-col gap-4 rounded-xl border border-[#dfdfdf] bg-white p-4 sm:p-6 md:p-8">
      <div className="flex w-full items-start gap-2 sm:gap-3">
        <button
          type="button"
          aria-label="Qaralamanı redaktə et"
          onClick={onEdit}
          className="flex size-11 shrink-0 items-center justify-center rounded-lg text-[#e97000] transition-colors hover:bg-[#fff7ed] focus-visible:ring-2 focus-visible:ring-[#e97000] focus-visible:outline-none"
        >
          <Pencil className="size-6" strokeWidth={1.5} />
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-sm leading-5 font-semibold text-[#e97000]">Yarımçıq müraciət</p>
          <h2 className="text-base leading-6 font-medium break-words text-[#1f1f1f]">{title}</h2>
        </div>

        <button
          type="button"
          aria-label="Qaralamanı sil"
          onClick={onDelete}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#fef1f1] p-2 text-[#f32020] transition-colors hover:bg-[#fee2e2] focus-visible:ring-2 focus-visible:ring-[#f32020] focus-visible:outline-none"
        >
          <Trash2 className="size-6" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full items-center justify-between gap-4">
          <span className="text-sm leading-5 font-medium text-[#797979]">İrəliləyiş</span>
          <span className="rounded-full px-2 py-1 text-sm leading-5 font-medium text-[#286aa6]">
            Addım {currentStep} / {totalSteps}
          </span>
        </div>

        <Progress
          value={clampedProgress}
          aria-label={`İrəliləyiş: ${clampedProgress}%`}
          className="h-2 bg-[#dfdfdf] [&_[data-slot=progress-indicator]]:bg-[#286aa6]"
        />

        <div className="flex h-2 w-full items-start justify-between">
          {stepMarkers.map((step) => (
            <span
              key={step}
              aria-hidden="true"
              className={`size-2 rounded-full ${
                step / totalSteps <= clampedProgress / 100 ? "bg-[#286aa6]" : "bg-[#f5f5f5]"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2 text-sm leading-5 text-[#797979]">
          <Clock3 className="size-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
          <time className="truncate">Son dəyişiklik: {updatedAt}</time>
        </div>

        <Button
          type="button"
          onClick={onContinue}
          className="h-12 w-full shrink-0 rounded-lg bg-[#286aa6] px-4 py-3 text-base leading-6 font-semibold text-white hover:bg-[#286aa6]/90 sm:w-[120px]"
        >
          Davam et
        </Button>
      </div>
    </article>
  );
}
