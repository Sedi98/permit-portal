import DraftCard from "@/components/DraftCard";
import type { CitizenDraftListItem } from "@/features/applications/types";

type DraftListProps = {
  drafts: CitizenDraftListItem[];
  errorMessage?: string;
};

export default function DraftList({ drafts, errorMessage }: DraftListProps) {
  if (errorMessage) {
    return (
      <section aria-label="Qaralamalar" className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8 md:px-20">
        <div role="alert" className="rounded-xl border border-[#dfdfdf] bg-white p-6 text-sm text-[#d90b0b]">
          {errorMessage}
        </div>
      </section>
    );
  }

  if (drafts.length === 0) {
    return (
      <section aria-label="Qaralamalar" className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8 md:px-20">
        <div className="rounded-xl border border-[#dfdfdf] bg-white p-8 text-center text-sm text-[#797979]">
          Qaralama tapılmadı.
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Qaralamalar" className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-8 md:px-20">
      {drafts.map((draft) => (
        <DraftCard
          key={draft.id}
          title={draft.permit_service.name}
          currentStep={draft.progress.completed_steps}
          totalSteps={draft.progress.total_steps}
          progress={draft.progress.percentage}
        />
      ))}
    </section>
  );
}
