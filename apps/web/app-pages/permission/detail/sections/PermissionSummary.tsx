"use client";

import Image from "next/image";
import { Building2, UserRound, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/features/auth/context";
import { cn } from "@/lib/utils";

type PermissionSummaryProps = {
  id: number;
  allowedApplicantTypes: "both" | ApplicantType;
  type: string;
  reviewTime: string;
  fee: string;
  documentCount: string;
  requirements: string[];
};

const summaryRows = [
  ["Növ", "type"],
  ["Baxılma müddəti", "reviewTime"],
  ["Dövlət rüsumu", "fee"],
  ["Sənəd sayı", "documentCount"],
] as const;

type ApplicantType = "legal" | "physical";

const applicantTypeOptions = [
  {
    value: "legal",
    title: "Hüquqi şəxs",
    description: "Şirkət adından müraciət – VÖEN ilə",
    icon: Building2,
  },
  {
    value: "physical",
    title: "Fiziki şəxs",
    description: "Şəxsi müraciət – şəxsiyyət vəsiqəsi ilə",
    icon: UserRound,
  },
] as const;

export function PermissionSummary({
  id,
  allowedApplicantTypes,
  type,
  reviewTime,
  fee,
  documentCount,
  requirements,
}: PermissionSummaryProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isApplicantTypeOpen, setIsApplicantTypeOpen] = useState(false);
  const [applicantType, setApplicantType] = useState<ApplicantType>("legal");
  const values = { type, reviewTime, fee, documentCount };

  const navigateToApplication = (selectedType: ApplicantType) => {
    router.push(
      selectedType === "legal"
        ? `/applications/${id}?type=legal`
        : `/applications/${id}`,
    );
  };

  const handleApply = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    const representativeTypes = new Set(
      (user.voens ?? [])
        .map(({ is_legal_representative }) => is_legal_representative)
        .filter((value): value is 0 | 1 => value === 0 || value === 1),
    );
    const canApplyAsLegal = representativeTypes.has(1);
    const canApplyAsPhysical =
      representativeTypes.size === 0 || representativeTypes.has(0);

    if (allowedApplicantTypes === "legal" && !canApplyAsLegal) {
      toast.error("Bu icazəyə yalnız hüquqi şəxs kimi müraciət etmək mümkündür.");
      return;
    }

    if (allowedApplicantTypes === "physical" && !canApplyAsPhysical) {
      toast.error("Bu icazəyə yalnız fiziki şəxs kimi müraciət etmək mümkündür.");
      return;
    }

    if (allowedApplicantTypes !== "both") {
      navigateToApplication(allowedApplicantTypes);
      return;
    }

    if (representativeTypes.size > 1) {
      setApplicantType("legal");
      setIsApplicantTypeOpen(true);
      return;
    }

    navigateToApplication(canApplyAsLegal ? "legal" : "physical");
  };

  const handleContinue = () => {
    setIsApplicantTypeOpen(false);
    navigateToApplication(applicantType);
  };

  return (
    <>
      <aside className="rounded-2xl border border-[#dfdfdf] bg-white p-6 sm:p-8 lg:sticky lg:top-6" aria-labelledby="permission-summary-title">
        <h2 id="permission-summary-title" className="text-xl font-bold leading-7 text-[#1f1f1f]">Müraciət məlumatları</h2>

        <dl className="mt-5 flex flex-col gap-3 border-b border-[#dfdfdf] pb-5 text-sm leading-5">
          {summaryRows.map(([label, key]) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <dt className="text-[#797979]">{label}</dt>
              <dd className="text-right font-medium text-[#1f1f1f]">{values[key]}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5">
          <h3 className="text-sm font-normal leading-5 text-[#797979]">Müraciət etmək üçün:</h3>
          <ul className="mt-3 flex flex-col gap-3">
            {requirements.map((requirement) => (
              <li key={requirement} className="flex items-center gap-2 text-sm leading-5 text-[#1f1f1f]">
                <Image src="/icons/permission-detail/tick-circle.svg" alt="" width={20} height={20} sizes="20px" />
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          type="button"
          onClick={handleApply}
          disabled={loading}
          className="mt-8 h-12 w-full bg-[#286aa6] px-4 text-base font-semibold leading-6 text-white hover:bg-[#1f5688]"
        >
          Müraciət et
        </Button>
      </aside>

      <Dialog open={isApplicantTypeOpen} onOpenChange={setIsApplicantTypeOpen}>
        <DialogContent
          showCloseButton={false}
          className="w-[calc(100%-2rem)] !max-w-[560px] gap-7 rounded-xl bg-white p-6 ring-0 sm:p-8"
        >
          <DialogHeader className="flex-row items-center justify-between gap-4 text-left">
            <DialogTitle className="text-xl font-bold leading-7 text-[#1f1f1f]">
              Müraciətçi növünü seçin
            </DialogTitle>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-12 shrink-0 text-[#286aa6] hover:bg-transparent hover:text-[#286aa6]"
                aria-label="Bağla"
              >
                <X className="size-6" aria-hidden="true" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Müraciətin fiziki və ya hüquqi şəxs adından edilməsini seçin.
          </DialogDescription>

          <RadioGroup
            value={applicantType}
            onValueChange={(value) => setApplicantType(value as ApplicantType)}
            aria-label="Müraciətçi növü"
            className="gap-5"
          >
            {applicantTypeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = applicantType === option.value;

              return (
                <label
                  key={option.value}
                  htmlFor={`applicant-type-${option.value}`}
                  className={cn(
                    "flex min-h-[74px] w-full cursor-pointer items-center gap-4 rounded-xl border p-[17px] transition-colors",
                    isSelected
                      ? "border-[#286aa6] bg-[#f9fafc]"
                      : "border-[#dfdfdf] bg-white",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-[14px]",
                      isSelected
                        ? "bg-[#286aa6] text-white"
                        : "bg-[#f5f5f5] text-[#1f1f1f]",
                    )}
                  >
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold leading-5 text-[#1f1f1f]">
                      {option.title}
                    </span>
                    <span className="block text-sm leading-5 text-[#797979]">
                      {option.description}
                    </span>
                  </span>
                  <RadioGroupItem
                    id={`applicant-type-${option.value}`}
                    value={option.value}
                    className="size-6 border-2 border-[#868686] data-checked:border-[#286aa6] data-checked:bg-white data-checked:text-[#286aa6] [&_[data-slot=radio-group-indicator]>span]:size-3 [&_[data-slot=radio-group-indicator]>span]:bg-[#286aa6]"
                  />
                </label>
              );
            })}
          </RadioGroup>

          <div className="flex flex-col gap-3">
            <Button
              type="button"
              onClick={handleContinue}
              className="h-12 w-full bg-[#286aa6] px-4 text-base font-semibold text-white hover:bg-[#1f5688]"
            >
              Davam et
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full border-[#dfdfdf] bg-white px-4 text-base font-semibold text-[#286aa6] hover:bg-white hover:text-[#286aa6]"
              >
                Bağla
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
