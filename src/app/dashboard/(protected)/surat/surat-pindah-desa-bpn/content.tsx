"use client"

import * as React from "react"
import Link from "next/link"
import type { SelectSuratPindahDesaBpn } from "@/lib/db/schema"
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

export default function SuratPindahDesaBpnContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [printItem, setPrintItem] =
    React.useState<SelectSuratPindahDesaBpn | null>(null)
  const columns = React.useMemo(
    () =>
      tableColumnRegistry.suratPindahDesaBpn as ColumnDef<SelectSuratPindahDesaBpn>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const {
    data: suratPindahDesaBpnsCount,
    refetch: refetchSuratPindahDesaBpnsCount,
  } = useQuery(trpc.suratPindahDesaBpn.count.queryOptions())

  const {
    data: rawData,
    isLoading,
    refetch: refetchSuratPindahDesaBpns,
  } = useQuery(
    trpc.suratPindahDesaBpn.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.suratPindahDesaBpn.delete.mutationOptions({
      onSuccess: async () => {
        await refetchSuratPindahDesaBpns()
        await refetchSuratPindahDesaBpnsCount()
        toast({
          description: "Berhasil menghapus surat pindah desa BPN",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus surat pindah desa BPN")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!suratPindahDesaBpnsCount) return 0
    return Math.ceil(suratPindahDesaBpnsCount / pagination.pageSize)
  }, [suratPindahDesaBpnsCount, pagination.pageSize])

  const data = React.useMemo(() => {
    return (rawData ?? []) as SelectSuratPindahDesaBpn[]
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
        <h1 className="text-lg font-bold">Surat Pindah Desa BPN</h1>
        <Button asChild>
          <Link href="/surat/surat-pindah-desa-bpn/tambah">Tambah</Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectSuratPindahDesaBpn>
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
              editUrl={`/surat/surat-pindah-desa-bpn/edit/${item.id}`}
              description={item.pemohonNIK}
            />
          )}
        />

        {printItem && (
          <PrintPreview
            suratType="surat-pindah-desa-bpn"
            suratData={printItem}
            open={!!printItem}
            onOpenChange={(open) => !open && setPrintItem(null)}
          />
        )}
      </div>
    </div>
  )
}
