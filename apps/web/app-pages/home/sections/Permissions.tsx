import { PermissionCard } from "@/components/PermissionCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getPermitServices } from "@/features/permit-services/api";
import type { PermitService } from "@/features/permit-services/types";

export async function Permissions() {
  let permitServices: PermitService[] = [];
  let hasError = false;

  try {
    const response = await getPermitServices();
    permitServices = response.data.filter((service) => service.is_active);
  } catch {
    hasError = true;
  }

  return (
    <section
      id="icazələr"
      className="bg-slate-50 px-6 py-16 sm:py-20"
      aria-labelledby="permissions-title"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title="İcazələr"
          description="Kateqoriyanı seçin, uyğun icazəni tapın"
          titleId="permissions-title"
          className="mb-10"
        />

        {hasError ? (
          <p className="text-center text-base text-[#797979]" role="alert">
            İcazələri yükləmək mümkün olmadı.
          </p>
        ) : permitServices.length === 0 ? (
          <p className="text-center text-base text-[#797979]">Aktiv icazə tapılmadı.</p>
        ) : (
          <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {permitServices.map((service) => (
              <PermissionCard
                key={service.id}
                title={service.name}
                href={`/permissions/${service.id}`}
                icon="/icons/permissions/permission-default.svg"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
