"use client"

import * as React from "react"
import Link from "next/link"
import type { SelectSuratKeteranganJalan } from "@pintudesa/db/schema"
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

export default function SuratKeteranganJalanContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [printItem, setPrintItem] = React.useState<any>(null)
  const columns = React.useMemo(
    () =>
      tableColumnRegistry.suratKeteranganJalan as ColumnDef<SelectSuratKeteranganJalan>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const {
    data: suratKeteranganJalansCount,
    refetch: refetchSuratKeteranganJalansCount,
  } = useQuery(trpc.suratKeteranganJalan.count.queryOptions())

  const {
    data: rawData,
    isLoading,
    refetch: refetchSuratKeteranganJalans,
  } = useQuery(
    trpc.suratKeteranganJalan.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.suratKeteranganJalan.delete.mutationOptions({
      onSuccess: async () => {
        await refetchSuratKeteranganJalans()
        await refetchSuratKeteranganJalansCount()
        toast({
          description: "Berhasil menghapus surat keterangan jalan",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus surat keterangan jalan")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!suratKeteranganJalansCount) return 0
    return Math.ceil(suratKeteranganJalansCount / pagination.pageSize)
  }, [suratKeteranganJalansCount, pagination.pageSize])

  const data = React.useMemo(() => {
    return (rawData ?? []) as SelectSuratKeteranganJalan[]
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
        <h1 className="text-lg font-bold">Surat Keterangan Jalan</h1>
        <Button asChild>
          <Link href="/surat/surat-keterangan-jalan/tambah">Tambah</Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectSuratKeteranganJalan>
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
              editUrl={`/surat/surat-keterangan-jalan/edit/${item.id}`}
              description={item.pemohonNIK}
            />
          )}
        />
      
      {printItem && (
        <PrintPreview
          suratType="surat-keterangan-jalan"
          suratData={printItem}
          open={!!printItem}
          onOpenChange={(open) => !open && setPrintItem(null)}
        />
      )}
      </div>
    </div>
  )
}
