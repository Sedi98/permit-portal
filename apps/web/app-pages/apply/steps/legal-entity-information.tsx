"use client";

import Image from "next/image";
import { useState } from "react";

import { RadioChoiceCard } from "@/components/radio-choice-card";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import type { Voen } from "@/features/auth/types";

export type LegalEntityInformationValues = {
  voen: string;
  legalEntityName: string;
  legalAddress: string;
  directorFirstName: string;
  directorLastName: string;
  directorFatherName: string;
};

type LegalEntityInformationProps = {
  voens: Voen[];
  values: LegalEntityInformationValues;
  onVoenSelect: (voen: string) => void;
  onLegalAddressChange: (address: string) => void;
  onBack?: () => void;
  onNext: () => void;
  isSubmitting?: boolean;
  totalSteps?: number;
};

type LockedFieldProps = {
  id: string;
  label: string;
  value: string;
};

function LockedField({ id, label, value }: LockedFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id} className="text-[#a5a5a5]">
        {label}
      </FieldLabel>
      <div className="flex h-12 items-center gap-3 rounded-lg bg-[#f5f5f5] px-4 py-3">
        <Image
          src="/icons/apply/lock.svg"
          alt=""
          width={20}
          height={20}
          aria-hidden="true"
        />
        <Input
          id={id}
          value={value}
          disabled
          className="h-auto min-h-6 flex-1 bg-transparent px-0 py-0 text-base text-[#1f1f1f] disabled:opacity-100"
        />
      </div>
    </Field>
  );
}

export default function LegalEntityInformation({
  voens,
  values,
  onVoenSelect,
  onLegalAddressChange,
  onBack,
  onNext,
  isSubmitting = false,
  totalSteps = 6,
}: LegalEntityInformationProps) {
  const [showValidation, setShowValidation] = useState(false);
  const canContinue = Boolean(
    values.voen &&
      values.legalEntityName &&
      values.legalAddress.trim() &&
      values.directorFirstName &&
      values.directorLastName &&
      values.directorFatherName,
  );
  const legalEntityMissing = !values.voen || !values.legalEntityName || !values.directorFirstName || !values.directorLastName || !values.directorFatherName;
  const addressMissing = !values.legalAddress.trim();
  const addressInvalid = showValidation && Boolean(values.voen) && addressMissing;

  const handleNext = () => {
    setShowValidation(true);
    if (!canContinue) return;
    onNext();
  };

  return (
    <section className="flex w-full max-w-[770px] flex-col gap-7 rounded-xl border border-[#dfdfdf] p-4 sm:p-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-bold leading-7 text-[#1f1f1f]">
          Hüquqi şəxs məlumatları
        </h1>
        <p className="text-sm leading-5 text-[#797979]">
          FİN-inizə bağlı hüquqi şəxs(lər) avtomatik tapılır
        </p>
      </header>

      <div
        className="flex flex-col gap-4 rounded-xl border border-transparent p-1 data-[invalid=true]:border-destructive data-[invalid=true]:ring-2 data-[invalid=true]:ring-destructive/20"
        data-invalid={showValidation && legalEntityMissing}
      >
        <h2 className="text-base font-medium leading-6 text-[#1f1f1f]">
          FİN-inizə əsasən səlahiyyətli olduğunuz hüquqi şəxslər
        </h2>

        {voens.length > 0 ? (
          <RadioGroup
            value={values.voen}
            onValueChange={onVoenSelect}
            disabled={isSubmitting}
            aria-label="Hüquqi şəxs seçimi"
            aria-invalid={showValidation && legalEntityMissing}
            className="gap-3"
          >
            {voens.map((item) => (
              <RadioChoiceCard
                key={item.id}
                id={`legal-entity-${item.id}`}
                value={item.voen}
                textClassName="text-[#1f1f1f]"
              >
                <span className="block text-sm font-medium leading-5">
                  {item.company_name}
                </span>
                <span className="mt-1 block text-sm font-normal leading-5 text-[#797979]">
                  VÖEN: {item.voen}
                  {item.position ? ` – ${item.position}` : ""}
                </span>
              </RadioChoiceCard>
            ))}
          </RadioGroup>
        ) : (
          <p className="rounded-xl bg-[#fef1f1] p-3 text-sm text-[#d90b0b]" role="alert">
            Hüquqi şəxs adından müraciət etmək üçün təsdiqlənmiş VÖEN tapılmadı.
          </p>
        )}

        {values.voen && values.legalEntityName ? (
          <div className="flex min-h-11 items-center gap-2 rounded-xl bg-[#f9fafc] p-3">
            <Image
              src="/icons/apply/tick-circle.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
            />
            <p className="flex-1 text-sm leading-5 text-[#286aa6]">
              Hüquqi şəxs məlumatları seçilmiş şirkətə əsasən avtomatik dolduruldu.
            </p>
          </div>
        ) : null}
        {showValidation && legalEntityMissing ? <FieldError>Hüquqi şəxsi seçin və məlumatların yüklənməsini gözləyin.</FieldError> : null}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <LockedField
          id="legal-entity-name"
          label="Hüquqi şəxsin adı"
          value={values.legalEntityName}
        />
        <Field data-invalid={addressInvalid}>
          <FieldLabel htmlFor="legal-address">Hüquqi ünvan</FieldLabel>
          <Input
            id="legal-address"
            value={values.legalAddress}
            onChange={(event) => onLegalAddressChange(event.target.value)}
            placeholder="Daxil edin"
            disabled={!values.voen || isSubmitting}
            aria-invalid={addressInvalid}
            className="h-12 bg-[#f5f5f5] px-4 py-3 text-base text-[#1f1f1f] placeholder:text-[#797979] disabled:opacity-100"
          />
          {addressInvalid ? <FieldError>Hüquqi ünvanı daxil edin.</FieldError> : null}
        </Field>
        <LockedField id="legal-entity-voen" label="VÖEN" value={values.voen} />
        <LockedField
          id="legal-director-first-name"
          label="Müəssisə rəhbərinin adı"
          value={values.directorFirstName}
        />
        <LockedField
          id="legal-director-last-name"
          label="Müəssisə rəhbərinin soyadı"
          value={values.directorLastName}
        />
        <LockedField
          id="legal-director-father-name"
          label="Müəssisə rəhbərinin ata adı"
          value={values.directorFatherName}
        />
      </div>

      <footer className="flex items-center justify-between border-t border-[#dfdfdf] pt-[21px]">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-12 w-[100px] gap-2 border-[#dfdfdf] bg-white px-4 py-3 text-base font-semibold text-[#286aa6] hover:bg-white hover:text-[#286aa6]"
        >
          <Image
            src="/icons/apply/arrow-left.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden="true"
          />
          Geri
        </Button>

        <span className="text-sm font-medium leading-5 text-[#797979]">
          1 / {totalSteps}
        </span>

        <Button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting}
          className="h-12 w-[100px] gap-2 bg-[#286aa6] px-4 py-3 text-base font-semibold text-white hover:bg-[#286aa6]"
        >
          İrəli
          <Image
            src="/icons/apply/arrow-right.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden="true"
          />
        </Button>
      </footer>
    </section>
  );
}
