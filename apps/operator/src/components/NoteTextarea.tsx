import { type ComponentProps } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface NoteTextareaProps extends Omit<ComponentProps<typeof Textarea>, "maxLength"> {
  label?: string;
  value?: string;
}

export default function NoteTextarea({
  label = "Qeyd",
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
          className={cn("h-[152px]", className)}
          placeholder="Əlavə qeyd və ya göstərişlər..."
          value={value}
          {...props}
        />
      </div>
    </div>
  );
}
