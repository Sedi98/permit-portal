import Image from "next/image";
import type { PermissionDetailData } from "./types";

type PermissionIdentityProps = Pick<PermissionDetailData, "category" | "title" | "icon">;

export function PermissionIdentity({ category, title, icon }: PermissionIdentityProps) {
  return (
    <article className="rounded-2xl border border-[#dfdfdf] bg-white p-6 sm:p-8">
      <div className="flex items-start gap-5">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#eef4fb]">
          <Image src={icon} alt="" width={24} height={24} sizes="24px" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium leading-5 text-[#286aa6]">{category}</p>
          <h1 id="permission-page-title" className="mt-2 text-xl font-bold leading-7 text-[#1f1f1f]">{title}</h1>
        </div>
      </div>
    </article>
  );
}
