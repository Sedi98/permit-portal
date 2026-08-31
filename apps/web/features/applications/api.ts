import { GetApi } from "@/features/http";
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
