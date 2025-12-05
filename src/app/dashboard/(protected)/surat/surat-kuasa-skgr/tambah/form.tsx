"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import { z } from "zod"

import { useAppForm } from "@/components/dashboard/form"
import { useToast } from "@/components/toast-provider"
import { JENIS_PEKERJAAN, listJenisPekerjaan } from "@/lib/db/schema"
import { useTRPC } from "@/lib/trpc/client"
import { Button, ComboboxPopover } from "@/lib/ui"
import { formatDate, formatStringToDate } from "@/lib/utils"
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
  yangDiberiKuasaNama: z.string().min(1, "Nama yang diberi kuasa wajib diisi"),
  yangDiberiKuasaTempatLahir: z.string().min(1, "Tempat lahir wajib diisi"),
  yangDiberiKuasaTanggalLahir: requiredDateFlexible,
  yangDiberiKuasaPekerjaan: z.enum(JENIS_PEKERJAAN),
  yangDiberiKuasaAlamat: z.string().min(1, "Alamat wajib diisi"),
  yangDiberiKuasaAlamatWilayah: z.string().min(1, "Alamat wilayah wajib diisi"),
  kuasaUntuk: z.string().min(1, "Kuasa untuk wajib diisi"),
  kuasaAtas: z.string().min(1, "Kuasa atas wajib diisi"),
  tujuanKuasa: z.string().min(1, "Tujuan kuasa wajib diisi"),
  atasNama: z.string().min(1, "Atas nama wajib diisi"),
  noReg: z.string().min(1, "Nomor registrasi wajib diisi"),
  tanggalSurat: requiredDateFlexible,
  lokasiTanah: z.string().min(1, "Lokasi tanah wajib diisi"),
  luasTanah: z.string().min(1, "Luas tanah wajib diisi"),
  kuasaDariId: z.string().min(1, "Kuasa dari wajib diisi"),
})

export default function SuratKuasaSKGRForm({
  isDialog,
}: {
  isDialog: boolean
}) {
  const [selectedKuasaDari, setSelectedKuasaDari] = React.useState<{
    label: string
    value: string
    nama: string
    alamat: string
    tempatLahir: string
    tanggalLahir: Date
    wilayah: string
  } | null>(null)
  const [searchKeyKuasaDari, setSearchKeyKuasaDari] = React.useState("")

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const suratKuasaSKGRsKey = trpc.suratKuasaSKGR.all.queryKey()

  const invalidateSuratKuasaSKGRsKey = async () => {
    await queryClient.invalidateQueries({ queryKey: suratKuasaSKGRsKey })
  }

  const { data: searchResultsKuasaDari = [] } = useQuery(
    trpc.penduduk.search.queryOptions(
      { searchQuery: searchKeyKuasaDari, limit: 10 },
      { enabled: !!searchKeyKuasaDari },
    ),
  )

  const pendudukOptionsKuasaDari = React.useMemo(() => {
    return searchResultsKuasaDari.map((p) => {
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
  }, [searchResultsKuasaDari])

  const { mutate: createSuratKuasaSKGR } = useMutation(
    trpc.suratKuasaSKGR.create.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil membuat surat kuasa SKGR",
        })
        await invalidateSuratKuasaSKGRsKey()
        if (isDialog) {
          router.back()
        } else {
          router.push("/dashboard/surat/surat-kuasa-skgr")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal membuat surat kuasa SKGR")
      },
    }),
  )

  const defaultValues = React.useMemo<z.input<typeof formSchema>>(
    () => ({
      yangDiberiKuasaNama: "",
      yangDiberiKuasaTempatLahir: "",
      yangDiberiKuasaTanggalLahir: "",
      yangDiberiKuasaPekerjaan: "belum_tidak bekerja",
      yangDiberiKuasaAlamat: "",
      yangDiberiKuasaAlamatWilayah: "",
      kuasaUntuk: "",
      kuasaAtas: "",
      tujuanKuasa: "",
      atasNama: "",
      noReg: "",
      tanggalSurat: "",
      lokasiTanah: "",
      luasTanah: "",
      kuasaDariId: "",
    }),
    [],
  )

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      createSuratKuasaSKGR({
        ...value,
        yangDiberiKuasaTanggalLahir: formatStringToDate(
          value.yangDiberiKuasaTanggalLahir,
        ),
        tanggalSurat: formatStringToDate(value.tanggalSurat),
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
      {/* Informasi Yang Diberi Kuasa */}
      <div className="space-y-4 rounded-md border p-4">
        <h3 className="text-sm font-medium">Informasi Yang Diberi Kuasa</h3>

        <form.AppField name="yangDiberiKuasaNama">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Nama Yang Diberi Kuasa</form.FormLabel>
              <field.BaseField placeholder="Masukkan nama yang diberi kuasa" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="yangDiberiKuasaTempatLahir">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Tempat Lahir</form.FormLabel>
              <field.BaseField placeholder="Masukkan tempat lahir" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="yangDiberiKuasaTanggalLahir">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Tanggal Lahir</form.FormLabel>
              <field.DatePickerField mode={isDialog ? "inline" : "portal"} />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="yangDiberiKuasaPekerjaan">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Pekerjaan</form.FormLabel>
              <field.SelectField
                options={listJenisPekerjaan.map((pekerjaan, index) => ({
                  label: pekerjaan,
                  value: JENIS_PEKERJAAN[index],
                }))}
                placeholder="Pilih pekerjaan"
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="yangDiberiKuasaAlamat">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Alamat</form.FormLabel>
              <field.TextareaField placeholder="Masukkan alamat" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="yangDiberiKuasaAlamatWilayah">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Alamat Wilayah</form.FormLabel>
              <field.TextareaField placeholder="Masukkan alamat wilayah" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
      </div>

      {/* Informasi Kuasa */}
      <div className="space-y-4 rounded-md border p-4">
        <h3 className="text-sm font-medium">Informasi Kuasa</h3>

        <form.AppField name="kuasaUntuk">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Kuasa Untuk</form.FormLabel>
              <field.TextareaField placeholder="Masukkan kuasa untuk" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="kuasaAtas">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Kuasa Atas</form.FormLabel>
              <field.TextareaField placeholder="Masukkan kuasa atas" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="tujuanKuasa">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Tujuan Kuasa</form.FormLabel>
              <field.TextareaField placeholder="Masukkan tujuan kuasa" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="atasNama">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Atas Nama</form.FormLabel>
              <field.BaseField placeholder="Masukkan atas nama" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="noReg">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Nomor Registrasi</form.FormLabel>
              <field.BaseField placeholder="Masukkan nomor registrasi" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="tanggalSurat">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Tanggal Surat</form.FormLabel>
              <field.DatePickerField mode={isDialog ? "inline" : "portal"} />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="lokasiTanah">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Lokasi Tanah</form.FormLabel>
              <field.TextareaField placeholder="Masukkan lokasi tanah" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="luasTanah">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Luas Tanah</form.FormLabel>
              <field.BaseField placeholder="Masukkan luas tanah (contoh: 100 m²)" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
      </div>

      {/* Informasi Kuasa Dari */}
      <div className="space-y-4 rounded-md border p-4">
        <h3 className="text-sm font-medium">Informasi Kuasa Dari</h3>

        <form.AppField name="kuasaDariId">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Cari Data Kuasa Dari</form.FormLabel>
              <ComboboxPopover
                mode={isDialog ? "inline" : "portal"}
                selectedLabel={selectedKuasaDari?.label}
                popoverClassName="w-lg max-w-sm lg:max-w-md"
                onInputValueChange={(value) => {
                  setSearchKeyKuasaDari(value)
                }}
                onValueChange={(val) => {
                  const selected = pendudukOptionsKuasaDari.find(
                    (p) => p.value === val,
                  )
                  if (selected) {
                    setSelectedKuasaDari(selected)
                    field.setValue(selected.value)
                  }
                }}
                isClearable={true}
                onClear={() => {
                  setSelectedKuasaDari(null)
                  field.setValue("")
                  setSearchKeyKuasaDari("")
                }}
                items={pendudukOptionsKuasaDari.map(({ label, value }) => ({
                  label,
                  value,
                }))}
                placeholder="Cari nama kuasa dari..."
                value={selectedKuasaDari?.value}
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        {selectedKuasaDari && (
          <div className="text-muted-foreground space-y-1 rounded-md border px-4 py-3 text-sm">
            <div>
              <div className="font-medium text-black">Nama Kuasa Dari</div>
              <div>{selectedKuasaDari.nama || "-"}</div>
            </div>
            <div>
              <div className="font-medium text-black">Tempat Lahir</div>
              <div>{selectedKuasaDari.tempatLahir || "-"}</div>
            </div>
            <div>
              <div className="font-medium text-black">Tanggal Lahir</div>
              <div>
                {formatDate(selectedKuasaDari.tanggalLahir, "D/M/YYYY")}
              </div>
            </div>
            <div>
              <div className="font-medium text-black">Alamat</div>
              <div>{selectedKuasaDari.alamat || "-"}</div>
            </div>
            <div>
              <div className="font-medium text-black">Wilayah</div>
              <div>{selectedKuasaDari.wilayah || "-"}</div>
            </div>
          </div>
        )}
      </div>

      <form.FormItem>
        <Button type="submit">Simpan Surat Kuasa SKGR</Button>
      </form.FormItem>
    </form>
  )
}
