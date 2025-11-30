"use client"

import * as React from "react"
import Link from "next/link"
import type { SelectSuratKeteranganPenghasilanOrangTua } from "@pintudesa/db/schema"
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

export default function SuratKeteranganPenghasilanOrangTuaContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [printItem, setPrintItem] = React.useState<any>(null)
  const columns = React.useMemo(
    () =>
      tableColumnRegistry.suratKeteranganPenghasilanOrangTua as ColumnDef<SelectSuratKeteranganPenghasilanOrangTua>[],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const {
    data: suratKeteranganPenghasilanOrangTuasCount,
    refetch: refetchSuratKeteranganPenghasilanOrangTuasCount,
  } = useQuery(trpc.suratKeteranganPnghasilanOrangTua.count.queryOptions())

  const {
    data: rawData,
    isLoading,
    refetch: refetchSuratKeteranganPenghasilanOrangTuas,
  } = useQuery(
    trpc.suratKeteranganPnghasilanOrangTua.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.suratKeteranganPnghasilanOrangTua.delete.mutationOptions({
      onSuccess: async () => {
        await refetchSuratKeteranganPenghasilanOrangTuas()
        await refetchSuratKeteranganPenghasilanOrangTuasCount()
        toast({
          description:
            "Berhasil menghapus surat keterangan penghasilan orang tua",
        })
      },
      onError: (error) => {
        handleError(
          error,
          "Gagal menghapus surat keterangan penghasilan orang tua",
        )
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!suratKeteranganPenghasilanOrangTuasCount) return 0
    return Math.ceil(
      suratKeteranganPenghasilanOrangTuasCount / pagination.pageSize,
    )
  }, [suratKeteranganPenghasilanOrangTuasCount, pagination.pageSize])

  const data = React.useMemo(() => {
    return (rawData ?? []) as SelectSuratKeteranganPenghasilanOrangTua[]
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
        <h1 className="text-lg font-bold">
          Surat Keterangan Penghasilan Orang Tua
        </h1>
        <Button asChild>
          <Link href="/surat/surat-keterangan-penghasilan-orang-tua/tambah">
            Tambah
          </Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SelectSuratKeteranganPenghasilanOrangTua>
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
              editUrl={`/surat/surat-keterangan-penghasilan-orang-tua/edit/${item.id}`}
              description={item.pemohonNIK}
            />
          )}
        />

        {printItem && (
          <PrintPreview
            suratType="surat-keterangan-penghasilan-orang-tua"
            suratData={printItem}
            open={!!printItem}
            onOpenChange={(open) => !open && setPrintItem(null)}
          />
        )}
      </div>
    </div>
  )
}
