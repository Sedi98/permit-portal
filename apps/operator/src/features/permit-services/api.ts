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
  formData.append("is_active", values.is_active ? "1" : "0");
  if (values.icon) formData.append("icon", values.icon);
  if (values.legal_basis) formData.append("legal_basis", values.legal_basis);
  if (values.required_documents) {
    formData.append("required_documents", values.required_documents);
  }
  if (values.suspension_basis) {
    formData.append("suspension_basis", values.suspension_basis);
  }
  if (values.review_duration_days) {
    formData.append("review_duration_days", values.review_duration_days);
  }
  if (values.state_fee) formData.append("state_fee", values.state_fee);
  if (values.document_count) {
    formData.append("document_count", values.document_count);
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
