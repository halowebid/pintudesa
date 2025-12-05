"use client"

import * as React from "react"
import Link from "next/link"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"

import PrintPreview from "@/components/features/print/print-preview"
import { useToast } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"
import { ControlledTable } from "@/components/ui/controlled-table"
import ShowOptions from "@/components/ui/show-options"
import { tableColumnRegistry } from "@/lib/data/surat/table-column-registry"
import type { SelectSuratKeteranganKepemilikanRumah } from "@/lib/db/schema"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function SuratKeteranganKepemilikanRumahContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [printItem, setPrintItem] =
    React.useState<SelectSuratKeteranganKepemilikanRumah | null>(null)
  const columns = React.useMemo(
    () =>
      tableColumnRegistry.suratKeteranganKepemilikanRumah as ColumnDef<SelectSuratKeteranganKepemilikanRumah>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const {
    data: suratKeteranganKepemilikanRumahsCount,
    refetch: refetchSuratKeteranganKepemilikanRumahsCount,
  } = useQuery(trpc.suratKeteranganKepemilikanRumah.count.queryOptions())

  const {
    data: rawData,
    isLoading,
    refetch: refetchSuratKeteranganKepemilikanRumahs,
  } = useQuery(
    trpc.suratKeteranganKepemilikanRumah.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.suratKeteranganKepemilikanRumah.delete.mutationOptions({
      onSuccess: async () => {
        await refetchSuratKeteranganKepemilikanRumahs()
        await refetchSuratKeteranganKepemilikanRumahsCount()
        toast({
          description: "Berhasil menghapus surat keterangan kepemilikan rumah",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus surat keterangan kepemilikan rumah")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!suratKeteranganKepemilikanRumahsCount) return 0
    return Math.ceil(
      suratKeteranganKepemilikanRumahsCount / pagination.pageSize,
    )
  }, [suratKeteranganKepemilikanRumahsCount, pagination.pageSize])

  const data = React.useMemo(() => {
    return (rawData ?? []) as SelectSuratKeteranganKepemilikanRumah[]
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
          Surat Keterangan Kepemilikan Rumah
        </h1>
        <Button asChild>
          <Link href="/dashboard/surat/surat-keterangan-kepemilikan-rumah/tambah">
            Tambah
          </Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectSuratKeteranganKepemilikanRumah>
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
              editUrl={`/dashboard/surat/surat-keterangan-kepemilikan-rumah/edit/${item.id}`}
              description={item.pemohonNIK}
            />
          )}
        />

        {printItem && (
          <PrintPreview
            suratType="surat-keterangan-kepemilikan-rumah"
            suratData={printItem}
            open={!!printItem}
            onOpenChange={(open) => !open && setPrintItem(null)}
          />
        )}
      </div>
    </div>
  )
}
