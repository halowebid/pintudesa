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
import type { SelectRencanaKerjaPembangunan } from "@/lib/db/schema/rencana-kerja-pembangunan"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function RencanaKerjaPembangunanContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const columns = React.useMemo(
    () =>
      tableColumnRegistry.rencanaKerjaPembangunan as ColumnDef<SelectRencanaKerjaPembangunan>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const {
    data: rencanaKerjaPembangunansCount,
    refetch: refetchRencanaKerjaPembangunansCount,
  } = useQuery(trpc.rencanaKerjaPembangunan.count.queryOptions())

  const {
    data: rawData,
    isLoading,
    refetch: refetchRencanaKerjaPembangunans,
  } = useQuery(
    trpc.rencanaKerjaPembangunan.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.rencanaKerjaPembangunan.delete.mutationOptions({
      onSuccess: async () => {
        await refetchRencanaKerjaPembangunans()
        await refetchRencanaKerjaPembangunansCount()
        toast({
          description: "Berhasil menghapus Rencana Kerja Pembangunan",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus Rencana Kerja Pembangunan")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!rencanaKerjaPembangunansCount) return 0
    return Math.ceil(rencanaKerjaPembangunansCount / pagination.pageSize)
  }, [rencanaKerjaPembangunansCount, pagination.pageSize])

  const data = React.useMemo(() => {
    return (rawData ?? []) as SelectRencanaKerjaPembangunan[]
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
          D1. Buku Rencana Kerja Pembangunan
        </h1>
        <Button asChild>
          <Link href="/buku-d1/tambah">Tambah</Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectRencanaKerjaPembangunan>
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
              editUrl={`/buku-d1/edit/${item.id}`}
              description={item.namaKegiatan}
            />
          )}
        />
      </div>
    </div>
  )
}
