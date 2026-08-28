import { type ComponentProps } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface NoteTextareaProps extends ComponentProps<typeof Textarea> {
  label?: string;
  maxLength?: number;
  value?: string;
}

export default function NoteTextarea({
  label = "Qeyd",
  maxLength = 300,
  value = "",
  className,
  ...props
}: NoteTextareaProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label
        htmlFor={props.id}
        className="text-sm font-medium leading-5 text-[#a5a5a5]"
      >
        {label}
      </label>
      <div className="relative w-full">
        <Textarea
          className={cn("h-[152px] pb-9 pr-16", className)}
          placeholder="Əlavə qeyd və ya göstərişlər..."
          maxLength={maxLength}
          value={value}
          {...props}
        />
        <p
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 right-4 text-xs leading-4 text-[#797979]"
        >
          {value.length}/{maxLength}
        </p>
      </div>
    </div>
  );
}
