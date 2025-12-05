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
  pemohonNik: z.string().min(1, "NIK wajib diisi"),
  bidangUsaha: z.string().min(1, "Bidang usaha wajib diisi"),
  merkUsaha: z.string().min(1, "Merk usaha wajib diisi"),
  alamatUsaha: z.string().min(1, "Alamat usaha wajib diisi"),
  berdasarkan: z.string().min(1, "Berdasarkan wajib diisi"),
})

export default function SuratKeteranganUsahaForm({
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

  const suratKeteranganUsahasKey = trpc.suratKeteranganUsaha.all.queryKey()

  const invalidateSuratKeteranganUsahasKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: suratKeteranganUsahasKey,
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

  const { mutate: createSuratKeteranganUsaha } = useMutation(
    trpc.suratKeteranganUsaha.create.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil menyimpan surat keterangan usaha",
        })
        await invalidateSuratKeteranganUsahasKey()
        if (isDialog) {
          router.back()
        } else {
          router.push("/dashboard/surat/surat-keterangan-usaha")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal menyimpan surat keterangan usaha")
      },
    }),
  )

  const defaultValues = React.useMemo<z.input<typeof formSchema>>(
    () => ({
      pemohonNik: "",
      bidangUsaha: "",
      merkUsaha: "",
      alamatUsaha: "",
      berdasarkan: "",
    }),
    [],
  )

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      createSuratKeteranganUsaha(value)
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
