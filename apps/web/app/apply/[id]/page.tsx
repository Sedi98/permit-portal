import ApplyPermissionPage from "@/app-pages/apply";
import { getPermitService } from "@/features/permit-services/api";

type ApplyPermissionProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ draft?: string }>;
};

const ApplyPermission = async ({ params, searchParams }: ApplyPermissionProps) => {
  const { id } = await params;
  const { draft } = await searchParams;
  const isDraft = draft === "1";
  const isValidPermitServiceId =
    /^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id));
  const permitService =
    !isDraft && isValidPermitServiceId
      ? (await getPermitService(id)).data
      : undefined;

  return (
    <ApplyPermissionPage
      id={id}
      isDraft={isDraft}
      initialPermitService={permitService}
    />
  );
};

export default ApplyPermission;
