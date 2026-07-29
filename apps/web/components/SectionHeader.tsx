import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  title: ReactNode;
  description: ReactNode;
  className?: string;
  titleId?: string;
};

export function SectionHeader({ title, description, className, titleId }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2 text-center", className)}>
      <h2 id={titleId} className="text-[32px] font-bold leading-9 text-[#1f1f1f]">{title}</h2>
      <p className="text-base font-medium leading-6 text-[#797979]">{description}</p>
    </div>
  );
}
