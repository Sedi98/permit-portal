import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  approveConfirmationParticipant,
  getConfirmationHistory,
  getConfirmationQueue,
} from "./api";
import type {
  ApproveConfirmationPayload,
  ConfirmationQueueParams,
} from "./types";

export function useConfirmationQueue(params: ConfirmationQueueParams) {
  return useQuery({
    queryKey: ["confirmations", "queue", params],
    queryFn: () => getConfirmationQueue(params),
    staleTime: 60 * 1000,
  });
}

export function useConfirmationHistory(perPage = 20) {
  return useQuery({
    queryKey: ["confirmations", "history", perPage],
    queryFn: () => getConfirmationHistory(perPage),
    staleTime: 60 * 1000,
  });
}

export function useApproveConfirmationParticipant(
  participantId: number,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ApproveConfirmationPayload) =>
      approveConfirmationParticipant(participantId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["confirmations", "queue"] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}
