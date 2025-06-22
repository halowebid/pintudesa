"use client"

import * as React from "react"
import Link from "next/link"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"

import ShowOptions from "@/components/show-options"
import { useToast } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"
import { ControlledTable } from "@/components/ui/controlled-table"
import { tableColumnRegistry } from "@/lib/data/admintrasi-pembangunan/table-column-registry"
import type { SelectInventarisHasilPembangunan } from "@/lib/db/schema/inventaris-hasil-pembangunan"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function InventarisHasilPembangunanContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const columns = React.useMemo(
    () =>
      tableColumnRegistry.inventarisHasilPembangunan as ColumnDef<SelectInventarisHasilPembangunan>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const {
    data: inventarisHasilPembangunansCount,
    refetch: refetchInventarisHasilPembangunansCount,
  } = useQuery(trpc.inventarisHasilPembangunan.count.queryOptions())

  const {
    data: rawData,
    isLoading,
    refetch: refetchInventarisHasilPembangunans,
  } = useQuery(
    trpc.inventarisHasilPembangunan.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.inventarisHasilPembangunan.delete.mutationOptions({
      onSuccess: async () => {
        await refetchInventarisHasilPembangunans()
        await refetchInventarisHasilPembangunansCount()
        toast({
          description: "Berhasil menghapus inventaris hasil bangunan",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus inventaris hasil bangunan")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!inventarisHasilPembangunansCount) return 0
    return Math.ceil(inventarisHasilPembangunansCount / pagination.pageSize)
  }, [inventarisHasilPembangunansCount, pagination.pageSize])

  const data = React.useMemo(() => {
    return (rawData ?? []) as SelectInventarisHasilPembangunan[]
  }, [rawData])

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
        <h1 className="text-lg font-bold">
          D3. Buku Inventaris Hasil Pembangunan
        </h1>
        <Button asChild>
          <Link href="/buku-d3/tambah">Tambah</Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectInventarisHasilPembangunan>
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
              editUrl={`/buku-d3/edit/${item.id}`}
              description={item.namaHasilPembangunan}
            />
          )}
        />
      </div>
    </div>
  )
}
