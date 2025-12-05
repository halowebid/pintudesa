"use client"

import * as React from "react"
import Link from "next/link"
import type { SelectPendudukSementara } from "@/lib/db/schema"
import { Button } from "@/lib/ui"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"

import { ControlledTable } from "@/components/dashboard/controlled-table"
import ShowOptions from "@/components/dashboard/show-options"
import { useToast } from "@/components/toast-provider"
import { tableColumnRegistry } from "@/lib/data/adminstrasi-umum/table-column-registry"
import { tableDataMapperRegistry } from "@/lib/data/adminstrasi-umum/table-data-mapper"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function PendudukSementaraContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const columns = React.useMemo(
    () =>
      tableColumnRegistry.pendudukSementara as ColumnDef<SelectPendudukSementara>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const {
    data: pendudukSementarasCount,
    refetch: refetchPendudukSementarasCount,
  } = useQuery(trpc.pendudukSementara.count.queryOptions())

  const {
    data: rawData,
    isLoading,
    refetch: refetchPendudukSementaras,
  } = useQuery(
    trpc.pendudukSementara.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.pendudukSementara.delete.mutationOptions({
      onSuccess: async () => {
        await refetchPendudukSementaras()
        await refetchPendudukSementarasCount()
        toast({
          description: "Berhasil menghapus penduduk sementara",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus penduduk sementara")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!pendudukSementarasCount) return 0
    return Math.ceil(pendudukSementarasCount / pagination.pageSize)
  }, [pendudukSementarasCount, pagination.pageSize])

  const mapFn = tableDataMapperRegistry.pendudukSementara
  const data = React.useMemo(() => {
    return (
      typeof mapFn === "function" ? mapFn(rawData ?? []) : (rawData ?? [])
    ) as SelectPendudukSementara[]
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
        <h1 className="text-lg font-bold">B4. Buku Penduduk Sementara</h1>
        <Button asChild>
          <Link href="/buku/penduduk-sementara/tambah">Tambah</Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectPendudukSementara>
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
              editUrl={`/buku/penduduk-sementara/edit/${item.id}`}
              description={item.nama}
            />
          )}
        />
      </div>
    </div>
  )
}
