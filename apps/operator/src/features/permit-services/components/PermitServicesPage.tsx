import { LoaderCircle, Package, Pencil, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import TableLayout from "@/app/layouts/TableLayout";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import {
  useDeactivateManagedPermitService,
  useManagedPermitServices,
} from "@/features/permit-services/hooks";

export default function PermitServicesPage() {
  const navigate = useNavigate();
  const services = useManagedPermitServices();
  const deactivate = useDeactivateManagedPermitService();
  const items = services.data?.data ?? [];

  return (
    <div className="space-y-4">
      <h1 className="pl-4 text-base font-medium text-stone-900">İcazələr</h1>
      <TableLayout className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <PageTitle
            title="İcazə növləri"
            text={`Cəmi ${items.length} icazə tapıldı`}
          />
          <Button className="gap-2" onClick={() => navigate("/permit-services/new")}>
            <Plus className="size-4" />
            Yeni icazə
          </Button>
        </div>
        {services.isLoading ? (
          <div className="flex justify-center py-20">
            <LoaderCircle className="size-9 animate-spin text-primary" />
          </div>
        ) : services.isError ? (
          <div className="rounded-lg bg-destructive/5 p-6 text-center text-sm text-destructive">
            İcazələr yüklənmədi.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((service) => (
              <article
                key={service.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#DFDFDF] bg-white p-4"
              >
                <div className="flex min-w-0 items-center gap-4">
                  {service.icon_url ? (
                    <img
                      src={service.icon_url}
                      alt=""
                      className="size-12 rounded-lg object-contain"
                    />
                  ) : (
                    <div className="flex size-12 items-center justify-center rounded-lg bg-[#EEF4FB] text-primary">
                      <Package className="size-6" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#1F1F1F]">
                      {service.short_name || service.name}
                    </p>
                    <p className="mt-1 text-sm text-[#797979]">
                      {service.code} · {service.category_label} ·{" "}
                      {service.is_active ? "Aktiv" : "Deaktiv"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => navigate(`/permit-services/${service.id}`)}
                  >
                    <Pencil className="size-4" />
                    Redaktə et
                  </Button>
                  {service.is_active ? (
                    <Button
                      variant="outline"
                      className="text-destructive"
                      disabled={deactivate.isPending}
                      onClick={() =>
                        deactivate.mutate(service.id, {
                          onSuccess: () => toast.success("İcazə deaktiv edildi"),
                          onError: () => toast.error("İcazə deaktiv edilərkən xəta baş verdi"),
                        })
                      }
                    >
                      Deaktiv et
                    </Button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </TableLayout>
    </div>
  );
}
