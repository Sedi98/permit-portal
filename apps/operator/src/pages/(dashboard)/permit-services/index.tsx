import type { ColumnDef } from "@tanstack/react-table";
import { LoaderCircle, Package, Pencil, Plus, Power } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import TableLayout from "@/app/layouts/TableLayout";
import PageTitle from "@/components/PageTitle";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  useDeactivateManagedPermitService,
  useManagedPermitServices,
} from "@/features/permit-services/hooks";
import type {
  AllowedApplicantType,
  ManagedPermitService,
} from "@/features/permit-services/types";

const applicantTypeLabels: Record<AllowedApplicantType, string> = {
  physical: "Fiziki şəxs",
  legal: "Hüquqi şəxs",
  both: "Hər ikisi",
};

function PermitServiceCell({ service }: { service: ManagedPermitService }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="flex min-w-64 items-center gap-3 text-left"
      onClick={() => navigate(`/permit-services/${service.id}`)}
      aria-label={`${service.short_name || service.name} icazəsini redaktə et`}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF4FB] text-primary">
        {service.icon_url ? (
          <img src={service.icon_url} alt="" className="size-6 object-contain" />
        ) : (
          <Package className="size-5" />
        )}
      </span>
      <span className="font-medium text-[#1F1F1F]">
        {service.short_name || service.name}
      </span>
    </button>
  );
}

function PermitServiceActions({ service }: { service: ManagedPermitService }) {
  const navigate = useNavigate();
  const deactivate = useDeactivateManagedPermitService();

  return (
    <div className="flex min-w-max items-center gap-2">
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => navigate(`/permit-services/${service.id}`)}
        aria-label="Redaktə et"
        title="Redaktə et"
      >
        <Pencil className="size-4" />
      </Button>
      {service.is_active ? (
        <Button
          variant="outline"
          size="icon-sm"
          className="text-destructive"
          disabled={deactivate.isPending}
          aria-label="Deaktiv et"
          title="Deaktiv et"
          onClick={() =>
            deactivate.mutate(service.id, {
              onSuccess: () => toast.success("İcazə deaktiv edildi"),
              onError: () =>
                toast.error("İcazə deaktiv edilərkən xəta baş verdi"),
            })
          }
        >
          <Power className="size-4" />
        </Button>
      ) : null}
    </div>
  );
}

const columns: ColumnDef<ManagedPermitService>[] = [
  {
    header: "İcazə",
    id: "permit_service",
    cell: ({ row }) => <PermitServiceCell service={row.original} />,
  },
  { header: "Kod", accessorKey: "code" },
  { header: "Kateqoriya", accessorKey: "category_label" },
  {
    header: "Müraciətçi tipi",
    accessorKey: "allowed_applicant_types",
    cell: ({ row }) => applicantTypeLabels[row.original.allowed_applicant_types],
  },
  {
    header: "Status",
    accessorKey: "is_active",
    cell: ({ row }) => (
      <StatusBadge
        variant={row.original.is_active ? "completed" : "suspended"}
        label={row.original.is_active ? "Aktiv" : "Deaktiv"}
      />
    ),
  },
  {
    header: "Əməliyyatlar",
    id: "actions",
    cell: ({ row }) => <PermitServiceActions service={row.original} />,
  },
];

export default function PermitServicesPage() {
  const navigate = useNavigate();
  const services = useManagedPermitServices();
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
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#DFDFDF] p-12 text-center text-sm text-[#797979]">
            İcazə tapılmadı.
          </div>
        ) : (
          <DataTable columns={columns} data={items} />
        )}
      </TableLayout>
    </div>
  );
}
