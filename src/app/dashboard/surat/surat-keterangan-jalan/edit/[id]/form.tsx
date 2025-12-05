"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { useAppForm } from "@/components/features/forms"
import { useToast } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"
import { ComboboxPopover } from "@/components/ui/combobox"
import { useTRPC } from "@/lib/trpc/client"
import { formatDate } from "@/lib/utils"
import { useHandleTRPCError } from "@/lib/utils/error"

const formSchema = z.object({
  id: z.string(),
  pemohonNIK: z.string().min(1, "NIK wajib diisi"),
  maksudPerjalanan: z.string().min(1, "Maksud perjalanan wajib diisi"),
  tujuanPerjalanan: z.string().min(1, "Tujuan perjalanan wajib diisi"),
  rencanaBerangkat: z.date({ required_error: "Rencana berangkat wajib diisi" }),
  transportasi: z.string().min(1, "Transportasi wajib diisi"),
  noPlatKendaraan: z.string().min(1, "No plat kendaraan wajib diisi"),
  namaSopir: z.string().min(1, "Nama sopir wajib diisi"),
  tempatLahirSopir: z.string().min(1, "Tempat lahir sopir wajib diisi"),
  tanggalLahirSopir: z.date().optional().nullable(),
  pengikut: z.string().optional().nullable(),
  barangBawaan: z.string().optional().nullable(),
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

export default function SuratKeteranganJalanEditForm({
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

  const suratKeteranganJalansKey = trpc.suratKeteranganJalan.all.queryKey()
  const suratKeteranganJalanByIdKey =
    trpc.suratKeteranganJalan.byId.queryKey(id)

  const invalidateSuratKeteranganJalanByIdKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: suratKeteranganJalanByIdKey,
    })
  }
  const invalidateSuratKeteranganJalansKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: suratKeteranganJalansKey,
    })
  }

  const { data: surat } = useQuery(
    trpc.suratKeteranganJalan.byId.queryOptions(id),
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

  const { mutate: updateSuratKeteranganJalan } = useMutation(
    trpc.suratKeteranganJalan.update.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil memperbarui surat keterangan jalan",
        })
        await invalidateSuratKeteranganJalanByIdKey()
        await invalidateSuratKeteranganJalansKey()
        if (isDialog) {
          router.back()
        } else {
          router.push("/dashboard/surat/surat-keterangan-jalan")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal memperbarui surat keterangan jalan")
      },
    }),
  )

  const defaultValues = React.useMemo<z.input<typeof formSchema>>(
    () =>
      surat
        ? {
            id: surat.id,
            pemohonNIK: surat.pemohonNIK,
            maksudPerjalanan: surat.maksudPerjalanan,
            tujuanPerjalanan: surat.tujuanPerjalanan,
            rencanaBerangkat: surat.rencanaBerangkat,
            transportasi: surat.transportasi,
            noPlatKendaraan: surat.noPlatKendaraan,
            namaSopir: surat.namaSopir,
            tempatLahirSopir: surat.tempatLahirSopir,
            tanggalLahirSopir: surat.tanggalLahirSopir,
            pengikut: surat.pengikut,
            barangBawaan: surat.barangBawaan,
          }
        : {
            id: "",
            pemohonNIK: "",
            maksudPerjalanan: "",
            tujuanPerjalanan: "",
            rencanaBerangkat: new Date(),
            transportasi: "",
            noPlatKendaraan: "",
            namaSopir: "",
            tempatLahirSopir: "",
            tanggalLahirSopir: null,
            pengikut: "",
            barangBawaan: "",
          },
    [surat],
  )

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      updateSuratKeteranganJalan(value)
    },
  })

  if (!surat) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="text-lg font-bold">Edit Surat Keterangan Jalan</h1>
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

        <form.AppField name="maksudPerjalanan">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Maksud Perjalanan</form.FormLabel>
              <field.TextareaField placeholder="Masukkan maksud perjalanan" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="tujuanPerjalanan">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Tujuan Perjalanan</form.FormLabel>
              <field.BaseField placeholder="Contoh: Jakarta" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="rencanaBerangkat">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Rencana Berangkat</form.FormLabel>
              <field.DatePickerField placeholder="Pilih tanggal berangkat" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="transportasi">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Transportasi</form.FormLabel>
              <field.BaseField placeholder="Contoh: Mobil, Motor, Bus" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="noPlatKendaraan">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>No Plat Kendaraan</form.FormLabel>
              <field.BaseField placeholder="Contoh: B 1234 ABC" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="namaSopir">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Nama Sopir</form.FormLabel>
              <field.BaseField placeholder="Masukkan nama sopir" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="tempatLahirSopir">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Tempat Lahir Sopir</form.FormLabel>
              <field.BaseField placeholder="Masukkan tempat lahir sopir" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="tanggalLahirSopir">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Tanggal Lahir Sopir (Opsional)</form.FormLabel>
              <field.DatePickerField placeholder="Pilih tanggal lahir sopir" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="pengikut">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Pengikut (Opsional)</form.FormLabel>
              <field.TextareaField placeholder="Masukkan daftar pengikut" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="barangBawaan">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Barang Bawaan (Opsional)</form.FormLabel>
              <field.TextareaField placeholder="Masukkan daftar barang bawaan" />
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
