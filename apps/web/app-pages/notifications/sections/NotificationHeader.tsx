"use client";

import type { MouseEventHandler } from "react";
import Image from "next/image";

type NotificationHeaderProps = {
  count?: number;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const handleDefaultClick: MouseEventHandler<HTMLButtonElement> = () => {
  console.log("hello");
};

export default function NotificationHeader({
  count = 3,
  onClick = handleDefaultClick,
}: NotificationHeaderProps) {
  return (
    <header className="flex h-28 items-center justify-between border-b border-[#dfdfdf] px-20 py-8">
      <h1 className="text-2xl leading-8 font-bold text-[#1f1f1f]">
        Bildirişlər ({count})
      </h1>

      <button
        type="button"
        onClick={onClick}
        className="flex items-center justify-center gap-2 rounded-lg border border-[#dfdfdf] bg-white px-4 py-3 text-base leading-6 font-semibold whitespace-nowrap text-[#286aa6] transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#286aa6] focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <Image
          src="/icons/notifications/double-tick.svg"
          alt=""
          width={24}
          height={24}
          className="size-6 shrink-0"
        />
        <span>Hamısını oxunmuş say</span>
      </button>
    </header>
  );
}
