"use client"

import * as React from "react"
import Link from "next/link"
import type { SelectSuratKeteranganDomisili } from "@pintudesa/db/schema"
import { Button } from "@pintudesa/ui"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"

import { ControlledTable } from "@/components/controlled-table"
import ShowOptions from "@/components/show-options"
import { useToast } from "@/components/toast-provider"
import { tableColumnRegistry } from "@/lib/data/surat/table-column-registry"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function SuratKeteranganDomisiliContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const columns = React.useMemo(
    () =>
      tableColumnRegistry.suratKeteranganDomisili as ColumnDef<SelectSuratKeteranganDomisili>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const {
    data: suratKeteranganDomisilisCount,
    refetch: refetchSuratKeteranganDomisilisCount,
  } = useQuery(trpc.suratKeteranganDomisili.count.queryOptions())

  const {
    data: rawData,
    isLoading,
    refetch: refetchSuratKeteranganDomisilis,
  } = useQuery(
    trpc.suratKeteranganDomisili.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.suratKeteranganDomisili.delete.mutationOptions({
      onSuccess: async () => {
        await refetchSuratKeteranganDomisilis()
        await refetchSuratKeteranganDomisilisCount()
        toast({
          description: "Berhasil menghapus surat keterangan domisili",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus surat keterangan domisili")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!suratKeteranganDomisilisCount) return 0
    return Math.ceil(suratKeteranganDomisilisCount / pagination.pageSize)
  }, [suratKeteranganDomisilisCount, pagination.pageSize])

  const data = React.useMemo(() => {
    return (rawData ?? []) as SelectSuratKeteranganDomisili[]
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
        <h1 className="text-lg font-bold">Surat Keterangan Domisili</h1>
        <Button asChild>
          <Link href="/surat/surat-keterangan-domisili/tambah">Tambah</Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectSuratKeteranganDomisili>
          data={data}
          setPagination={setPagination}
          pagination={pagination}
          totalPages={lastPage}
          columns={columns}
          isLoading={isLoading}
          showActions
          renderAction={(item) => (
            <ShowOptions
              onDelete={() => deleteItem(item.id)}
              editUrl={`/surat/surat-keterangan-domisili/edit/${item.id}`}
              description={item.pemohonNIK}
            />
          )}
        />
      </div>
    </div>
  )
}
