"use client"

import * as React from "react"
import Link from "next/link"
import type { SelectSuratKeteranganDomisiliUsaha } from "@pintudesa/db/schema"
import { Button } from "@pintudesa/ui"
import { formatDate } from "@pintudesa/utils"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"

import { ControlledTable } from "@/components/controlled-table"
import PrintPreview from "@/components/print/print-preview"
import ShowOptions from "@/components/show-options"
import { useToast } from "@/components/toast-provider"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

export default function SuratKeteranganDomisiliUsahaContent() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [printItem, setPrintItem] =
    React.useState<SelectSuratKeteranganDomisiliUsaha | null>(null)

  type SuratWithPemohon = SelectSuratKeteranganDomisiliUsaha & {
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
        accessorKey: "jenisUsaha",
        header: "Jenis Usaha",
      },
      {
        accessorKey: "namaTempatUsaha",
        header: "Nama Tempat Usaha",
      },
      {
        accessorKey: "lokasiUsaha",
        header: "Lokasi Usaha",
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
    data: suratKeteranganDomisiliUsahasCount,
    refetch: refetchSuratKeteranganDomisiliUsahasCount,
  } = useQuery(trpc.suratKeteranganDomisiliUsaha.count.queryOptions())

  const {
    data: rawData,
    isLoading,
    refetch: refetchSuratKeteranganDomisiliUsahas,
  } = useQuery(
    trpc.suratKeteranganDomisiliUsaha.all.queryOptions({
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
    }),
  )
  const { mutate: deleteItem } = useMutation(
    trpc.suratKeteranganDomisiliUsaha.delete.mutationOptions({
      onSuccess: async () => {
        await refetchSuratKeteranganDomisiliUsahas()
        await refetchSuratKeteranganDomisiliUsahasCount()
        toast({
          description: "Berhasil menghapus surat keterangan domisili usaha",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus surat keterangan domisili usaha")
      },
    }),
  )
  const lastPage = React.useMemo(() => {
    if (!suratKeteranganDomisiliUsahasCount) return 0
    return Math.ceil(suratKeteranganDomisiliUsahasCount / pagination.pageSize)
  }, [suratKeteranganDomisiliUsahasCount, pagination.pageSize])

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
        <h1 className="text-lg font-bold">Surat Keterangan Domisili Usaha</h1>
        <Button asChild>
          <Link href="/surat/surat-keterangan-domisili-usaha/tambah">
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
              editUrl={`/surat/surat-keterangan-domisili-usaha/edit/${item.id}`}
              description={item.pemohonNIK}
            />
          )}
        />

        {printItem && (
          <PrintPreview
            suratType="surat-keterangan-domisili-usaha"
            suratData={printItem}
            open={!!printItem}
            onOpenChange={(open) => !open && setPrintItem(null)}
          />
        )}
      </div>
    </div>
  )
}
