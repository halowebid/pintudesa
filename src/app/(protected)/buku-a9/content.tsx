"use client"

import * as React from "react"
import Link from "next/link"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"

import ShowOptions from "@/components/show-options"
import { useToast } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"
import { ControlledTable } from "@/components/ui/controlled-table"
import { tableColumnRegistry } from "@/lib/data/table-column-registry"
import { tableDataMapperRegistry } from "@/lib/data/table-data-mapper"
import type { SelectLembaran } from "@/lib/db/schema/lembaran"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function LembaranContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const columns = React.useMemo(
    () => tableColumnRegistry.lembaran as ColumnDef<SelectLembaran>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const { data: lembaransCount, refetch: refetchLembaransCount } = useQuery(
    trpc.lembaran.count.queryOptions(),
  )

  const {
    data: rawData,
    isLoading,
    refetch: refetchLembarans,
  } = useQuery(
    trpc.lembaran.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.lembaran.delete.mutationOptions({
      onSuccess: async () => {
        await refetchLembarans()
        await refetchLembaransCount()
        toast({
          description: "Berhasil menghapus lembaran",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus lembaran")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!lembaransCount) return 0
    return Math.ceil(lembaransCount / pagination.pageSize)
  }, [lembaransCount, pagination.pageSize])

  const mapFn = tableDataMapperRegistry.lembaran
  const data = React.useMemo(() => {
    return (
      typeof mapFn === "function" ? mapFn(rawData ?? []) : (rawData ?? [])
    ) as SelectLembaran[]
  }, [mapFn, rawData])

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
        <h1 className="text-lg font-bold">
          A9. Buku Lembaran dan Buku Berita Desa
        </h1>
        <Button asChild>
          <Link href="/buku-a9/tambah">Tambah</Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectLembaran>
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
              editUrl={`/buku-a9/edit/${item.id}`}
              description={item.keterangan}
            />
          )}
        />
      </div>
    </div>
  )
}
