"use client"

import * as React from "react"
import Link from "next/link"
import type { SelectTanahKas } from "@pintudesa/db/schema"
import { Button } from "@pintudesa/ui"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"

import { ControlledTable } from "@/components/controlled-table"
import ShowOptions from "@/components/show-options"
import { useToast } from "@/components/toast-provider"
import { tableColumnRegistry } from "@/lib/data/adminstrasi-umum/table-column-registry"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function TanahKasContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const columns = React.useMemo(
    () => tableColumnRegistry.tanahKas as ColumnDef<SelectTanahKas>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const { data: tanahKasCount, refetch: refetchTanahKasCount } = useQuery(
    trpc.tanahKas.count.queryOptions(),
  )

  const {
    data: rawData,
    isLoading,
    refetch: refetchTanahKas,
  } = useQuery(
    trpc.tanahKas.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.tanahKas.delete.mutationOptions({
      onSuccess: async () => {
        await refetchTanahKas()
        await refetchTanahKasCount()
        toast({
          description: "Berhasil menghapus tanah kas",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus tanah kas")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!tanahKasCount) return 0
    return Math.ceil(tanahKasCount / pagination.pageSize)
  }, [tanahKasCount, pagination.pageSize])

  const data = React.useMemo(() => {
    return (rawData ?? []) as SelectTanahKas[]
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
        <h1 className="text-lg font-bold">A5. Buku Tanah Kas Desa</h1>
        <Button asChild>
          <Link href="/buku-a5/tambah">Tambah</Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectTanahKas>
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
              editUrl={`/buku-a5/edit/${item.id}`}
              description={item.asal}
            />
          )}
        />
      </div>
    </div>
  )
}
