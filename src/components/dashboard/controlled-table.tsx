"use client"

import * as React from "react"
import type { ListCollection } from "@ark-ui/react"
import {
  createListCollection,
  Input,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValueText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/lib/ui"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type Header,
  type PaginationState,
  type RowData,
  type SortingState,
} from "@tanstack/react-table"
import { Icon } from "@yopem-ui/react-icons"
import { cn } from "@yopem-ui/utils"

declare module "@tanstack/react-table" {
  // @ts-ignore extending ColumnMeta with custom props
  interface ColumnMeta<_TData, _TValue> {
    isHiddenOnMobile?: boolean
    filterVariant?: "range" | "select" | undefined
    options?: string[]
  }
}

export type { ColumnDef, FilterFn, RowData } from "@tanstack/react-table"

export const createColumnHelperInstance = <TData extends RowData>() =>
  createColumnHelper<TData>()

interface ControlledTableProps<TData extends RowData> {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  totalPages?: number
  isLoading?: boolean
  pagination?: PaginationState
  sorting?: SortingState
  columnFilters?: ColumnFiltersState
  setPagination?: React.Dispatch<React.SetStateAction<PaginationState>>
  setSorting?: React.Dispatch<React.SetStateAction<SortingState>>
  setColumnFilters?: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
  pageSizeOptions?: number[]
  showActions?: boolean
  renderAction?: (item: TData) => React.ReactNode
}

export function ControlledTable<TData extends RowData>({
  columns,
  data,
  totalPages,
  pagination,
  sorting,
  columnFilters,
  isLoading,
  setPagination,
  setSorting,
  setColumnFilters,
  pageSizeOptions = [10, 20, 30],
  showActions,
  renderAction,
}: ControlledTableProps<TData>) {
  const [internalPagination, setInternalPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: pageSizeOptions[0],
    })
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([])
  const [internalColumnFilters, setInternalColumnFilters] =
    React.useState<ColumnFiltersState>([])

  const memoizedColumns = React.useMemo(() => columns, [columns])
  const memoizedData = React.useMemo(() => data, [data])

  const table = useReactTable<TData>({
    data: memoizedData,
    columns: memoizedColumns,
    state: {
      pagination: pagination ?? internalPagination,
      sorting: sorting ?? internalSorting,
      columnFilters: columnFilters ?? internalColumnFilters,
    },
    manualPagination: !!pagination,
    manualSorting: !!sorting,
    manualFiltering: !!columnFilters,
    pageCount: totalPages,
    onPaginationChange: setPagination ?? setInternalPagination,
    onSortingChange: setSorting ?? setInternalSorting,
    onColumnFiltersChange: setColumnFilters ?? setInternalColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
  })

  const pageSizeCollection: ListCollection = createListCollection({
    items: pageSizeOptions.map((size) => String(size)),
  })

  return (
    <div className="relative min-h-[100vh] w-full overflow-auto">
      <Table className="table-auto border-collapse border-spacing-0">
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => {
                const isHiddenOnMobile =
                  header.column.columnDef.meta?.isHiddenOnMobile

                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      "space-y-1 px-2 py-4 align-top whitespace-nowrap",
                      header.column.getCanSort() &&
                        "cursor-pointer select-none",
                      isHiddenOnMobile && "hidden lg:table-cell",
                    )}
                  >
                    <div className="flex flex-col justify-center gap-1">
                      {!header.isPlaceholder && <HeaderCell header={header} />}
                      {header.column.getCanFilter() && (
                        <div>
                          <Filter column={header.column} />
                        </div>
                      )}
                    </div>
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={memoizedColumns.length}
                className="py-4 text-center"
              >
                <span className="text-muted-foreground animate-pulse">
                  Loading...
                </span>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={memoizedColumns.length}
                className="py-4 text-center"
              >
                Tidak ada data ditemukan.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "max-w-[10rem] px-1.5 py-2 !whitespace-normal md:px-3",
                      cell.column.columnDef.meta?.isHiddenOnMobile &&
                        "hidden lg:table-cell",
                    )}
                    title={String(cell.getValue())}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                {showActions && renderAction && (
                  <TableCell className="px-1.5 py-2 md:px-3">
                    {renderAction(row.original)}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent className="flex flex-wrap items-center justify-center gap-2 px-2 py-1">
          <PaginationItem>
            <PaginationLink
              onClick={() => table.setPageIndex(0)}
              aria-disabled={!table.getCanPreviousPage()}
              className={cn(
                !table.getCanPreviousPage() && "pointer-events-none opacity-50",
              )}
            >
              <Icon name="ChevronsLeft" />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => table.previousPage()}
              aria-disabled={!table.getCanPreviousPage()}
              className={cn(
                !table.getCanPreviousPage() && "pointer-events-none opacity-50",
              )}
            />
          </PaginationItem>

          <PaginationItem>
            <span className="px-2 text-sm whitespace-nowrap">
              Page{" "}
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={() => table.nextPage()}
              aria-disabled={!table.getCanNextPage()}
              className={cn(
                !table.getCanNextPage() && "pointer-events-none opacity-50",
              )}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              aria-disabled={!table.getCanNextPage()}
              className={cn(
                !table.getCanNextPage() && "pointer-events-none opacity-50",
              )}
            >
              <Icon name="ChevronsRight" />
            </PaginationLink>
          </PaginationItem>

          <PaginationItem className="flex flex-wrap items-center gap-1 text-sm">
            <span className="whitespace-nowrap">Go to page:</span>
            <Input
              aria-label="Page number"
              type="number"
              min={1}
              max={table.getPageCount()}
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                table.setPageIndex(page)
              }}
              className="h-8 w-16 rounded border px-1 py-0.5 text-sm"
            />
          </PaginationItem>

          <PaginationItem>
            <Select
              value={[String(table.getState().pagination.pageSize)]}
              collection={pageSizeCollection}
              onValueChange={(e) => {
                if (setPagination) {
                  setPagination((prev) => ({
                    ...prev,
                    pageSize: Number(e.value[0]),
                    pageIndex: 0,
                  }))
                }
                table.setPageSize(Number(e.value[0]))
              }}
            >
              <SelectTrigger className="ml-2 !h-8 w-[120px] px-2 py-1 text-sm">
                <SelectValueText placeholder="Page size" />
              </SelectTrigger>
              <SelectContent>
                {pageSizeCollection.items.map((item) => (
                  <SelectItem key={item} item={item}>
                    Show {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="mt-1 text-sm">
        {table.getPrePaginationRowModel().rows.length} Rows
      </div>
    </div>
  )
}

function HeaderCell<TData>({ header }: { header: Header<TData, unknown> }) {
  return (
    <div
      className="group flex cursor-pointer items-center gap-1 select-none"
      onClick={header.column.getToggleSortingHandler()}
    >
      {flexRender(header.column.columnDef.header, header.getContext())}
      <span className="ml-1">
        {header.column.getIsSorted() === "asc" ? (
          <Icon name="ChevronUp" className="text-primary h-4 w-4" />
        ) : header.column.getIsSorted() === "desc" ? (
          <Icon name="ChevronDown" className="text-primary h-4 w-4" />
        ) : (
          <Icon
            name="ChevronsUpDown"
            className="text-muted-foreground group-hover:text-foreground h-4 w-4"
          />
        )}
      </span>
    </div>
  )
}

function Filter<TData extends RowData>({
  column,
}: {
  column: Column<TData, unknown>
}) {
  const columnFilterValue = column.getFilterValue()
  const filterVariant = column.columnDef.meta?.filterVariant as
    | "range"
    | "select"
    | undefined

  if (filterVariant === "range") {
    return (
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          value={Array.isArray(columnFilterValue) ? columnFilterValue[0] : ""}
          onChange={(value) =>
            column.setFilterValue((old?: [number, number]) => [
              value,
              Number(old?.[1]) ? old?.[1] : undefined,
            ])
          }
          placeholder="Min"
        />
        <DebouncedInput
          type="number"
          value={Array.isArray(columnFilterValue) ? columnFilterValue[1] : ""}
          onChange={(value) =>
            column.setFilterValue((old?: [number, number]) => [
              Number(old?.[0]) ? old?.[0] : undefined,
              value,
            ])
          }
          placeholder="Max"
        />
      </div>
    )
  } else if (filterVariant === "select") {
    return <SelectFilter column={column} />
  }
  return null
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value?: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [value, setValue] = React.useState(initialValue ?? "")
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => onChange(newValue), debounce)
  }

  return (
    <Input
      {...props}
      value={value}
      onChange={handleChange}
      className="h-8 min-w-16 p-2"
    />
  )
}

function SelectFilter<TData extends RowData>({
  column,
}: {
  column: Column<TData, unknown>
}) {
  const rawValue = column.getFilterValue()
  const options = column.columnDef.meta?.selectOptions
  const columnFilterValue =
    typeof rawValue === "string" || typeof rawValue === "number"
      ? String(rawValue)
      : ""

  const values = React.useMemo<string[]>(() => {
    const unique = new Set<string>()
    column.getFacetedRowModel().rows.forEach((row) => {
      const value = row.getValue(column.id)
      if (
        value != null &&
        (typeof value === "string" || typeof value === "number")
      ) {
        unique.add(String(value))
      }
    })
    return ["", ...Array.from(unique)]
  }, [column])

  const rangeCollection: ListCollection = createListCollection({
    items: options ? ["", ...options] : values,
  })

  return (
    <Select
      value={[columnFilterValue]}
      collection={rangeCollection}
      onValueChange={(e) => column.setFilterValue(e.value[0])}
    >
      <SelectTrigger className="!h-8 w-32 p-2">
        <SelectValueText placeholder="All" />
      </SelectTrigger>
      <SelectContent>
        {rangeCollection.items.map((item) => (
          <SelectItem key={item} item={item}>
            {item === "" ? "All" : item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
