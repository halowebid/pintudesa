"use client"

import * as React from "react"
import Link from "next/link"
import type { SelectKaderPemberdayaanMasyarakat } from "@pintudesa/db/schema"
import { Button } from "@pintudesa/ui"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"

import { ControlledTable } from "@/components/controlled-table"
import ShowOptions from "@/components/show-options"
import { useToast } from "@/components/toast-provider"
import { tableColumnRegistry } from "@/lib/data/admintrasi-pembangunan/table-column-registry"
import { tableDataMapperRegistry } from "@/lib/data/admintrasi-pembangunan/table-data-mapper"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function KaderPemberdayaanMasyarakatContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const columns = React.useMemo(
    () =>
      tableColumnRegistry.kaderPemberdayaanMasyarakat as ColumnDef<SelectKaderPemberdayaanMasyarakat>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const {
    data: kaderPemberdayaanMasyarakatsCount,
    refetch: refetchKaderPemberdayaanMasyarakatsCount,
  } = useQuery(trpc.kaderPemberdayaanMasyarakat.count.queryOptions())

  const {
    data: rawData,
    isLoading,
    refetch: refetchKaderPemberdayaanMasyarakats,
  } = useQuery(
    trpc.kaderPemberdayaanMasyarakat.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.kaderPemberdayaanMasyarakat.delete.mutationOptions({
      onSuccess: async () => {
        await refetchKaderPemberdayaanMasyarakats()
        await refetchKaderPemberdayaanMasyarakatsCount()
        toast({
          description: "Berhasil menghapus kader pemberdayaan masyarakat",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus kader pemberdayaan masyarakat")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!kaderPemberdayaanMasyarakatsCount) return 0
    return Math.ceil(kaderPemberdayaanMasyarakatsCount / pagination.pageSize)
  }, [kaderPemberdayaanMasyarakatsCount, pagination.pageSize])

  const mapFn = tableDataMapperRegistry.kaderPemberdayaanMasyarakat
  const data = React.useMemo(() => {
    return (
      typeof mapFn === "function" ? mapFn(rawData ?? []) : (rawData ?? [])
    ) as SelectKaderPemberdayaanMasyarakat[]
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
          D4. Buku Kader Pemberdayaan Masyarakat
        </h1>
        <Button asChild>
          <Link href="/buku-d4/tambah">Tambah</Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectKaderPemberdayaanMasyarakat>
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
              editUrl={`/buku-d4/edit/${item.id}`}
              description={item.nama}
            />
          )}
        />
      </div>
    </div>
  )
}
