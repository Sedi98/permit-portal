import { TickCircleIcon } from "@/components/icons";

export interface Step {
  label: string;
}

interface StepperProps {
  steps: Step[];
  activeStep: number;
  className?: string;
}

export default function Stepper({ steps, activeStep, className }: StepperProps) {
  const elements: React.ReactNode[] = [];

  steps.forEach((step, index) => {
    if (index > 0) {
      elements.push(
        <div
          key={`divider-${index}`}
          className="flex flex-col items-start justify-center h-[72px] pt-4 pb-8 w-14 shrink-0"
        >
          <div className="bg-[#DFDFDF] h-[2px] rounded-full w-full" />
        </div>,
      );
    }

    const isCompleted = index < activeStep;
    const isActive = index === activeStep;

    elements.push(
      <div key={index} className="flex flex-col items-center gap-2 shrink-0">
        <div
          className={`w-10 rounded-full ${
            isCompleted ? "bg-[#EEF4FB]" : isActive ? "bg-[#286AA6]" : "bg-[#F5F5F5]"
          }`}
        >
          <div className="flex items-center justify-center py-2">
            {isCompleted ? (
              <TickCircleIcon className="size-6 text-[#286AA6]" />
            ) : (
              <p
                className={`font-bold text-base leading-6 text-center ${
                  isActive ? "text-white" : "text-[#797979]"
                }`}
              >
                {index + 1}
              </p>
            )}
          </div>
        </div>
        <p
          className={`text-base leading-6 text-center whitespace-nowrap ${
            isCompleted
              ? "font-normal text-[#286AA6]"
              : isActive
                ? "font-semibold text-[#286AA6]"
                : "font-normal text-[#797979]"
          }`}
        >
          {step.label}
        </p>
      </div>,
    );
  });

  return (
    <div className={`bg-white flex items-center gap-4 p-6 rounded-xl ${className ?? ""}`}>
      {elements}
    </div>
  );
}
