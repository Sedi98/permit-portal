"use client";

import Image from "next/image";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

const ARROW_LEFT_ICON = "/icons/apply/confirmation/arrow-left.svg";
const INFO_ICON = "/icons/apply/checkout/info-circle.svg";

type PaymentStepProps = {
  applicationNumber: string;
  permitServiceName?: string;
  invoiceNumber?: string | null;
  paymentAmount?: number | string | null;
  isSubmitting?: boolean;
  errorMessage?: string;
  onBack: () => void;
  onSubmit: () => void;
};

function InvoiceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm leading-5">
      <dt className="shrink-0 text-[#797979]">{label}</dt>
      <dd className="min-w-0 text-right font-semibold text-[#1f1f1f]">{value}</dd>
    </div>
  );
}

export default function PaymentStep({
  applicationNumber,
  permitServiceName,
  invoiceNumber,
  paymentAmount,
  isSubmitting = false,
  errorMessage,
  onBack,
  onSubmit,
}: PaymentStepProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4">
      <section className="mx-auto flex w-full max-w-[770px] flex-col gap-7 rounded-xl border border-[#dfdfdf] bg-white p-4 sm:p-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-xl font-bold leading-7 text-[#1f1f1f]">
            Hesab-faktura detalı
          </h1>
          <p className="text-sm leading-5 text-[#797979]">
            Ödənişi etməzdən əvvəl hesab-faktura məlumatlarını yoxlayın
          </p>
        </header>

        <dl className="flex flex-col gap-3 rounded-2xl bg-[#f9fafc] p-5">
          <InvoiceRow label="Müraciət nömrəsi:" value={applicationNumber} />
          <InvoiceRow label="İcazə növü:" value={permitServiceName || "—"} />
          <InvoiceRow label="Hesab-faktura nömrəsi:" value={invoiceNumber || "—"} />
          <InvoiceRow
            label="Ödəniləcək məbləğ:"
            value={paymentAmount === null || paymentAmount === undefined ? "—" : `${paymentAmount} AZN`}
          />
        </dl>

        <div className="flex items-center gap-2 rounded-xl bg-[#f9fafc] p-3">
          <Image src={INFO_ICON} alt="" width={20} height={20} aria-hidden="true" />
          <p className="flex-1 text-sm leading-5 text-[#286aa6]">
            Hazırda ödəniş sınaq rejimindədir. Ödənişdən sonra “Ödədim” düyməsini seçin.
          </p>
        </div>

        {errorMessage ? (
          <p className="text-sm text-[#d90b0b]" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <footer className="flex items-center justify-between gap-4 border-t border-[#dfdfdf] pt-[21px]">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="h-12 min-w-[100px] gap-2 border-[#dfdfdf] bg-white px-4 text-base font-semibold text-[#286aa6] hover:bg-white hover:text-[#286aa6]"
          >
            <Image src={ARROW_LEFT_ICON} alt="" width={24} height={24} aria-hidden="true" />
            Geri
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="h-12 min-w-[120px] gap-2 bg-[#286aa6] px-4 text-base font-semibold text-white hover:bg-[#286aa6]"
          >
            {isSubmitting ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            Ödədim
          </Button>
        </footer>
      </section>
    </div>
  );
}
