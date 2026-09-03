import { GetApi } from "@/features/http";

import type {
  ReportExportParams,
  ReportParams,
  ReportsResponse,
} from "./types";

export function getReports(params: ReportParams) {
  return GetApi<ReportsResponse>(
    "/admin/permit-applications/report",
    params as unknown as Record<string, unknown>,
  );
}

export function getReportsExportUrl(params: ReportExportParams) {
  const query = new URLSearchParams();

  if (params.permit_service_id) {
    query.set("permit_service_id", String(params.permit_service_id));
  }
  if (params.date_from) query.set("date_from", params.date_from);
  if (params.date_to) query.set("date_to", params.date_to);

  const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");
  const queryString = query.toString();
  return `${baseUrl}/api/admin/permit-applications/export-excel${
    queryString ? `?${queryString}` : ""
  }`;
}
