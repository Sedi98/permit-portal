"use client";

import { useQuery } from "@tanstack/react-query";
import { getPermitServices } from "./api";

export function usePermitServices() {
  return useQuery({
    queryKey: ["permit-services", "list"],
    queryFn: getPermitServices,
    staleTime: 5 * 60 * 1000,
  });
}
