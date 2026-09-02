import { GetApi, PostApi } from "@/features/http";
import type {
  MarkAllNotificationsReadResponse,
  NotificationsQueryParams,
  NotificationsResponse,
  UnreadNotificationsCountResponse,
} from "./types";

export function getNotifications(params?: NotificationsQueryParams) {
  return GetApi<NotificationsResponse>(
    "/notifications",
    params as Record<string, unknown> | undefined,
  );
}

export function getUnreadNotificationsCount() {
  return GetApi<UnreadNotificationsCountResponse>("/notifications/unread-count");
}

export function markAllNotificationsRead() {
  return PostApi<MarkAllNotificationsReadResponse, Record<string, never>>(
    "/notifications/mark-all-read",
    {},
  );
}
