"use client"

import * as React from "react"
import Link from "next/link"
import type { SelectAgenda } from "@/lib/db/schema"
import { Button } from "@/lib/ui"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"

import { ControlledTable } from "@/components/dashboard/controlled-table"
import ShowOptions from "@/components/dashboard/show-options"
import { useToast } from "@/components/toast-provider"
import { tableColumnRegistry } from "@/lib/data/adminstrasi-umum/table-column-registry"
import { tableDataMapperRegistry } from "@/lib/data/adminstrasi-umum/table-data-mapper"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function AgendaContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const columns = React.useMemo(
    () => tableColumnRegistry.agenda as ColumnDef<SelectAgenda>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const { data: agendasCount, refetch: refetchAgendasCount } = useQuery(
    trpc.agenda.count.queryOptions(),
  )

  const {
    data: rawData,
    isLoading,
    refetch: refetchAgendas,
  } = useQuery(
    trpc.agenda.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.agenda.delete.mutationOptions({
      onSuccess: async () => {
        await refetchAgendas()
        await refetchAgendasCount()
        toast({
          description: "Berhasil menghapus agenda",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus agenda")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!agendasCount) return 0
    return Math.ceil(agendasCount / pagination.pageSize)
  }, [agendasCount, pagination.pageSize])

  const mapFn = tableDataMapperRegistry.agenda
  const data = React.useMemo(() => {
    return (
      typeof mapFn === "function" ? mapFn(rawData ?? []) : (rawData ?? [])
    ) as SelectAgenda[]
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
        <h1 className="text-lg font-bold">A7. Buku Agenda</h1>
        <Button asChild>
          <Link href="/buku/agenda/tambah">Tambah</Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectAgenda>
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
              editUrl={`/buku/agenda/edit/${item.id}`}
              description={item.uraian}
            />
          )}
        />
      </div>
    </div>
  )
}
