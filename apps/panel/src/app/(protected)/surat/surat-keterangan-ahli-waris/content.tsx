"use client"

import * as React from "react"
import Link from "next/link"
import type { SelectSuratKuasaAhliWaris } from "@pintudesa/db/schema"
import { Button } from "@pintudesa/ui"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"

import { ControlledTable } from "@/components/controlled-table"
import ShowOptions from "@/components/show-options"
import { useToast } from "@/components/toast-provider"
import { tableColumnRegistry } from "@/lib/data/surat/table-column-registry"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function SuratKeteranganAhliWarisContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const columns = React.useMemo(
    () =>
      tableColumnRegistry.suratKuasaAhliWaris as ColumnDef<SelectSuratKuasaAhliWaris>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const {
    data: suratKuasaAhliWarissCount,
    refetch: refetchSuratKuasaAhliWarissCount,
  } = useQuery(trpc.suratKuasaAhliWaris.count.queryOptions())

  const {
    data: rawData,
    isLoading,
    refetch: refetchSuratKuasaAhliWariss,
  } = useQuery(
    trpc.suratKuasaAhliWaris.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.suratKuasaAhliWaris.delete.mutationOptions({
      onSuccess: async () => {
        await refetchSuratKuasaAhliWariss()
        await refetchSuratKuasaAhliWarissCount()
        toast({
          description: "Berhasil menghapus surat keterangan ahli waris",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus surat keterangan ahli waris")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!suratKuasaAhliWarissCount) return 0
    return Math.ceil(suratKuasaAhliWarissCount / pagination.pageSize)
  }, [suratKuasaAhliWarissCount, pagination.pageSize])

  const data = React.useMemo(() => {
    return (rawData ?? []) as SelectSuratKuasaAhliWaris[]
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
        <h1 className="text-lg font-bold">Surat Keterangan Ahli Waris</h1>
        <Button asChild>
          <Link href="/surat/surat-keterangan-ahli-waris/tambah">Tambah</Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectSuratKuasaAhliWaris>
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
              editUrl={`/surat/surat-keterangan-ahli-waris/edit/${item.id}`}
              description={item.pemohonNIK}
            />
          )}
        />
      </div>
    </div>
  )
}
