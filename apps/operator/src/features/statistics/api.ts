import { GetApi } from "@/features/http";
import type {
  DashboardStatisticsParams,
  DashboardStatisticsResponse,
  StatisticsResponse,
} from "./types";

export function getStatistics() {
  return GetApi<StatisticsResponse>("/admin/statistics");
}

export function getDashboardStatistics(params: DashboardStatisticsParams) {
  return GetApi<DashboardStatisticsResponse>(
    "/admin/statistics/dashboard",
    params as Record<string, unknown>,
  );
}
