import { useId } from "react";

import { Label } from "@/components/ui/label";
import MultipleSelector, { type Option } from "@/components/ui/multi-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ApplicationAssignSectionProps {
  availablePeople: Option[];
  selectedPeople: Option[];
  onPeopleChange: (people: Option[]) => void;
  selectedExecutor: string;
  onExecutorChange: (value: string) => void;
}

export default function ApplicationAssignSection({
  availablePeople,
  selectedPeople,
  onPeopleChange,
  selectedExecutor,
  onExecutorChange,
}: ApplicationAssignSectionProps) {
  const id = useId();

  return (
    <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
      <div className="flex min-w-0 flex-col gap-2">
        <Label className="text-sm font-medium leading-5 text-[#797979]">
          Yönləndiriləcək şəxslərin seçimi
        </Label>
        <MultipleSelector
          value={selectedPeople}
          onChange={onPeopleChange}
          defaultOptions={availablePeople}
          placeholder="İcraçı seçin"
          emptyIndicator={
            <p className="text-center text-sm">Nəticə tapılmadı</p>
          }
          className="rounded-lg border-none bg-[#F5F5F5] px-4 py-3 shadow-none"
          badgeClassName="h-9 rounded-xl border-none bg-[#F9FAFC] px-3 text-sm font-medium leading-5 text-[#286AA6]"
          inputProps={{
            className: "text-base leading-6 text-[#797979]",
            "aria-label": "Yönləndiriləcək şəxslər",
          }}
          hideClearAllButton
        />
      </div>

      <div className="flex min-w-0 flex-col gap-5">
        <p className="text-base font-semibold leading-6 text-[#1F1F1F]">
          Əsas icraçının təyin olunması
        </p>
        {selectedPeople.length === 0 ? (
          <p className="text-sm leading-5 text-[#797979]">
            Əsas icraçını seçmək üçün əvvəlcə şəxsləri seçin
          </p>
        ) : (
          <RadioGroup
            className="w-full gap-3"
            value={selectedExecutor}
            onValueChange={onExecutorChange}
          >
            {selectedPeople.map((person, index) => {
              const optionId = `${id}-${index}`;
              const isSelected = selectedExecutor === person.value;

              return (
                <div
                  key={person.value}
                  className={`relative flex w-full items-center gap-4 rounded-xl border px-[17px] py-[13px] outline-none ${
                    isSelected
                      ? "border-[#286AA6] bg-[#EEF4FB]"
                      : "border-[#DFDFDF] bg-[#FEFEFE]"
                  }`}
                >
                  <RadioGroupItem
                    value={person.value}
                    id={optionId}
                    className="size-6 shrink-0 rounded-full border-[#DFDFDF] data-checked:border-[#286AA6] data-checked:bg-[#286AA6] [&_[data-slot=radio-group-indicator]>span]:size-[10px]"
                  />
                  <Label
                    htmlFor={optionId}
                    className="grow cursor-pointer text-sm font-semibold leading-5 text-[#1F1F1F]"
                  >
                    {person.label}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        )}
      </div>
    </div>
  );
}
