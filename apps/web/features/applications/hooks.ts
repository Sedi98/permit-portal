"use client";

import { useQuery } from "@tanstack/react-query";

import { getApplications } from "./api";
import type { ApplicationsQueryParams } from "./types";

export function useApplications(params?: ApplicationsQueryParams) {
  return useQuery({
    queryKey: ["applications", "list", params],
    queryFn: () => getApplications(params),
    staleTime: 5 * 60 * 1000,
  });
}
