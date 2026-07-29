import { GetApi, Http, PostApi } from "@/features/http";
import type {
  ApplicationsQueryParams,
  AssignPayload,
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

export async function getFileBlob(applicationId: number, fileId: number) {
  const response = await Http.get(
    `/admin/permit-applications/${applicationId}/files/${fileId}/download`,
    { responseType: "blob" },
  );
  return response.data as Blob;
}
