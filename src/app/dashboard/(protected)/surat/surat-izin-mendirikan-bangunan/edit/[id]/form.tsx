"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { useAppForm } from "@/components/dashboard/form"
import { useToast } from "@/components/toast-provider"
import { useTRPC } from "@/lib/trpc/client"
import { Button, ComboboxPopover } from "@/lib/ui"
import { formatDate } from "@/lib/utils"
import { useHandleTRPCError } from "@/lib/utils/error"

const formSchema = z.object({
  id: z.string(),
  pemohonNIK: z.string().min(1, "NIK wajib diisi"),
  tujuanPembuatan: z.string().min(1, "Tujuan pembuatan wajib diisi"),
  luasTanah: z.string().min(1, "Luas tanah wajib diisi"),
  batasUtara: z.string().min(1, "Batas utara wajib diisi"),
  batasSelatan: z.string().min(1, "Batas selatan wajib diisi"),
  batasBarat: z.string().min(1, "Batas barat wajib diisi"),
  batasTimur: z.string().min(1, "Batas timur wajib diisi"),
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

export default function SuratIzinMendirikanBangunanEditForm({
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

  const suratIzinMendirikanBangunansKey =
    trpc.suratIzinMendirikanBangunan.all.queryKey()
  const suratIzinMendirikanBangunanByIdKey =
    trpc.suratIzinMendirikanBangunan.byId.queryKey(id)

  const invalidateSuratIzinMendirikanBangunanByIdKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: suratIzinMendirikanBangunanByIdKey,
    })
  }
  const invalidateSuratIzinMendirikanBangunansKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: suratIzinMendirikanBangunansKey,
    })
  }

  const { data: surat } = useQuery(
    trpc.suratIzinMendirikanBangunan.byId.queryOptions(id),
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

  const { mutate: updateSuratIzinMendirikanBangunan } = useMutation(
    trpc.suratIzinMendirikanBangunan.update.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil memperbarui surat izin mendirikan bangunan",
        })
        await invalidateSuratIzinMendirikanBangunanByIdKey()
        await invalidateSuratIzinMendirikanBangunansKey()
        if (isDialog) {
          router.back()
        } else {
          router.push("/dashboard/surat/surat-izin-mendirikan-bangunan")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal memperbarui surat izin mendirikan bangunan")
      },
    }),
  )

  const defaultValues = React.useMemo<z.input<typeof formSchema>>(
    () =>
      surat
        ? {
            id: surat.id,
            pemohonNIK: surat.pemohonNIK,
            tujuanPembuatan: surat.tujuanPembuatan,
            luasTanah: surat.luasTanah,
            batasUtara: surat.batasUtara,
            batasSelatan: surat.batasSelatan,
            batasBarat: surat.batasBarat,
            batasTimur: surat.batasTimur,
          }
        : {
            id: "",
            pemohonNIK: "",
            tujuanPembuatan: "",
            luasTanah: "",
            batasUtara: "",
            batasSelatan: "",
            batasBarat: "",
            batasTimur: "",
          },
    [surat],
  )

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      updateSuratIzinMendirikanBangunan(value)
    },
  })

  if (!surat) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="text-lg font-bold">Edit Surat Izin Mendirikan Bangunan</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
        className="max-w-md space-y-6"
      >
        <form.AppField name="pemohonNIK">
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
                value={field.state.value}
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

        <form.AppField name="tujuanPembuatan">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Tujuan Pembuatan</form.FormLabel>
              <field.TextareaField placeholder="Masukkan tujuan pembuatan izin bangunan" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="luasTanah">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Luas Tanah</form.FormLabel>
              <field.BaseField placeholder="Contoh: 100 m²" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="batasUtara">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Batas Utara</form.FormLabel>
              <field.BaseField placeholder="Masukkan batas utara tanah" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="batasSelatan">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Batas Selatan</form.FormLabel>
              <field.BaseField placeholder="Masukkan batas selatan tanah" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="batasBarat">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Batas Barat</form.FormLabel>
              <field.BaseField placeholder="Masukkan batas barat tanah" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="batasTimur">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Batas Timur</form.FormLabel>
              <field.BaseField placeholder="Masukkan batas timur tanah" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.FormItem>
          <Button type="submit">Perbarui Surat</Button>
        </form.FormItem>
      </form>
    </div>
  )
}
