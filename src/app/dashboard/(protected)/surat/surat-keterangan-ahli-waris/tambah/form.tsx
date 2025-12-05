"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import { z } from "zod"

import { useAppForm } from "@/components/dashboard/form"
import { useToast } from "@/components/toast-provider"
import type { SHDK } from "@/lib/db/schema"
import { useTRPC } from "@/lib/trpc/client"
import { Button, ComboboxPopover } from "@/lib/ui"
import { formatStringToDate } from "@/lib/utils"
import { useHandleTRPCError } from "@/lib/utils/error"

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
  pemohonNIK: z.string().min(1, "NIK pemohon wajib diisi"),
  yangDiberiKuasaNama: z.string().min(1, "Nama yang diberi kuasa wajib diisi"),
  yangDiberiKuasaTempatLahir: z
    .string()
    .min(1, "Tempat lahir yang diberi kuasa wajib diisi"),
  yangDiberiKuasaTanggalLahir: requiredDateFlexible,
  hubunganKeluarga: z
    .enum([
      "suami",
      "pembantu",
      "orangtua",
      "mertua",
      "menantu",
      "kepala_keluarga",
      "istri",
      "cucu",
      "anak",
      "lainnya",
    ])
    .nullable()
    .optional(),
  yangDiberiKuasaAlamat: z
    .string()
    .min(1, "Alamat yang diberi kuasa wajib diisi"),
  yangDiberiKuasaAlamatWilayah: z.string().optional(),
  yangMeninggalNIK: z.string().min(1, "NIK yang meninggal wajib diisi"),
  tanggalMeninggal: requiredDateFlexible,
  lokasiMeninggal: z.string().min(1, "Lokasi meninggal wajib diisi"),
  lokasiPemakaman: z.string().min(1, "Lokasi pemakaman wajib diisi"),
  tanggalPemakaman: requiredDateFlexible,
  nomorSuratKematian: z.string().optional(),
  tanggalSuratKematian: requiredDateFlexible.optional(),
  ahaliWarisNIK: z.string().optional(),
})

export default function SuratKeteranganAhliWarisForm({
  isDialog,
}: {
  isDialog: boolean
}) {
  const [selectedPemohon, setSelectedPemohon] = React.useState<{
    label: string
    value: string
    nama: string
    alamat: string
    tempatLahir: string
    tanggalLahir: Date
    wilayah: string
  } | null>(null)

  const [selectedYangMeninggal, setSelectedYangMeninggal] = React.useState<{
    label: string
    value: string
    nama: string
    alamat: string
    tempatLahir: string
    tanggalLahir: Date
    wilayah: string
  } | null>(null)

  const [selectedAhliWaris, setSelectedAhliWaris] = React.useState<{
    label: string
    value: string
    nama: string
    alamat: string
    tempatLahir: string
    tanggalLahir: Date
    wilayah: string
  } | null>(null)

  const [searchKeyPemohon, setSearchKeyPemohon] = React.useState("")
  const [searchKeyYangMeninggal, setSearchKeyYangMeninggal] = React.useState("")
  const [searchKeyAhliWaris, setSearchKeyAhliWaris] = React.useState("")

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const suratKuasaAhliWarissKey = trpc.suratKuasaAhliWaris.all.queryKey()

  const invalidateSuratKuasaAhliWarissKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: suratKuasaAhliWarissKey,
    })
  }

  const { data: searchResultsPemohon = [] } = useQuery(
    trpc.penduduk.search.queryOptions(
      { searchQuery: searchKeyPemohon, limit: 10 },
      { enabled: !!searchKeyPemohon },
    ),
  )

  const { data: searchResultsYangMeninggal = [] } = useQuery(
    trpc.penduduk.search.queryOptions(
      { searchQuery: searchKeyYangMeninggal, limit: 10 },
      { enabled: !!searchKeyYangMeninggal },
    ),
  )

  const { data: searchResultsAhliWaris = [] } = useQuery(
    trpc.penduduk.search.queryOptions(
      { searchQuery: searchKeyAhliWaris, limit: 10 },
      { enabled: !!searchKeyAhliWaris },
    ),
  )

  const pendudukOptionsPemohonRaw = React.useMemo(() => {
    return searchResultsPemohon.map((p) => {
      const wilayah = [
        p.rt && `RT. ${p.rt}`,
        p.rw && `RW. ${p.rw}`,
        p.dusun && `Dusun ${p.dusun}`,
        p.desa_kelurahan && `Desa ${p.desa_kelurahan}`,
        p.kecamatan && `Kec. ${p.kecamatan}`,
        p.kabupaten_kota && `Kab. ${p.kabupaten_kota}`,
        p.provinsi && p.provinsi,
      ]
        .filter(Boolean)
        .join(", ")

      return {
        label: `${p.nik} - ${p.namaLengkap}`,
        value: p.id,
        nama: p.namaLengkap,
        alamat: p.alamat,
        tempatLahir: p.tempatLahir,
        tanggalLahir: p.tanggalLahir,
        wilayah,
      }
    })
  }, [searchResultsPemohon])

  const pendudukOptionsPemohon = React.useMemo(
    () =>
      pendudukOptionsPemohonRaw.map(({ label, value }) => ({ label, value })),
    [pendudukOptionsPemohonRaw],
  )

  const pendudukOptionsYangMeninggalRaw = React.useMemo(() => {
    return searchResultsYangMeninggal.map((p) => {
      const wilayah = [
        p.rt && `RT. ${p.rt}`,
        p.rw && `RW. ${p.rw}`,
        p.dusun && `Dusun ${p.dusun}`,
        p.desa_kelurahan && `Desa ${p.desa_kelurahan}`,
        p.kecamatan && `Kec. ${p.kecamatan}`,
        p.kabupaten_kota && `Kab. ${p.kabupaten_kota}`,
        p.provinsi && p.provinsi,
      ]
        .filter(Boolean)
        .join(", ")

      return {
        label: `${p.nik} - ${p.namaLengkap}`,
        value: p.id,
        nama: p.namaLengkap,
        alamat: p.alamat,
        tempatLahir: p.tempatLahir,
        tanggalLahir: p.tanggalLahir,
        wilayah,
      }
    })
  }, [searchResultsYangMeninggal])

  const pendudukOptionsYangMeninggal = React.useMemo(
    () =>
      pendudukOptionsYangMeninggalRaw.map(({ label, value }) => ({
        label,
        value,
      })),
    [pendudukOptionsYangMeninggalRaw],
  )

  const pendudukOptionsAhliWarisRaw = React.useMemo(() => {
    return searchResultsAhliWaris.map((p) => {
      const wilayah = [
        p.rt && `RT. ${p.rt}`,
        p.rw && `RW. ${p.rw}`,
        p.dusun && `Dusun ${p.dusun}`,
        p.desa_kelurahan && `Desa ${p.desa_kelurahan}`,
        p.kecamatan && `Kec. ${p.kecamatan}`,
        p.kabupaten_kota && `Kab. ${p.kabupaten_kota}`,
        p.provinsi && p.provinsi,
      ]
        .filter(Boolean)
        .join(", ")

      return {
        label: `${p.nik} - ${p.namaLengkap}`,
        value: p.id,
        nama: p.namaLengkap,
        alamat: p.alamat,
        tempatLahir: p.tempatLahir,
        tanggalLahir: p.tanggalLahir,
        wilayah,
      }
    })
  }, [searchResultsAhliWaris])

  const pendudukOptionsAhliWaris = React.useMemo(
    () =>
      pendudukOptionsAhliWarisRaw.map(({ label, value }) => ({ label, value })),
    [pendudukOptionsAhliWarisRaw],
  )

  const { mutate: createSuratKuasaAhliWaris } = useMutation(
    trpc.suratKuasaAhliWaris.create.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil membuat surat keterangan ahli waris",
        })
        await invalidateSuratKuasaAhliWarissKey()
        if (isDialog) {
          router.back()
        } else {
          router.push("/dashboard/surat/surat-keterangan-ahli-waris")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal membuat surat keterangan ahli waris")
      },
    }),
  )

  const defaultValues = React.useMemo<z.input<typeof formSchema>>(
    () => ({
      pemohonNIK: "",
      yangDiberiKuasaNama: "",
      yangDiberiKuasaTempatLahir: "",
      yangDiberiKuasaTanggalLahir: "",
      hubunganKeluarga: null,
      yangDiberiKuasaAlamat: "",
      yangDiberiKuasaAlamatWilayah: "",
      yangMeninggalNIK: "",
      tanggalMeninggal: "",
      lokasiMeninggal: "",
      lokasiPemakaman: "",
      tanggalPemakaman: "",
      nomorSuratKematian: "",
      tanggalSuratKematian: "",
      ahaliWarisNIK: "",
    }),
    [],
  )

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      createSuratKuasaAhliWaris({
        pemohonNIK: value.pemohonNIK,
        yangDiberiKuasaNama: value.yangDiberiKuasaNama,
        yangDiberiKuasaTempatLahir: value.yangDiberiKuasaTempatLahir,
        yangDiberiKuasaTanggalLahir: formatStringToDate(
          value.yangDiberiKuasaTanggalLahir,
        ),
        hubunganKeluarga: value.hubunganKeluarga as SHDK | null,
        yangDiberiKuasaAlamat: value.yangDiberiKuasaAlamat,
        yangDiberiKuasaAlamatWilayah: value.yangDiberiKuasaAlamatWilayah,
        yangMeninggalNIK: value.yangMeninggalNIK,
        tanggalMeninggal: formatStringToDate(value.tanggalMeninggal),
        lokasiMeninggal: value.lokasiMeninggal,
        lokasiPemakaman: value.lokasiPemakaman,
        tanggalPemakaman: formatStringToDate(value.tanggalPemakaman),
        nomorSuratKematian: value.nomorSuratKematian,
        tanggalSuratKematian: value.tanggalSuratKematian
          ? formatStringToDate(value.tanggalSuratKematian)
          : undefined,
        ahaliWarisNIK: value.ahaliWarisNIK,
      })
    },
  })

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
              selectedLabel={selectedPemohon?.label}
              popoverClassName="w-lg max-w-sm lg:max-w-md"
              onInputValueChange={(value) => {
                setSearchKeyPemohon(value)
              }}
              onValueChange={(val) => {
                const selectedValue = val
                const selected = pendudukOptionsPemohonRaw.find(
                  (p) => p.value === selectedValue,
                )
                if (selected) {
                  setSelectedPemohon(selected)
                  field.handleChange(selected.value)
                }
              }}
              isClearable={true}
              onClear={() => {
                setSelectedPemohon(null)
                field.handleChange("")
                setSearchKeyPemohon("")
              }}
              items={pendudukOptionsPemohon}
              placeholder="Cari Nama pemohon..."
              value={selectedPemohon?.value}
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="yangDiberiKuasaNama">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Nama yang Diberi Kuasa</form.FormLabel>
            <field.BaseField placeholder="Masukkan nama yang diberi kuasa" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="yangDiberiKuasaTempatLahir">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Tempat Lahir yang Diberi Kuasa</form.FormLabel>
            <field.BaseField placeholder="Masukkan tempat lahir yang diberi kuasa" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="yangDiberiKuasaTanggalLahir">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Tanggal Lahir yang Diberi Kuasa</form.FormLabel>
            <field.DatePickerField mode={isDialog ? "inline" : "portal"} />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="hubunganKeluarga">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Hubungan Keluarga</form.FormLabel>
            <field.SelectField
              placeholder="Pilih hubungan keluarga (opsional)"
              options={[
                { label: "Suami", value: "suami" },
                { label: "Pembantu", value: "pembantu" },
                { label: "Orang Tua", value: "orangtua" },
                { label: "Mertua", value: "mertua" },
                { label: "Menantu", value: "menantu" },
                { label: "Kepala Keluarga", value: "kepala_keluarga" },
                { label: "Istri", value: "istri" },
                { label: "Cucu", value: "cucu" },
                { label: "Anak", value: "anak" },
                { label: "Lainnya", value: "lainnya" },
              ]}
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="yangDiberiKuasaAlamat">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Alamat yang Diberi Kuasa</form.FormLabel>
            <field.TextareaField placeholder="Masukkan alamat yang diberi kuasa" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="yangDiberiKuasaAlamatWilayah">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Wilayah Alamat yang Diberi Kuasa</form.FormLabel>
            <field.TextareaField placeholder="Masukkan wilayah alamat yang diberi kuasa (opsional)" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="yangMeninggalNIK">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Informasi yang Meninggal</form.FormLabel>
            <ComboboxPopover
              mode={isDialog ? "inline" : "portal"}
              selectedLabel={selectedYangMeninggal?.label}
              popoverClassName="w-lg max-w-sm lg:max-w-md"
              onInputValueChange={(value) => {
                setSearchKeyYangMeninggal(value)
              }}
              onValueChange={(val) => {
                const selectedValue = val
                const selected = pendudukOptionsYangMeninggalRaw.find(
                  (p) => p.value === selectedValue,
                )
                if (selected) {
                  setSelectedYangMeninggal(selected)
                  field.handleChange(selected.value)
                }
              }}
              isClearable={true}
              onClear={() => {
                setSelectedYangMeninggal(null)
                field.handleChange("")
                setSearchKeyYangMeninggal("")
              }}
              items={pendudukOptionsYangMeninggal}
              placeholder="Cari Nama yang meninggal..."
              value={selectedYangMeninggal?.value}
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

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

      <form.AppField name="tanggalPemakaman">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Tanggal Pemakaman</form.FormLabel>
            <field.DatePickerField mode={isDialog ? "inline" : "portal"} />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="nomorSuratKematian">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Nomor Surat Kematian</form.FormLabel>
            <field.BaseField placeholder="Masukkan nomor surat kematian (opsional)" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="tanggalSuratKematian">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Tanggal Surat Kematian</form.FormLabel>
            <field.DatePickerField mode={isDialog ? "inline" : "portal"} />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="ahaliWarisNIK">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Informasi Ahli Waris</form.FormLabel>
            <ComboboxPopover
              mode={isDialog ? "inline" : "portal"}
              selectedLabel={selectedAhliWaris?.label}
              popoverClassName="w-lg max-w-sm lg:max-w-md"
              onInputValueChange={(value) => {
                setSearchKeyAhliWaris(value)
              }}
              onValueChange={(val) => {
                const selectedValue = val
                const selected = pendudukOptionsAhliWarisRaw.find(
                  (p) => p.value === selectedValue,
                )
                if (selected) {
                  setSelectedAhliWaris(selected)
                  field.handleChange(selected.value)
                }
              }}
              isClearable={true}
              onClear={() => {
                setSelectedAhliWaris(null)
                field.handleChange("")
                setSearchKeyAhliWaris("")
              }}
              items={pendudukOptionsAhliWaris}
              placeholder="Cari Nama ahli waris (opsional)..."
              value={selectedAhliWaris?.value}
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.FormItem>
        <Button type="submit">Simpan Surat Keterangan Ahli Waris</Button>
      </form.FormItem>
    </form>
  )
}
