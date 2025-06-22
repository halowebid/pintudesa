"use client"

import * as React from "react"
import Link from "next/link"
import type { SelectPeraturan } from "@pintudesa/db"
import { Button } from "@pintudesa/ui"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"

import { ControlledTable } from "@/components/controlled-table"
import ShowOptions from "@/components/show-options"
import { useToast } from "@/components/toast-provider"
import { tableColumnRegistry } from "@/lib/data/adminstrasi-umum/table-column-registry"
import { tableDataMapperRegistry } from "@/lib/data/adminstrasi-umum/table-data-mapper"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function PeraturanContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const columns = React.useMemo(
    () => tableColumnRegistry.peraturan as ColumnDef<SelectPeraturan>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const { data: peraturansCount, refetch: refetchPeraturansCount } = useQuery(
    trpc.peraturan.count.queryOptions(),
  )

  const {
    data: rawData,
    isLoading,
    refetch: refetchPeraturans,
  } = useQuery(
    trpc.peraturan.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.peraturan.delete.mutationOptions({
      onSuccess: async () => {
        await refetchPeraturans()
        await refetchPeraturansCount()
        toast({
          description: "Berhasil menghapus peraturan",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus peraturan")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!peraturansCount) return 0
    return Math.ceil(peraturansCount / pagination.pageSize)
  }, [peraturansCount, pagination.pageSize])

  const mapFn = tableDataMapperRegistry.peraturan
  const data = React.useMemo(() => {
    return (
      typeof mapFn === "function" ? mapFn(rawData ?? []) : (rawData ?? [])
    ) as SelectPeraturan[]
  }, [mapFn, rawData])

  React.useEffect(() => {
    if (
      lastPage &&
      pagination.pageIndex &&
      pagination.pageIndex !== 0 &&
      pagination.pageIndex > lastPage - 1
    ) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: lastPage - 1,
      }))
    }
  }, [lastPage, pagination.pageIndex])
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-lg font-bold">A1. Buku Peraturan</h1>
        <Button asChild>
          <Link href="/buku-a1/tambah">Tambah</Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectPeraturan>
          data={data}
          setPagination={setPagination}
          pagination={pagination}
          totalPages={lastPage}
          columns={columns}
          isLoading={isLoading}
          showActions
          renderAction={(item) => (
            <ShowOptions
              onDelete={() => deleteItem(item.id)}
              editUrl={`/buku-a1/edit/${item.id}`}
              description={item.judul}
            />
          )}
        />
      </div>
    </div>
  )
}
