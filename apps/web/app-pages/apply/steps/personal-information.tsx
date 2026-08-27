import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type PersonalInformationFieldProps = {
  id: string;
  label: string;
  value: string;
  locked?: boolean;
};

export type PersonalInformationValues = {
  idSeries?: string;
  fin?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  fatherName?: string | null;
};

type PersonalInformationProps = {
  values?: PersonalInformationValues;
  onBack?: () => void;
  onNext?: () => void;
  isNextDisabled?: boolean;
};

function PersonalInformationField({
  id,
  label,
  value,
  locked = false,
}: PersonalInformationFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {locked ? (
        <div className="flex h-12 w-full items-center gap-3 overflow-hidden rounded-lg bg-[#f5f5f5] px-4 py-3">
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
            className="h-auto min-h-6 flex-1 bg-transparent px-0 py-0 text-[#1f1f1f] focus-visible:ring-0"
          />
        </div>
      ) : (
        <Input id={id} value={value} readOnly className="text-[#1f1f1f]" />
      )}
    </Field>
  );
}

export default function PersonalInformation({
  values,
  onBack,
  onNext,
  isNextDisabled = false,
}: PersonalInformationProps) {
  const idSeries = values?.idSeries ?? "";
  const fin = values?.fin ?? "";
  const firstName = values?.firstName ?? "";
  const lastName = values?.lastName ?? "";
  const fatherName = values?.fatherName ?? "";

  return (
    <section className="flex w-full max-w-[770px] flex-col gap-7 rounded-xl border border-[#dfdfdf] p-4 sm:p-8">
      <header className="flex w-full flex-col gap-1">
        <h1 className="text-xl font-bold leading-7 text-[#1f1f1f]">
          Şəxsiyyət məlumatları
        </h1>
        <p className="text-sm font-normal leading-5 text-[#797979]">
          Şəxsiyyət vəsiqəsi məlumatlarını daxil edin
        </p>
      </header>

      <div className="flex w-full flex-col gap-5">
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
          <PersonalInformationField
            id="personal-id-series"
            label="Şəxsiyyət vəsiqəsinin seriyası"
            value={idSeries}
          />
          <PersonalInformationField
            id="personal-id-number"
            label="Şəxsiyyət vəsiqəsinin nömrəsi (FİN kod)"
            value={fin}
            locked={Boolean(fin)}
          />
        </div>

        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
          <PersonalInformationField
            id="personal-first-name"
            label="Ad"
            value={firstName}
            locked={Boolean(firstName)}
          />
          <PersonalInformationField
            id="personal-last-name"
            label="Soyad"
            value={lastName}
            locked={Boolean(lastName)}
          />
          <PersonalInformationField
            id="personal-father-name"
            label="Ata adı"
            value={fatherName}
            locked={Boolean(fatherName)}
          />
        </div>

        <div className="flex min-h-11 w-full items-center gap-2 rounded-xl bg-[#f9fafc] p-3">
          <Image
            src="/icons/apply/tick-circle.svg"
            alt=""
            width={20}
            height={20}
            aria-hidden="true"
          />
          <p className="flex-1 text-sm font-normal leading-5 text-[#286aa6]">
            Şəxsiyyət məlumatları API vasitəsilə dolduruldu.
          </p>
        </div>
      </div>

      <footer className="flex w-full items-center justify-between border-t border-[#dfdfdf] pt-[21px]">
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
          1 / 6
        </span>

        <Button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
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
