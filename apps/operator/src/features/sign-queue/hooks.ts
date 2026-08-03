import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSignQueue, signDocument } from "./api";
import type { SignQueueQueryParams } from "./types";

export function useSignQueue(params?: SignQueueQueryParams) {
  return useQuery({
    queryKey: ["sign-queue", "list", params],
    queryFn: () => getSignQueue(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSignDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: number) => signDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sign-queue", "list"] });
      queryClient.invalidateQueries({ queryKey: ["applications", "list"] });
    },
  });
}
