import { GetApi, Http, PostApi } from "@/features/http";
import type {
  AssignApplicationPayload,
  ApplicationsQueryParams,
  AssignPayload,
  DepartmentsResponse,
  FileReviewPayload,
  ForwardApplicationPayload,
  PrepareDocumentPayload,
  StatusChangePayload,
  PaginatedApplicationsResponse,
  ApplicationDetailResponse,
  ExecutorsResponse,
  StatusChangeResponse,
} from "./types";

export function getApplications(params?: ApplicationsQueryParams) {
  return GetApi<PaginatedApplicationsResponse>(
    "/admin/permit-applications",
    params as Record<string, unknown>,
  );
}

export function getApplicationById(id: number) {
  return GetApi<ApplicationDetailResponse>(`/admin/permit-applications/${id}`);
}

export function getExecutors() {
  return GetApi<ExecutorsResponse>("/admin/executors");
}

export function getDepartments() {
  return GetApi<DepartmentsResponse>("/admin/departments");
}

export function forwardApplication(id: number, payload: ForwardApplicationPayload) {
  return PostApi<StatusChangeResponse, ForwardApplicationPayload>(
    `/admin/permit-applications/${id}/forward`,
    payload,
  );
}

export function assignApplication(id: number, payload: AssignApplicationPayload) {
  return PostApi<StatusChangeResponse, AssignApplicationPayload>(
    `/admin/permit-applications/${id}/assign`,
    payload,
  );
}

export function assignExecutor(id: number, payload: AssignPayload) {
  return PostApi<StatusChangeResponse, AssignPayload>(
    `/admin/permit-applications/${id}/assign`,
    payload,
  );
}

export function changeStatus(id: number, payload: StatusChangePayload) {
  return PostApi<StatusChangeResponse, StatusChangePayload>(
    `/admin/permit-applications/${id}/status`,
    payload,
  );
}

export function reviewApplicationFile(id: number, fileId: number, payload: FileReviewPayload) {
  return PostApi<StatusChangeResponse, FileReviewPayload>(
    `/admin/permit-applications/${id}/files/${fileId}/review`,
    payload,
  );
}

export function prepareApplicationDocument(id: number, payload: PrepareDocumentPayload) {
  return PostApi<StatusChangeResponse, PrepareDocumentPayload>(
    `/admin/permit-applications/${id}/documents`,
    payload,
  );
}

export async function getFileBlob(applicationId: number, fileId: number) {
  const response = await Http.get(
    `/admin/permit-applications/${applicationId}/files/${fileId}/download`,
    { responseType: "blob" },
  );
  return response.data as Blob;
}
