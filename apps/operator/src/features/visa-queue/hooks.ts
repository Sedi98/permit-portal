import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { approveVisa, getVisaQueue, returnVisa } from "./api";
import type { VisaDecisionPayload, VisaQueueQueryParams } from "./types";

export function useVisaQueue(params?: VisaQueueQueryParams) {
  return useQuery({
    queryKey: ["visa-queue", "list", params],
    queryFn: () => getVisaQueue(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useApproveVisa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ visaId, payload }: { visaId: number; payload: VisaDecisionPayload }) =>
      approveVisa(visaId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["visa-queue", "list"] }),
  });
}

export function useReturnVisa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ visaId, payload }: { visaId: number; payload: VisaDecisionPayload }) =>
      returnVisa(visaId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["visa-queue", "list"] }),
  });
}
