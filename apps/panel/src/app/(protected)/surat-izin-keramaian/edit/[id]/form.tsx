"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button, ComboboxPopover } from "@pintudesa/ui"
import { formatDate, formatStringToDate } from "@pintudesa/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import { z } from "zod"

import { useAppForm } from "@/components/form"
import { useToast } from "@/components/toast-provider"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

const optionalDateFlexible = z
  .union([z.string(), z.date()])
  .optional()
  .refine(
    (val) => {
      if (!val) return true
      if (typeof val === "string") {
        return dayjs(val, "DD/MM/YYYY", true).isValid()
      }
      return val instanceof Date && !isNaN(val.getTime())
    },
    {
      message: "Tanggal tidak valid",
    },
  )
  .transform((val) => {
    if (!val) return undefined
    if (typeof val === "string") {
      return dayjs(val, "DD/MM/YYYY").toDate()
    }
    return val
  })

const requiredDateFlexible = z
  .union([z.string(), z.date()])
  .refine(
    (val) => {
      if (!val) return false
      if (typeof val === "string") {
        return dayjs(val, "DD/MM/YYYY", true).isValid()
      }
      return val instanceof Date && !isNaN(val.getTime())
    },
    {
      message: "Tanggal wajib dan harus valid",
    },
  )
  .transform((val) => {
    if (typeof val === "string") {
      return dayjs(val, "DD/MM/YYYY").toDate()
    }
    return val
  })

const formSchema = z.object({
  pemohonNIK: z.string().min(1, "NIK wajib diisi"),
  tujuanPembuatan: z.string().min(1, "Tujuan wajib diisi"),
  waktuAcara: requiredDateFlexible,
  waktuSelesai: optionalDateFlexible,
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

export default function SuratIzinKeramaianForm({
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

  const suratIzinKeramaiansKey = trpc.suratIzinKeramaian.all.queryKey()
  const suratIzinKeramaianByIdKey = trpc.suratIzinKeramaian.byId.queryKey(id)
  const invalidateSuratIzinKeramaianByIdKey = async () => {
    await queryClient.invalidateQueries({ queryKey: suratIzinKeramaianByIdKey })
  }
  const invalidateSuratIzinKeramaiansKey = async () => {
    await queryClient.invalidateQueries({ queryKey: suratIzinKeramaiansKey })
  }
  const { data: searchResults = [] } = useQuery(
    trpc.penduduk.search.queryOptions(
      { searchQuery: searchKey, limit: 10 },
      { enabled: !!searchKey },
    ),
  )

  const pendudukOptionsRaw = React.useMemo(() => {
    return searchResults.map((p) => ({
      label: `${p.nik} (${p.namaLengkap})`,
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

  const { data } = useQuery(trpc.suratIzinKeramaian.byId.queryOptions(id))

  React.useEffect(() => {
    if (data?.pemohon) {
      setSelectedPenduduk({
        value: data.pemohonNIK,
        label: `${data.pemohon.nik} - ${data.pemohon.namaLengkap}`,
        nama: data.pemohon.namaLengkap,
        alamat: data.pemohon.alamat,
        tempatLahir: data.pemohon.tempatLahir,
        tanggalLahir: data.pemohon.tanggalLahir,
        wilayah: formatWilayah(data.pemohon),
      })
    }
  }, [data])

  const { mutate: updateSuratIzinKeramaian } = useMutation(
    trpc.suratIzinKeramaian.update.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil memperbaharui surat izin keramaian",
        })
        await invalidateSuratIzinKeramaiansKey()
        await invalidateSuratIzinKeramaianByIdKey()
        if (isDialog) {
          router.back()
        } else {
          router.push("/surat-izin-keramaian")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal memperbaharui surat izin keramaian")
      },
    }),
  )

  const defaultValues = React.useMemo<z.input<typeof formSchema>>(
    () => ({
      ...data,
      pemohonNIK: data?.pemohonNIK ?? "",
      tujuanPembuatan: data?.tujuanPembuatan ?? "",
      waktuAcara: data?.waktuAcara ?? "",
      waktuSelesai: data?.waktuSelesai ?? "",
    }),
    [data],
  )

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      updateSuratIzinKeramaian({
        ...value,
        waktuAcara: value.waktuAcara
          ? formatStringToDate(value.waktuAcara)
          : undefined,
        waktuSelesai: value.waktuSelesai
          ? formatStringToDate(value.waktuSelesai)
          : undefined,
      })
    },
  })

  React.useEffect(() => {
    if (!defaultValues.pemohonNIK || !pendudukOptionsRaw.length) return

    const selected = pendudukOptionsRaw.find(
      (item) => item.value === defaultValues.pemohonNIK,
    )

    if (selected) {
      setSelectedPenduduk(selected)
    }
  }, [defaultValues.pemohonNIK, pendudukOptionsRaw])

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
              onInputValueChange={(value) => {
                setSearchKey(value)
              }}
              onSelect={(val) => {
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
              buttonClassName="w-full"
              value={selectedPenduduk?.value}
              defaultInputValue={selectedPenduduk?.label ?? ""}
              defaultLabel={selectedPenduduk?.label ?? ""}
            />

            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      {selectedPenduduk && (
        <div className="text-muted-foreground space-y-1 rounded-md border px-4 py-3 text-sm">
          <div>
            <div className="text-foreground font-medium">Nama Pemohon</div>
            <div>{selectedPenduduk.nama || "-"}</div>
          </div>
          <div>
            <div className="text-foreground font-medium">Tempat Lahir</div>
            <div>{selectedPenduduk.tempatLahir || "-"}</div>
          </div>
          <div>
            <div className="text-foreground font-medium">Tanggal Lahir</div>
            <div>{formatDate(selectedPenduduk.tanggalLahir, "D/M/YYYY")}</div>
          </div>
          <div>
            <div className="text-foreground font-medium">Alamat</div>
            <div>{selectedPenduduk.alamat || "-"}</div>
          </div>
          <div>
            <div className="text-foreground font-medium">Wilayah</div>
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
            <field.TextareaField placeholder="Masukkan tujuan pembuatan izin keramaian" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="waktuAcara">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Waktu Acara</form.FormLabel>
            <field.DatePickerField mode={isDialog ? "inline" : "portal"} />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="waktuSelesai">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Waktu Selesai (Opsional)</form.FormLabel>
            <field.DatePickerField mode={isDialog ? "inline" : "portal"} />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>
      <form.FormItem>
        <Button type="submit">Simpan SuratIzinKeramaian</Button>
      </form.FormItem>
    </form>
  )
}
