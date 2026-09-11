import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAdminContactSettings, updateAdminContactSettings } from "./api";
import type { ContactSettingsResponse, UpdateContactSettingsPayload } from "./types";

export const contactSettingsQueryKey = ["contact-settings", "admin"] as const;

export function useAdminContactSettings() {
  return useQuery({
    queryKey: contactSettingsQueryKey,
    queryFn: getAdminContactSettings,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateAdminContactSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateContactSettingsPayload) =>
      updateAdminContactSettings(payload),
    onSuccess: (response) => {
      queryClient.setQueryData<ContactSettingsResponse>(
        contactSettingsQueryKey,
        response,
      );
      void queryClient.invalidateQueries({ queryKey: contactSettingsQueryKey });
    },
  });
}
