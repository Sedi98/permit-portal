import { type ComponentProps } from "react";
import { Textarea } from "@/components/ui/textarea";

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
    <div className="flex flex-col gap-1 w-full">
      <div className="flex flex-col gap-2 w-full">
        <label className="text-[#797979] text-sm font-medium leading-5">
          {label}
        </label>
        <div className="relative w-full">
          <Textarea
            className={`bg-[#F5F5F5] rounded-lg px-4 py-3 border-none shadow-none text-[#797979] text-base leading-6 placeholder:text-[#797979] resize-none min-h-[48px] h-30 ${className ?? ""}`}
            placeholder="Əlavə qeyd və ya göstərişlər..."
            maxLength={maxLength}
            value={value}
            {...props}
          />
          <p className="absolute bottom-3 right-4 text-[#797979] text-xs leading-4">
            {value.length}/{maxLength}
          </p>
        </div>
      </div>
    </div>
  );
}
