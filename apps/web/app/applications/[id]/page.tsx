import ApplyPermissionPage from "@/app-pages/apply";
import { getPermitService } from "@/features/permit-services/api";

type ApplyPermissionProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    action?: string;
    section?: string;
    status?: string;
    view?: string;
  }>;
};

const ApplyPermission = async ({ params, searchParams }: ApplyPermissionProps) => {
  const { id } = await params;
  const { action, section, status, view } = await searchParams;
  const isExistingApplication =
    status === "draft" ||
    section === "deficiency" ||
    action !== undefined ||
    view === "1";
  const isValidPermitServiceId =
    /^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id));
  const permitService =
    !isExistingApplication && isValidPermitServiceId
      ? (await getPermitService(id)).data
      : undefined;

  return (
    <ApplyPermissionPage
      id={id}
      isExistingApplication={isExistingApplication}
      initialPermitService={permitService}
    />
  );
};

export default ApplyPermission;
