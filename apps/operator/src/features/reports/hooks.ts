import { useQuery } from "@tanstack/react-query";

import { getReports } from "./api";
import type { ReportParams } from "./types";

export function useReports(params: ReportParams) {
  return useQuery({
    queryKey: ["reports", params],
    queryFn: () => getReports(params),
    staleTime: 60 * 1000,
  });
}
