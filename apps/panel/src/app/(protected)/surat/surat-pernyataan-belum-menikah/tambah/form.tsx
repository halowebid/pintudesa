"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SHDK } from "@pintudesa/db/schema"
import { Button, ComboboxPopover } from "@pintudesa/ui"
import { formatDate } from "@pintudesa/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { useAppForm } from "@/components/form"
import { useToast } from "@/components/toast-provider"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

const formSchema = z.object({
  pemohonNIK: z.string().min(1, "NIK pemohon wajib diisi"),
  namaSaksi1: z.string().min(1, "Nama saksi 1 wajib diisi"),
  hubunganSaksi1: z.enum(SHDK),
  namaSaksi2: z.string().optional(),
  hubunganSaksi2: z.enum(SHDK).optional(),
})

export default function SuratPernyataanBelumMenikahForm({
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
  const [searchKeyPemohon, setSearchKeyPemohon] = React.useState("")

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const suratPernyataanBelumMenikahsKey =
    trpc.suratPernyataanBelumMenikah.all.queryKey()

  const invalidateSuratPernyataanBelumMenikahsKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: suratPernyataanBelumMenikahsKey,
    })
  }

  const { data: searchResultsPemohon = [] } = useQuery(
    trpc.penduduk.search.queryOptions(
      { searchQuery: searchKeyPemohon, limit: 10 },
      { enabled: !!searchKeyPemohon },
    ),
  )

  const pendudukOptionsPemohon = React.useMemo(() => {
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

  const { mutate: createSuratPernyataanBelumMenikah } = useMutation(
    trpc.suratPernyataanBelumMenikah.create.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil membuat surat pernyataan belum menikah",
        })
        await invalidateSuratPernyataanBelumMenikahsKey()
        if (isDialog) {
          router.back()
        } else {
          router.push("/surat/surat-pernyataan-belum-menikah")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal membuat surat pernyataan belum menikah")
      },
    }),
  )

  const defaultValues = React.useMemo<z.input<typeof formSchema>>(
    () => ({
      pemohonNIK: "",
      namaSaksi1: "",
      hubunganSaksi1: "anak",
      namaSaksi2: "",
      hubunganSaksi2: "anak",
    }),
    [],
  )

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      createSuratPernyataanBelumMenikah({
        ...value,
        namaSaksi2: value.namaSaksi2,
        hubunganSaksi2: value.hubunganSaksi2,
      })
    },
  })

  const shdkOptions = SHDK.map((value) => {
    const labels = {
      suami: "Suami",
      pembantu: "Pembantu",
      orangtua: "Orang Tua",
      mertua: "Mertua",
      menantu: "Menantu",
      kepala_keluarga: "Kepala Keluarga",
      istri: "Istri",
      cucu: "Cucu",
      anak: "Anak",
      lainnya: "Lainnya",
    }
    return {
      label: labels[value] || value,
      value: value,
    }
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
      className="max-w-md space-y-6"
    >
      {/* Informasi Pemohon */}
      <div className="space-y-4 rounded-md border p-4">
        <h3 className="text-sm font-medium">Informasi Pemohon</h3>

        <form.AppField name="pemohonNIK">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Cari Data Pemohon</form.FormLabel>
              <ComboboxPopover
                mode={isDialog ? "inline" : "portal"}
                selectedLabel={selectedPemohon?.label}
                popoverClassName="w-lg max-w-sm lg:max-w-md"
                onInputValueChange={(value) => {
                  setSearchKeyPemohon(value)
                }}
                onValueChange={(val) => {
                  const selected = pendudukOptionsPemohon.find(
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
                items={pendudukOptionsPemohon.map(({ label, value }) => ({
                  label,
                  value,
                }))}
                placeholder="Cari nama pemohon..."
                value={selectedPemohon?.value}
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
              <div>{selectedPemohon.wilayah || "-"}</div>
            </div>
          </div>
        )}
      </div>

      {/* Informasi Saksi 1 (Wajib) */}
      <div className="space-y-4 rounded-md border p-4">
        <h3 className="text-sm font-medium">Informasi Saksi 1</h3>

        <form.AppField name="namaSaksi1">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Nama Saksi 1</form.FormLabel>
              <field.BaseField placeholder="Masukkan nama saksi 1" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="hubunganSaksi1">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Hubungan dengan Pemohon</form.FormLabel>
              <field.SelectField
                options={shdkOptions}
                placeholder="Pilih hubungan dengan pemohon"
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
      </div>

      {/* Informasi Saksi 2 (Opsional) */}
      <div className="space-y-4 rounded-md border p-4">
        <h3 className="text-sm font-medium">Informasi Saksi 2 (Opsional)</h3>

        <form.AppField name="namaSaksi2">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Nama Saksi 2</form.FormLabel>
              <field.BaseField placeholder="Masukkan nama saksi 2 (opsional)" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="hubunganSaksi2">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Hubungan dengan Pemohon</form.FormLabel>
              <field.SelectField
                options={shdkOptions}
                placeholder="Pilih hubungan dengan pemohon (opsional)"
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
      </div>

      <form.FormItem>
        <Button type="submit">Simpan Surat Pernyataan Belum Menikah</Button>
      </form.FormItem>
    </form>
  )
}
