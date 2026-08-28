import * as React from "react"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

type SearchInputProps = React.ComponentProps<"input"> & {
  containerClassName?: string
}

function SearchInput({
  className,
  containerClassName,
  ...props
}: SearchInputProps) {
  return (
    <div
      data-slot="search-input"
      className={cn(
        "flex h-12 w-full items-center gap-3 rounded-[8px] bg-[#f5f5f5] px-4 py-3 focus-within:ring-3 focus-within:ring-ring/50 has-[input[aria-invalid=true]]:ring-3 has-[input[aria-invalid=true]]:ring-destructive/20",
        containerClassName
      )}
    >
      <Search
        aria-hidden="true"
        className="size-5 shrink-0 text-[#1F1F1F]"
        strokeWidth={1.67}
      />
      <Input
        className={cn(
          "h-auto flex-1 rounded-none bg-transparent px-0 py-0 shadow-none focus-visible:ring-0 dark:bg-transparent",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { SearchInput }
