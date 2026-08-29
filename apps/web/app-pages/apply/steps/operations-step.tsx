
"use client";

import Image from "next/image";
import { useState } from "react";

import { RadioChoiceCard } from "@/components/radio-choice-card";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { RadioGroup } from "@/components/ui/radio-group";

export type OperationInformationValues = {
  operationType: "export" | "import" | "re_export" | "re_import" | "transit";
  goodsCategory: string;
  goodsNameVolume: string;
};

const categoryOptions = [
  {
    value: "nuclear",
    label:
      "Nüvə materialları, texnologiyaları, qurğuları, radioaktiv ionlaşdırıcı şüa mənbələri və izotoplar, partlayıcı maddələr və vasitələr",
  },
  {
    value: "toxic",
    label:
      "Toksiki kimyəvi maddələr, insan həyatı və heyvanlar aləmi üçün təhlükəli olan patogenlər, genetik cəhətdən dəyişdirilmiş mikroorqanizmlər və toksinlər, prekursorlar",
  },
  {
    value: "dual-use",
    label:
      "Materialların emalı üçün sistemlər, avadanlıqlar, komponentlər, materiallar və digər ikili təyinatlı mallar",
  },
] as const;

type OperationStepProps = {
  initialValues?: Partial<OperationInformationValues>;
  onBack?: () => void;
  onNext?: (values: OperationInformationValues) => void | Promise<void>;
  isSubmitting?: boolean;
};

const OperationStep = ({
  initialValues,
  onBack,
  onNext,
  isSubmitting = false,
}: OperationStepProps) => {
  const [operationType, setOperationType] = useState<OperationInformationValues["operationType"]>(
    initialValues?.operationType ?? "import",
  );
  const [goodsCategory, setGoodsCategory] = useState(
    initialValues?.goodsCategory ?? categoryOptions[0].value,
  );
  const [description, setDescription] = useState(initialValues?.goodsNameVolume ?? "");

  const handleNext = () => {
    if (!description.trim()) {
      return;
    }

    void onNext?.({
      operationType,
      goodsCategory,
      goodsNameVolume: description.trim(),
    });
  };

  return (
    <section className="flex w-full max-w-[770px] flex-col gap-7 rounded-xl border border-[#dfdfdf] p-4 sm:p-8">
      <header className="flex w-full flex-col gap-1">
        <h1 className="text-xl font-bold leading-7 text-[#1f1f1f]">
          Əməliyyat və mal məlumatları
        </h1>
        <p className="text-sm font-normal leading-5 text-[#797979]">
          Xarici iqtisadi əməliyyat növünü, mal kateqoriyasını və ətraflı məlumatları daxil edin
        </p>
      </header>

      <div className="flex w-full flex-col gap-5">
        <Field>
          <FieldLabel htmlFor="operation-type">Xarici iqtisadi əməliyyatın növü</FieldLabel>
          <div className="relative w-full">
            <select
              id="operation-type"
              value={operationType}
              onChange={(event) => setOperationType(event.target.value as OperationInformationValues["operationType"])}
              className="h-12 w-full appearance-none rounded-lg border-0 bg-[#f5f5f5] px-4 py-3 text-base font-normal leading-6 text-[#1f1f1f] outline-none focus-visible:ring-2 focus-visible:ring-[#286aa6]/30"
            >
              <option value="import">İdxal</option>
              <option value="export">İxrac</option>
              <option value="re_export">Təkrar ixrac</option>
              <option value="re_import">Təkrar idxal</option>
              <option value="transit">Tranzit</option>
            </select>
            <Image
              src="/icons/apply/operations/arrow-down.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2"
            />
          </div>
        </Field>

        <div className="h-px w-full bg-[#dfdfdf]" aria-hidden="true" />

        <div className="flex w-full flex-col gap-4">
          <h2 className="w-full text-base font-medium leading-6 text-[#1f1f1f]">
            Malların (işlərin, xidmətlərin, əqli fəaliyyətin nəticələrinin) kateqoriyaları
          </h2>
          <RadioGroup
            defaultValue={categoryOptions[0].value}
            value={goodsCategory}
            onValueChange={setGoodsCategory}
            aria-label="Mal kateqoriyası"
            className="flex w-full flex-col gap-3"
          >
            {categoryOptions.map((category) => (
              <RadioChoiceCard
                key={category.value}
                id={`operation-category-${category.value}`}
                value={category.value}
              >
                {category.label}
              </RadioChoiceCard>
            ))}
          </RadioGroup>
        </div>

        <div className="h-px w-full bg-[#dfdfdf]" aria-hidden="true" />

        <Field>
          <FieldLabel htmlFor="operation-description">Malın adı və həcmi</FieldLabel>
          <div className="relative w-full">
            <textarea
              id="operation-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Daxil edin"
              className="h-[110px] w-full resize-none rounded-lg border-0 bg-[#f5f5f5] px-4 py-3 text-base font-normal leading-6 text-[#797979] outline-none placeholder:text-[#797979] focus-visible:ring-2 focus-visible:ring-[#286aa6]/30"
            />
          </div>
        </Field>
      </div>

      <footer className="flex w-full items-center justify-between border-t border-[#dfdfdf] pt-[21px]">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-12 w-[100px] gap-2 border-[#dfdfdf] bg-white px-4 py-3 text-base font-semibold text-[#286aa6] hover:bg-white hover:text-[#286aa6]"
        >
          <Image
            src="/icons/apply/operations/arrow-left.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden="true"
          />
          Geri
        </Button>

        <span className="text-sm font-medium leading-5 text-[#797979]">3 / 6</span>

        <Button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting || !description.trim()}
          className="h-12 w-[100px] gap-2 bg-[#286aa6] px-4 py-3 text-base font-semibold text-white hover:bg-[#286aa6]"
        >
          İrəli
          <Image
            src="/icons/apply/operations/arrow-right.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden="true"
          />
        </Button>
      </footer>
    </section>
  );
};

export default OperationStep;
