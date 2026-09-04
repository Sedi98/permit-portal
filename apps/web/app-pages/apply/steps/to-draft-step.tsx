"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

const BOOK_ICON = "/icons/apply/to-draft/book.svg";

export type ToDraftStepProps = {
  permitServiceName?: string;
  completedSteps?: string;
  onContinue?: () => void;
  onDrafts?: () => void;
};

const SummaryRow = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="flex items-start gap-3 text-sm leading-5">
    <span className="shrink-0 font-normal text-[#797979]">{label}</span>
    <span className="min-w-0 flex-1 text-right font-medium text-[#1f1f1f]">
      {children}
    </span>
  </div>
);

const ToDraftStep = ({
  permitServiceName,
  completedSteps = "5/6 tamamlandı",
  onContinue,
  onDrafts,
}: ToDraftStepProps) => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4">
      <section className="mx-auto flex w-full max-w-[550px] flex-col items-center gap-6 rounded-xl border border-[#dfdfdf] bg-white p-4 sm:p-8">
        <div className="flex size-14 items-center justify-center rounded-lg bg-[#f9fafc]">
          <Image
            src={BOOK_ICON}
            alt=""
            width={24}
            height={24}
            aria-hidden="true"
          />
        </div>

        <div className="flex w-full flex-col items-center gap-2 text-center">
          <h1 className="w-full text-2xl font-bold leading-8 text-[#1f1f1f]">
            Qaralama yadda saxlanıldı!
          </h1>
          <p className="w-full text-base font-normal leading-6 text-[#797979]">
            Müraciətiniz <strong className="font-semibold text-[#286aa6]">Qaralama</strong> kimi yadda saxlanıldı. İstədiyiniz vaxt &quot;<strong className="font-normal text-[#797979]">Qaralamalar</strong>&quot; bölməsindən davam edə bilərsiniz.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 rounded-2xl bg-[#f9fafc] p-5">
          <SummaryRow label="Addım:">
            <span className="font-semibold text-[#286aa6]">{completedSteps}</span>
          </SummaryRow>
          <SummaryRow label="İcazə növü:">{permitServiceName ?? "—"}</SummaryRow>
          <SummaryRow label="Status:">
            <span className="font-semibold text-[#e97000]">Yarımçıq müraciət</span>
          </SummaryRow>
        </div>

        <div className="flex w-full gap-5">
          <Button
            type="button"
            variant="outline"
            onClick={onContinue}
            className="h-12 min-w-0 flex-1 rounded-lg border-[#dfdfdf] bg-white px-4 py-3 text-base font-semibold text-[#286aa6] hover:bg-white hover:text-[#286aa6]"
          >
            Davam et
          </Button>
          <Button
            type="button"
            onClick={onDrafts}
            className="h-12 min-w-0 flex-1 rounded-lg bg-[#286aa6] px-4 py-3 text-base font-semibold text-white hover:bg-[#286aa6]"
          >
            Qaralamalarıma bax
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ToDraftStep;
