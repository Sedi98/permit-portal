import type { Metadata } from "next";
import PermissionDetailPage from "@/app-pages/permission/detail";
import { getPermitService, getPermitServices } from "@/features/permit-services/api";

export const metadata: Metadata = {
  title: "İxrac nəzarəti üçün icazə",
  description: "İxrac nəzarətinə düşən mallar üçün icazə tələbləri, sənədlər və müraciət məlumatları.",
};

export async function generateStaticParams() {
  const response = await getPermitServices();

  return response.data.map(({ id }) => ({ id: String(id) }));
}

export default async function PermissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await getPermitService(id);

  return <PermissionDetailPage permitService={response.data} />;
}
