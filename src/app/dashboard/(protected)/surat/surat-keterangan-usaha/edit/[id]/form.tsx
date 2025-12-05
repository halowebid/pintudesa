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
  pemohonNik: z.string().min(1, "NIK wajib diisi"),
  bidangUsaha: z.string().min(1, "Bidang usaha wajib diisi"),
  merkUsaha: z.string().min(1, "Merk usaha wajib diisi"),
  alamatUsaha: z.string().min(1, "Alamat usaha wajib diisi"),
  berdasarkan: z.string().min(1, "Berdasarkan wajib diisi"),
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

export default function SuratKeteranganUsahaEditForm({
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

  const suratKeteranganUsahasKey = trpc.suratKeteranganUsaha.all.queryKey()
  const suratKeteranganUsahaByIdKey =
    trpc.suratKeteranganUsaha.byId.queryKey(id)

  const invalidateSuratKeteranganUsahaByIdKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: suratKeteranganUsahaByIdKey,
    })
  }
  const invalidateSuratKeteranganUsahasKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: suratKeteranganUsahasKey,
    })
  }

  const { data: surat } = useQuery(
    trpc.suratKeteranganUsaha.byId.queryOptions(id),
  )

  const { data: pemohonData } = useQuery(
    trpc.penduduk.byId.queryOptions(surat?.pemohonNik ?? "", {
      enabled: !!surat?.pemohonNik,
    }),
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

  React.useEffect(() => {
    if (!pemohonData) return

    setSelectedPenduduk({
      label: `${pemohonData.nik} - ${pemohonData.namaLengkap}`,
      value: pemohonData.id,
      nama: pemohonData.namaLengkap,
      alamat: pemohonData.alamat,
      tempatLahir: pemohonData.tempatLahir,
      tanggalLahir: pemohonData.tanggalLahir,
      wilayah: formatWilayah(pemohonData),
    })
  }, [pemohonData])

  const { mutate: updateSuratKeteranganUsaha } = useMutation(
    trpc.suratKeteranganUsaha.update.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil mengubah surat keterangan usaha",
        })
        await invalidateSuratKeteranganUsahaByIdKey()
        await invalidateSuratKeteranganUsahasKey()
        if (isDialog) {
          router.back()
        } else {
          router.push("/dashboard/surat/surat-keterangan-usaha")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal mengubah surat keterangan usaha")
      },
    }),
  )

  const defaultValues = React.useMemo<z.input<typeof formSchema>>(
    () => ({
      id: surat?.id ?? "",
      pemohonNik: surat?.pemohonNik ?? "",
      bidangUsaha: surat?.bidangUsaha ?? "",
      merkUsaha: surat?.merkUsaha ?? "",
      alamatUsaha: surat?.alamatUsaha ?? "",
      berdasarkan: surat?.berdasarkan ?? "",
    }),
    [surat],
  )

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      updateSuratKeteranganUsaha(value)
    },
  })

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
      <form.AppField name="pemohonNik">
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

      <form.AppField name="bidangUsaha">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Bidang Usaha</form.FormLabel>
            <field.BaseField placeholder="Masukkan bidang usaha" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="merkUsaha">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Merk Usaha</form.FormLabel>
            <field.BaseField placeholder="Masukkan merk usaha" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="alamatUsaha">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Alamat Usaha</form.FormLabel>
            <field.TextareaField placeholder="Masukkan alamat usaha" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="berdasarkan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Berdasarkan</form.FormLabel>
            <field.TextareaField placeholder="Masukkan berdasarkan (referensi/dasar pembuatan surat)" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.FormItem>
        <Button type="submit">Simpan Surat</Button>
      </form.FormItem>
    </form>
  )
}
