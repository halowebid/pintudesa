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
import type { SelectSuratPernyataanBelumMenikah } from "@/lib/db/schema"
import { useTRPC } from "@/lib/trpc/client"
import { Button } from "@/lib/ui"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function SuratPernyataanBelumMenikahContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [printItem, setPrintItem] =
    React.useState<SelectSuratPernyataanBelumMenikah | null>(null)
  const columns = React.useMemo(
    () =>
      tableColumnRegistry.suratPernyataanBelumMenikah as ColumnDef<SelectSuratPernyataanBelumMenikah>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const {
    data: suratPernyataanBelumMenikahsCount,
    refetch: refetchSuratPernyataanBelumMenikahsCount,
  } = useQuery(trpc.suratPernyataanBelumMenikah.count.queryOptions())

  const {
    data: rawData,
    isLoading,
    refetch: refetchSuratPernyataanBelumMenikahs,
  } = useQuery(
    trpc.suratPernyataanBelumMenikah.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.suratPernyataanBelumMenikah.delete.mutationOptions({
      onSuccess: async () => {
        await refetchSuratPernyataanBelumMenikahs()
        await refetchSuratPernyataanBelumMenikahsCount()
        toast({
          description: "Berhasil menghapus surat pernyataan belum menikah",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus surat pernyataan belum menikah")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!suratPernyataanBelumMenikahsCount) return 0
    return Math.ceil(suratPernyataanBelumMenikahsCount / pagination.pageSize)
  }, [suratPernyataanBelumMenikahsCount, pagination.pageSize])

  const data = React.useMemo(() => {
    return (rawData ?? []) as SelectSuratPernyataanBelumMenikah[]
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
        <h1 className="text-lg font-bold">Surat Pernyataan Belum Menikah</h1>
        <Button asChild>
          <Link href="/dashboard/surat/surat-pernyataan-belum-menikah/tambah">
            Tambah
          </Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectSuratPernyataanBelumMenikah>
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
              editUrl={`/dashboard/surat/surat-pernyataan-belum-menikah/edit/${item.id}`}
              description={item.pemohonNIK}
            />
          )}
        />

        {printItem && (
          <PrintPreview
            suratType="surat-pernyataan-belum-menikah"
            suratData={printItem}
            open={!!printItem}
            onOpenChange={(open) => !open && setPrintItem(null)}
          />
        )}
      </div>
    </div>
  )
}
