

"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

const SEND_ICON = "/icons/apply/confirmation/send-2.svg";
const BOOK_ICON = "/icons/apply/confirmation/book.svg";
const INFO_ICON = "/icons/apply/confirmation/info-circle.svg";
const ARROW_LEFT_ICON = "/icons/apply/confirmation/arrow-left.svg";
const SEND_DISABLED_ICON = "/icons/apply/confirmation/send-disabled.svg";

type ConfirmationStepProps = {
  applicantName?: string;
  documentCount?: number;
  onBack?: () => void;
  onSaveDraft?: () => void;
  onSubmit?: () => void | Promise<void>;
  isSubmitting?: boolean;
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

const ConfirmationStep = ({
  applicantName = "—",
  documentCount = 0,
  onBack,
  onSaveDraft,
  onSubmit,
  isSubmitting = false,
}: ConfirmationStepProps) => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4">
      <section className="mx-auto flex w-full max-w-[770px] flex-col gap-7 rounded-xl border border-[#dfdfdf] p-4 sm:p-8">
        <div className="flex w-full flex-col items-center gap-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-lg bg-[#f9fafc]">
            <Image
              src={SEND_ICON}
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
          </div>

          <div className="flex w-full flex-col items-center gap-2">
            <h1 className="w-full text-xl font-bold leading-7 text-[#1f1f1f]">
              Müraciəti göndərməyə razısınız?
            </h1>
            <p className="w-full text-base font-normal leading-6 text-[#797979]">
              Müraciətiniz <strong className="font-semibold text-[#286aa6]">7 iş günü</strong> ərzində baxılacaq. Nəticə haqqında bildiriş alacaqsınız.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 rounded-2xl bg-[#f9fafc] p-5 text-left">
            <SummaryRow label="İcazə növü:">
              İxrac nəzarəti haqqında” Azərbaycan Respublikasının Qanununa əsasən ixrac nəzarətinə düşən malların (işlərin, xidmətlərin, əqli fəaliyyətin nəticələrinin) ixracı, təkrar ixracı, idxalı, təkrar idxalı və tranziti üçün icazə
            </SummaryRow>
            <SummaryRow label="Müraciətçi:">{applicantName}</SummaryRow>
            <SummaryRow label="Yüklənmiş sənəd:">{documentCount} fayl</SummaryRow>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onSaveDraft}
            className="h-12 w-[156px] gap-2 border-[#dfdfdf] bg-white px-4 py-3 text-base font-semibold text-[#286aa6] hover:bg-white hover:text-[#286aa6]"
          >
            <Image
              src={BOOK_ICON}
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
            Yadda saxla
          </Button>

          <p className="w-full text-left text-base font-normal leading-6 text-[#797979]">
            &quot;Yadda saxla&quot; seçimi müraciəti qaralama kimi saxlayır. İstənilən vaxt davam edə bilərsiniz.
          </p>
        </div>

        <div className="flex w-full items-center gap-2 rounded-xl bg-[#f9fafc] p-3">
          <Image
            src={INFO_ICON}
            alt=""
            width={20}
            height={20}
            aria-hidden="true"
          />
          <p className="flex-1 text-sm font-normal leading-5 text-[#286aa6]">
            Məlumatları yoxladıqdan sonra müraciəti göndərə bilərsiniz.
          </p>
        </div>

        <footer className="flex w-full items-center justify-between border-t border-[#dfdfdf] pt-[21px]">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="h-12 w-[100px] gap-2 border-[#dfdfdf] bg-white px-4 py-3 text-base font-semibold text-[#286aa6] hover:bg-white hover:text-[#286aa6]"
          >
            <Image
              src={ARROW_LEFT_ICON}
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
            Geri
          </Button>

          <span className="text-sm font-medium leading-5 text-[#797979]">6 / 6</span>

          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="h-12 w-[122px] gap-2 bg-[#286aa6] px-4 py-3 text-base font-semibold text-white hover:bg-[#286aa6] disabled:opacity-70"
          >
            Göndər
            <Image src={isSubmitting ? SEND_DISABLED_ICON : SEND_ICON} alt="" width={24} height={24} aria-hidden="true" />
          </Button>
        </footer>
      </section>
    </div>
  );
};

export default ConfirmationStep;
