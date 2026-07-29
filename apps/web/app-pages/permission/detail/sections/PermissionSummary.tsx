import Image from "next/image";
import Link from "next/link";
import type { PermissionDetailData } from "./types";

type PermissionSummaryProps = Pick<PermissionDetailData, "type" | "reviewTime" | "fee" | "documentCount" | "requirements">;

const summaryRows = [
  ["Növ", "type"],
  ["Baxılma müddəti", "reviewTime"],
  ["Dövlət rüsumu", "fee"],
  ["Sənəd sayı", "documentCount"],
] as const;

export function PermissionSummary({ type, reviewTime, fee, documentCount, requirements }: PermissionSummaryProps) {
  const values = { type, reviewTime, fee, documentCount };

  return (
    <aside className="rounded-2xl border border-[#dfdfdf] bg-white p-6 sm:p-8 lg:sticky lg:top-6" aria-labelledby="permission-summary-title">
      <h2 id="permission-summary-title" className="text-xl font-bold leading-7 text-[#1f1f1f]">Müraciət məlumatları</h2>

      <dl className="mt-5 flex flex-col gap-3 border-b border-[#dfdfdf] pb-5 text-sm leading-5">
        {summaryRows.map(([label, key]) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <dt className="text-[#797979]">{label}</dt>
            <dd className="text-right font-medium text-[#1f1f1f]">{values[key]}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5">
        <h3 className="text-sm font-normal leading-5 text-[#797979]">Müraciət etmək üçün:</h3>
        <ul className="mt-3 flex flex-col gap-3">
          {requirements.map((requirement) => (
            <li key={requirement} className="flex items-center gap-2 text-sm leading-5 text-[#1f1f1f]">
              <Image src="/icons/permission-detail/tick-circle.svg" alt="" width={20} height={20} sizes="20px" />
              <span>{requirement}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link href="/login" className="mt-8 flex h-12 w-full items-center justify-center rounded-lg bg-[#286aa6] px-4 text-base font-semibold leading-6 text-white transition-colors hover:bg-[#1f5688] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#286aa6] focus-visible:ring-offset-2">
        Müraciət et
      </Link>
    </aside>
  );
}
