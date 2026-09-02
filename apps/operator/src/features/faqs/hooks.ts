import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createFaq, deleteFaq, getAdminFaqs, updateFaq } from "./api";
import type { CreateFaqPayload, UpdateFaqPayload } from "./types";

export const faqQueryKeys = {
  adminList: ["faqs", "admin", "list"] as const,
};

export function useAdminFaqs() {
  return useQuery({
    queryKey: faqQueryKeys.adminList,
    queryFn: getAdminFaqs,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFaqPayload) => createFaq(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: faqQueryKeys.adminList }),
  });
}

export function useUpdateFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateFaqPayload }) =>
      updateFaq(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: faqQueryKeys.adminList }),
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteFaq(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: faqQueryKeys.adminList }),
  });
}
