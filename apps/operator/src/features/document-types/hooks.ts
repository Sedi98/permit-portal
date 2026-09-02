import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createDocumentType, getDocumentTypes } from "./api";
import type { DocumentTypesResponse } from "./types";

const documentTypesQueryKey = ["document-types", "admin", "list"] as const;

export function useDocumentTypes() {
  return useQuery({
    queryKey: documentTypesQueryKey,
    queryFn: getDocumentTypes,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateDocumentType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDocumentType,
    onSuccess: (response) => {
      queryClient.setQueryData<DocumentTypesResponse>(
        documentTypesQueryKey,
        (current) => {
          if (!current) return { data: [response.data] };
          if (current.data.some((item) => item.id === response.data.id)) {
            return current;
          }
          return { ...current, data: [...current.data, response.data] };
        },
      );
    },
  });
}
