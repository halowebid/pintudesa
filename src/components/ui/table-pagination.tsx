"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface TablePaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number
  paramsName?: string
  lastPage: number
  onPageChange?: (_page: number) => void
}

const TablePagination: React.FunctionComponent<TablePaginationProps> = (
  props,
) => {
  const { currentPage, lastPage, paramsName = "page" } = props

  const searchParams = useSearchParams()

  function updatePage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set(paramsName, page.toString())
    window.history.pushState(null, "", `?${params.toString()}`)
  }

  return (
    <>
      {lastPage > 1 && (
        <div>
          <Pagination>
            <PaginationContent>
              {currentPage !== 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => updatePage(currentPage - 1)}
                  />
                </PaginationItem>
              )}
              <span>{`Halaman ${currentPage} dari ${lastPage} halaman`}</span>
              {currentPage !== lastPage && (
                <PaginationItem>
                  <PaginationNext onClick={() => updatePage(currentPage + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  )
}

export default TablePagination
