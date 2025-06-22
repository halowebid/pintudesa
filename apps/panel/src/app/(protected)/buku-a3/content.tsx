"use client"

import * as React from "react"
import Link from "next/link"
import type { SelectInventaris } from "@pintudesa/db"
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

export default function InventarisContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const columns = React.useMemo(
    () => tableColumnRegistry.inventaris as ColumnDef<SelectInventaris>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const { data: inventarissCount, refetch: refetchInventarissCount } = useQuery(
    trpc.inventaris.count.queryOptions(),
  )

  const {
    data: rawData,
    isLoading,
    refetch: refetchInventariss,
  } = useQuery(
    trpc.inventaris.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.inventaris.delete.mutationOptions({
      onSuccess: async () => {
        await refetchInventariss()
        await refetchInventarissCount()
        toast({
          description: "Berhasil menghapus inventaris",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus inventaris")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!inventarissCount) return 0
    return Math.ceil(inventarissCount / pagination.pageSize)
  }, [inventarissCount, pagination.pageSize])

  const mapFn = tableDataMapperRegistry.inventaris
  const data = React.useMemo(() => {
    return (
      typeof mapFn === "function" ? mapFn(rawData ?? []) : (rawData ?? [])
    ) as SelectInventaris[]
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
        <h1 className="text-lg font-bold">A3. Buku Inventaris</h1>
        <Button asChild>
          <Link href="/buku-a3/tambah">Tambah</Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectInventaris>
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
              editUrl={`/buku-a3/edit/${item.id}`}
              description={item.jenisInventaris}
            />
          )}
        />
      </div>
    </div>
  )
}
