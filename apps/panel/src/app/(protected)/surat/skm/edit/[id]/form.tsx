"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button, ComboboxPopover } from "@pintudesa/ui"
import { formatStringToDate } from "@pintudesa/utils"
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
  tanggalMeninggal: requiredDateFlexible,
  lokasiMeninggal: z.string().min(1, "Lokasi meniggal wajib diisi"),
  lokasiPemakaman: z.string().min(1, "Lokasi pemakaman wajib diisi"),
  nik: z.string().min(1, "NIK wajib diisi"),
  sebabMeninggal: z.string().optional(),
  tanggalPemakaman: optionalDateFlexible,
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

export default function SuratKeteranganKematianForm({
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

  const suratKeteranganKematiansKey =
    trpc.suratKeteranganKematian.all.queryKey()
  const suratKeteranganKematianByIdKey =
    trpc.suratKeteranganKematian.byId.queryKey(id)
  const invalidateSuratKeteranganKematianByIdKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: suratKeteranganKematianByIdKey,
    })
  }
  const invalidateSuratKeteranganKematiansKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: suratKeteranganKematiansKey,
    })
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

  const { data } = useQuery(trpc.suratKeteranganKematian.byId.queryOptions(id))

  React.useEffect(() => {
    if (data?.penduduk) {
      setSelectedPenduduk({
        value: data.nik,
        label: `${data.penduduk.nik} - ${data.penduduk.namaLengkap}`,
        nama: data.penduduk.namaLengkap,
        alamat: data.penduduk.alamat,
        tempatLahir: data.penduduk.tempatLahir,
        tanggalLahir: data.penduduk.tanggalLahir,
        wilayah: formatWilayah(data.penduduk),
      })
    }
  }, [data])

  const { mutate: updateSuratKeteranganKematian } = useMutation(
    trpc.suratKeteranganKematian.update.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil memperbaharui surat keterangan kematian",
        })
        await invalidateSuratKeteranganKematiansKey()
        await invalidateSuratKeteranganKematianByIdKey()
        if (isDialog) {
          router.back()
        } else {
          router.push("/surat/sik")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal memperbaharui surat keterangan kematian")
      },
    }),
  )

  const defaultValues = React.useMemo<z.input<typeof formSchema>>(
    () => ({
      ...data,
      tanggalMeninggal: data?.tanggalMeninggal ?? "",
      lokasiMeninggal: data?.lokasiMeninggal ?? "",
      lokasiPemakaman: data?.lokasiPemakaman ?? "",
      nik: data?.nik ?? "",
      sebabMeninggal: data?.sebabMeninggal ?? "",
      tanggalPemakaman: data?.tanggalPemakaman ?? "",
    }),
    [data],
  )

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      updateSuratKeteranganKematian({
        ...value,
        tanggalMeninggal: formatStringToDate(value.tanggalMeninggal),
        tanggalPemakaman: value.tanggalPemakaman
          ? formatStringToDate(value.tanggalPemakaman)
          : undefined,
      })
    },
  })

  React.useEffect(() => {
    if (!defaultValues.nik || !pendudukOptionsRaw.length) return

    const selected = pendudukOptionsRaw.find(
      (item) => item.value === defaultValues.nik,
    )

    if (selected) {
      setSelectedPenduduk(selected)
    }
  }, [defaultValues.nik, pendudukOptionsRaw])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
      className="max-w-md space-y-6"
    >
      <form.AppField name="tanggalMeninggal">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Tanggal Meninggal</form.FormLabel>
            <field.DatePickerField mode={isDialog ? "inline" : "portal"} />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="lokasiMeninggal">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Lokasi Meninggal</form.FormLabel>
            <field.TextareaField placeholder="Masukkan lokasi meninggal" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="lokasiPemakaman">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Lokasi Pemakaman</form.FormLabel>
            <field.TextareaField placeholder="Masukkan lokasi pemakaman" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="nik">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Informasi Penduduk</form.FormLabel>
            <ComboboxPopover
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

      <form.AppField name="sebabMeninggal">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Sebab Meninggal</form.FormLabel>
            <field.TextareaField placeholder="Masukkan sebab meninggal" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="tanggalPemakaman">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Tanggal Pemakaman</form.FormLabel>
            <field.DatePickerField mode={isDialog ? "inline" : "portal"} />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>
      <form.FormItem>
        <Button type="submit">Simpan Surat Keterangan Kematian</Button>
      </form.FormItem>
    </form>
  )
}
