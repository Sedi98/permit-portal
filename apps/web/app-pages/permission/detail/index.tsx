import { PermissionIdentity } from "./sections/PermissionIdentity";
import { PermissionInfoSection } from "./sections/PermissionInfoSection";
import { PermissionSummary } from "./sections/PermissionSummary";
import type { DetailItem } from "./sections/types";
import type { PermitServiceDetail } from "@/features/permit-services/types";
import { backendAssetUrl } from "@/lib/api";

const fallbackIcon = "/icons/permission-detail/globe.svg";

function toDetailItems(value: string | null): DetailItem[] {
  if (!value) {
    return [];
  }

  const items = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^•\s*/.test(line))
    .map((line) => ({ text: line.replace(/^•\s*/, "") }));

  return items.length > 0 ? items : [{ text: value }];
}

export default function PermissionDetailPage({
  permitService,
}: {
  permitService: PermitServiceDetail;
}) {
  const permitServiceIcon = permitService.icon_url ?? permitService.icon_path;

  const sections = [
    {
      title: "Hüquqi əsas",
      items: toDetailItems(permitService.legal_basis),
    },
    {
      title: "Tələb olunan sənədlər",
      items: toDetailItems(permitService.required_documents),
    },
    {
      title: "Dayandırılma və imtinanın hüquqi əsasları",
      items: toDetailItems(permitService.suspension_basis),
    },
  ];

  return (
    <main
      className="bg-slate-50 px-6 pb-16 pt-4 sm:pb-20 lg:px-20"
      aria-labelledby="permission-page-title"
    >
      <div className="mx-auto grid max-w-7xl items-start gap-5 lg:grid-cols-[minmax(0,847px)_minmax(0,413px)]">
        <div className="flex min-w-0 flex-col gap-5">
          <PermissionIdentity
            category={permitService.category_label}
            title={permitService.name}
            icon={
              permitServiceIcon
                ? backendAssetUrl(permitServiceIcon)
                : fallbackIcon
            }
          />
          {sections.map((section, index) => (
            <PermissionInfoSection
              key={section.title}
              index={index + 1}
              {...section}
            />
          ))}
        </div>
        <PermissionSummary
          id={permitService.id}
          type={permitService.category_label}
          reviewTime={`${permitService.review_duration_days} iş günü`}
          fee={`${permitService.state_fee} AZN`}
          documentCount={`${permitService.document_count} sənəd`}
          requirements={["MYGOV hesabı", "Tələb olunan sənədlər"]}
        />
      </div>
    </main>
  );
}
