"use client"

import * as React from "react"
import Link from "next/link"
import type { SelectSuratKeteranganKematian } from "@pintudesa/db/schema"
import { Button } from "@pintudesa/ui"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"

import { ControlledTable } from "@/components/controlled-table"
import ShowOptions from "@/components/show-options"
import PrintPreview from "@/components/print/print-preview"
import { useToast } from "@/components/toast-provider"
import { tableColumnRegistry } from "@/lib/data/surat/table-column-registry"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function SuratKeteranganKematianContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [printItem, setPrintItem] = React.useState<any>(null)
  const columns = React.useMemo(
    () =>
      tableColumnRegistry.suratKeteranganKematian as ColumnDef<SelectSuratKeteranganKematian>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const {
    data: suratKeteranganKematiansCount,
    refetch: refetchSuratKeteranganKematiansCount,
  } = useQuery(trpc.suratKeteranganKematian.count.queryOptions())

  const {
    data: rawData,
    isLoading,
    refetch: refetchSuratKeteranganKematians,
  } = useQuery(
    trpc.suratKeteranganKematian.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.suratKeteranganKematian.delete.mutationOptions({
      onSuccess: async () => {
        await refetchSuratKeteranganKematians()
        await refetchSuratKeteranganKematiansCount()
        toast({
          description: "Berhasil menghapus surat keterangan keramaian",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus surat keterangan keramaian")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!suratKeteranganKematiansCount) return 0
    return Math.ceil(suratKeteranganKematiansCount / pagination.pageSize)
  }, [suratKeteranganKematiansCount, pagination.pageSize])

  const data = React.useMemo(() => {
    return (rawData ?? []) as SelectSuratKeteranganKematian[]
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
        <h1 className="text-lg font-bold">Surat Keterangan Kematian</h1>
        <Button asChild>
          <Link href="/surat/surat-keterangan-kematian/tambah">Tambah</Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectSuratKeteranganKematian>
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
              editUrl={`/surat/surat-keterangan-kematian/edit/${item.id}`}
              description={item.nik}
            />
          )}
        />
      
      {printItem && (
        <PrintPreview
          suratType="surat-keterangan-kematian"
          suratData={printItem}
          open={!!printItem}
          onOpenChange={(open) => !open && setPrintItem(null)}
        />
      )}
      </div>
    </div>
  )
}
