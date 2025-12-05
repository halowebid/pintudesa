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
  pemohonNIK: z.string().min(1, "NIK pemohon wajib diisi"),
  pasangan: z.string().min(1, "NIK pasangan wajib diisi"),
  tanggalDitinggal: z.date({ required_error: "Tanggal ditinggal wajib diisi" }),
})

export default function SuratKeteranganGaibEditForm({
  id,
  isDialog,
}: {
  id: string
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
  const [selectedPasangan, setSelectedPasangan] = React.useState<{
    label: string
    value: string
    nama: string
    alamat: string
    tempatLahir: string
    tanggalLahir: Date
    wilayah: string
  } | null>(null)
  const [searchKeyPemohon, setSearchKeyPemohon] = React.useState("")
  const [searchKeyPasangan, setSearchKeyPasangan] = React.useState("")

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const suratKeteranganGaibsKey = trpc.suratKeteranganGaib.all.queryKey()
  const suratKeteranganGaibByIdKey = trpc.suratKeteranganGaib.byId.queryKey(id)

  const invalidateSuratKeteranganGaibByIdKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: suratKeteranganGaibByIdKey,
    })
  }

  const invalidateSuratKeteranganGaibsKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: suratKeteranganGaibsKey,
    })
  }

  const { data: surat } = useQuery(
    trpc.suratKeteranganGaib.byId.queryOptions(id),
  )

  const { data: searchResultsPemohon = [] } = useQuery(
    trpc.penduduk.search.queryOptions(
      { searchQuery: searchKeyPemohon, limit: 10 },
      { enabled: !!searchKeyPemohon },
    ),
  )

  const { data: searchResultsPasangan = [] } = useQuery(
    trpc.penduduk.search.queryOptions(
      { searchQuery: searchKeyPasangan, limit: 10 },
      { enabled: !!searchKeyPasangan },
    ),
  )

  const formatWilayah = (p: {
    rt?: string | null
    rw?: string | null
    dusun?: string | null
    desa_kelurahan?: string | null
    kecamatan?: string | null
    kabupaten_kota?: string | null
    provinsi?: string | null
  }) => {
    return [
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
  }

  const pendudukPemohonOptionsRaw = React.useMemo(() => {
    return searchResultsPemohon.map((p) => ({
      label: `${p.nik} - ${p.namaLengkap}`,
      value: p.id,
      nama: p.namaLengkap,
      alamat: p.alamat,
      tempatLahir: p.tempatLahir,
      tanggalLahir: p.tanggalLahir,
      wilayah: formatWilayah(p),
    }))
  }, [searchResultsPemohon])

  const pendudukPasanganOptionsRaw = React.useMemo(() => {
    return searchResultsPasangan.map((p) => ({
      label: `${p.nik} - ${p.namaLengkap}`,
      value: p.id,
      nama: p.namaLengkap,
      alamat: p.alamat,
      tempatLahir: p.tempatLahir,
      tanggalLahir: p.tanggalLahir,
      wilayah: formatWilayah(p),
    }))
  }, [searchResultsPasangan])

  const pendudukPemohonOptions = React.useMemo(
    () =>
      pendudukPemohonOptionsRaw.map(({ label, value }) => ({ label, value })),
    [pendudukPemohonOptionsRaw],
  )

  const pendudukPasanganOptions = React.useMemo(
    () =>
      pendudukPasanganOptionsRaw.map(({ label, value }) => ({ label, value })),
    [pendudukPasanganOptionsRaw],
  )

  const { mutate: updateSuratKeteranganGaib } = useMutation(
    trpc.suratKeteranganGaib.update.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil memperbarui surat keterangan gaib",
        })
        await invalidateSuratKeteranganGaibByIdKey()
        await invalidateSuratKeteranganGaibsKey()
        if (isDialog) {
          router.back()
        } else {
          router.push("/surat/surat-keterangan-gaib")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal memperbarui surat keterangan gaib")
      },
    }),
  )

  const defaultValues = React.useMemo<z.input<typeof formSchema>>(
    () =>
      surat
        ? {
            id: surat.id,
            pemohonNIK: surat.pemohonNIK,
            pasangan: surat.pasangan,
            tanggalDitinggal: surat.tanggalDitinggal,
          }
        : {
            id: "",
            pemohonNIK: "",
            pasangan: "",
            tanggalDitinggal: new Date(),
          },
    [surat],
  )

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      updateSuratKeteranganGaib(value)
    },
  })

  if (!surat) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="text-lg font-bold">Edit Surat Keterangan Gaib</h1>
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
                  const selected = pendudukPemohonOptionsRaw.find(
                    (p) => p.value === val,
                  )
                  if (selected) {
                    setSelectedPemohon(selected)
                    field.setValue(selected.value)
                  }
                }}
                isClearable={true}
                onClear={() => {
                  setSelectedPemohon(null)
                  field.setValue("")
                  setSearchKeyPemohon("")
                }}
                items={pendudukPemohonOptions}
                placeholder="Cari Nama pemohon..."
                value={field.state.value}
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        {selectedPemohon && (
          <div className="text-muted-foreground space-y-1 rounded-md border px-4 py-3 text-sm">
            <div>
              <div className="font-medium text-black">Nama Pemohon</div>
              <div>{selectedPemohon.nama || "-"}</div>
            </div>
            <div>
              <div className="font-medium text-black">Tempat Lahir</div>
              <div>{selectedPemohon.tempatLahir || "-"}</div>
            </div>
            <div>
              <div className="font-medium text-black">Tanggal Lahir</div>
              <div>{formatDate(selectedPemohon.tanggalLahir, "D/M/YYYY")}</div>
            </div>
            <div>
              <div className="font-medium text-black">Alamat</div>
              <div>{selectedPemohon.alamat || "-"}</div>
            </div>
            <div>
              <div className="font-medium text-black">Wilayah</div>
              <div>
                {selectedPemohon.wilayah ? (
                  selectedPemohon.wilayah
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

        <form.AppField name="pasangan">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Informasi Pasangan yang Gaib</form.FormLabel>
              <ComboboxPopover
                mode={isDialog ? "inline" : "portal"}
                selectedLabel={selectedPasangan?.label}
                popoverClassName="w-lg max-w-sm lg:max-w-md"
                onInputValueChange={(value) => {
                  setSearchKeyPasangan(value)
                }}
                onValueChange={(val) => {
                  const selected = pendudukPasanganOptionsRaw.find(
                    (p) => p.value === val,
                  )
                  if (selected) {
                    setSelectedPasangan(selected)
                    field.setValue(selected.value)
                  }
                }}
                isClearable={true}
                onClear={() => {
                  setSelectedPasangan(null)
                  field.setValue("")
                  setSearchKeyPasangan("")
                }}
                items={pendudukPasanganOptions}
                placeholder="Cari Nama pasangan yang gaib..."
                value={field.state.value}
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        {selectedPasangan && (
          <div className="text-muted-foreground space-y-1 rounded-md border px-4 py-3 text-sm">
            <div>
              <div className="font-medium text-black">Nama Pasangan</div>
              <div>{selectedPasangan.nama || "-"}</div>
            </div>
            <div>
              <div className="font-medium text-black">Tempat Lahir</div>
              <div>{selectedPasangan.tempatLahir || "-"}</div>
            </div>
            <div>
              <div className="font-medium text-black">Tanggal Lahir</div>
              <div>{formatDate(selectedPasangan.tanggalLahir, "D/M/YYYY")}</div>
            </div>
            <div>
              <div className="font-medium text-black">Alamat</div>
              <div>{selectedPasangan.alamat || "-"}</div>
            </div>
          </div>
        )}

        <form.AppField name="tanggalDitinggal">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Tanggal Ditinggal</form.FormLabel>
              <field.DatePickerField placeholder="Pilih tanggal ditinggal" />
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
