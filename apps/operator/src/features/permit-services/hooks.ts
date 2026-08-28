import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createManagedPermitService,
  deactivateManagedPermitService,
  getManagedPermitService,
  getManagedPermitServices,
  updateManagedPermitService,
} from "./api";
import type { PermitServiceFormValues } from "./types";

export function useManagedPermitServices() {
  return useQuery({
    queryKey: ["permit-services", "admin", "list"],
    queryFn: getManagedPermitServices,
    staleTime: 5 * 60 * 1000,
  });
}

export function useManagedPermitService(id: number | undefined) {
  return useQuery({
    queryKey: ["permit-services", "admin", "detail", id],
    queryFn: () => getManagedPermitService(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateManagedPermitService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createManagedPermitService,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["permit-services", "admin", "list"],
      }),
  });
}

export function useUpdateManagedPermitService(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: PermitServiceFormValues) =>
      updateManagedPermitService(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["permit-services", "admin", "list"],
      });
      queryClient.invalidateQueries({
        queryKey: ["permit-services", "admin", "detail", id],
      });
    },
  });
}

export function useDeactivateManagedPermitService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivateManagedPermitService,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({
        queryKey: ["permit-services", "admin", "list"],
      });
      queryClient.invalidateQueries({
        queryKey: ["permit-services", "admin", "detail", id],
      });
    },
  });
}
