"use client"

import * as React from "react"
import Link from "next/link"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"

import { ControlledTable } from "@/components/dashboard/controlled-table"
import PrintPreview from "@/components/dashboard/print/print-preview"
import ShowOptions from "@/components/dashboard/show-options"
import { useToast } from "@/components/toast-provider"
import { tableColumnRegistry } from "@/lib/data/surat/table-column-registry"
import type { SelectSuratIzinKeramaian } from "@/lib/db/schema"
import { useTRPC } from "@/lib/trpc/client"
import { Button } from "@/lib/ui"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function SuratIzinKeramaianContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [printItem, setPrintItem] =
    React.useState<SelectSuratIzinKeramaian | null>(null)
  const columns = React.useMemo(
    () =>
      tableColumnRegistry.suratIzinKeramaian as ColumnDef<SelectSuratIzinKeramaian>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const {
    data: suratIzinKeramaiansCount,
    refetch: refetchSuratIzinKeramaiansCount,
  } = useQuery(trpc.suratIzinKeramaian.count.queryOptions())

  const {
    data: rawData,
    isLoading,
    refetch: refetchSuratIzinKeramaians,
  } = useQuery(
    trpc.suratIzinKeramaian.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.suratIzinKeramaian.delete.mutationOptions({
      onSuccess: async () => {
        await refetchSuratIzinKeramaians()
        await refetchSuratIzinKeramaiansCount()
        toast({
          description: "Berhasil menghapus surat izin keramaian",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus surat izin keramaian")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!suratIzinKeramaiansCount) return 0
    return Math.ceil(suratIzinKeramaiansCount / pagination.pageSize)
  }, [suratIzinKeramaiansCount, pagination.pageSize])

  const data = React.useMemo(() => {
    return (rawData ?? []) as SelectSuratIzinKeramaian[]
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
        <h1 className="text-lg font-bold">Surat Izin Keramaian</h1>
        <Button asChild>
          <Link href="/dashboard/surat/surat-izin-keramaian/tambah">
            Tambah
          </Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectSuratIzinKeramaian>
          data={data}
          setPagination={setPagination}
          pagination={pagination}
          totalPages={lastPage}
          columns={columns}
          isLoading={isLoading}
          showActions
          renderAction={(item) => (
            <ShowOptions
              onPrint={() => setPrintItem(item)}
              onDelete={() => deleteItem(item.id)}
              editUrl={`/dashboard/surat/surat-izin-keramaian/edit/${item.id}`}
              description={item.pemohonNIK}
            />
          )}
        />

        {printItem && (
          <PrintPreview
            suratType="surat-izin-keramaian"
            suratData={printItem}
            open={!!printItem}
            onOpenChange={(open) => !open && setPrintItem(null)}
          />
        )}
      </div>
    </div>
  )
}
