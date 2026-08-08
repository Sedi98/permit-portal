import { GetApi } from "@/features/http";
import type { ApplicationsQueryParams, ApplicationsResponse } from "./types";

export function getApplications(params?: ApplicationsQueryParams, token?: string | null) {
  return GetApi<ApplicationsResponse>("/permit-applications", params as Record<string, unknown>, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
