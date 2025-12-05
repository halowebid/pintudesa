"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button, ComboboxPopover } from "@/lib/ui"
import { formatDate } from "@/lib/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { useAppForm } from "@/components/dashboard/form"
import { useToast } from "@/components/toast-provider"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

const formSchema = z.object({
  id: z.string(),
  pemohonNik: z.string().min(1, "NIK wajib diisi"),
  tujuanPembuatan: z.string().min(1, "Tujuan pembuatan wajib diisi"),
  namaLain: z.string().min(1, "Nama lain wajib diisi"),
})

function formatWilayah(p: {
  rt?: string | null
  rw?: string | null
  dusun?: string | null
  desa_kelurahan?: string | null
  kecamatan?: string | null
  kabupaten_kota?: string | null
  provinsi?: string | null
}) {
  return [
    p.rt && `RT. ${p.rt}`,
    p.rw && `RW. ${p.rw}`,
    p.dusun && `Dusun ${p.dusun}`,
    p.desa_kelurahan && `Desa ${p.desa_kelurahan}`,
    p.kecamatan && `Kec. ${p.kecamatan}`,
    p.kabupaten_kota && `Kab. ${p.kabupaten_kota}`,
    p.provinsi,
  ]
    .filter(Boolean)
    .join(", ")
}

export default function SuratKeteranganBedaNamaEditForm({
  id,
  isDialog,
}: {
  id: string
  isDialog: boolean
}) {
  const [selectedPenduduk, setSelectedPenduduk] = React.useState<{
    label: string
    value: string
    nama: string
    alamat: string
    tempatLahir: string
    tanggalLahir: Date
    wilayah: string
  } | null>(null)
  const [searchKey, setSearchKey] = React.useState("")

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const suratKeteranganBedaNamasKey =
    trpc.suratKeteranganBedaNama.all.queryKey()
  const suratKeteranganBedaNamaByIdKey =
    trpc.suratKeteranganBedaNama.byId.queryKey(id)

  const invalidateSuratKeteranganBedaNamaByIdKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: suratKeteranganBedaNamaByIdKey,
    })
  }
  const invalidateSuratKeteranganBedaNamasKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: suratKeteranganBedaNamasKey,
    })
  }

  const { data: surat } = useQuery(
    trpc.suratKeteranganBedaNama.byId.queryOptions(id),
  )

  const { data: pemohonData } = useQuery(
    trpc.penduduk.byId.queryOptions(surat?.pemohonNik ?? "", {
      enabled: !!surat?.pemohonNik,
    }),
  )

  const { data: searchResults = [] } = useQuery(
    trpc.penduduk.search.queryOptions(
      { searchQuery: searchKey, limit: 10 },
      { enabled: !!searchKey },
    ),
  )

  const pendudukOptionsRaw = React.useMemo(() => {
    return searchResults.map((p) => ({
      label: `${p.nik} - ${p.namaLengkap}`,
      value: p.id,
      nama: p.namaLengkap,
      alamat: p.alamat,
      tempatLahir: p.tempatLahir,
      tanggalLahir: p.tanggalLahir,
      wilayah: formatWilayah(p),
    }))
  }, [searchResults])

  const pendudukOptions = React.useMemo(
    () => pendudukOptionsRaw.map(({ label, value }) => ({ label, value })),
    [pendudukOptionsRaw],
  )

  React.useEffect(() => {
    if (!pemohonData) return

    setSelectedPenduduk({
      label: `${pemohonData.nik} - ${pemohonData.namaLengkap}`,
      value: pemohonData.id,
      nama: pemohonData.namaLengkap,
      alamat: pemohonData.alamat,
      tempatLahir: pemohonData.tempatLahir,
      tanggalLahir: pemohonData.tanggalLahir,
      wilayah: formatWilayah(pemohonData),
    })
  }, [pemohonData])

  const { mutate: updateSuratKeteranganBedaNama } = useMutation(
    trpc.suratKeteranganBedaNama.update.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil mengubah surat keterangan beda nama",
        })
        await invalidateSuratKeteranganBedaNamaByIdKey()
        await invalidateSuratKeteranganBedaNamasKey()
        if (isDialog) {
          router.back()
        } else {
          router.push("/surat/surat-keterangan-beda-nama")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal mengubah surat keterangan beda nama")
      },
    }),
  )

  const defaultValues = React.useMemo<z.input<typeof formSchema>>(
    () => ({
      id: surat?.id ?? "",
      pemohonNik: surat?.pemohonNik ?? "",
      tujuanPembuatan: surat?.tujuanPembuatan ?? "",
      namaLain: surat?.namaLain ?? "",
    }),
    [surat],
  )

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      updateSuratKeteranganBedaNama(value)
    },
  })

  if (!surat) {
    return <div>Loading...</div>
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
      className="max-w-md space-y-6"
    >
      <form.AppField name="pemohonNik">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Informasi Pemohon</form.FormLabel>
            <ComboboxPopover
              mode={isDialog ? "inline" : "portal"}
              selectedLabel={selectedPenduduk?.label}
              popoverClassName="w-lg max-w-sm lg:max-w-md"
              onInputValueChange={(value) => {
                setSearchKey(value)
              }}
              onValueChange={(val) => {
                const selectedValue = val

                const selected = pendudukOptionsRaw.find(
                  (p) => p.value === selectedValue,
                )
                if (selected) {
                  setSelectedPenduduk(selected)
                  field.setValue(selected.value)
                }
              }}
              isClearable={true}
              onClear={() => {
                setSelectedPenduduk(null)
                field.setValue("")
                setSearchKey("")
              }}
              items={pendudukOptions}
              placeholder="Cari Nama penduduk..."
              value={selectedPenduduk?.value}
            />

            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      {selectedPenduduk && (
        <div className="text-muted-foreground space-y-1 rounded-md border px-4 py-3 text-sm">
          <div>
            <div className="font-medium text-black">Nama Pemohon</div>
            <div>{selectedPenduduk.nama || "-"}</div>
          </div>
          <div>
            <div className="font-medium text-black">Tempat Lahir</div>
            <div>{selectedPenduduk.tempatLahir || "-"}</div>
          </div>
          <div>
            <div className="font-medium text-black">Tanggal Lahir</div>
            <div>{formatDate(selectedPenduduk.tanggalLahir, "D/M/YYYY")}</div>
          </div>
          <div>
            <div className="font-medium text-black">Alamat</div>
            <div>{selectedPenduduk.alamat || "-"}</div>
          </div>
          <div>
            <div className="font-medium text-black">Wilayah</div>
            <div>
              {selectedPenduduk.wilayah ? (
                selectedPenduduk.wilayah
              ) : (
                <span className="text-destructive italic">
                  * Jika data wilayah kosong, silahkan perbaiki data alamat
                  kartu keluarga dan pastikan data lengkap terlebih dahulu
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <form.AppField name="namaLain">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Nama Lain</form.FormLabel>
            <field.BaseField placeholder="Masukkan nama lain" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="tujuanPembuatan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Tujuan Pembuatan</form.FormLabel>
            <field.TextareaField placeholder="Masukkan tujuan pembuatan surat" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.FormItem>
        <Button type="submit">Simpan Surat</Button>
      </form.FormItem>
    </form>
  )
}
