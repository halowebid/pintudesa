"use client"

import * as React from "react"
import Link from "next/link"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"

import { ControlledTable } from "@/components/dashboard/controlled-table"
import ShowOptions from "@/components/dashboard/show-options"
import { useToast } from "@/components/toast-provider"
import { tableColumnRegistry } from "@/lib/data/adminstrasi-umum/table-column-registry"
import type { SelectKeputusanKepalaDesa } from "@/lib/db/schema"
import { useTRPC } from "@/lib/trpc/client"
import { Button } from "@/lib/ui"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function KeputusanKepalaDesaContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const columns = React.useMemo(
    () =>
      tableColumnRegistry.keputusanKepalaDesa as ColumnDef<SelectKeputusanKepalaDesa>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const {
    data: keputusanKepalaDesasCount,
    refetch: refetchKeputusanKepalaDesasCount,
  } = useQuery(trpc.keputusanKepalaDesa.count.queryOptions())

  const {
    data: rawData,
    isLoading,
    refetch: refetchKeputusanKepalaDesas,
  } = useQuery(
    trpc.keputusanKepalaDesa.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.keputusanKepalaDesa.delete.mutationOptions({
      onSuccess: async () => {
        await refetchKeputusanKepalaDesas()
        await refetchKeputusanKepalaDesasCount()
        toast({
          description: "Berhasil menghapus keputusan Kepala Desa",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus keputusan Kepala Desa")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!keputusanKepalaDesasCount) return 0
    return Math.ceil(keputusanKepalaDesasCount / pagination.pageSize)
  }, [keputusanKepalaDesasCount, pagination.pageSize])

  const data = React.useMemo(() => {
    return (rawData ?? []) as SelectKeputusanKepalaDesa[]
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
        <h1 className="text-lg font-bold">A2. Buku Keputusan Kepala Desa</h1>
        <Button asChild>
          <Link href="/dashboard/buku/keputusan-kepala-desa/tambah">
            Tambah
          </Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectKeputusanKepalaDesa>
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
              editUrl={`/dashboard/buku/keputusan-kepala-desa/edit/${item.id}`}
              description={item.judul}
            />
          )}
        />
      </div>
    </div>
  )
}
