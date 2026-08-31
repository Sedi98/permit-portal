import { CheckCheck, LoaderCircle, Mail, MailOpen } from "lucide-react";
import { useNavigate } from "react-router";

import TableLayout from "@/app/layouts/TableLayout";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
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
  const navigate = useNavigate();
  const notificationsQuery = useNotifications();
  const unreadCountQuery = useUnreadNotificationsCount();
  const markAllRead = useMarkAllNotificationsRead();
  const notifications = notificationsQuery.data?.data.data ?? [];
  const total = notificationsQuery.data?.data.total ?? 0;
  const unreadCount = unreadCountQuery.data?.data.count ?? 0;

  return (
    <div className="relative space-y-4">
      <h1 className="pl-4 text-base font-medium leading-6 text-stone-900">
        Bildirişlər
      </h1>

      <TableLayout className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <PageTitle
            title="Bildiriş siyahısı"
            text={
              notificationsQuery.isLoading || unreadCountQuery.isLoading
                ? "Bildiriş məlumatları yüklənir"
                : unreadCountQuery.isError
                  ? `Cəmi ${total} bildiriş · oxunmamış sayı yüklənmədi`
                : `Cəmi ${total} bildiriş · ${unreadCount} oxunmamış`
            }
          />
          <Button
            variant="outline"
            className="gap-2"
            disabled={unreadCountQuery.isLoading || markAllRead.isPending || unreadCount === 0}
            onClick={() => markAllRead.mutate()}
          >
            {markAllRead.isPending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <CheckCheck className="size-4" />
            )}
            Hamısını oxunmuş et
          </Button>
        </div>

        {markAllRead.isError ? (
          <p role="alert" className="text-sm text-destructive">
            Bildirişləri oxunmuş kimi işarələmək mümkün olmadı.
          </p>
        ) : null}

        {notificationsQuery.isLoading ? (
          <div className="flex justify-center py-20">
            <LoaderCircle className="size-10 animate-spin text-primary" />
          </div>
        ) : notificationsQuery.isError ? (
          <div className="rounded-lg bg-destructive/5 p-6 text-center text-sm text-destructive">
            Bildirişlər yüklənmədi.
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#DFDFDF] p-12 text-center text-sm text-[#797979]">
            Bildiriş yoxdur.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#DFDFDF]">
            {notifications.map((notification) => {
              const Icon = notification.is_read ? MailOpen : Mail;

              return (
                <button
                  key={notification.id}
                  type="button"
                  className={`flex w-full items-start gap-4 border-b border-[#DFDFDF] p-5 text-left transition-colors last:border-b-0 hover:bg-[#F7F9FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary ${
                    notification.is_read ? "bg-white" : "bg-[#F8FBFE]"
                  }`}
                  onClick={() =>
                    navigate(
                      `/applications/manage/${encodeURIComponent(String(notification.data.permit_application_id))}`,
                    )
                  }
                >
                  <span
                    className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${
                      notification.is_read
                        ? "bg-[#F5F5F5] text-[#797979]"
                        : "bg-white text-primary"
                    }`}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                      <span className="flex min-w-0 items-center gap-2">
                        {!notification.is_read ? (
                          <span className="size-2 shrink-0 rounded-full bg-primary" aria-label="Oxunmayıb" />
                        ) : null}
                        <span className="truncate text-base font-semibold leading-6 text-[#1F1F1F]">
                          {notification.title}
                        </span>
                      </span>
                      <time className="shrink-0 text-sm leading-5 text-[#797979]">
                        {formatNotificationDate(notification.created_at)}
                      </time>
                    </span>
                    <span className="mt-1 block text-sm leading-5 text-[#797979]">
                      {notification.body}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </TableLayout>
    </div>
  );
}
