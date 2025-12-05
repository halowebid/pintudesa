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
  pemohonNik: z.string().min(1, "NIK wajib diisi"),
  tujuanPembuatan: z.string().min(1, "Tujuan pembuatan wajib diisi"),
  namaLain: z.string().min(1, "Nama lain wajib diisi"),
})

export default function SuratKeteranganBedaNamaForm({
  isDialog,
}: {
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

  const suratKeteranganBedaNamasKey =
    trpc.suratKeteranganBedaNama.all.queryKey()

  const invalidateSuratKeteranganBedaNamasKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: suratKeteranganBedaNamasKey,
    })
  }
  const { data: searchResults = [] } = useQuery(
    trpc.penduduk.search.queryOptions(
      { searchQuery: searchKey, limit: 10 },
      { enabled: !!searchKey },
    ),
  )

  const pendudukOptionsRaw = React.useMemo(() => {
    return searchResults.map((p) => {
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
  }, [searchResults])

  const pendudukOptions = React.useMemo(
    () => pendudukOptionsRaw.map(({ label, value }) => ({ label, value })),
    [pendudukOptionsRaw],
  )

  const { mutate: createSuratKeteranganBedaNama } = useMutation(
    trpc.suratKeteranganBedaNama.create.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil menyimpan surat keterangan beda nama",
        })
        await invalidateSuratKeteranganBedaNamasKey()
        if (isDialog) {
          router.back()
        } else {
          router.push("/dashboard/surat/surat-keterangan-beda-nama")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal menyimpan surat keterangan beda nama")
      },
    }),
  )

  const defaultValues = React.useMemo<z.input<typeof formSchema>>(
    () => ({
      pemohonNik: "",
      tujuanPembuatan: "",
      namaLain: "",
    }),
    [],
  )

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      createSuratKeteranganBedaNama(value)
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

      <form.AppField name="namaLain">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Nama Lain</form.FormLabel>
            <field.BaseField placeholder="Masukkan nama lain" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="tujuanPembuatan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Tujuan Pembuatan</form.FormLabel>
            <field.TextareaField placeholder="Masukkan tujuan pembuatan surat" />
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
