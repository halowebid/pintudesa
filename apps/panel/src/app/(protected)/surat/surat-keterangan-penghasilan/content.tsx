"use client"

import * as React from "react"
import Link from "next/link"
import type { SelectSuratKeteranganPenghasilan } from "@pintudesa/db/schema"
import { Button } from "@pintudesa/ui"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"

import { ControlledTable } from "@/components/controlled-table"
import PrintPreview from "@/components/print/print-preview"
import ShowOptions from "@/components/show-options"
import { useToast } from "@/components/toast-provider"
import { tableColumnRegistry } from "@/lib/data/surat/table-column-registry"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function SuratKeteranganPenghasilanContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [printItem, setPrintItem] =
    React.useState<SelectSuratKeteranganPenghasilan | null>(null)
  const columns = React.useMemo(
    () =>
      tableColumnRegistry.suratKeteranganPenghasilan as ColumnDef<SelectSuratKeteranganPenghasilan>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const {
    data: suratKeteranganPenghasilansCount,
    refetch: refetchSuratKeteranganPenghasilansCount,
  } = useQuery(trpc.suratKeteranganPenghasilan.count.queryOptions())

  const {
    data: rawData,
    isLoading,
    refetch: refetchSuratKeteranganPenghasilans,
  } = useQuery(
    trpc.suratKeteranganPenghasilan.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.suratKeteranganPenghasilan.delete.mutationOptions({
      onSuccess: async () => {
        await refetchSuratKeteranganPenghasilans()
        await refetchSuratKeteranganPenghasilansCount()
        toast({
          description: "Berhasil menghapus surat keterangan penghasilan",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus surat keterangan penghasilan")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!suratKeteranganPenghasilansCount) return 0
    return Math.ceil(suratKeteranganPenghasilansCount / pagination.pageSize)
  }, [suratKeteranganPenghasilansCount, pagination.pageSize])

  const data = React.useMemo(() => {
    return (rawData ?? []) as SelectSuratKeteranganPenghasilan[]
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
        <h1 className="text-lg font-bold">Surat Keterangan Penghasilan</h1>
        <Button asChild>
          <Link href="/surat/surat-keterangan-penghasilan/tambah">Tambah</Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectSuratKeteranganPenghasilan>
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
              editUrl={`/surat/surat-keterangan-penghasilan/edit/${item.id}`}
              description={item.pemohonNIK}
            />
          )}
        />

        {printItem && (
          <PrintPreview
            suratType="surat-keterangan-penghasilan"
            suratData={printItem}
            open={!!printItem}
            onOpenChange={(open) => !open && setPrintItem(null)}
          />
        )}
      </div>
    </div>
  )
}
