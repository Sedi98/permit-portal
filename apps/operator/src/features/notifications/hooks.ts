import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getNotifications,
  getUnreadNotificationsCount,
  markAllNotificationsRead,
} from "./api";
import type { NotificationsQueryParams } from "./types";

export const notificationQueryKeys = {
  lists: ["notifications", "list"] as const,
  list: (params?: NotificationsQueryParams) =>
    [...notificationQueryKeys.lists, params] as const,
  unreadCount: ["notifications", "unread-count"] as const,
};

export function useNotifications(params?: NotificationsQueryParams) {
  return useQuery({
    queryKey: notificationQueryKeys.list(params),
    queryFn: () => getNotifications(params),
    staleTime: 30 * 1000,
  });
}

export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: notificationQueryKeys.unreadCount,
    queryFn: getUnreadNotificationsCount,
    staleTime: 30 * 1000,
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: notificationQueryKeys.lists }),
        queryClient.invalidateQueries({ queryKey: notificationQueryKeys.unreadCount }),
      ]);
    },
  });
}
