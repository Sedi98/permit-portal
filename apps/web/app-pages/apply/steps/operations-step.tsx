"use client";

import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export type OperationInformationValues = {
  operationType: "export" | "import" | "re_export" | "re_import" | "transit";
  operationTypeLabel?: string;
  goodsCategory: string;
  goodsName: string;
  goodsQuantity: string;
  goodsUnit: string;
};

const categoryOptions = [
  "Nüvə materialları, texnologiyaları, qurğuları, radioaktiv ionlaşdırıcı şüa mənbələri və izotoplar, partlayıcı maddələr və vasitələr",
  "Toksiki kimyəvi maddələr, insan həyatı və heyvanlar aləmi üçün təhlükəli olan patogenlər, genetik cəhətdən dəyişdirilmiş mikroorqanizmlər və toksinlər, prekursorlar",
  "Materialların emalı üçün sistemlər, avadanlıqlar, komponentlər, materiallar və digər ikili təyinatlı mallar",
] as const;

const operationLabels: Record<OperationInformationValues["operationType"], string> = {
  export: "İxrac",
  import: "İdxal",
  re_export: "Təkrar ixrac",
  re_import: "Təkrar idxal",
  transit: "Tranzit",
};

type OperationStepProps = {
  serviceCode: "PS-001" | "PS-002";
  initialValues?: Partial<OperationInformationValues>;
  onBack?: () => void;
  onNext?: (values: OperationInformationValues) => void | Promise<void>;
  isSubmitting?: boolean;
  isBackDisabled?: boolean;
  stepNumber?: number;
  totalSteps?: number;
};

const OperationStep = ({ serviceCode, initialValues, onBack, onNext, isSubmitting = false, isBackDisabled = false, stepNumber = 3, totalSteps = 6 }: OperationStepProps) => {
  const [operationType, setOperationType] = useState<OperationInformationValues["operationType"]>(initialValues?.operationType ?? "import");
  const [goodsCategory, setGoodsCategory] = useState(
    serviceCode === "PS-001"
      ? initialValues?.goodsCategory || categoryOptions[0]
      : "",
  );
  const [goodsName, setGoodsName] = useState(initialValues?.goodsName ?? "");
  const [goodsQuantity, setGoodsQuantity] = useState(initialValues?.goodsQuantity ?? "");
  const [goodsUnit, setGoodsUnit] = useState(initialValues?.goodsUnit ?? "");
  const [showValidation, setShowValidation] = useState(false);
  const isComplete = Boolean(goodsName.trim() && goodsQuantity.trim() && goodsUnit.trim());

  const handleNext = () => {
    setShowValidation(true);
    if (!isComplete) return;
    void onNext?.({ operationType, operationTypeLabel: operationLabels[operationType], goodsCategory, goodsName: goodsName.trim(), goodsQuantity: goodsQuantity.trim(), goodsUnit: goodsUnit.trim() });
  };

  return (
    <section className="flex w-full max-w-[770px] flex-col gap-7 rounded-xl border border-[#dfdfdf] p-4 sm:p-8">
      <header className="flex w-full flex-col gap-1"><h1 className="text-xl font-bold leading-7 text-[#1f1f1f]">Əməliyyat və mal məlumatları</h1><p className="text-sm leading-5 text-[#797979]">Xarici iqtisadi əməliyyat və mal məlumatlarını daxil edin</p></header>
      <div className="flex w-full flex-col gap-5">
        <Field><FieldLabel htmlFor="operation-type">Əməliyyat növü</FieldLabel><div className="relative w-full"><select id="operation-type" value={operationType} onChange={(event) => setOperationType(event.target.value as OperationInformationValues["operationType"])} className="h-12 w-full appearance-none rounded-lg border-0 bg-[#f5f5f5] px-4 text-base outline-none focus-visible:ring-2 focus-visible:ring-[#286aa6]/30"><option value="export">İxrac</option><option value="import">İdxal</option><option value="re_export">Təkrar ixrac</option><option value="re_import">Təkrar idxal</option><option value="transit">Tranzit</option></select><Image src="/icons/apply/operations/arrow-down.svg" alt="" width={20} height={20} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2" /></div></Field>
        {serviceCode === "PS-001" ? <Field><FieldLabel htmlFor="goods-category">Malların kateqoriyası</FieldLabel><select id="goods-category" value={goodsCategory} onChange={(event) => setGoodsCategory(event.target.value)} className="min-h-12 w-full rounded-lg border-0 bg-[#f5f5f5] px-4 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-[#286aa6]/30">{categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}</select></Field> : null}
        <Field data-invalid={showValidation && !goodsName.trim()}><FieldLabel htmlFor="goods-name">Malın adı</FieldLabel><Input id="goods-name" value={goodsName} onChange={(event) => setGoodsName(event.target.value)} placeholder="Daxil edin" aria-invalid={showValidation && !goodsName.trim()} />{showValidation && !goodsName.trim() ? <FieldError>Malın adını daxil edin.</FieldError> : null}</Field>
        <Field data-invalid={showValidation && !goodsQuantity.trim()}><FieldLabel htmlFor="goods-quantity">Miqdar</FieldLabel><Input id="goods-quantity" value={goodsQuantity} onChange={(event) => setGoodsQuantity(event.target.value)} placeholder="Daxil edin" aria-invalid={showValidation && !goodsQuantity.trim()} />{showValidation && !goodsQuantity.trim() ? <FieldError>Miqdarı daxil edin.</FieldError> : null}</Field>
        <Field data-invalid={showValidation && !goodsUnit.trim()}><FieldLabel htmlFor="goods-unit">Vahid</FieldLabel><Input id="goods-unit" value={goodsUnit} onChange={(event) => setGoodsUnit(event.target.value)} placeholder="kq, ton, ədəd, litr və s." aria-invalid={showValidation && !goodsUnit.trim()} />{showValidation && !goodsUnit.trim() ? <FieldError>Vahidi daxil edin.</FieldError> : null}</Field>
      </div>
      <footer className="flex w-full items-center justify-between border-t border-[#dfdfdf] pt-[21px]"><Button type="button" variant="outline" onClick={onBack} disabled={isBackDisabled} className="h-12 w-[100px] gap-2 border-[#dfdfdf] bg-white px-4 text-base font-semibold text-[#286aa6] hover:bg-white hover:text-[#286aa6]"><Image src="/icons/apply/operations/arrow-left.svg" alt="" width={24} height={24} aria-hidden="true" />Geri</Button><span className="text-sm font-medium leading-5 text-[#797979]">{stepNumber} / {totalSteps}</span><Button type="button" onClick={handleNext} disabled={isSubmitting} className="h-12 w-[100px] gap-2 bg-[#286aa6] px-4 text-base font-semibold text-white hover:bg-[#286aa6]">İrəli<Image src="/icons/apply/operations/arrow-right.svg" alt="" width={24} height={24} aria-hidden="true" /></Button></footer>
    </section>
  );
};

export default OperationStep;
