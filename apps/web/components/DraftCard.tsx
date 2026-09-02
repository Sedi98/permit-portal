import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export type DraftCardProps = {
  title: string;
  currentStep: number;
  totalSteps: number;
  progress: number;
  continueHref: string;
};

export default function DraftCard({
  title,
  currentStep,
  totalSteps,
  progress,
  continueHref,
}: DraftCardProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const safeTotalSteps = Math.max(0, Math.trunc(totalSteps));
  const completedSteps = Math.min(safeTotalSteps, Math.max(0, Math.trunc(currentStep)));
  const stepMarkers = Array.from({ length: safeTotalSteps }, (_, index) => index + 1);

  return (
    <article className="flex w-full flex-col gap-4 rounded-xl border border-[#dfdfdf] bg-white p-4 sm:p-6 md:p-8">
      <div className="flex w-full items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-sm leading-5 font-semibold text-[#e97000]">Yarımçıq müraciət</p>
          <h2 className="text-base leading-6 font-medium break-words text-[#1f1f1f]">{title}</h2>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full items-center justify-between gap-4">
          <span className="text-sm leading-5 font-medium text-[#797979]">İrəliləyiş</span>
          <span className="rounded-full px-2 py-1 text-sm leading-5 font-medium text-[#286aa6]">
            Addım {completedSteps} / {safeTotalSteps}
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
                step <= completedSteps ? "bg-[#286aa6]" : "bg-[#f5f5f5]"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex w-full justify-end border-t border-[#dfdfdf] pt-4">
        <Link
          href={continueHref}
          className="flex h-12 w-full items-center justify-center rounded-lg bg-[#286aa6] px-4 py-3 text-base leading-6 font-semibold text-white transition-colors hover:bg-[#1f5688] focus-visible:ring-2 focus-visible:ring-[#286aa6] focus-visible:outline-none sm:w-[120px]"
        >
          Davam et
        </Link>
      </div>
    </article>
  );
}
