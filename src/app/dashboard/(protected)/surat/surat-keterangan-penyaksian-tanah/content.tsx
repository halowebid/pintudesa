"use client"

import * as React from "react"
import Link from "next/link"
import type { SelectSuratKeteranganPenyaksianTanah } from "@/lib/db/schema"
import { Button } from "@/lib/ui"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"

import { ControlledTable } from "@/components/dashboard/controlled-table"
import PrintPreview from "@/components/dashboard/print/print-preview"
import ShowOptions from "@/components/dashboard/show-options"
import { useToast } from "@/components/toast-provider"
import { tableColumnRegistry } from "@/lib/data/surat/table-column-registry"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function SuratKeteranganPenyaksianTanahContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [printItem, setPrintItem] =
    React.useState<SelectSuratKeteranganPenyaksianTanah | null>(null)
  const columns = React.useMemo(
    () =>
      tableColumnRegistry.suratKeteranganPenyaksianTanah as ColumnDef<SelectSuratKeteranganPenyaksianTanah>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const {
    data: suratKeteranganPenyaksianTanahsCount,
    refetch: refetchSuratKeteranganPenyaksianTanahsCount,
  } = useQuery(trpc.suratKeteranganPenyaksianTanah.count.queryOptions())

  const {
    data: rawData,
    isLoading,
    refetch: refetchSuratKeteranganPenyaksianTanahs,
  } = useQuery(
    trpc.suratKeteranganPenyaksianTanah.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.suratKeteranganPenyaksianTanah.delete.mutationOptions({
      onSuccess: async () => {
        await refetchSuratKeteranganPenyaksianTanahs()
        await refetchSuratKeteranganPenyaksianTanahsCount()
        toast({
          description: "Berhasil menghapus surat keterangan penyaksian tanah",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus surat keterangan penyaksian tanah")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!suratKeteranganPenyaksianTanahsCount) return 0
    return Math.ceil(suratKeteranganPenyaksianTanahsCount / pagination.pageSize)
  }, [suratKeteranganPenyaksianTanahsCount, pagination.pageSize])

  const data = React.useMemo(() => {
    return (rawData ?? []) as SelectSuratKeteranganPenyaksianTanah[]
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
        <h1 className="text-lg font-bold">Surat Keterangan Penyaksian Tanah</h1>
        <Button asChild>
          <Link href="/surat/surat-keterangan-penyaksian-tanah/tambah">
            Tambah
          </Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectSuratKeteranganPenyaksianTanah>
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
              editUrl={`/surat/surat-keterangan-penyaksian-tanah/edit/${item.id}`}
              description={item.pemohonNIK}
            />
          )}
        />

        {printItem && (
          <PrintPreview
            suratType="surat-keterangan-penyaksian-tanah"
            suratData={printItem}
            open={!!printItem}
            onOpenChange={(open) => !open && setPrintItem(null)}
          />
        )}
      </div>
    </div>
  )
}
