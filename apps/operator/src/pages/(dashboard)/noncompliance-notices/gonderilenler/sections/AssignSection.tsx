import { useId, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MultipleSelector, { type Option } from "@/components/ui/multi-select";

interface AssignSectionProps {
  availablePeople: Option[];
  selectedPeople: Option[];
  onPeopleChange: (people: Option[]) => void;
  selectedExecutor: string;
  onExecutorChange: (name: string) => void;
}

export default function AssignSection({
  availablePeople,
  selectedPeople,
  onPeopleChange,
  selectedExecutor,
  onExecutorChange,
}: AssignSectionProps) {
  const id = useId();

  useEffect(() => {
    const stillSelected = selectedPeople.some(
      (p) => p.value === selectedExecutor,
    );
    if (!stillSelected && selectedPeople.length > 0) {
      onExecutorChange(selectedPeople[0].value);
    }
  }, [selectedPeople, selectedExecutor, onExecutorChange]);

  return (
    <div className="flex items-start justify-between gap-10">
      <div className="flex flex-col gap-5 w-[450px]">
        <div className="flex flex-col gap-2 w-full">
          <Label className="text-[#797979] text-sm font-medium leading-5">
            Yönləndiriləcək şəxslərin seçimi
          </Label>
          <MultipleSelector
            value={selectedPeople}
            onChange={onPeopleChange}
            defaultOptions={availablePeople}
            placeholder="Icraçı seçin"
            emptyIndicator={
              <p className="text-center text-sm">Nəticə tapılmadı</p>
            }
            className="bg-[#F5F5F5] rounded-lg px-4 py-3 border-none shadow-none"
            badgeClassName="bg-[#F9FAFC] text-[#286AA6] text-sm font-medium leading-5 rounded-xl px-3 border-none h-9"
            inputProps={{
              className: "text-[#797979] text-base leading-6",
            }}
            hideClearAllButton
          />
        </div>
      </div>

      <div className="flex flex-col gap-5 w-[450px]">
        <p className="text-[#1F1F1F] font-semibold text-base leading-6">
          Əsas icraçının təyin olunması
        </p>
        {selectedPeople.length === 0 ? (
          <p className="text-[#797979] text-sm leading-5">
            İcraçı seçmək üçün əvvəlcə şəxsləri seçin
          </p>
        ) : (
          <RadioGroup
            className="w-full gap-3"
            value={selectedExecutor}
            onValueChange={onExecutorChange}
          >
            {selectedPeople.map((person, i) => {
              const isSelected = selectedExecutor === person.value;
              return (
                <div
                  key={person.value}
                  className={`relative flex w-full items-center gap-4 rounded-xl border px-[17px] py-[13px] outline-none ${
                    isSelected
                      ? "bg-[#EEF4FB] border-[#286AA6]"
                      : "bg-[#FEFEFE] border-[#DFDFDF]"
                  }`}
                >
                  <RadioGroupItem
                    value={person.value}
                    id={`${id}-${i}`}
                    className="size-6 shrink-0 border-[#DFDFDF] data-checked:border-[#286AA6] data-checked:bg-[#286AA6] rounded-full [&_[data-slot=radio-group-indicator]>span]:size-[10px]"
                  />
                  <div className="grid grow gap-px">
                    <Label
                      htmlFor={`${id}-${i}`}
                      className="text-[#1F1F1F] text-sm font-semibold leading-5"
                    >
                      {person.label}
                    </Label>
                    <p className="text-[#797979] text-sm leading-5">İnzibati şöbə</p>
                  </div>
                </div>
              );
            })}
          </RadioGroup>
        )}
      </div>
    </div>
  );
}
