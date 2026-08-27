import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

const defaultSteps = [
  "Fiziki şəxs",
  "Əlaqə",
  "Əməliyyat",
  "Sənədlər",
  "Nəzərdən keçir",
  "Yekun",
] as const;

export type ProgressStepperProps = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  /** The 1-based number of the currently active step. */
  activeStep?: number;
  /** Optional labels for a custom step sequence. */
  steps?: readonly string[];
};

export function ProgressStepper({
  activeStep = 1,
  steps = defaultSteps,
  className,
  ...props
}: ProgressStepperProps) {
  return (
    <nav
      aria-label="Müraciət mərhələləri"
      className={cn(
        "w-full overflow-x-auto px-4 py-10 sm:px-8 lg:px-20",
        className,
      )}
      {...props}
    >
      <ol className="mx-auto flex min-w-max w-full max-w-7xl items-start justify-center">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === activeStep;

          return (
            <li
              key={`${stepNumber}-${label}`}
              aria-current={isActive ? "step" : undefined}
              className="flex shrink-0 items-start gap-4"
            >
              <div className="flex shrink-0 flex-col items-center gap-2">
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full py-2 text-center text-base font-bold leading-6",
                    isActive
                      ? "bg-[#286aa6] text-white"
                      : "bg-[#f5f5f5] text-[#797979]",
                  )}
                >
                  {stepNumber}
                </span>
                <span
                  className={cn(
                    "whitespace-nowrap text-center text-base leading-6",
                    isActive
                      ? "font-semibold text-[#286aa6]"
                      : "font-normal text-[#797979]",
                  )}
                >
                  {label}
                </span>
              </div>

              {stepNumber < steps.length ? (
                <div aria-hidden="true" className="h-[72px] w-14 shrink-0 pt-4">
                  <div className="h-0.5 w-full rounded-full bg-[#dfdfdf]" />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
