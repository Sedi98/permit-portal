import ApplicationsPage from "@/app-pages/applications";
import { getApplications } from "@/features/applications/api";
import { getServerAuthToken } from "@/features/auth/server";
import {
  applicationStatusOptions,
  type ApplicationStatus,
  type ApplicationStatusGroup,
  type ApplicationsQueryParams,
  type CitizenApplicationListItem,
} from "@/features/applications/types";

type ApplicationsProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const isApplicationStatus = (value: string): value is ApplicationStatus =>
  applicationStatusOptions.some(([status]) => status === value);

const isApplicationStatusGroup = (value: string): value is ApplicationStatusGroup =>
  value === "in_progress" || value === "payment_history";

const firstSearchParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const Applications = async ({ searchParams }: ApplicationsProps) => {
  const params = await searchParams;

  const rawStatus = firstSearchParam(params.status);
  const rawStatusGroup = firstSearchParam(params.status_group);
  const search = firstSearchParam(params.search)?.trim() || undefined;
  const selectedStatus = rawStatus && isApplicationStatus(rawStatus) ? rawStatus : undefined;
  const selectedStatusGroup =
    rawStatusGroup && isApplicationStatusGroup(rawStatusGroup) ? rawStatusGroup : undefined;

  const query: ApplicationsQueryParams = {
    ...(selectedStatus ? { status: selectedStatus } : {}),
    ...(!selectedStatus && selectedStatusGroup ? { status_group: selectedStatusGroup } : {}),
    ...(search ? { search } : {}),
  };

  let applications: CitizenApplicationListItem[] = [];
  let errorMessage: string | undefined;
  const token = await getServerAuthToken();

  try {
    const response = await getApplications(query, token);
    applications = search
      ? response.data.filter((application) =>
          (application.application_no ?? "")
            .toLocaleLowerCase("az-AZ")
            .includes(search.toLocaleLowerCase("az-AZ")),
        )
      : response.data;
  } catch (error) {
    console.error("Applications load error:", error);
    errorMessage = "Müraciətlər yüklənərkən xəta baş verdi.";
  }

  return (
    <ApplicationsPage
      applications={applications}
      selectedStatus={selectedStatus}
      search={search}
      errorMessage={errorMessage}
    />
  );
};

export default Applications;
