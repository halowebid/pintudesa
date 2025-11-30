"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  JENIS_KELAMIN,
  JENIS_PEKERJAAN,
  listJenisPekerjaan,
} from "@pintudesa/db/schema"
import { Button, ComboboxPopover } from "@pintudesa/ui"
import { formatDate, formatStringToDate } from "@pintudesa/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import { z } from "zod"

import { useAppForm } from "@/components/form"
import { useToast } from "@/components/toast-provider"
import { useTRPC } from "@/lib/trpc/client"
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
  namaAnak: z.string().min(1, "Nama anak wajib diisi"),
  tempatLahirAnak: z.string().min(1, "Tempat lahir anak wajib diisi"),
  tanggalLahirAnak: requiredDateFlexible,
  jenisKelaminAnak: z.enum(JENIS_KELAMIN),
  nikAyah: z.string().min(1, "NIK ayah wajib diisi"),
  namaAyah: z.string().min(1, "Nama ayah wajib diisi"),
  tempatLahirAyah: z.string().min(1, "Tempat lahir ayah wajib diisi"),
  tanggalLahirAyah: requiredDateFlexible,
  pekerjaanAyah: z.enum(JENIS_PEKERJAAN),
  alamatAyah: z.string().min(1, "Alamat ayah wajib diisi"),
  alamatWilayahAyah: z.string().min(1, "Alamat wilayah ayah wajib diisi"),
  nikIbu: z.string().min(1, "NIK ibu wajib diisi"),
  namaIbu: z.string().min(1, "Nama ibu wajib diisi"),
  tempatLahirIbu: z.string().min(1, "Tempat lahir ibu wajib diisi"),
  tanggalLahirIbu: requiredDateFlexible,
  pekerjaanIbu: z.enum(JENIS_PEKERJAAN),
  alamatIbu: z.string().min(1, "Alamat ibu wajib diisi"),
  alamatWilayahIbu: z.string().min(1, "Alamat wilayah ibu wajib diisi"),
  nikPemohon: z.string().min(1, "NIK pemohon wajib diisi"),
})

export default function SuratKeteranganKelahiranForm({
  isDialog,
}: {
  isDialog: boolean
}) {
  const [selectedAyah, setSelectedAyah] = React.useState<{
    label: string
    value: string
    nama: string
    alamat: string
    tempatLahir: string
    tanggalLahir: Date
    wilayah: string
    pekerjaan: string
  } | null>(null)

  const [selectedIbu, setSelectedIbu] = React.useState<{
    label: string
    value: string
    nama: string
    alamat: string
    tempatLahir: string
    tanggalLahir: Date
    wilayah: string
    pekerjaan: string
  } | null>(null)

  const [selectedPemohon, setSelectedPemohon] = React.useState<{
    label: string
    value: string
    nama: string
    alamat: string
    tempatLahir: string
    tanggalLahir: Date
    wilayah: string
  } | null>(null)

  const [searchKeyAyah, setSearchKeyAyah] = React.useState("")
  const [searchKeyIbu, setSearchKeyIbu] = React.useState("")
  const [searchKeyPemohon, setSearchKeyPemohon] = React.useState("")

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const suratKeteranganKelahiransKey =
    trpc.suratKeteranganKelahiran.all.queryKey()

  const invalidateSuratKeteranganKelahiransKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: suratKeteranganKelahiransKey,
    })
  }

  // Search for male gender (ayah)
  const { data: searchResultsAyah = [] } = useQuery(
    trpc.penduduk.searchByJenisKelamin.queryOptions(
      {
        searchQuery: searchKeyAyah,
        jenisKelamin: "laki-laki",
      },
      { enabled: !!searchKeyAyah },
    ),
  )

  // Search for female gender (ibu)
  const { data: searchResultsIbu = [] } = useQuery(
    trpc.penduduk.searchByJenisKelamin.queryOptions(
      {
        searchQuery: searchKeyIbu,
        jenisKelamin: "perempuan",
      },
      { enabled: !!searchKeyIbu },
    ),
  )

  // Search for pemohon (any gender)
  const { data: searchResultsPemohon = [] } = useQuery(
    trpc.penduduk.search.queryOptions(
      { searchQuery: searchKeyPemohon, limit: 10 },
      { enabled: !!searchKeyPemohon },
    ),
  )

  const pendudukOptionsAyah = React.useMemo(() => {
    return searchResultsAyah.map((p) => {
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
        pekerjaan: p.pekerjaan,
      }
    })
  }, [searchResultsAyah])

  const pendudukOptionsIbu = React.useMemo(() => {
    return searchResultsIbu.map((p) => {
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
        pekerjaan: p.pekerjaan,
      }
    })
  }, [searchResultsIbu])

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

  const { mutate: createSuratKeteranganKelahiran } = useMutation(
    trpc.suratKeteranganKelahiran.create.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil membuat surat keterangan kelahiran",
        })
        await invalidateSuratKeteranganKelahiransKey()
        if (isDialog) {
          router.back()
        } else {
          router.push("/surat/surat-keterangan-kelahiran")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal membuat surat keterangan kelahiran")
      },
    }),
  )

  const defaultValues = React.useMemo<z.input<typeof formSchema>>(
    () => ({
      namaAnak: "",
      tempatLahirAnak: "",
      tanggalLahirAnak: "",
      jenisKelaminAnak: "laki-laki",
      nikAyah: "",
      namaAyah: "",
      tempatLahirAyah: "",
      tanggalLahirAyah: "",
      pekerjaanAyah: "belum_tidak bekerja",
      alamatAyah: "",
      alamatWilayahAyah: "",
      nikIbu: "",
      namaIbu: "",
      tempatLahirIbu: "",
      tanggalLahirIbu: "",
      pekerjaanIbu: "belum_tidak bekerja",
      alamatIbu: "",
      alamatWilayahIbu: "",
      nikPemohon: "",
    }),
    [],
  )

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      createSuratKeteranganKelahiran({
        ...value,
        tanggalLahirAnak: formatStringToDate(value.tanggalLahirAnak),
        tanggalLahirAyah: formatStringToDate(value.tanggalLahirAyah),
        tanggalLahirIbu: formatStringToDate(value.tanggalLahirIbu),
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
      {/* Informasi Anak */}
      <div className="space-y-4 rounded-md border p-4">
        <h3 className="text-sm font-medium">Informasi Anak</h3>

        <form.AppField name="namaAnak">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Nama Anak</form.FormLabel>
              <field.BaseField placeholder="Masukkan nama anak" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="tempatLahirAnak">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Tempat Lahir Anak</form.FormLabel>
              <field.BaseField placeholder="Masukkan tempat lahir anak" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="tanggalLahirAnak">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Tanggal Lahir Anak</form.FormLabel>
              <field.DatePickerField mode={isDialog ? "inline" : "portal"} />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="jenisKelaminAnak">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Jenis Kelamin Anak</form.FormLabel>
              <field.SelectField
                options={[
                  { label: "Laki-laki", value: "laki-laki" },
                  { label: "Perempuan", value: "perempuan" },
                ]}
                placeholder="Pilih jenis kelamin"
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
      </div>

      {/* Informasi Ayah */}
      <div className="space-y-4 rounded-md border p-4">
        <h3 className="text-sm font-medium">Informasi Ayah</h3>

        <form.AppField name="nikAyah">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Cari Data Ayah</form.FormLabel>
              <ComboboxPopover
                mode={isDialog ? "inline" : "portal"}
                selectedLabel={selectedAyah?.label}
                popoverClassName="w-lg max-w-sm lg:max-w-md"
                onInputValueChange={(value) => {
                  setSearchKeyAyah(value)
                }}
                onValueChange={(val) => {
                  const selected = pendudukOptionsAyah.find(
                    (p) => p.value === val,
                  )
                  if (selected) {
                    setSelectedAyah(selected)
                    field.setValue(selected.value)
                    form.setFieldValue("namaAyah", selected.nama)
                    form.setFieldValue("tempatLahirAyah", selected.tempatLahir)
                    form.setFieldValue(
                      "tanggalLahirAyah",
                      formatDate(selected.tanggalLahir, "DD/MM/YYYY"),
                    )
                    form.setFieldValue("alamatAyah", selected.alamat)
                    form.setFieldValue("alamatWilayahAyah", selected.wilayah)
                    form.setFieldValue("pekerjaanAyah", selected.pekerjaan)
                  }
                }}
                isClearable={true}
                onClear={() => {
                  setSelectedAyah(null)
                  field.setValue("")
                  setSearchKeyAyah("")
                }}
                items={pendudukOptionsAyah.map(({ label, value }) => ({
                  label,
                  value,
                }))}
                placeholder="Cari nama ayah..."
                value={selectedAyah?.value}
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
            <div>
              <div className="font-medium text-black">Wilayah</div>
              <div>{selectedAyah.wilayah || "-"}</div>
            </div>
          </div>
        )}

        <form.AppField name="namaAyah">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Nama Ayah</form.FormLabel>
              <field.BaseField placeholder="Masukkan nama ayah" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="tempatLahirAyah">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Tempat Lahir Ayah</form.FormLabel>
              <field.BaseField placeholder="Masukkan tempat lahir ayah" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="tanggalLahirAyah">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Tanggal Lahir Ayah</form.FormLabel>
              <field.DatePickerField mode={isDialog ? "inline" : "portal"} />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="pekerjaanAyah">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Pekerjaan Ayah</form.FormLabel>
              <field.SelectField
                options={listJenisPekerjaan.map((pekerjaan, index) => ({
                  label: pekerjaan,
                  value: JENIS_PEKERJAAN[index],
                }))}
                placeholder="Pilih pekerjaan ayah"
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="alamatAyah">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Alamat Ayah</form.FormLabel>
              <field.TextareaField placeholder="Masukkan alamat ayah" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="alamatWilayahAyah">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Alamat Wilayah Ayah</form.FormLabel>
              <field.TextareaField placeholder="Masukkan alamat wilayah ayah" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
      </div>

      {/* Informasi Ibu */}
      <div className="space-y-4 rounded-md border p-4">
        <h3 className="text-sm font-medium">Informasi Ibu</h3>

        <form.AppField name="nikIbu">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Cari Data Ibu</form.FormLabel>
              <ComboboxPopover
                mode={isDialog ? "inline" : "portal"}
                selectedLabel={selectedIbu?.label}
                popoverClassName="w-lg max-w-sm lg:max-w-md"
                onInputValueChange={(value) => {
                  setSearchKeyIbu(value)
                }}
                onValueChange={(val) => {
                  const selected = pendudukOptionsIbu.find(
                    (p) => p.value === val,
                  )
                  if (selected) {
                    setSelectedIbu(selected)
                    field.setValue(selected.value)
                    form.setFieldValue("namaIbu", selected.nama)
                    form.setFieldValue("tempatLahirIbu", selected.tempatLahir)
                    form.setFieldValue(
                      "tanggalLahirIbu",
                      formatDate(selected.tanggalLahir, "DD/MM/YYYY"),
                    )
                    form.setFieldValue("alamatIbu", selected.alamat)
                    form.setFieldValue("alamatWilayahIbu", selected.wilayah)
                    form.setFieldValue("pekerjaanIbu", selected.pekerjaan)
                  }
                }}
                isClearable={true}
                onClear={() => {
                  setSelectedIbu(null)
                  field.setValue("")
                  setSearchKeyIbu("")
                }}
                items={pendudukOptionsIbu.map(({ label, value }) => ({
                  label,
                  value,
                }))}
                placeholder="Cari nama ibu..."
                value={selectedIbu?.value}
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
            <div>
              <div className="font-medium text-black">Wilayah</div>
              <div>{selectedIbu.wilayah || "-"}</div>
            </div>
          </div>
        )}

        <form.AppField name="namaIbu">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Nama Ibu</form.FormLabel>
              <field.BaseField placeholder="Masukkan nama ibu" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="tempatLahirIbu">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Tempat Lahir Ibu</form.FormLabel>
              <field.BaseField placeholder="Masukkan tempat lahir ibu" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="tanggalLahirIbu">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Tanggal Lahir Ibu</form.FormLabel>
              <field.DatePickerField mode={isDialog ? "inline" : "portal"} />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="pekerjaanIbu">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Pekerjaan Ibu</form.FormLabel>
              <field.SelectField
                options={listJenisPekerjaan.map((pekerjaan, index) => ({
                  label: pekerjaan,
                  value: JENIS_PEKERJAAN[index],
                }))}
                placeholder="Pilih pekerjaan ibu"
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="alamatIbu">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Alamat Ibu</form.FormLabel>
              <field.TextareaField placeholder="Masukkan alamat ibu" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="alamatWilayahIbu">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Alamat Wilayah Ibu</form.FormLabel>
              <field.TextareaField placeholder="Masukkan alamat wilayah ibu" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
      </div>

      {/* Informasi Pemohon */}
      <div className="space-y-4 rounded-md border p-4">
        <h3 className="text-sm font-medium">Informasi Pemohon</h3>

        <form.AppField name="nikPemohon">
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

      <form.FormItem>
        <Button type="submit">Simpan Surat Keterangan Kelahiran</Button>
      </form.FormItem>
    </form>
  )
}
