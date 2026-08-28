import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[152px] w-full resize-none rounded-[8px] border-none bg-[#f5f5f5] px-4 py-3 text-base leading-6 text-[#1f1f1f] shadow-none transition-[color,box-shadow] outline-none placeholder:text-[#797979] focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-[#f5f5f5]/30 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
