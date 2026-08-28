import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-[8px] border-none bg-[#f5f5f5] px-4 py-3 text-base leading-6 text-[#1F1F1F] shadow-none transition-[color,box-shadow] outline-none file:inline-flex file:h-auto file:border-0 file:bg-transparent file:text-base file:leading-6 file:font-medium file:text-foreground placeholder:text-[#797979] focus-visible:border-ring/20 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-[#f5f5f5]/30 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
