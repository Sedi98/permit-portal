import { GetApi } from "@/features/http";
import type { StatisticsResponse } from "./types";

export function getStatistics() {
  return GetApi<StatisticsResponse>("/admin/statistics");
}
