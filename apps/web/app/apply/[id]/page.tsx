import ApplyPermissionPage from "@/app-pages/apply";

type ApplyPermissionProps = {
  params: Promise<{ id: string }>;
};

const ApplyPermission = async ({ params }: ApplyPermissionProps) => {
  const { id } = await params;

  return <ApplyPermissionPage id={id} />;
};

export default ApplyPermission;
