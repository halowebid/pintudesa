"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button, ComboboxPopover } from "@pintudesa/ui"
import { formatDate } from "@pintudesa/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { useAppForm } from "@/components/form"
import { useToast } from "@/components/toast-provider"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

const formSchema = z.object({
  id: z.string(),
  pemohonNIK: z.string().min(1, "NIK pemohon wajib diisi"),
  NIKAyah: z.string().min(1, "NIK ayah wajib diisi"),
  NIKIbu: z.string().min(1, "NIK ibu wajib diisi"),
  tujuanPembuatan: z.string().min(1, "Tujuan pembuatan wajib diisi"),
  namaSekolahAtauUniversitas: z
    .string()
    .min(1, "Nama sekolah/universitas wajib diisi"),
})

export default function SuratKeteranganPenghasilanOrangTuaEditForm({
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
  const [selectedAyah, setSelectedAyah] = React.useState<{
    label: string
    value: string
    nama: string
    alamat: string
    tempatLahir: string
    tanggalLahir: Date
    wilayah: string
  } | null>(null)
  const [selectedIbu, setSelectedIbu] = React.useState<{
    label: string
    value: string
    nama: string
    alamat: string
    tempatLahir: string
    tanggalLahir: Date
    wilayah: string
  } | null>(null)
  const [searchKeyPemohon, setSearchKeyPemohon] = React.useState("")
  const [searchKeyAyah, setSearchKeyAyah] = React.useState("")
  const [searchKeyIbu, setSearchKeyIbu] = React.useState("")

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const suratKeteranganPenghasilanOrangTuasKey =
    trpc.suratKeteranganPnghasilanOrangTua.all.queryKey()
  const suratKeteranganPenghasilanOrangTuaByIdKey =
    trpc.suratKeteranganPnghasilanOrangTua.byId.queryKey(id)

  const invalidateSuratKeteranganPenghasilanOrangTuaByIdKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: suratKeteranganPenghasilanOrangTuaByIdKey,
    })
  }
  const invalidateSuratKeteranganPenghasilanOrangTuasKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: suratKeteranganPenghasilanOrangTuasKey,
    })
  }

  const { data: surat } = useQuery(
    trpc.suratKeteranganPnghasilanOrangTua.byId.queryOptions(id),
  )

  const { data: searchResultsPemohon = [] } = useQuery(
    trpc.penduduk.search.queryOptions(
      { searchQuery: searchKeyPemohon, limit: 10 },
      { enabled: !!searchKeyPemohon },
    ),
  )

  const { data: searchResultsAyah = [] } = useQuery(
    trpc.penduduk.search.queryOptions(
      { searchQuery: searchKeyAyah, limit: 10 },
      { enabled: !!searchKeyAyah },
    ),
  )

  const { data: searchResultsIbu = [] } = useQuery(
    trpc.penduduk.search.queryOptions(
      { searchQuery: searchKeyIbu, limit: 10 },
      { enabled: !!searchKeyIbu },
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

  const pendudukAyahOptionsRaw = React.useMemo(() => {
    return searchResultsAyah.map((p) => ({
      label: `${p.nik} - ${p.namaLengkap}`,
      value: p.id,
      nama: p.namaLengkap,
      alamat: p.alamat,
      tempatLahir: p.tempatLahir,
      tanggalLahir: p.tanggalLahir,
      wilayah: formatWilayah(p),
    }))
  }, [searchResultsAyah])

  const pendudukIbuOptionsRaw = React.useMemo(() => {
    return searchResultsIbu.map((p) => ({
      label: `${p.nik} - ${p.namaLengkap}`,
      value: p.id,
      nama: p.namaLengkap,
      alamat: p.alamat,
      tempatLahir: p.tempatLahir,
      tanggalLahir: p.tanggalLahir,
      wilayah: formatWilayah(p),
    }))
  }, [searchResultsIbu])

  const pendudukPemohonOptions = React.useMemo(
    () =>
      pendudukPemohonOptionsRaw.map(({ label, value }) => ({ label, value })),
    [pendudukPemohonOptionsRaw],
  )

  const pendudukAyahOptions = React.useMemo(
    () => pendudukAyahOptionsRaw.map(({ label, value }) => ({ label, value })),
    [pendudukAyahOptionsRaw],
  )

  const pendudukIbuOptions = React.useMemo(
    () => pendudukIbuOptionsRaw.map(({ label, value }) => ({ label, value })),
    [pendudukIbuOptionsRaw],
  )

  const { mutate: updateSuratKeteranganPenghasilanOrangTua } = useMutation(
    trpc.suratKeteranganPnghasilanOrangTua.update.mutationOptions({
      onSuccess: async () => {
        toast({
          description:
            "Berhasil memperbarui surat keterangan penghasilan orang tua",
        })
        await invalidateSuratKeteranganPenghasilanOrangTuaByIdKey()
        await invalidateSuratKeteranganPenghasilanOrangTuasKey()
        if (isDialog) {
          router.back()
        } else {
          router.push("/surat/surat-keterangan-penghasilan-orang-tua")
        }
      },
      onError: (error) => {
        handleError(
          error,
          "Gagal memperbarui surat keterangan penghasilan orang tua",
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
            NIKAyah: surat.NIKAyah,
            NIKIbu: surat.NIKIbu,
            tujuanPembuatan: surat.tujuanPembuatan,
            namaSekolahAtauUniversitas: surat.namaSekolahAtauUniversitas,
          }
        : {
            id: "",
            pemohonNIK: "",
            NIKAyah: "",
            NIKIbu: "",
            tujuanPembuatan: "",
            namaSekolahAtauUniversitas: "",
          },
    [surat],
  )

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      updateSuratKeteranganPenghasilanOrangTua({
        ...value,
        pendudukIds: [],
      } as Parameters<typeof updateSuratKeteranganPenghasilanOrangTua>[0])
    },
  })

  if (!surat) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="text-lg font-bold">
        Edit Surat Keterangan Penghasilan Orang Tua
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
              <form.FormLabel>Informasi Pemohon (Anak)</form.FormLabel>
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

        <form.AppField name="NIKAyah">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Informasi Ayah</form.FormLabel>
              <ComboboxPopover
          mode={isDialog ? "inline" : "portal"}
          selectedLabel={selectedAyah?.label}
                popoverClassName="w-lg max-w-sm lg:max-w-md"
                onInputValueChange={(value) => {
                  setSearchKeyAyah(value)
                }}
                onValueChange={(val) => {
                  const selected = pendudukAyahOptionsRaw.find(
                    (p) => p.value === val,
                  )
                  if (selected) {
                    setSelectedAyah(selected)
                    field.setValue(selected.value)
                  }
                }}
                isClearable={true}
                onClear={() => {
                  setSelectedAyah(null)
                  field.setValue("")
                  setSearchKeyAyah("")
                }}
                items={pendudukAyahOptions}
                placeholder="Cari Nama ayah..."
                value={field.state.value}
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        {selectedAyah && (
          <div className="text-muted-foreground space-y-1 rounded-md border px-4 py-3 text-sm">
            <div>
              <div className="font-medium text-black">Nama Ayah</div>
              <div>{selectedAyah.nama || "-"}</div>
            </div>
            <div>
              <div className="font-medium text-black">Tempat Lahir</div>
              <div>{selectedAyah.tempatLahir || "-"}</div>
            </div>
            <div>
              <div className="font-medium text-black">Tanggal Lahir</div>
              <div>{formatDate(selectedAyah.tanggalLahir, "D/M/YYYY")}</div>
            </div>
            <div>
              <div className="font-medium text-black">Alamat</div>
              <div>{selectedAyah.alamat || "-"}</div>
            </div>
          </div>
        )}

        <form.AppField name="NIKIbu">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Informasi Ibu</form.FormLabel>
              <ComboboxPopover
          mode={isDialog ? "inline" : "portal"}
          selectedLabel={selectedIbu?.label}
                popoverClassName="w-lg max-w-sm lg:max-w-md"
                onInputValueChange={(value) => {
                  setSearchKeyIbu(value)
                }}
                onValueChange={(val) => {
                  const selected = pendudukIbuOptionsRaw.find(
                    (p) => p.value === val,
                  )
                  if (selected) {
                    setSelectedIbu(selected)
                    field.setValue(selected.value)
                  }
                }}
                isClearable={true}
                onClear={() => {
                  setSelectedIbu(null)
                  field.setValue("")
                  setSearchKeyIbu("")
                }}
                items={pendudukIbuOptions}
                placeholder="Cari Nama ibu..."
                value={field.state.value}
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        {selectedIbu && (
          <div className="text-muted-foreground space-y-1 rounded-md border px-4 py-3 text-sm">
            <div>
              <div className="font-medium text-black">Nama Ibu</div>
              <div>{selectedIbu.nama || "-"}</div>
            </div>
            <div>
              <div className="font-medium text-black">Tempat Lahir</div>
              <div>{selectedIbu.tempatLahir || "-"}</div>
            </div>
            <div>
              <div className="font-medium text-black">Tanggal Lahir</div>
              <div>{formatDate(selectedIbu.tanggalLahir, "D/M/YYYY")}</div>
            </div>
            <div>
              <div className="font-medium text-black">Alamat</div>
              <div>{selectedIbu.alamat || "-"}</div>
            </div>
          </div>
        )}

        <form.AppField name="tujuanPembuatan">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Tujuan Pembuatan</form.FormLabel>
              <field.TextareaField placeholder="Masukkan tujuan pembuatan surat" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="namaSekolahAtauUniversitas">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Nama Sekolah atau Universitas</form.FormLabel>
              <field.BaseField placeholder="Contoh: SMA Negeri 1, Universitas Indonesia" />
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
