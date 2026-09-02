"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, ChevronDown } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: React.ComponentProps<typeof Calendar>["disabled"]
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Tarix seç",
  className,
  disabled,
}: DatePickerProps) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>()

  const date = value ?? internalDate

  const handleSelect = React.useCallback(
    (selectedDate: Date | undefined) => {
      if (!value) {
        setInternalDate(selectedDate)
      }
      onChange?.(selectedDate)
    },
    [onChange, value]
  )

  const displayText = date
    ? format(date, "dd.MM.yy")
    : placeholder

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "flex items-center gap-3 bg-[#f5f5f5] rounded-lg px-4 py-3 w-full cursor-pointer",
            "text-base font-normal leading-6",
            date ? "text-[#1F1F1F]" : "text-[#797979]",
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
          mode="single"
          defaultMonth={date}
          selected={date}
          onSelect={handleSelect}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  )
}
