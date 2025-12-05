"use client"

import * as React from "react"
import Link from "next/link"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"

import { ControlledTable } from "@/components/dashboard/controlled-table"
import PrintPreview from "@/components/dashboard/print/print-preview"
import ShowOptions from "@/components/dashboard/show-options"
import { useToast } from "@/components/toast-provider"
import type { SelectSuratKeteranganBelumMemilikiRumah } from "@/lib/db/schema"
import { useTRPC } from "@/lib/trpc/client"
import { Button } from "@/lib/ui"
import { formatDate } from "@/lib/utils"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function SuratKeteranganBelumMemilikiRumahContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [printItem, setPrintItem] =
    React.useState<SelectSuratKeteranganBelumMemilikiRumah | null>(null)

  type SuratWithPemohon = SelectSuratKeteranganBelumMemilikiRumah & {
    pemohon?: { namaLengkap: string } | null
  }

  const columns = React.useMemo<ColumnDef<SuratWithPemohon>[]>(
    () => [
      {
        accessorKey: "pemohon",
        header: "Pemohon",
        cell: ({ row }) => {
          const pemohon = row.original.pemohon
          return pemohon?.namaLengkap ?? "-"
        },
      },
      {
        accessorKey: "tujuanPembuatan",
        header: "Tujuan Pembuatan",
      },
      {
        accessorKey: "tempatTinggalSekarang",
        header: "Tempat Tinggal Sekarang",
      },
      {
        accessorKey: "createdAt",
        header: "Tanggal Dibuat",
        cell: ({ row }) => {
          const date = row.original.createdAt
          return date ? formatDate(date, "D/M/YYYY") : "-"
        },
      },
    ],
    [],
  )

  const trpc = useTRPC()

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const {
    data: suratKeteranganBelumMemilikiRumahsCount,
    refetch: refetchSuratKeteranganBelumMemilikiRumahsCount,
  } = useQuery(trpc.suratKeteranganBelumMemilikiRumah.count.queryOptions())

  const {
    data: rawData,
    isLoading,
    refetch: refetchSuratKeteranganBelumMemilikiRumahs,
  } = useQuery(
    trpc.suratKeteranganBelumMemilikiRumah.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.suratKeteranganBelumMemilikiRumah.delete.mutationOptions({
      onSuccess: async () => {
        await refetchSuratKeteranganBelumMemilikiRumahs()
        await refetchSuratKeteranganBelumMemilikiRumahsCount()
        toast({
          description:
            "Berhasil menghapus surat keterangan belum memiliki rumah",
        })
      },
      onError: (error) => {
        handleError(
          error,
          "Gagal menghapus surat keterangan belum memiliki rumah",
        )
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!suratKeteranganBelumMemilikiRumahsCount) return 0
    return Math.ceil(
      suratKeteranganBelumMemilikiRumahsCount / pagination.pageSize,
    )
  }, [suratKeteranganBelumMemilikiRumahsCount, pagination.pageSize])

  const data = React.useMemo(() => {
    return (rawData ?? []) as SuratWithPemohon[]
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
          Surat Keterangan Belum Memiliki Rumah
        </h1>
        <Button asChild>
          <Link href="/dashboard/surat/surat-keterangan-belum-memiliki-rumah/tambah">
            Tambah
          </Link>
        </Button>
      </div>
      <div className="relative min-h-[100vh] w-full overflow-auto">
        <ControlledTable<SuratWithPemohon>
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
              editUrl={`/dashboard/surat/surat-keterangan-belum-memiliki-rumah/edit/${item.id}`}
              description={item.pemohonNIK}
            />
          )}
        />

        {printItem && (
          <PrintPreview
            suratType="surat-keterangan-belum-memiliki-rumah"
            suratData={printItem}
            open={!!printItem}
            onOpenChange={(open) => !open && setPrintItem(null)}
          />
        )}
      </div>
    </div>
  )
}
