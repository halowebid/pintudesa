"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button, ComboboxPopover } from "@pintudesa/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { useAppForm } from "@/components/form"
import { useToast } from "@/components/toast-provider"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

const formSchema = z.object({
  id: z.string(),
  pemohonNIK: z.string().min(1, "NIK pemohon wajib diisi"),
  jumlahTahunDomisili: z.string().min(1, "Jumlah tahun domisili wajib diisi"),
  pendudukIds: z
    .array(z.string())
    .min(1, "Minimal harus ada satu anggota keluarga"),
})

export default function SuratKeteranganDomisiliForm({
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

  const [selectedKeluarga, setSelectedKeluarga] = React.useState<
    {
      label: string
      value: string
      nama: string
      alamat: string
      tempatLahir: string
      tanggalLahir: Date
      wilayah: string
    }[]
  >([])

  const [searchKeyPemohon, setSearchKeyPemohon] = React.useState("")
  const [searchKeyKeluarga, setSearchKeyKeluarga] = React.useState("")

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const suratKeteranganDomisilisKey =
    trpc.suratKeteranganDomisili.all.queryKey()

  const invalidateSuratKeteranganDomisilisKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: suratKeteranganDomisilisKey,
    })
  }

  // Search for pemohon
  const { data: searchResultsPemohon = [] } = useQuery(
    trpc.penduduk.search.queryOptions(
      { searchQuery: searchKeyPemohon, limit: 10 },
      { enabled: !!searchKeyPemohon },
    ),
  )

  // Search for keluarga
  const { data: searchResultsKeluarga = [] } = useQuery(
    trpc.penduduk.search.queryOptions(
      { searchQuery: searchKeyKeluarga, limit: 10 },
      { enabled: !!searchKeyKeluarga },
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

  const pendudukOptionsKeluargaRaw = React.useMemo(() => {
    return searchResultsKeluarga.map((p) => {
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
  }, [searchResultsKeluarga])

  const pendudukOptionsKeluarga = React.useMemo(
    () =>
      pendudukOptionsKeluargaRaw.map(({ label, value }) => ({ label, value })),
    [pendudukOptionsKeluargaRaw],
  )

  const { mutate: updateSuratKeteranganDomisili } = useMutation(
    trpc.suratKeteranganDomisili.update.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil memperbarui surat keterangan domisili",
        })
        await invalidateSuratKeteranganDomisilisKey()
        if (isDialog) {
          router.back()
        } else {
          router.push("/surat/surat-keterangan-domisili")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal memperbarui surat keterangan domisili")
      },
    }),
  )

  const defaultValues = React.useMemo<z.input<typeof formSchema>>(
    () => ({
      id: "",
      pemohonNIK: "",
      jumlahTahunDomisili: "",
      pendudukIds: [],
    }),
    [],
  )

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      updateSuratKeteranganDomisili({
        id: value.id,
        pemohonNIK: value.pemohonNIK,
        jumlahTahunDomisili: value.jumlahTahunDomisili,
        // pendudukIds is not needed for update in this implementation
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
      <form.AppField name="id">
        {(field) => (
          <input type="hidden" name={field.name} value={field.state.value} />
        )}
      </form.AppField>

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

      <form.AppField name="jumlahTahunDomisili">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Jumlah Tahun Domisili</form.FormLabel>
            <field.BaseField placeholder="Masukkan jumlah tahun domisili" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="pendudukIds">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Anggota Keluarga</form.FormLabel>
            <div className="space-y-2">
              {selectedKeluarga.map((item, index) => (
                <div
                  key={item.value}
                  className="flex items-center justify-between rounded border p-2"
                >
                  <span className="text-sm">{item.label}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newSelected = selectedKeluarga.filter(
                        (_, i) => i !== index,
                      )
                      setSelectedKeluarga(newSelected)
                      field.handleChange(newSelected.map((item) => item.value))
                    }}
                  >
                    Hapus
                  </Button>
                </div>
              ))}
              <ComboboxPopover
          mode={isDialog ? "inline" : "portal"}
          selectedLabel={""}
                popoverClassName="w-lg max-w-sm lg:max-w-md"
                onInputValueChange={(value) => {
                  setSearchKeyKeluarga(value)
                }}
                onValueChange={(val) => {
                  const selectedValue = val
                  const selected = pendudukOptionsKeluargaRaw.find(
                    (p) => p.value === selectedValue,
                  )
                  if (selected) {
                    // Check if already selected
                    if (
                      !selectedKeluarga.some(
                        (item) => item.value === selected.value,
                      )
                    ) {
                      const newSelected = [...selectedKeluarga, selected]
                      setSelectedKeluarga(newSelected)
                      field.handleChange(newSelected.map((item) => item.value))
                    }
                  }
                }}
                isClearable={true}
                onClear={() => {
                  setSearchKeyKeluarga("")
                }}
                items={pendudukOptionsKeluarga}
                placeholder="Tambah anggota keluarga..."
                value={""}
              />
            </div>
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.FormItem>
        <Button type="submit">Simpan Surat Keterangan Domisili</Button>
      </form.FormItem>
    </form>
  )
}
