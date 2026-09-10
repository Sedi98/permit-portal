import { useRef, useState } from "react";
import { isAxiosError } from "axios";
import { ArrowLeft, LoaderCircle, Package } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import TableLayout from "@/app/layouts/TableLayout";
import NoteTextarea from "@/components/NoteTextarea";
import TiptapNoteEditor from "@/components/tiptap-note-editor";
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
import {
  useCreateManagedPermitService,
  useManagedPermitService,
  useUpdateManagedPermitService,
} from "@/features/permit-services/hooks";
import type {
  AllowedApplicantType,
  ManagedPermitService,
  PermitServiceCategory,
  PermitServiceFormValues,
} from "@/features/permit-services/types";

import DocumentTypeSelector from "./document-type-selector";

const emptyValues: PermitServiceFormValues = {
  name: "",
  short_name: "",
  category: "permit",
  allowed_applicant_types: "both",
  is_active: true,
  icon: null,
  legal_basis: "",
  required_documents: "",
  suspension_basis: "",
  review_duration_days: "",
  state_fee: "",
  document_type_ids: [],
  document_type_applicant_types: {},
};

const MAX_ICON_SIZE = 2 * 1024 * 1024;
const ALLOWED_ICON_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/svg+xml",
]);

const APPLICANT_TYPE_OPTIONS: Array<{
  label: string;
  value: AllowedApplicantType;
}> = [
  { label: "Fiziki", value: "physical" },
  { label: "Hüquqi", value: "legal" },
  { label: "Hər ikisi", value: "both" },
];

type FormErrors = Partial<Record<keyof PermitServiceFormValues, string>>;

type ApiValidationError = {
  message?: string;
  errors?: Partial<
    Record<keyof PermitServiceFormValues, string | string[]>
  >;
};

function validateIcon(icon: File | null) {
  if (!icon) return undefined;
  if (!ALLOWED_ICON_TYPES.has(icon.type)) {
    return "İkon JPG, PNG və ya SVG formatında olmalıdır.";
  }
  if (icon.size > MAX_ICON_SIZE) {
    return "İkonun ölçüsü 2 MB-dan çox ola bilməz.";
  }
  return undefined;
}

function validateValues(values: PermitServiceFormValues) {
  const errors: FormErrors = {};

  if (!values.name.trim()) errors.name = "Tam ad məcburidir.";
  if (!values.short_name.trim()) errors.short_name = "Qısa ad məcburidir.";
  if (!values.allowed_applicant_types) {
    errors.allowed_applicant_types = "Müraciətçi tipi məcburidir.";
  }
  if (values.document_type_ids.length === 0) {
    errors.document_type_ids = "Ən azı bir sənəd növü seçilməlidir.";
  }

  const iconError = validateIcon(values.icon);
  if (iconError) errors.icon = iconError;

  const numericFields = [
    ["review_duration_days", "Baxılma müddəti", true],
    ["state_fee", "Dövlət rüsumu", false],
  ] as const;

  for (const [field, label, integer] of numericFields) {
    const value = values[field];
    if (!value) continue;
    const numericValue = Number(value);
    if (
      !Number.isFinite(numericValue) ||
      numericValue < 0 ||
      (integer && !Number.isInteger(numericValue))
    ) {
      errors[field] = integer
        ? `${label} mənfi olmayan tam ədəd olmalıdır.`
        : `${label} mənfi olmayan ədəd olmalıdır.`;
    }
  }

  return errors;
}

function getApiValidation(error: unknown) {
  const fallback = "İcazə yadda saxlanılarkən xəta baş verdi";
  if (!isAxiosError<ApiValidationError>(error)) {
    return { message: fallback, errors: {} as FormErrors };
  }

  const response = error.response?.data;
  const errors: FormErrors = {};
  for (const [field, messages] of Object.entries(response?.errors ?? {})) {
    const message = Array.isArray(messages) ? messages[0] : messages;
    const normalizedField = field.split(".")[0] as keyof PermitServiceFormValues;
    if (message) errors[normalizedField] = message;
  }

  return { message: response?.message ?? fallback, errors };
}

function getInitialValues(service?: ManagedPermitService): PermitServiceFormValues {
  if (!service) return emptyValues;
  const documentTypes = [
    ...(service.documentTypes ?? service.document_types ?? []),
  ].sort(
    (first, second) => first.pivot.display_order - second.pivot.display_order,
  );

  return {
    name: service.name,
    short_name: service.short_name,
    category: service.category,
    allowed_applicant_types: service.allowed_applicant_types ?? "both",
    is_active: service.is_active,
    icon: null,
    legal_basis: service.legal_basis ?? "",
    required_documents: service.required_documents ?? "",
    suspension_basis: service.suspension_basis ?? "",
    review_duration_days: service.review_duration_days?.toString() ?? "",
    state_fee: service.state_fee?.toString() ?? "",
    document_type_ids: documentTypes.map((item) => item.id),
    document_type_applicant_types: Object.fromEntries(
      documentTypes.map((item) => [
        item.id.toString(),
        item.pivot.applicant_type ?? null,
      ]),
    ),
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
  const [errors, setErrors] = useState<FormErrors>({});
  const iconInputRef = useRef<HTMLInputElement>(null);
  const isEdit = id !== undefined;
  const mutation = isEdit ? update : create;

  const setField = <K extends keyof PermitServiceFormValues>(
    field: K,
    value: PermitServiceFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const icon = event.target.files?.[0] ?? null;
    const error = validateIcon(icon);
    if (error) {
      event.target.value = "";
      setField("icon", null);
      setErrors((current) => ({ ...current, icon: error }));
      toast.error(error);
      return;
    }
    setField("icon", icon);
  };

  const handleDocumentTypesChange = (
    ids: number[],
    applicantTypes: PermitServiceFormValues["document_type_applicant_types"],
  ) => {
    setValues((current) => ({
      ...current,
      document_type_ids: ids,
      document_type_applicant_types: applicantTypes,
    }));
    setErrors((current) => {
      if (!current.document_type_ids) return current;
      const next = { ...current };
      delete next.document_type_ids;
      return next;
    });
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors = validateValues(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Məlumatları düzgün doldurun");
      return;
    }

    mutation.mutate(
      {
        ...values,
        name: values.name.trim(),
        short_name: values.short_name.trim(),
      },
      {
        onSuccess: () => {
          toast.success(isEdit ? "İcazə yeniləndi" : "İcazə yaradıldı");
          navigate("/permit-services");
        },
        onError: (error) => {
          const validation = getApiValidation(error);
          setErrors(validation.errors);
          toast.error(validation.message);
        },
      },
    );
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="permit-short-name" className="text-[#797979]">Qısa ad</Label>
          <Input
            id="permit-short-name"
            value={values.short_name}
            onChange={(event) => setField("short_name", event.target.value)}
            aria-invalid={!!errors.short_name}
            aria-describedby={errors.short_name ? "permit-short-name-error" : undefined}
            required
          />
          {errors.short_name ? (
            <p id="permit-short-name-error" className="text-sm text-destructive">
              {errors.short_name}
            </p>
          ) : null}
        </div>
        <div className="space-y-2 md:col-span-2">
          <NoteTextarea
            id="permit-name"
            label="Tam ad"
            value={values.name}
            onChange={(event) => setField("name", event.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "permit-name-error" : undefined}
            required
          />
          {errors.name ? (
            <p id="permit-name-error" className="text-sm text-destructive">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="permit-allowed-applicant-types" className="text-[#797979]">
            Müraciətçi tipi
          </Label>
          <Select
            value={values.allowed_applicant_types}
            onValueChange={(value) =>
              setField(
                "allowed_applicant_types",
                value as AllowedApplicantType,
              )
            }
            required
          >
            <SelectTrigger
              id="permit-allowed-applicant-types"
              aria-invalid={!!errors.allowed_applicant_types}
              aria-describedby={
                errors.allowed_applicant_types
                  ? "permit-allowed-applicant-types-error"
                  : undefined
              }
            >
              <SelectValue placeholder="Müraciətçi tipini seçin" />
            </SelectTrigger>
            <SelectContent>
              {APPLICANT_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.allowed_applicant_types ? (
            <p
              id="permit-allowed-applicant-types-error"
              className="text-sm text-destructive"
            >
              {errors.allowed_applicant_types}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="permit-category" className="text-[#797979]">Kateqoriya</Label>
          <Select
            value={values.category}
            onValueChange={(value) =>
              setField("category", value as PermitServiceCategory)
            }
          >
            <SelectTrigger
              id="permit-category"
              aria-invalid={!!errors.category}
              aria-describedby={errors.category ? "permit-category-error" : undefined}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="permit">İcazə</SelectItem>
              <SelectItem value="certificate">Şəhadətnamə</SelectItem>
            </SelectContent>
          </Select>
          {errors.category ? (
            <p id="permit-category-error" className="text-sm text-destructive">
              {errors.category}
            </p>
          ) : null}
        </div>
        <div className="md:col-span-2">
          <DocumentTypeSelector
            selectedIds={values.document_type_ids}
            applicantTypes={values.document_type_applicant_types}
            initialDocumentTypes={
              service?.documentTypes ?? service?.document_types
            }
            onChange={handleDocumentTypesChange}
            error={errors.document_type_ids}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="permit-icon" className="text-[#797979]">İkon</Label>
          <button
            type="button"
            className="flex size-16 items-center justify-center rounded-lg border border-dashed border-[#DFDFDF] bg-[#EEF4FB] text-primary transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => iconInputRef.current?.click()}
            aria-label="İkon faylı seç"
            aria-describedby={
              errors.icon
                ? "permit-icon-help permit-icon-error"
                : "permit-icon-help"
            }
          >
            {service?.icon_url ? (
              <img
                src={service.icon_url}
                alt="Cari icazə ikonu"
                className="size-10 object-contain"
              />
            ) : (
              <Package className="size-5" aria-hidden="true" />
            )}
          </button>
          <Input
            id="permit-icon"
            ref={iconInputRef}
            type="file"
            accept="image/jpeg,image/png,image/svg+xml"
            onChange={handleIconChange}
            className="sr-only"
            tabIndex={-1}
          />
          <p id="permit-icon-help" className="text-xs text-[#797979]">
            JPG, PNG və ya SVG · maksimum 2 MB
          </p>
          {errors.icon ? (
            <p id="permit-icon-error" className="text-sm text-destructive">
              {errors.icon}
            </p>
          ) : null}
        </div>
        <label className="flex items-center gap-3 self-end rounded-lg border border-[#DFDFDF] p-3 text-[#797979]">
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
        ].map(([field, label, type]) => {
          const typedField = field as
            | "review_duration_days"
            | "state_fee";
          const error = errors[typedField];
          return (
            <div key={field} className="space-y-2">
              <Label htmlFor={`permit-${field}`} className="text-[#797979]">{label}</Label>
              <Input
                id={`permit-${field}`}
                type={type}
                min="0"
                step={field === "state_fee" ? "0.01" : "1"}
                value={values[typedField]}
                onChange={(event) => setField(typedField, event.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? `permit-${field}-error` : undefined}
              />
              {error ? (
                <p
                  id={`permit-${field}-error`}
                  className="text-sm text-destructive"
                >
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}
        {[
          ["legal_basis", "Hüquqi əsas"],
          ["required_documents", "Tələb olunan sənədlər"],
          ["suspension_basis", "Dayandırılma və imtinanın hüquqi əsasları"],
        ].map(([field, label]) => {
          const typedField = field as
            | "legal_basis"
            | "required_documents"
            | "suspension_basis";
          const error = errors[typedField];
          return (
            <div key={field} className="space-y-2 md:col-span-2">
              <TiptapNoteEditor
                id={`permit-${field}`}
                label={label}
                value={values[typedField]}
                onChange={(value) => setField(typedField, value)}
                aria-invalid={!!error}
                aria-describedby={error ? `permit-${field}-error` : undefined}
              />
              {error ? (
                <p
                  id={`permit-${field}-error`}
                  className="text-sm text-destructive"
                >
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}
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
  const isInvalidId =
    idParam !== undefined &&
    (!/^[1-9]\d*$/.test(idParam) || !Number.isSafeInteger(Number(idParam)));
  const id = isInvalidId || idParam === undefined ? undefined : Number(idParam);
  const service = useManagedPermitService(id);

  if (isInvalidId) {
    return (
      <TableLayout>
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          <p className="text-sm text-destructive">
            İcazə identifikatoru yanlışdır.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/permit-services")}
          >
            İcazələrə qayıt
          </Button>
        </div>
      </TableLayout>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4">
        <Button
          variant="ghost"
          className="gap-2 text-primary"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="size-5" />
          Geri
        </Button>
        <h1 className="font-semibold">
          {id !== undefined ? "İcazəni redaktə et" : "Yeni icazə"}
        </h1>
      </div>
      <TableLayout>
        {id !== undefined && service.isLoading ? (
          <div className="flex justify-center py-20">
            <LoaderCircle className="size-9 animate-spin text-primary" />
          </div>
        ) : id !== undefined && (service.isError || !service.data?.data) ? (
          <div className="p-6 text-center text-sm text-destructive">
            İcazə tapılmadı.
          </div>
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
