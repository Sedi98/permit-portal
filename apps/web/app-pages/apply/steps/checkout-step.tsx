"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { formatFileSize } from "@/components/document-upload-item";
import { Button } from "@/components/ui/button";
import type { ContactInformationValues } from "@/app-pages/apply/steps/contact-information";
import type { OperationInformationValues } from "@/app-pages/apply/steps/operations-step";
import type { PersonalInformationValues } from "@/app-pages/apply/steps/personal-information";

const DOCUMENT_ICON = "/icons/apply/checkout/document-text.svg";
const INFO_ICON = "/icons/apply/checkout/info-circle.svg";

export type CheckoutDocument = {
  documentTypeName?: string;
  name: string;
  size: number;
  type?: string;
};

type CheckoutStepProps = {
  documents?: readonly CheckoutDocument[];
  personalInformation?: PersonalInformationValues;
  contactInformation?: ContactInformationValues;
  operationInformation?: OperationInformationValues;
  onBack?: () => void;
  onNext?: () => void;
  isBackDisabled?: boolean;
};

const DEFAULT_CHECKOUT_DOCUMENTS: readonly CheckoutDocument[] = Array.from(
  { length: 6 },
  () => ({
    name: "xyxyxyxxyxyxy.pdf",
    size: 628 * 1024,
    type: "PDF",
  }),
);

const ReviewSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="w-full overflow-hidden rounded-xl border border-[#dfdfdf]">
    <header className="flex w-full items-center bg-[#f9fafc] px-5 py-3">
      <h2 className="text-sm font-semibold leading-5 text-[#1f1f1f]">{title}</h2>
    </header>
    <div className="flex w-full flex-col gap-2 px-5 py-3">{children}</div>
  </section>
);

const ReviewRow = ({
  label,
  value,
  valueClassName = "",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) => (
  <div className="flex items-start justify-between gap-4 text-sm leading-5">
    <span className="shrink-0 font-normal text-[#797979]">{label}</span>
    <span className={`text-right font-medium text-[#1f1f1f] ${valueClassName}`}>
      {value}
    </span>
  </div>
);

const OperationArrow = ({ direction }: { direction: "left" | "right" }) => (
  <Image
    src={`/icons/apply/checkout/arrow-${direction}.svg`}
    alt=""
    width={24}
    height={24}
    aria-hidden="true"
  />
);

const CheckoutStep = ({
  documents = DEFAULT_CHECKOUT_DOCUMENTS,
  personalInformation,
  contactInformation,
  operationInformation,
  onBack,
  onNext,
  isBackDisabled = false,
}: CheckoutStepProps) => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4">
      <section className="mx-auto flex w-full max-w-[770px] flex-col gap-7 rounded-xl border border-[#dfdfdf] p-4 sm:p-8">
        <header className="flex w-full flex-col gap-1">
          <h1 className="text-xl font-bold leading-7 text-[#1f1f1f]">
            Nəzərdən keçirin
          </h1>
          <p className="text-sm font-normal leading-5 text-[#797979]">
            Müraciəti göndərməzdən əvvəl məlumatları yoxlayın
          </p>
        </header>

        <div className="flex w-full flex-col gap-5">
          <ReviewSection title="Şəxsiyyət məlumatları">
            <ReviewRow label="Seriya / Nömrə" value={personalInformation?.idSeries || "—"} />
            <ReviewRow label="FIN" value={personalInformation?.fin || "—"} />
            <ReviewRow label="Ad" value={personalInformation?.firstName || "—"} />
            <ReviewRow label="Soyad" value={personalInformation?.lastName || "—"} />
            <ReviewRow label="Ata adı" value={personalInformation?.fatherName || "—"} />
          </ReviewSection>

          <ReviewSection title="Əlaqə">
            {(contactInformation?.phones ?? []).map((phone, index) => (
              <ReviewRow key={`${phone}-${index}`} label={`Mobil nömrə ${index + 1}`} value={phone} />
            ))}
            <ReviewRow label="E-poçt" value={contactInformation?.email || "—"} />
          </ReviewSection>

          {operationInformation ? <ReviewSection title="Əməliyyat və mal məlumatları">
            <ReviewRow label="Əməliyyatın növü" value={operationInformation.operationType} />
            <ReviewRow
              label="Mal kateqoriyası"
              value={operationInformation.goodsCategory}
              valueClassName="max-w-[545px] flex-1"
            />
            <ReviewRow label="Malın adı və həcmi" value={operationInformation.goodsNameVolume} />
          </ReviewSection> : null}

          <ReviewSection title="Sənədlər">
            {documents.map((document, index) => (
              <div
                key={`${document.name}-${index}`}
                className="flex min-h-[62px] w-full items-center rounded-xl border border-[#dfdfdf] bg-white px-[13px] py-[9px]"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#f5f5f5] p-3">
                    <Image
                      src={DOCUMENT_ICON}
                      alt=""
                      width={24}
                      height={24}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-0">
                    <p className="truncate text-base font-medium leading-6 text-[#1f1f1f]">
                      {document.documentTypeName ?? document.name}
                    </p>
                    <p className="text-sm font-normal leading-5 text-[#797979]">
                      {document.documentTypeName ? `${document.name} · ` : ""}
                      {formatFileSize(document.size)} · {document.type ?? "PDF"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </ReviewSection>

          <div className="flex w-full items-center gap-2 rounded-xl bg-[#f9fafc] p-3">
            <Image
              src={INFO_ICON}
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
            />
            <p className="flex-1 text-sm font-normal leading-5 text-[#286aa6]">
              Müraciəti göndərməklə siz təqdim edilən bütün məlumatların düzgün olduğunu təsdiqləyirsiniz. Müraciət göndərildikdən sonra dəyişiklik etmək mümkün olmayacaq.
            </p>
          </div>
        </div>

        <footer className="flex w-full items-center justify-between border-t border-[#dfdfdf] pt-[21px]">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isBackDisabled}
            className="h-12 w-[100px] gap-2 border-[#dfdfdf] bg-white px-4 py-3 text-base font-semibold text-[#286aa6] hover:bg-white hover:text-[#286aa6]"
          >
            <OperationArrow direction="left" />
            Geri
          </Button>

          <span className="text-sm font-medium leading-5 text-[#797979]">5 / 6</span>

          <Button
            type="button"
            onClick={onNext}
            className="h-12 w-[100px] gap-2 bg-[#286aa6] px-4 py-3 text-base font-semibold text-white hover:bg-[#286aa6]"
          >
            İrəli
            <OperationArrow direction="right" />
          </Button>
        </footer>
      </section>
    </div>
  );
};

export default CheckoutStep;
