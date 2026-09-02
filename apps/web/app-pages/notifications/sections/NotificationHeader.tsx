"use client";

import type { MouseEventHandler } from "react";
import Image from "next/image";

type NotificationHeaderProps = {
  count?: number;
  loading?: boolean;
  markingAllRead?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export default function NotificationHeader({
  count = 0,
  loading = false,
  markingAllRead = false,
  onClick,
}: NotificationHeaderProps) {
  return (
    <header className="flex h-28 items-center justify-between border-b border-[#dfdfdf] px-20 py-8">
      <h1 className="text-2xl leading-8 font-bold text-[#1f1f1f]">
        Bildirişlər ({loading ? "..." : count})
      </h1>

      <button
        type="button"
        onClick={onClick}
        disabled={loading || markingAllRead || count === 0}
        className="flex items-center justify-center gap-2 rounded-lg border border-[#dfdfdf] bg-white px-4 py-3 text-base leading-6 font-semibold whitespace-nowrap text-[#286aa6] transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#286aa6] focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
      >
        <Image
          src="/icons/notifications/double-tick.svg"
          alt=""
          width={24}
          height={24}
          className="size-6 shrink-0"
        />
        <span>{markingAllRead ? "İşarələnir..." : "Hamısını oxunmuş say"}</span>
      </button>
    </header>
  );
}
