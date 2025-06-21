"use client"

import * as React from "react"
import Link from "next/link"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"

import ShowOptions from "@/components/show-options"
import { useToast } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"
import { ControlledTable } from "@/components/ui/controlled-table"
import { tableColumnRegistry } from "@/lib/data/adminstrasi-umum/table-column-registry"
import type { SelectRAB } from "@/lib/db/schema/rab"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function RABContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const columns = React.useMemo(
    () => tableColumnRegistry.rab as ColumnDef<SelectRAB>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const { data: RABsCount, refetch: refetchRABsCount } = useQuery(
    trpc.rab.count.queryOptions(),
  )

  const {
    data: rawData,
    isLoading,
    refetch: refetchRABs,
  } = useQuery(
    trpc.rab.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.rab.delete.mutationOptions({
      onSuccess: async () => {
        await refetchRABs()
        await refetchRABsCount()
        toast({
          description: "Berhasil menghapus rencana anggaran biaya",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus rencana anggaran biaya")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!RABsCount) return 0
    return Math.ceil(RABsCount / pagination.pageSize)
  }, [RABsCount, pagination.pageSize])

  const data = React.useMemo(() => {
    return (rawData ?? []) as SelectRAB[]
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
        <h1 className="text-lg font-bold">C2. Buku RAB</h1>
        <Button asChild>
          <Link href="/buku-c2/tambah">Tambah</Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectRAB>
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
              editUrl={`/buku-c2/edit/${item.id}`}
              description={item.kegiatan}
            />
          )}
        />
      </div>
    </div>
  )
}
