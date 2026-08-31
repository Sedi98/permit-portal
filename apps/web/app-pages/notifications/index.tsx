"use client";

import NotificationHeader from "@/app-pages/notifications/sections/NotificationHeader";
import NotificationContainer from "@/app-pages/notifications/sections/NotificationContainer";
import {
  useMarkAllNotificationsRead,
  useNotifications,
  useUnreadNotificationsCount,
} from "@/features/notifications/hooks";

function formatNotificationDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("az-AZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(date)
    .replace(",", " ·");
}

export default function NotificationsPage() {
  const notificationsQuery = useNotifications();
  const unreadCountQuery = useUnreadNotificationsCount();
  const markAllRead = useMarkAllNotificationsRead();
  const notifications = notificationsQuery.data?.data.data ?? [];
  const unreadCount = unreadCountQuery.data?.data.count ?? 0;

  return (
    <main>
      <NotificationHeader
        count={unreadCount}
        loading={unreadCountQuery.isPending}
        markingAllRead={markAllRead.isPending}
        onClick={() => markAllRead.mutate()}
      />
      <section aria-label="Bildirişlər" className="my-8 max-w-7xl w-full mx-auto">
        {notificationsQuery.isPending ? (
          <p className="px-6 py-8 text-sm text-[#797979]">Bildirişlər yüklənir...</p>
        ) : notificationsQuery.isError ? (
          <p role="alert" className="px-6 py-8 text-sm text-[#f32020]">
            Bildirişlər yüklənərkən xəta baş verdi.
          </p>
        ) : notifications.length === 0 ? (
          <p className="px-6 py-8 text-sm text-[#797979]">Bildiriş yoxdur.</p>
        ) : (
          notifications.map((notification) => (
            <NotificationContainer
              key={notification.id}
              title={notification.title}
              message={notification.body}
              date={formatNotificationDate(notification.created_at)}
              read={notification.is_read}
              applicationId={notification.data.permit_application_id}
            />
          ))
        )}
        {markAllRead.isError ? (
          <p role="alert" className="px-6 pt-4 text-sm text-[#f32020]">
            Bildirişləri oxunmuş kimi işarələmək mümkün olmadı.
          </p>
        ) : null}
      </section>
    </main>
  );
}
