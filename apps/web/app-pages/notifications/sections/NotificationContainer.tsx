"use client";

import Image from "next/image";
import { useState } from "react";
import type { KeyboardEvent } from "react";

import NotificationDialog, {
  type NotificationDialogData,
} from "@/app-pages/notifications/sections/NotificationDialog";

export type NotificationContainerProps = {
  title: string;
  applicationNumber: string;
  message: string;
  date: string;
  read: boolean;
  details: NotificationDialogData;
  onClick?: () => void;
};

export default function NotificationContainer({
  title,
  applicationNumber,
  message,
  date,
  read,
  details,
  onClick,
}: NotificationContainerProps) {
  const [showDetailsLink, setShowDetailsLink] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleNotificationClick = () => {
    setShowDetailsLink(true);
    onClick?.();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNotificationClick();
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleNotificationClick}
      onKeyDown={handleKeyDown}
      className={`flex  cursor-pointer flex-col items-start border-b border-[#dfdfdf] p-6 transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#286aa6] focus-visible:outline-none ${
        read ? "bg-white" : "rounded-t-xl bg-[#f9fafc]"
      }`}
    >
      <div className="flex w-full items-start gap-6">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg px-[11px] ${
            read ? "bg-[#f5f5f5]" : "bg-white"
          }`}
        >
          <Image
            src={
              read
                ? "/icons/notifications/mail-open.svg"
                : "/icons/notifications/mail-close.svg"
            }
            alt=""
            aria-hidden="true"
            width={24}
            height={24}
            className="size-6"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
          <div className="flex w-full items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-2">
              {!read && (
                <span
                  aria-label="Oxunmayıb"
                  className="size-2 shrink-0 rounded-full bg-[#286aa6]"
                />
              )}
              <p className="truncate text-base leading-6 font-medium text-[#1f1f1f]">
                {title}
              </p>
              <span
                className={`shrink-0 rounded px-3 py-0.5 text-sm leading-5 font-semibold text-[#286aa6] ${
                  read ? "bg-[#f9fafc]" : "bg-white"
                }`}
              >
                {applicationNumber}
              </span>
            </div>
            <time className="shrink-0 text-sm leading-5 text-[#797979]">
              {date}
            </time>
          </div>

          <p className="w-full text-sm leading-5 text-[#797979]">{message}</p>

          {showDetailsLink && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setDialogOpen(true);
              }}
              className="flex items-center justify-center gap-2 text-sm leading-5 font-medium text-[#286aa6] focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[#286aa6] focus-visible:outline-none"
            >
              <Image
                src="/icons/notifications/eye-open.svg"
                alt=""
                aria-hidden="true"
                width={24}
                height={24}
                className="size-6"
              />
              <span>Ətraflı bax</span>
            </button>
          )}
        </div>
      </div>

      <NotificationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={title}
        date={date}
        data={details}
      />
    </article>
  );
}
