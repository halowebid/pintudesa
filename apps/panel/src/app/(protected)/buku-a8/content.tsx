"use client"

import * as React from "react"
import Link from "next/link"
import type { SelectEkspedisi } from "@pintudesa/db/schema"
import { Button } from "@pintudesa/ui"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"

import { ControlledTable } from "@/components/controlled-table"
import ShowOptions from "@/components/show-options"
import { useToast } from "@/components/toast-provider"
import { tableColumnRegistry } from "@/lib/data/adminstrasi-umum/table-column-registry"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function EkspedisiContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const columns = React.useMemo(
    () => tableColumnRegistry.ekspedisi as ColumnDef<SelectEkspedisi>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const { data: ekspedisisCount, refetch: refetchEkspedisisCount } = useQuery(
    trpc.ekspedisi.count.queryOptions(),
  )

  const {
    data: rawData,
    isLoading,
    refetch: refetchEkspedisis,
  } = useQuery(
    trpc.ekspedisi.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.ekspedisi.delete.mutationOptions({
      onSuccess: async () => {
        await refetchEkspedisis()
        await refetchEkspedisisCount()
        toast({
          description: "Berhasil menghapus ekspedisi",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus ekspedisi")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!ekspedisisCount) return 0
    return Math.ceil(ekspedisisCount / pagination.pageSize)
  }, [ekspedisisCount, pagination.pageSize])

  const data = React.useMemo(() => {
    return (rawData ?? []) as SelectEkspedisi[]
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
        <h1 className="text-lg font-bold">A7. Buku Ekspedisi</h1>
        <Button asChild>
          <Link href="/buku-a8/tambah">Tambah</Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectEkspedisi>
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
              editUrl={`/buku-a8/edit/${item.id}`}
              description={item.uraianSurat}
            />
          )}
        />
      </div>
    </div>
  )
}
