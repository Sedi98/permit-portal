import DraftHeader from "@/app-pages/drafts/sections/DraftHeader";
import DraftList, { type DraftListItem } from "@/app-pages/drafts/sections/DraftList";

const mockDrafts: DraftListItem[] = [
  {
    id: "restricted-items-permit",
    title:
      "Mülki dövriyyənin müəyyən iştirakçılarına mənsub ola bilən və dövriyyədə olmasına xüsusi icazə əsasında yol verilən əşyaların dövriyyəsinə icazə",
    currentStep: 2,
    totalSteps: 5,
    progress: 80,
    updatedAt: "04/08/2026 - 14:28",
  },
  {
    id: "energy-distribution-permit",
    title: "Elektrik enerjisinin paylanmasına icazə",
    currentStep: 3,
    totalSteps: 5,
    progress: 60,
    updatedAt: "02/08/2026 - 09:42",
  },
];

export default function DraftsPage() {
  return (
    <main>
      <DraftHeader />
      <DraftList drafts={mockDrafts} />
    </main>
  );
}
