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
import type { SelectSuratKeteranganKelahiran } from "@/lib/db/schema"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function SuratKeteranganKelahiranContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [printItem, setPrintItem] =
    React.useState<SelectSuratKeteranganKelahiran | null>(null)
  const columns = React.useMemo(
    () =>
      tableColumnRegistry.suratKeteranganKelahiran as ColumnDef<SelectSuratKeteranganKelahiran>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const {
    data: suratKeteranganKelahiransCount,
    refetch: refetchSuratKeteranganKelahiransCount,
  } = useQuery(trpc.suratKeteranganKelahiran.count.queryOptions())

  const {
    data: rawData,
    isLoading,
    refetch: refetchSuratKeteranganKelahirans,
  } = useQuery(
    trpc.suratKeteranganKelahiran.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.suratKeteranganKelahiran.delete.mutationOptions({
      onSuccess: async () => {
        await refetchSuratKeteranganKelahirans()
        await refetchSuratKeteranganKelahiransCount()
        toast({
          description: "Berhasil menghapus surat keterangan kelahiran",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus surat keterangan kelahiran")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!suratKeteranganKelahiransCount) return 0
    return Math.ceil(suratKeteranganKelahiransCount / pagination.pageSize)
  }, [suratKeteranganKelahiransCount, pagination.pageSize])

  const data = React.useMemo(() => {
    return (rawData ?? []) as SelectSuratKeteranganKelahiran[]
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
        <h1 className="text-lg font-bold">Surat Keterangan Kelahiran</h1>
        <Button asChild>
          <Link href="/dashboard/surat/surat-keterangan-kelahiran/tambah">
            Tambah
          </Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectSuratKeteranganKelahiran>
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
              editUrl={`/dashboard/surat/surat-keterangan-kelahiran/edit/${item.id}`}
              description={item.namaAnak}
            />
          )}
        />

        {printItem && (
          <PrintPreview
            suratType="surat-keterangan-kelahiran"
            suratData={printItem}
            open={!!printItem}
            onOpenChange={(open) => !open && setPrintItem(null)}
          />
        )}
      </div>
    </div>
  )
}
