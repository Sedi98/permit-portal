import DraftHeader from "@/app-pages/drafts/sections/DraftHeader";
import DraftList from "@/app-pages/drafts/sections/DraftList";
import type { CitizenDraftListItem } from "@/features/applications/types";

type DraftsPageProps = {
  drafts: CitizenDraftListItem[];
  errorMessage?: string;
};

export default function DraftsPage({ drafts, errorMessage }: DraftsPageProps) {
  return (
    <main>
      <DraftHeader />
      <DraftList drafts={drafts} errorMessage={errorMessage} />
    </main>
  );
}
