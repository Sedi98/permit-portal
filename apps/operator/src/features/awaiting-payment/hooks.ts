import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { confirmPayment, getAwaitingPayments } from "./api";
import type { AwaitingPaymentQueryParams, ConfirmPaymentPayload } from "./types";

export function useAwaitingPayments(params?: AwaitingPaymentQueryParams) {
  return useQuery({
    queryKey: ["awaiting-payment", "list", params],
    queryFn: () => getAwaitingPayments(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useConfirmPayment(applicationId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ConfirmPaymentPayload) => confirmPayment(applicationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["awaiting-payment", "list"] });
      queryClient.invalidateQueries({ queryKey: ["applications", "detail", applicationId] });
      queryClient.invalidateQueries({ queryKey: ["applications", "list"] });
    },
  });
}
