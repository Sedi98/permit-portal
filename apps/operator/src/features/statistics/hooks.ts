import { useQuery } from "@tanstack/react-query";
import { getStatistics } from "./api";

export function useStatistics() {
  return useQuery({
    queryKey: ["statistics"],
    queryFn: getStatistics,
    staleTime: 5 * 60 * 1000,
  });
}
