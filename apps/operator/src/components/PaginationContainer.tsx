"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

interface PaginationContainerProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  className?: string
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | "ellipsis")[] = []

  if (current <= 3) {
    for (let i = 1; i <= 4; i++) pages.push(i)
    pages.push("ellipsis")
    pages.push(total)
  } else if (current >= total - 2) {
    pages.push(1)
    pages.push("ellipsis")
    for (let i = total - 3; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    pages.push("ellipsis")
    for (let i = current - 1; i <= current + 1; i++) pages.push(i)
    pages.push("ellipsis")
    pages.push(total)
  }

  return pages
}

export function PaginationContainer({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
}: PaginationContainerProps) {
  const from = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const to = Math.min(currentPage * itemsPerPage, totalItems)
  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between border-t border-[#f5f5f5] px-6 py-4",
        className
      )}
    >
      <p className="text-sm leading-5 w-full text-[#797979]">
        {totalItems} müraciətin {from}-{to} nəticəsi
      </p>

      <Pagination>
        <PaginationContent className="gap-3">
          <PaginationItem>
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="flex size-10 items-center justify-center rounded-lg bg-[#dfdfdf] p-2 disabled:opacity-50"
            >
              <ChevronLeftIcon className="size-6 text-[#797979]" />
            </button>
          </PaginationItem>

          {pages.map((page, index) =>
            page === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis className="text-[#797979]" />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <button
                  type="button"
                  onClick={() => onPageChange(page)}
                  className={cn(
                    "text-base font-medium leading-6",
                    page === currentPage
                      ? "text-[#286aa6]"
                      : "text-[#797979]"
                  )}
                >
                  {page}
                </button>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="flex size-10 items-center justify-center rounded-lg border border-[#dfdfdf] bg-white p-2 disabled:opacity-50"
            >
              <ChevronRightIcon className="size-6 text-[#797979]" />
            </button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
