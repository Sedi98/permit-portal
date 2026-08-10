import { useState } from "react";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import TableLayout from "@/app/layouts/TableLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateManagedPermitService,
  useManagedPermitService,
  useUpdateManagedPermitService,
} from "@/features/permit-services/hooks";
import type {
  ManagedPermitService,
  PermitServiceCategory,
  PermitServiceFormValues,
} from "@/features/permit-services/types";

const emptyValues: PermitServiceFormValues = {
  name: "",
  short_name: "",
  category: "permit",
  is_active: true,
  icon: null,
  legal_basis: "",
  required_documents: "",
  suspension_basis: "",
  review_duration_days: "",
  state_fee: "",
  document_count: "",
};

function getInitialValues(service?: ManagedPermitService): PermitServiceFormValues {
  if (!service) return emptyValues;
  return {
    name: service.name,
    short_name: service.short_name,
    category: service.category,
    is_active: service.is_active,
    icon: null,
    legal_basis: service.legal_basis ?? "",
    required_documents: service.required_documents ?? "",
    suspension_basis: service.suspension_basis ?? "",
    review_duration_days: service.review_duration_days?.toString() ?? "",
    state_fee: service.state_fee?.toString() ?? "",
    document_count: service.document_count?.toString() ?? "",
  };
}

function PermitServiceForm({
  id,
  service,
}: {
  id?: number;
  service?: ManagedPermitService;
}) {
  const navigate = useNavigate();
  const create = useCreateManagedPermitService();
  const update = useUpdateManagedPermitService(id ?? 0);
  const [values, setValues] = useState(() => getInitialValues(service));
  const mutation = id ? update : create;

  const setField = <K extends keyof PermitServiceFormValues>(
    field: K,
    value: PermitServiceFormValues[K],
  ) => setValues((current) => ({ ...current, [field]: value }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!values.name.trim() || !values.short_name.trim()) {
      toast.error("Ad və qısa ad məcburidir");
      return;
    }

    mutation.mutate(values, {
      onSuccess: () => {
        toast.success(id ? "İcazə yeniləndi" : "İcazə yaradıldı");
        navigate("/permit-services");
      },
      onError: () => toast.error("İcazə yadda saxlanılarkən xəta baş verdi"),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="permit-name">Tam ad</Label>
          <Textarea
            id="permit-name"
            value={values.name}
            onChange={(event) => setField("name", event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="permit-short-name">Qısa ad</Label>
          <Input
            id="permit-short-name"
            value={values.short_name}
            onChange={(event) => setField("short_name", event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Kateqoriya</Label>
          <Select
            value={values.category}
            onValueChange={(value) =>
              setField("category", value as PermitServiceCategory)
            }
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="permit">İcazə</SelectItem>
              <SelectItem value="certificate">Şəhadətnamə</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="permit-icon">İkon</Label>
          <Input
            id="permit-icon"
            type="file"
            accept="image/jpeg,image/png,image/svg+xml"
            onChange={(event) => setField("icon", event.target.files?.[0] ?? null)}
          />
        </div>
        <label className="flex items-center gap-3 self-end rounded-lg border border-[#DFDFDF] p-3">
          <input
            type="checkbox"
            checked={values.is_active}
            onChange={(event) => setField("is_active", event.target.checked)}
          />
          Aktiv
        </label>
        {[
          ["review_duration_days", "Baxılma müddəti (gün)", "number"],
          ["state_fee", "Dövlət rüsumu (AZN)", "number"],
          ["document_count", "Sənəd sayı", "number"],
        ].map(([field, label, type]) => (
          <div key={field} className="space-y-2">
            <Label htmlFor={`permit-${field}`}>{label}</Label>
            <Input
              id={`permit-${field}`}
              type={type}
              min="0"
              step={field === "state_fee" ? "0.01" : "1"}
              value={values[field as keyof PermitServiceFormValues] as string}
              onChange={(event) =>
                setField(
                  field as "review_duration_days" | "state_fee" | "document_count",
                  event.target.value,
                )
              }
            />
          </div>
        ))}
        {[
          ["legal_basis", "Hüquqi əsas"],
          ["required_documents", "Tələb olunan sənədlər"],
          ["suspension_basis", "Dayandırılma və imtinanın hüquqi əsasları"],
        ].map(([field, label]) => (
          <div key={field} className="space-y-2 md:col-span-2">
            <Label htmlFor={`permit-${field}`}>{label}</Label>
            <Textarea
              id={`permit-${field}`}
              value={values[field as keyof PermitServiceFormValues] as string}
              onChange={(event) =>
                setField(
                  field as "legal_basis" | "required_documents" | "suspension_basis",
                  event.target.value,
                )
              }
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
          Yadda saxla
        </Button>
      </div>
    </form>
  );
}

export default function PermitServiceManagePage() {
  const navigate = useNavigate();
  const { id: idParam } = useParams();
  const id = idParam && idParam !== "new" ? Number(idParam) : undefined;
  const service = useManagedPermitService(id);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4">
        <Button variant="ghost" className="gap-2 text-primary" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-5" />
          Geri
        </Button>
        <h1 className="font-semibold">{id ? "İcazəni redaktə et" : "Yeni icazə"}</h1>
      </div>
      <TableLayout>
        {id && service.isLoading ? (
          <div className="flex justify-center py-20">
            <LoaderCircle className="size-9 animate-spin text-primary" />
          </div>
        ) : id && (service.isError || !service.data?.data) ? (
          <div className="p-6 text-center text-sm text-destructive">İcazə tapılmadı.</div>
        ) : (
          <PermitServiceForm
            key={id ?? "new"}
            id={id}
            service={service.data?.data}
          />
        )}
      </TableLayout>
    </div>
  );
}
