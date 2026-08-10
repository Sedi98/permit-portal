import ApplicationListPage from "@/components/ApplicationListPage";
import { useMe } from "@/features/auth/hooks";

export default function AssignedApplicationsPage() {
  const { data: me } = useMe();
  const role = me?.data?.role;
  const status =
    role === "deputy_minister" || role === "super_admin"
      ? "registered"
      : "assigned";

  return <ApplicationListPage title="Yeni daxil olanlar" initialStatus={status} />;
}
