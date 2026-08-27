"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

type RadioChoiceCardProps = {
  id: string;
  value: string;
  children: ReactNode;
  className?: string;
  textClassName?: string;
};

function RadioChoiceCard({
  id,
  value,
  children,
  className,
  textClassName,
}: RadioChoiceCardProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex w-full cursor-pointer items-center gap-5 rounded-[14px] border border-[#dfdfdf] bg-white p-[17px] transition-colors",
        "has-data-checked:border-[#286aa6] has-data-checked:bg-[#f9fafc]",
        "focus-within:border-[#286aa6] focus-within:ring-2 focus-within:ring-[#286aa6]/20",
        className,
      )}
    >
      <span className="relative size-6 shrink-0">
        <RadioGroupItem
          id={id}
          value={value}
          className="peer absolute inset-0 z-10 size-6 border-0 bg-transparent opacity-0 shadow-none focus-visible:ring-0 data-checked:border-0 data-checked:bg-transparent"
        />
        <Image
          src="/icons/apply/operations/radio-unchecked.svg"
          alt=""
          width={24}
          height={24}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-6 peer-data-checked:hidden"
        />
        <Image
          src="/icons/apply/operations/radio-checked.svg"
          alt=""
          width={24}
          height={24}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden size-6 peer-data-checked:block"
        />
      </span>
      <span
        className={cn(
          "min-w-0 flex-1 text-sm font-normal leading-5 text-[#626262] group-has-[[data-checked]]/radio-choice-card:font-medium group-has-[[data-checked]]/radio-choice-card:text-[#1f1f1f]",
          textClassName,
        )}
      >
        {children}
      </span>
    </label>
  );
}

export { RadioChoiceCard };
export type { RadioChoiceCardProps };
