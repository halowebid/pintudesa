"use client"

import * as React from "react"
import Link from "next/link"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"

import { ControlledTable } from "@/components/dashboard/controlled-table"
import ShowOptions from "@/components/dashboard/show-options"
import { useToast } from "@/components/toast-provider"
import { tableColumnRegistry } from "@/lib/data/adminstrasi-umum/table-column-registry"
import type { SelectTanah } from "@/lib/db/schema"
import { useTRPC } from "@/lib/trpc/client"
import { Button } from "@/lib/ui"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function TanahContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const columns = React.useMemo(
    () => tableColumnRegistry.tanah as ColumnDef<SelectTanah>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const { data: tanahsCount, refetch: refetchTanahsCount } = useQuery(
    trpc.tanah.count.queryOptions(),
  )

  const {
    data: rawData,
    isLoading,
    refetch: refetchTanahs,
  } = useQuery(
    trpc.tanah.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.tanah.delete.mutationOptions({
      onSuccess: async () => {
        await refetchTanahs()
        await refetchTanahsCount()
        toast({
          description: "Berhasil menghapus tanah",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus tanah")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!tanahsCount) return 0
    return Math.ceil(tanahsCount / pagination.pageSize)
  }, [tanahsCount, pagination.pageSize])

  const data = React.useMemo(() => {
    return (rawData ?? []) as SelectTanah[]
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
        <h1 className="text-lg font-bold">A6. Buku Tanah Desa</h1>
        <Button asChild>
          <Link href="/dashboard/buku/tanah/tambah">Tambah</Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectTanah>
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
              editUrl={`/dashboard/buku/tanah/edit/${item.id}`}
              description={item.namaPemilik}
            />
          )}
        />
      </div>
    </div>
  )
}
