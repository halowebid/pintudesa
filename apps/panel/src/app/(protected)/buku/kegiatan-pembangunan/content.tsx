"use client"

import * as React from "react"
import Link from "next/link"
import type { SelectKegiatanPembangunan } from "@pintudesa/db/schema"
import { Button } from "@pintudesa/ui"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"

import { ControlledTable } from "@/components/controlled-table"
import ShowOptions from "@/components/show-options"
import { useToast } from "@/components/toast-provider"
import { tableColumnRegistry } from "@/lib/data/admintrasi-pembangunan/table-column-registry"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function KegiatanPembangunanContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const columns = React.useMemo(
    () =>
      tableColumnRegistry.kegiatanPembangunan as ColumnDef<SelectKegiatanPembangunan>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const {
    data: kegiatanPembangunansCount,
    refetch: refetchKegiatanPembangunansCount,
  } = useQuery(trpc.kegiatanPembangunan.count.queryOptions())

  const {
    data: rawData,
    isLoading,
    refetch: refetchKegiatanPembangunans,
  } = useQuery(
    trpc.kegiatanPembangunan.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.kegiatanPembangunan.delete.mutationOptions({
      onSuccess: async () => {
        await refetchKegiatanPembangunans()
        await refetchKegiatanPembangunansCount()
        toast({
          description: "Berhasil menghapus Kegiatan Pembangunan",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus Kegiatan Pembangunan")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!kegiatanPembangunansCount) return 0
    return Math.ceil(kegiatanPembangunansCount / pagination.pageSize)
  }, [kegiatanPembangunansCount, pagination.pageSize])

  const data = React.useMemo(() => {
    return (rawData ?? []) as SelectKegiatanPembangunan[]
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
        <h1 className="text-lg font-bold">D2. Buku Kegiatan Pembangunan</h1>
        <Button asChild>
          <Link href="/buku-d2/tambah">Tambah</Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectKegiatanPembangunan>
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
              editUrl={`/buku-d2/edit/${item.id}`}
              description={item.namaKegiatan}
            />
          )}
        />
      </div>
    </div>
  )
}
