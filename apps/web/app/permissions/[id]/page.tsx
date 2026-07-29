import type { Metadata } from "next";
import PermissionDetailPage, { permissionDetail } from "@/app-pages/permission/detail";

export const metadata: Metadata = {
  title: "İxrac nəzarəti üçün icazə",
  description: "İxrac nəzarətinə düşən mallar üçün icazə tələbləri, sənədlər və müraciət məlumatları.",
};

export function generateStaticParams() {
  return Array.from({ length: 15 }, (_, index) => ({ id: String(index + 1) }));
}

export default async function PermissionPage({ params }: { params: Promise<{ id: string }> }) {
  await params;
  return <PermissionDetailPage permission={permissionDetail} />;
}
