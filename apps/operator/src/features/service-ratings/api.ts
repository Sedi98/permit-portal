import { GetApi } from "@/features/http";

import type {
  ServiceRatingsQueryParams,
  ServiceRatingsStatisticsResponse,
} from "./types";

export function getServiceRatingsStatistics(params: ServiceRatingsQueryParams) {
  return GetApi<ServiceRatingsStatisticsResponse>(
    "/admin/service-ratings/statistics",
    params as unknown as Record<string, unknown>,
  );
}
