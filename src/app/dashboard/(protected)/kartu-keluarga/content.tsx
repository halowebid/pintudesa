"use client"

import * as React from "react"
import Link from "next/link"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"

import { ControlledTable } from "@/components/dashboard/controlled-table"
import ShowOptions from "@/components/dashboard/show-options"
import { useToast } from "@/components/toast-provider"
import { tableColumnRegistry } from "@/lib/data/kependudukan/table-column-registry"
import type { SelectKartuKeluarga } from "@/lib/db/schema"
import { useTRPC } from "@/lib/trpc/client"
import { Button } from "@/lib/ui"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function KartuKeluargaContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const columns = React.useMemo(
    () => tableColumnRegistry.kartuKeluarga as ColumnDef<SelectKartuKeluarga>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const { data: kartuKeluargasCount, refetch: refetchKartuKeluargasCount } =
    useQuery(trpc.kartuKeluarga.count.queryOptions())

  const {
    data: rawData,
    isLoading,
    refetch: refetchKartuKeluargas,
  } = useQuery(
    trpc.kartuKeluarga.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.kartuKeluarga.delete.mutationOptions({
      onSuccess: async () => {
        await refetchKartuKeluargas()
        await refetchKartuKeluargasCount()
        toast({
          description: "Berhasil menghapus kartuKeluarga",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus kartuKeluarga")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!kartuKeluargasCount) return 0
    return Math.ceil(kartuKeluargasCount / pagination.pageSize)
  }, [kartuKeluargasCount, pagination.pageSize])

  const data = React.useMemo(() => {
    return (rawData ?? []) as SelectKartuKeluarga[]
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
        <h1 className="text-lg font-bold">Kartu Keluarga</h1>
        <Button asChild>
          <Link href="/dashboard/kartu-keluarga/tambah">Tambah</Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectKartuKeluarga>
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
              editUrl={`/dashboard/kartu-keluarga/edit/${item.id}`}
              seperateUrl={`/dashboard/kartu-keluarga/pisah/${item.id}`}
              description={item.nomorKartuKeluarga}
            />
          )}
        />
      </div>
    </div>
  )
}
