"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

const TICK_ICON = "/icons/apply/success/tick-circle.svg";

const PERMIT_TYPE =
  "İxrac nəzarəti haqqında” Azərbaycan Respublikasının Qanununa əsasən ixrac nəzarətinə düşən malların (işlərin, xidmətlərin, əqli fəaliyyətin nəticələrinin) ixracı, təkrar ixracı, idxalı, təkrar idxalı və tranziti üçün icazə";

export type SuccessStepProps = {
  applicationNumber?: string;
  applicationDate?: string;
  onApplications?: () => void;
  onHome?: () => void;
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

const SuccessStep = ({
  applicationNumber = "ENR-2025-2026",
  applicationDate = "25.11.2026",
  onApplications,
  onHome,
}: SuccessStepProps) => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4">
      <section className="mx-auto flex w-full max-w-[550px] flex-col items-center gap-6 rounded-xl border border-[#dfdfdf] bg-white p-4 sm:p-8">
        <div className="flex size-14 items-center justify-center rounded-lg bg-[#f9fafc]">
          <Image
            src={TICK_ICON}
            alt=""
            width={24}
            height={24}
            aria-hidden="true"
          />
        </div>

        <div className="flex w-full flex-col items-center gap-2 text-center">
          <h1 className="w-full text-2xl font-bold leading-8 text-[#1f1f1f]">
            Müraciət göndərildi!
          </h1>
          <p className="w-full text-base font-normal leading-6 text-[#797979]">
            Müraciətiniz uğurla qeydiyyata alındı.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 rounded-2xl bg-[#f9fafc] p-5">
          <SummaryRow label="İcazə növü:">{PERMIT_TYPE}</SummaryRow>
          <SummaryRow label="Müraciət nömrəsi:">
            <span className="text-[#286aa6]">{applicationNumber}</span>
          </SummaryRow>
          <SummaryRow label="Müraciət tarixi:">{applicationDate}</SummaryRow>
          <div className="flex items-start gap-3 text-sm leading-5">
            <span className="shrink-0 font-normal text-[#797979]">Status:</span>
            <span className="flex min-w-0 flex-1 items-center justify-end gap-2 font-medium text-[#34b443]">
              <span className="size-1.5 rounded-full bg-[#34b443]" aria-hidden="true" />
              Qeydiyyata alındı
            </span>
          </div>
        </div>

        <div className="flex w-full gap-5">
          <Button
            type="button"
            onClick={onApplications}
            className="h-12 min-w-0 flex-1 rounded-lg bg-[#286aa6] px-4 py-3 text-base font-semibold text-white hover:bg-[#286aa6]"
          >
            Müraciətlərimə keç
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onHome}
            className="h-12 min-w-0 flex-1 rounded-lg border-[#dfdfdf] bg-white px-4 py-3 text-base font-semibold text-[#286aa6] hover:bg-white hover:text-[#286aa6]"
          >
            Ana səhifəyə qayıt
          </Button>
        </div>
      </section>
    </div>
  );
};

export default SuccessStep;
