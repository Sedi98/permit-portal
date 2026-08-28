import { DeleteApi, GetApi, Http } from "@/features/http";

import type {
  PermitServiceFormValues,
  PermitServiceResponse,
  PermitServicesResponse,
} from "./types";

export function getManagedPermitServices() {
  return GetApi<PermitServicesResponse>("/admin/permit-services");
}

export function getManagedPermitService(id: number) {
  return GetApi<PermitServiceResponse>(`/admin/permit-services/${id}`);
}

function toFormData(values: PermitServiceFormValues, update: boolean) {
  const formData = new FormData();
  if (update) formData.append("_method", "PUT");
  formData.append("name", values.name);
  formData.append("short_name", values.short_name);
  formData.append("category", values.category);
  formData.append("allowed_applicant_types", values.allowed_applicant_types);
  formData.append("is_active", values.is_active ? "1" : "0");
  if (values.icon) formData.append("icon", values.icon);

  const optionalFields = [
    "legal_basis",
    "required_documents",
    "suspension_basis",
    "review_duration_days",
    "state_fee",
    "document_count",
  ] as const;

  for (const field of optionalFields) {
    if (update || values[field]) {
      formData.append(field, values[field]);
    }
  }
  return formData;
}

export async function createManagedPermitService(values: PermitServiceFormValues) {
  const response = await Http.post<PermitServiceResponse>(
    "/admin/permit-services",
    toFormData(values, false),
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
}

export async function updateManagedPermitService(
  id: number,
  values: PermitServiceFormValues,
) {
  const response = await Http.post<PermitServiceResponse>(
    `/admin/permit-services/${id}`,
    toFormData(values, true),
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
}

export function deactivateManagedPermitService(id: number) {
  return DeleteApi<{ status: string; message: string }>(
    `/admin/permit-services/${id}`,
  );
}
