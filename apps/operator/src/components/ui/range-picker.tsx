"use client"

import * as React from "react"
import { format, subMonths } from "date-fns"
import { CalendarIcon, ChevronDown } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerWithRangeProps {
  value?: DateRange
  onChange?: (date: DateRange | undefined) => void
  placeholder?: string
  className?: string
}

export function DatePickerWithRange({
  value: controlledValue,
  onChange,
  placeholder = "Tarix seç",
  className,
}: DatePickerWithRangeProps) {
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>(() => ({
    from: subMonths(new Date(), 1),
    to: new Date(),
  }))

  const date = controlledValue ?? internalDate

  const handleSelect = React.useCallback(
    (selectedDate: DateRange | undefined) => {
      if (!controlledValue) {
        setInternalDate(selectedDate)
      }
      onChange?.(selectedDate)
    },
    [onChange, controlledValue]
  )

  const displayText = date?.from
    ? date.to
      ? `${format(date.from, "dd.MM.yyyy")} - ${format(date.to, "dd.MM.yyyy")}`
      : format(date.from, "dd.MM.yyyy")
    : placeholder

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "flex items-center gap-3 bg-[#f5f5f5] rounded-lg px-4 py-3 w-auto cursor-pointer",
            "text-base font-normal leading-6",
            date?.from ? "text-[#1F1F1F]" : "text-[#797979]",
            className
          )}
        >
          <CalendarIcon className="size-5 text-[#797979] shrink-0" />
          <span className="flex-1 min-w-0">{displayText}</span>
          <ChevronDown className="size-5 text-[#797979] shrink-0" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}
