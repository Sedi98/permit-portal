"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export type ContactInformationValues = {
  email: string;
  phones: string[];
};

type PhoneFieldProps = {
  id: number;
  value: string;
  onChange: (value: string) => void;
  onRemove: (id: number) => void;
  index: number;
  invalid?: boolean;
};

function PhoneField({ id, index, value, onChange, onRemove, invalid = false }: PhoneFieldProps) {
  return (
    <div className="flex w-full items-end gap-3">
      <Field className="min-w-0 flex-1" data-invalid={invalid}>
        <FieldLabel htmlFor={`contact-phone-${id}`}>Mobil nömrə</FieldLabel>
        <Input
          id={`contact-phone-${id}`}
          type="tel"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="+994 __ ___ __ __"
          aria-invalid={invalid}
        />
        {invalid ? <FieldError>Ən azı bir mobil nömrə daxil edin.</FieldError> : null}
      </Field>
      <Button
        type="button"
        variant="ghost"
        aria-label={`${index + 1}-ci mobil nömrəni sil`}
        onClick={() => onRemove(id)}
        className="h-12 w-12 shrink-0 rounded-lg bg-[#fef1f1] p-3 text-[#f32020] hover:bg-[#fef1f1] hover:text-[#f32020]"
      >
        <Image
          src="/icons/apply/contact/trash.svg"
          alt=""
          width={24}
          height={24}
          aria-hidden="true"
        />
      </Button>
    </div>
  );
}

type ContactInformationProps = {
  initialValues?: ContactInformationValues;
  onBack?: () => void;
  onNext?: (values: ContactInformationValues) => void | Promise<void>;
  isSubmitting?: boolean;
  isBackDisabled?: boolean;
  totalSteps?: number;
};

export default function ContactInformation({
  initialValues,
  onBack,
  onNext,
  isSubmitting = false,
  isBackDisabled = false,
  totalSteps = 6,
}: ContactInformationProps) {
  const [phoneFields, setPhoneFields] = useState(() =>
    (initialValues?.phones?.length ? initialValues.phones : [""]).map(
      (value, index) => ({ id: index, value }),
    ),
  );
  const [email, setEmail] = useState(initialValues?.email ?? "");
  const [showValidation, setShowValidation] = useState(false);
  const nextPhoneId = useRef(1);

  const handleAddPhone = () => {
    const id = nextPhoneId.current;
    nextPhoneId.current += 1;
    setPhoneFields((current) => [...current, { id, value: "" }]);
  };

  const handleRemovePhone = (id: number) => {
    setPhoneFields((current) =>
      current.length === 1 ? current : current.filter((field) => field.id !== id),
    );
  };

  const handlePhoneChange = (id: number, value: string) => {
    setPhoneFields((current) =>
      current.map((field) => (field.id === id ? { ...field, value } : field)),
    );
  };

  const handleNext = () => {
    const phones = phoneFields.map((field) => field.value.trim()).filter(Boolean);
    setShowValidation(true);

    if (!email.trim() || phones.length === 0) {
      return;
    }

    void onNext?.({ email: email.trim(), phones });
  };

  return (
    <section className="flex w-full max-w-[770px] flex-col gap-7 rounded-xl border border-[#dfdfdf] p-4 sm:p-8">
      <header className="flex w-full flex-col gap-1">
        <h1 className="text-xl font-bold leading-7 text-[#1f1f1f]">
          Əlaqə məlumatları
        </h1>
        <p className="text-sm font-normal leading-5 text-[#797979]">
          Əlaqə nömrəsi və e-poçt ünvanını daxil edin
        </p>
      </header>

      <div className="flex w-full flex-col gap-5">
        <div className="flex w-full flex-col gap-5">
          {phoneFields.map((field, index) => (
            <PhoneField
              key={field.id}
              id={field.id}
              index={index}
              value={field.value}
              onChange={(value) => handlePhoneChange(field.id, value)}
              onRemove={handleRemovePhone}
              invalid={showValidation && phoneFields.every(({ value }) => !value.trim())}
            />
          ))}
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={handleAddPhone}
          className="h-12 w-fit gap-2 px-4 py-3 text-base font-semibold text-[#286aa6] hover:bg-transparent hover:text-[#286aa6]"
        >
          <Image
            src="/icons/apply/contact/add.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden="true"
          />
          Nömrə əlavə et
        </Button>

        <Field data-invalid={showValidation && !email.trim()}>
          <FieldLabel htmlFor="contact-email">E-poçt ünvanı</FieldLabel>
          <Input
            id="contact-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="example@email.az"
            aria-invalid={showValidation && !email.trim()}
          />
          {showValidation && !email.trim() ? <FieldError>E-poçt ünvanını daxil edin.</FieldError> : null}
        </Field>
      </div>

      <footer className="flex w-full items-center justify-between border-t border-[#dfdfdf] pt-[21px]">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isBackDisabled}
          className="h-12 w-[100px] gap-2 border-[#dfdfdf] bg-white px-4 py-3 text-base font-semibold text-[#286aa6] hover:bg-white hover:text-[#286aa6]"
        >
          <Image
            src="/icons/apply/contact/arrow-left.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden="true"
          />
          Geri
        </Button>

        <span className="text-sm font-medium leading-5 text-[#797979]">
          2 / {totalSteps}
        </span>

        <Button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting}
          className="h-12 w-[100px] gap-2 bg-[#286aa6] px-4 py-3 text-base font-semibold text-white hover:bg-[#286aa6] disabled:opacity-70"
        >
          İrəli
          <Image
            src="/icons/apply/contact/arrow-right.svg"
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
