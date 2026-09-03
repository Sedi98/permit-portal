"use client";

import { Mail, MailOpen } from "lucide-react";

export type NotificationContainerProps = {
  title: string;
  message: string;
  date: string;
  read: boolean;
  onClick: () => void;
};

export default function NotificationContainer({
  title,
  message,
  date,
  read,
  onClick,
}: NotificationContainerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full cursor-pointer flex-col items-start border-b border-[#dfdfdf] p-6 text-left transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#286aa6] focus-visible:outline-none ${
        read ? "bg-white" : "rounded-t-xl bg-[#f9fafc]"
      }`}
    >
      <div className="flex w-full items-start gap-6">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg px-[11px] ${
            read ? "bg-[#f5f5f5]" : "bg-white"
          }`}
        >
          {read ? (
            <MailOpen className="size-6" strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Mail className="size-6" strokeWidth={1.5} aria-hidden="true" />
          )}
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
            </div>
            <time className="shrink-0 text-sm leading-5 text-[#797979]">
              {date}
            </time>
          </div>

          <p className="w-full text-sm leading-5 text-[#797979]">{message}</p>
        </div>
      </div>
    </button>
  );
}
