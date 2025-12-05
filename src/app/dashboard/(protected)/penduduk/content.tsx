"use client"

import * as React from "react"
import Link from "next/link"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"

import { ControlledTable } from "@/components/dashboard/controlled-table"
import ShowOptions from "@/components/dashboard/show-options"
import { useToast } from "@/components/toast-provider"
import { tableColumnRegistry } from "@/lib/data/kependudukan/table-column-registry"
import { tableDataMapperRegistry } from "@/lib/data/kependudukan/table-data-mapper"
import type { SelectPenduduk } from "@/lib/db/schema"
import { useTRPC } from "@/lib/trpc/client"
import { Button } from "@/lib/ui"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function PendudukContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const columns = React.useMemo(
    () => tableColumnRegistry.penduduk as ColumnDef<SelectPenduduk>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const { data: penduduksCount, refetch: refetchPenduduksCount } = useQuery(
    trpc.penduduk.count.queryOptions(),
  )

  const {
    data: rawData,
    isLoading,
    refetch: refetchPenduduks,
  } = useQuery(
    trpc.penduduk.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.penduduk.delete.mutationOptions({
      onSuccess: async () => {
        await refetchPenduduks()
        await refetchPenduduksCount()
        toast({
          description: "Berhasil menghapus penduduk",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus penduduk")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!penduduksCount) return 0
    return Math.ceil(penduduksCount / pagination.pageSize)
  }, [penduduksCount, pagination.pageSize])

  const mapFn = tableDataMapperRegistry.penduduk
  const data = React.useMemo(() => {
    return (
      typeof mapFn === "function" ? mapFn(rawData ?? []) : (rawData ?? [])
    ) as SelectPenduduk[]
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
        <h1 className="text-lg font-bold">Penduduk</h1>
        <Button asChild>
          <Link href="/dashboard/penduduk/tambah">Tambah</Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectPenduduk>
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
              editUrl={`/dashboard/penduduk/edit/${item.id}`}
              description={item.namaLengkap}
            />
          )}
        />
      </div>
    </div>
  )
}
