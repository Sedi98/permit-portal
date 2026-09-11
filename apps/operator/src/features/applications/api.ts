import { GetApi, Http, PostApi, PutApi } from "@/features/http";
import type {
  ApplicationsQueryParams,
  DepartmentsResponse,
  FileReviewPayload,
  StatusChangePayload,
  PaginatedApplicationsResponse,
  ApplicationDetailResponse,
  ApplicationsCollectionResponse,
  CreateConfirmationSequencePayload,
  RouteApplicationPayload,
  RoutingCandidatesResponse,
  StatusChangeResponse,
  UpdateTradeDetailPayload,
  UpdateTradeDetailResponse,
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

export function getRoutingCandidates() {
  return GetApi<RoutingCandidatesResponse>("/admin/routing-candidates");
}

export function getDepartments() {
  return GetApi<DepartmentsResponse>("/admin/departments");
}

export function routeApplication(id: number, payload: RouteApplicationPayload) {
  return PostApi<StatusChangeResponse, RouteApplicationPayload>(
    `/admin/permit-applications/${id}/route`,
    payload,
  );
}

export function createConfirmationSequence(
  id: number,
  payload: CreateConfirmationSequencePayload,
) {
  return PostApi<StatusChangeResponse, CreateConfirmationSequencePayload>(
    `/admin/permit-applications/${id}/confirmation-sequences`,
    payload,
  );
}

export function confirmPaymentReceived(id: number) {
  return PostApi<StatusChangeResponse, Record<string, never>>(
    `/admin/permit-applications/${id}/confirm-payment-received`,
    {},
  );
}

export function updateTradeDetail(
  id: number,
  payload: UpdateTradeDetailPayload,
) {
  return PutApi<UpdateTradeDetailResponse, UpdateTradeDetailPayload>(
    `/admin/permit-applications/${id}/trade-detail`,
    payload,
  );
}

export async function getApplicationPreviewBlob(id: number) {
  const response = await Http.get(
    `/admin/permit-applications/${id}/preview-document`,
    { responseType: "blob" },
  );
  return response.data as Blob;
}

export function getAwaitingSignatureApplications() {
  return GetApi<ApplicationsCollectionResponse>(
    "/admin/permit-applications-awaiting-signature",
  );
}

export function signApplication(id: number) {
  return PostApi<StatusChangeResponse, Record<string, never>>(
    `/admin/permit-applications/${id}/sign`,
    {},
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

export async function getFileBlob(applicationId: number, fileId: number) {
  const response = await Http.get(
    `/admin/permit-applications/${applicationId}/files/${fileId}/download`,
    { responseType: "blob" },
  );
  return response.data as Blob;
}

export async function getApplicationDocumentBlob(
  applicationId: number,
  documentId: number,
) {
  const response = await Http.get(
    `/admin/permit-applications/${applicationId}/documents/${documentId}/download`,
    { responseType: "blob" },
  );
  return response.data as Blob;
}
