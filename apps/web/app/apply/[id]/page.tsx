import ApplyPermissionPage from "@/app-pages/apply";

type ApplyPermissionProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ draft?: string }>;
};

const ApplyPermission = async ({ params, searchParams }: ApplyPermissionProps) => {
  const { id } = await params;
  const { draft } = await searchParams;

  return <ApplyPermissionPage id={id} isDraft={draft === "1"} />;
};

export default ApplyPermission;
