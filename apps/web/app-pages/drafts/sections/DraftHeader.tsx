import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function DraftHeader() {
  return (
    <header className="border-b border-[#dfdfdf] px-4 py-6 sm:px-8 sm:py-8 md:px-20">
      <div className="flex w-full flex-col items-stretch justify-between gap-5 sm:flex-row sm:items-center sm:gap-2.5">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h1 className="text-2xl leading-8 font-bold text-[#1f1f1f]">Qaralamalar</h1>
          <p className="text-sm leading-5 text-[#797979]">
            Tamamlanmamış müraciətlərinizi idarə edin
          </p>
        </div>

        <Button
          asChild
          className="h-12 w-full gap-2 rounded-lg bg-[#286aa6] px-4 py-3 text-base leading-6 font-semibold text-white hover:bg-[#286aa6]/90 sm:w-40"
        >
          <Link href="/">
            <Plus className="size-6 shrink-0" aria-hidden="true" />
            <span>Yeni müraciət</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
