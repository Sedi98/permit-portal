import { GetApi, PostApi } from "@/features/http";
import { apiUrl } from "@/lib/api";
import type {
  ApplicationsQueryParams,
  ApplicationsResponse,
  DraftApplicationsResponse,
} from "./types";

export function getApplications(params?: ApplicationsQueryParams, token?: string | null) {
  return GetApi<ApplicationsResponse>("/permit-applications", params as Record<string, unknown>, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

export function getDraftApplications(token?: string | null) {
  return GetApi<DraftApplicationsResponse>(
    "/permit-applications",
    { status: "draft" },
    {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    },
  );
}

export function payApplication(applicationId: number) {
  return PostApi<{
    status: string;
    message: string;
    data: { id: number; status: "payment_review"; paid_at: string };
  }, Record<string, never>>(`/permit-applications/${applicationId}/pay`, {});
}

export function getApplicationDocumentDownloadUrl(
  applicationId: number,
  documentId: number,
) {
  return apiUrl(
    `/permit-applications/${applicationId}/documents/${documentId}/download`,
  );
}
