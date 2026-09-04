import { GetApi, Http } from "@/features/http";

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

export async function downloadReportsExport(params: ReportExportParams) {
  const response = await Http.get<Blob>(
    "/admin/permit-applications/export-excel",
    {
      params,
      responseType: "blob",
    },
  );

  return response.data;
}
