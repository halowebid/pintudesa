"use client"

import * as React from "react"
import Link from "next/link"
import type { SelectSuratKuasaSKGR } from "@pintudesa/db/schema"
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

export default function SuratKuasaSKGRContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [printItem, setPrintItem] = React.useState<any>(null)
  const columns = React.useMemo(
    () =>
      tableColumnRegistry.suratKuasaSKGR as ColumnDef<SelectSuratKuasaSKGR>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const { data: suratKuasaSKGRsCount, refetch: refetchSuratKuasaSKGRsCount } =
    useQuery(trpc.suratKuasaSKGR.count.queryOptions())

  const {
    data: rawData,
    isLoading,
    refetch: refetchSuratKuasaSKGRs,
  } = useQuery(
    trpc.suratKuasaSKGR.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.suratKuasaSKGR.delete.mutationOptions({
      onSuccess: async () => {
        await refetchSuratKuasaSKGRs()
        await refetchSuratKuasaSKGRsCount()
        toast({
          description: "Berhasil menghapus surat kuasa SKGR",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus surat kuasa SKGR")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!suratKuasaSKGRsCount) return 0
    return Math.ceil(suratKuasaSKGRsCount / pagination.pageSize)
  }, [suratKuasaSKGRsCount, pagination.pageSize])

  const data = React.useMemo(() => {
    return (rawData ?? []) as SelectSuratKuasaSKGR[]
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
        <h1 className="text-lg font-bold">Surat Kuasa SKGR</h1>
        <Button asChild>
          <Link href="/surat/surat-kuasa-skgr/tambah">Tambah</Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectSuratKuasaSKGR>
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
              editUrl={`/surat/surat-kuasa-skgr/edit/${item.id}`}
              description={item.yangDiberiKuasaNama}
            />
          )}
        />

        {printItem && (
          <PrintPreview
            suratType="surat-kuasa-skgr"
            suratData={printItem}
            open={!!printItem}
            onOpenChange={(open) => !open && setPrintItem(null)}
          />
        )}
      </div>
    </div>
  )
}
