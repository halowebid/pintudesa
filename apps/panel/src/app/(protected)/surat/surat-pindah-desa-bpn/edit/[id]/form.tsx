"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button, ComboboxPopover } from "@pintudesa/ui"
import { formatDate, formatStringToDate } from "@pintudesa/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { useAppForm } from "@/components/form"
import { useToast } from "@/components/toast-provider"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

const requiredDateFlexible = z.union([z.string(), z.date()]).refine(
  (val) => {
    if (!val) return false
    if (typeof val === "string") {
      return val.trim().length > 0
    }
    return true
  },
  { message: "Tanggal wajib diisi" },
)

const formSchema = z.object({
  id: z.string(),
  pemohonNIK: z.string().min(1, "NIK wajib diisi"),
  nomorShm: z.string().min(1, "Nomor SHM wajib diisi"),
  tanggalShm: requiredDateFlexible,
  keteranganSurat: z.string().optional(),
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

export default function SuratPindahDesaBpnEditForm({
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

  const suratPindahDesaBpnsKey = trpc.suratPindahDesaBpn.all.queryKey()
  const suratPindahDesaBpnByIdKey = trpc.suratPindahDesaBpn.byId.queryKey(id)

  const invalidateSuratPindahDesaBpnByIdKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: suratPindahDesaBpnByIdKey,
    })
  }
  const invalidateSuratPindahDesaBpnsKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: suratPindahDesaBpnsKey,
    })
  }

  const { data: surat } = useQuery(
    trpc.suratPindahDesaBpn.byId.queryOptions(id),
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

  const { mutate: updateSuratPindahDesaBpn } = useMutation(
    trpc.suratPindahDesaBpn.update.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil memperbarui surat pindah desa BPN",
        })
        await invalidateSuratPindahDesaBpnByIdKey()
        await invalidateSuratPindahDesaBpnsKey()
        if (isDialog) {
          router.back()
        } else {
          router.push("/surat/surat-pindah-desa-bpn")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal memperbarui surat pindah desa BPN")
      },
    }),
  )

  const defaultValues = React.useMemo<z.input<typeof formSchema>>(
    () =>
      surat
        ? {
            id: surat.id,
            pemohonNIK: surat.pemohonNIK,
            nomorShm: surat.nomorShm,
            tanggalShm: surat.tanggalShm,
            keteranganSurat: surat.keteranganSurat ?? "",
          }
        : {
            id: "",
            pemohonNIK: "",
            nomorShm: "",
            tanggalShm: new Date(),
            keteranganSurat: "",
          },
    [surat],
  )

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      updateSuratPindahDesaBpn({
        ...value,
        tanggalShm: formatStringToDate(value.tanggalShm),
      })
    },
  })

  React.useEffect(() => {
    if (surat?.pemohon) {
      setSelectedPenduduk({
        label: `${surat.pemohon.nik} - ${surat.pemohon.namaLengkap}`,
        value: surat.pemohonNIK,
        nama: surat.pemohon.namaLengkap,
        alamat: surat.pemohon.alamat,
        tempatLahir: surat.pemohon.tempatLahir,
        tanggalLahir: surat.pemohon.tanggalLahir,
        wilayah: formatWilayah(surat.pemohon),
      })
    }
  }, [surat])

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

      <form.AppField name="nomorShm">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Nomor SHM</form.FormLabel>
            <field.BaseField placeholder="Masukkan nomor sertifikat hak milik" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="tanggalShm">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Tanggal SHM</form.FormLabel>
            <field.DatePickerField mode={isDialog ? "inline" : "portal"} />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="keteranganSurat">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Keterangan Surat (Opsional)</form.FormLabel>
            <field.TextareaField placeholder="Masukkan keterangan tambahan jika ada" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.FormItem>
        <Button type="submit">Simpan Perubahan</Button>
      </form.FormItem>
    </form>
  )
}
