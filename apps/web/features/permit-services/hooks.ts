"use client";

import { useQuery } from "@tanstack/react-query";
import { getPermitService, getPermitServices } from "./api";

export function usePermitServices() {
  return useQuery({
    queryKey: ["permit-services", "list"],
    queryFn: getPermitServices,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePermitService(id: number | null) {
  return useQuery({
    queryKey: ["permit-services", "detail", id],
    queryFn: () => {
      if (id === null) {
        throw new Error("Permit service ID is required.");
      }

      return getPermitService(id);
    },
    enabled: id !== null,
    staleTime: 5 * 60 * 1000,
  });
}
