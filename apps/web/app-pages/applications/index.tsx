import FilterSection from "@/app-pages/applications/sections/FilterSection";
import ApplicationsList from "@/app-pages/applications/sections/ApplicationsList";
import type {
  ApplicationStatus,
  CitizenApplicationListItem,
} from "@/features/applications/types";

type ApplicationsPageProps = {
  applications: CitizenApplicationListItem[];
  selectedStatus?: ApplicationStatus;
  search?: string;
  errorMessage?: string;
};

export default function ApplicationsPage({
  applications,
  selectedStatus,
  search,
  errorMessage,
}: ApplicationsPageProps) {
  return (
    <main className="flex flex-col gap-6 px-4 py-6 sm:px-8 md:px-20">
      <FilterSection selectedStatus={selectedStatus} search={search} />
      <ApplicationsList applications={applications} errorMessage={errorMessage} />
    </main>
  );
}
