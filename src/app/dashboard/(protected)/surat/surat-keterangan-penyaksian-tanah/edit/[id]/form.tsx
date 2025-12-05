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
  keperluan: z.string().min(1, "Keperluan wajib diisi"),
  jenisTanah: z.string().min(1, "Jenis tanah wajib diisi"),
  lokasiTanah: z.string().min(1, "Lokasi tanah wajib diisi"),
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

export default function SuratKeteranganPenyaksianTanahEditForm({
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

  const suratKeteranganPenyaksianTanahsKey =
    trpc.suratKeteranganPenyaksianTanah.all.queryKey()
  const suratKeteranganPenyaksianTanahByIdKey =
    trpc.suratKeteranganPenyaksianTanah.byId.queryKey(id)

  const invalidateSuratKeteranganPenyaksianTanahByIdKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: suratKeteranganPenyaksianTanahByIdKey,
    })
  }
  const invalidateSuratKeteranganPenyaksianTanahsKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: suratKeteranganPenyaksianTanahsKey,
    })
  }

  const { data: surat } = useQuery(
    trpc.suratKeteranganPenyaksianTanah.byId.queryOptions(id),
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

  const { mutate: updateSuratKeteranganPenyaksianTanah } = useMutation(
    trpc.suratKeteranganPenyaksianTanah.update.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil memperbarui surat keterangan penyaksian tanah",
        })
        await invalidateSuratKeteranganPenyaksianTanahByIdKey()
        await invalidateSuratKeteranganPenyaksianTanahsKey()
        if (isDialog) {
          router.back()
        } else {
          router.push("/dashboard/surat/surat-keterangan-penyaksian-tanah")
        }
      },
      onError: (error) => {
        handleError(
          error,
          "Gagal memperbarui surat keterangan penyaksian tanah",
        )
      },
    }),
  )

  const defaultValues = React.useMemo<z.input<typeof formSchema>>(
    () =>
      surat
        ? {
            id: surat.id,
            pemohonNIK: surat.pemohonNIK,
            keperluan: surat.keperluan,
            jenisTanah: surat.jenisTanah,
            lokasiTanah: surat.lokasiTanah,
            luasTanah: surat.luasTanah,
            batasUtara: surat.batasUtara,
            batasSelatan: surat.batasSelatan,
            batasBarat: surat.batasBarat,
            batasTimur: surat.batasTimur,
          }
        : {
            id: "",
            pemohonNIK: "",
            keperluan: "",
            jenisTanah: "",
            lokasiTanah: "",
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
      updateSuratKeteranganPenyaksianTanah({
        ...value,
        pendudukIds: [],
      } as Parameters<typeof updateSuratKeteranganPenyaksianTanah>[0])
    },
  })

  if (!surat) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="text-lg font-bold">
        Edit Surat Keterangan Penyaksian Tanah
      </h1>
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

        <form.AppField name="keperluan">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Keperluan</form.FormLabel>
              <field.TextareaField placeholder="Masukkan keperluan penyaksian tanah" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="jenisTanah">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Jenis Tanah</form.FormLabel>
              <field.BaseField placeholder="Contoh: Tanah Pertanian, Tanah Perumahan" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="lokasiTanah">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Lokasi Tanah</form.FormLabel>
              <field.TextareaField placeholder="Masukkan lokasi lengkap tanah" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="luasTanah">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Luas Tanah</form.FormLabel>
              <field.BaseField placeholder="Contoh: 500 m²" />
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
