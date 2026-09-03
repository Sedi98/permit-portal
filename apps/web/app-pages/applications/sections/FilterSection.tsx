import Link from "next/link";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  applicationStatusOptions,
  type ApplicationStatus,
} from "@/features/applications/types";

export const applicationStatuses = applicationStatusOptions;
export type { ApplicationStatus } from "@/features/applications/types";

type FilterSectionProps = {
  selectedStatus?: ApplicationStatus;
  search?: string;
};

export default function FilterSection({ selectedStatus, search = "" }: FilterSectionProps) {
  return (
    <section className="w-full" aria-label="Müraciət filtrləri">
      <form action="/applications" method="get" className="flex w-full flex-wrap items-center gap-3 md:gap-5">
        <div className="flex h-12 w-full items-center gap-3 rounded-lg bg-[#f5f5f5] px-4 md:w-60">
          <label htmlFor="applications-search" className="sr-only">
            Müraciət nömrəsi ilə axtar
          </label>
          <input
            id="applications-search"
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Müraciət №"
            className="min-w-0 flex-1 bg-transparent text-base leading-6 text-[#1f1f1f] outline-none placeholder:text-[#797979]"
          />
          <button
            type="submit"
            aria-label="Axtar"
            className="flex size-6 shrink-0 items-center justify-center rounded text-[#1f1f1f] transition-colors hover:text-[#286aa6] focus-visible:ring-2 focus-visible:ring-[#286aa6] focus-visible:outline-none"
          >
            <Search className="size-5" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        {selectedStatus && <input type="hidden" name="status" value={selectedStatus} />}

        <Button
          asChild
          className={`h-12 rounded-lg border px-4 py-3 text-sm leading-5 font-semibold whitespace-nowrap ${
            selectedStatus === undefined
              ? "border-[#286aa6] bg-[#286aa6] text-white hover:bg-[#286aa6]/90"
              : "border-[#dfdfdf] bg-white text-[#797979] hover:bg-[#f5f5f5]"
          }`}
        >
          <Link href="/applications">Hamısı</Link>
        </Button>

        {applicationStatusOptions.map(([status, label]) => (
          <Button
            key={status}
            asChild
            className={`h-12 rounded-lg border px-4 py-3 text-sm leading-5 font-semibold whitespace-nowrap ${
              selectedStatus === status
                ? "border-[#286aa6] bg-[#286aa6] text-white hover:bg-[#286aa6]/90"
                : "border-[#dfdfdf] bg-white text-[#797979] hover:bg-[#f5f5f5]"
            }`}
          >
            <Link href={`/applications?status=${status}`}>{label}</Link>
          </Button>
        ))}
      </form>
    </section>
  );
}
