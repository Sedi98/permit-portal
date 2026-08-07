import DraftCard, { type DraftCardProps } from "@/components/DraftCard";

export type DraftListItem = DraftCardProps & {
  id: string;
};

type DraftListProps = {
  drafts: DraftListItem[];
};

export default function DraftList({ drafts }: DraftListProps) {
  return (
    <section aria-label="Qaralamalar" className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-8 md:px-20">
      {drafts.map(({ id, ...draft }) => (
        <DraftCard key={id} {...draft} />
      ))}
    </section>
  );
}
