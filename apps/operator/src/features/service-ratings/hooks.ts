import { useQuery } from "@tanstack/react-query";

import { getServiceRatingsStatistics } from "./api";
import type { ServiceRatingsQueryParams } from "./types";

export function useServiceRatingsStatistics(params: ServiceRatingsQueryParams) {
  return useQuery({
    queryKey: ["service-ratings", "statistics", params],
    queryFn: () => getServiceRatingsStatistics(params),
    staleTime: 5 * 60 * 1000,
  });
}
