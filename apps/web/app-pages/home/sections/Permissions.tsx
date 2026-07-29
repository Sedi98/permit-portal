import { PermissionCard } from "@/components/PermissionCard";
import { SectionHeader } from "@/components/SectionHeader";

const permissions = [
  "Qazın paylanmasına icazə",
  "Elektrik enerjisinin nəqlinə icazə",
  "Elektrik enerjisinin paylanmasına icazə",
  "Təbii qazın nəqlinə icazə",
  "Neft məhsullarının dövriyyəsinə icazə",
  "Enerji istehsalına icazə",
  "Bərpa olunan enerji layihəsinə icazə",
  "İstilik enerjisi istehsalına icazə",
  "Enerji auditinə icazə",
  "Qaz qurğularının quraşdırılmasına icazə",
  "Elektrik qurğularının istismarına icazə",
  "Yanacaq doldurma məntəqəsinə icazə",
  "Enerji obyektinin tikintisinə icazə",
  "İxrac enerji əməliyyatına icazə",
  "Enerji təchizatı fəaliyyətinə icazə",
];

export function Permissions() {
  return (
    <section id="icazələr" className="bg-slate-50 px-6 py-16 sm:py-20" aria-labelledby="permissions-title">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title="İcazələr"
          description="Kateqoriyanı seçin, uyğun icazəni tapın"
          titleId="permissions-title"
          className="mb-10"
        />

        <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {permissions.map((title, index) => (
            <PermissionCard
              key={title}
              title={title}
              href={`/permissions/${index + 1}`}
              icon="/icons/permissions/permission-default.svg"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
