import { useQuery } from "@tanstack/react-query";
import { getDashboardStatistics, getStatistics } from "./api";
import type { DashboardStatisticsParams } from "./types";

export function useStatistics() {
  return useQuery({
    queryKey: ["statistics"],
    queryFn: getStatistics,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardStatistics(params: DashboardStatisticsParams) {
  return useQuery({
    queryKey: ["statistics", "dashboard", params],
    queryFn: () => getDashboardStatistics(params),
    staleTime: 5 * 60 * 1000,
  });
}
