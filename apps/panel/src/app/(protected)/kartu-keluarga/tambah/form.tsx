"use client"

import React from "react"
import { useRouter } from "next/navigation"
import {
  AGAMA,
  ASAL_PENDUDUK,
  JENIS_KELAMIN,
  JENIS_PEKERJAAN,
  KATEGORI_PENDUDUK,
  PENDIDIKAN_TERAKHIR,
  SHDK,
  STATUS_DOMISILI,
  STATUS_PERKAWINAN,
} from "@pintudesa/db/schema"
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@pintudesa/ui"
import { formatStringToDate } from "@pintudesa/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import { z } from "zod"

import { useAppForm } from "@/components/form"
import { useToast } from "@/components/toast-provider"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

const dateFlexible = z
  .union([z.string(), z.date()])
  .refine(
    (val) => {
      if (typeof val === "string") {
        return dayjs(val, "DD/MM/YYYY", true).isValid()
      }
      return val instanceof Date && !isNaN(val.getTime())
    },
    {
      message: "Tanggal tidak valid, harus format MM/DD/YYYY",
    },
  )
  .transform((val) => {
    if (typeof val === "string") {
      return dayjs(val, "DD/MM/YYYY").toDate()
    }
    return val
  })

const pendudukSchema = z.object({
  namaLengkap: z.string().min(1, "Nama lengkap wajib diisi"),
  nik: z.string().min(1, "NIK wajib diisi"),
  tempatLahir: z.string().min(1, "Tempat lahir wajib diisi"),
  tanggalLahir: dateFlexible,
  jenisKelamin: z.enum(JENIS_KELAMIN),
  agama: z.enum(AGAMA),
  pendidikanTerakhir: z.enum(PENDIDIKAN_TERAKHIR),
  pekerjaan: z.enum(JENIS_PEKERJAAN),
  statusPerkawinan: z.enum(STATUS_PERKAWINAN),
  statusDomisili: z.enum(STATUS_DOMISILI),
  asalPenduduk: z.enum(ASAL_PENDUDUK),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  rt: z.string().min(1, "RT wajib diisi"),
  rw: z.string().min(1, "RW wajib diisi"),
  provinsi: z.string().min(1, "Provinsi wajib diisi"),
  kabupaten_kota: z.string().min(1, "Kabupaten/Kota wajib diisi"),
  kecamatan: z.string().min(1, "Kecamatan wajib diisi"),
  desa_kelurahan: z.string().min(1, "Desa/Kelurahan wajib diisi"),
  dusun: z.string().optional(),
  namaAyahKandung: z.string().min(1, "Nama ayah kandung wajib diisi"),
  namaIbuKandung: z.string().min(1, "Nama ibu kandung wajib diisi"),
  bantuanSosial: z.boolean().optional().default(false),
  disabilitas: z.boolean().optional().default(false),
  shdk: z.enum(SHDK, {
    errorMap: () => ({ message: "SHDK wajib dipilih" }),
  }),
})
const kartuKeluargaSchema = z.object({
  kategoriPenduduk: z.enum(KATEGORI_PENDUDUK).default("penduduk_dalam_desa"),
  nomorKartuKeluarga: z.string().min(1, "Nomor KK wajib diisi"),
})

const combinedSchema = z.object({
  kartuKeluarga: kartuKeluargaSchema,
  kepalaKeluarga: pendudukSchema,
})

export default function PendudukForm({ isDialog }: { isDialog: boolean }) {
  const [anggotaList, setAnggotaList] = React.useState<
    z.infer<typeof pendudukSchema>[]
  >([])
  const [showAnggotaModal, setShowAnggotaModal] = React.useState(false)

  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const kartuKeluargasKey = trpc.kartuKeluarga.all.queryKey()
  const invalidateKartuKeluargasKey = async () => {
    await queryClient.invalidateQueries({ queryKey: kartuKeluargasKey })
  }
  const { mutateAsync: createKartuKeluarga } = useMutation(
    trpc.kartuKeluarga.create.mutationOptions({
      onError: (error) => {
        handleError(error, "Gagal membuat kartu keluarga")
      },
    }),
  )

  const { mutateAsync: createPenduduk } = useMutation(
    trpc.penduduk.create.mutationOptions({
      onError: (error) => {
        handleError(error, "Gagal membuat penduduk")
      },
    }),
  )

  const { mutateAsync: createAnggotaKeluarga } = useMutation(
    trpc.anggotaKeluarga.create.mutationOptions({
      onError: (error) => {
        handleError(error, "Gagal membuat anggota keluarga")
      },
    }),
  )

  const defaultValues: z.input<typeof combinedSchema> = {
    kartuKeluarga: {
      kategoriPenduduk: "penduduk_dalam_desa",
      nomorKartuKeluarga: "",
    },

    kepalaKeluarga: {
      namaLengkap: "",
      nik: "",
      tempatLahir: "",
      tanggalLahir: new Date(),
      jenisKelamin: "laki-laki",
      agama: "islam",
      pendidikanTerakhir: "tidak_atau_belum_sekolah",
      pekerjaan: "lainnya",
      statusPerkawinan: "belum_kawin",
      statusDomisili: "ktp_beralamat_di_desa_berdomisili_di_desa",
      asalPenduduk: "penduduk_desa",
      alamat: "",
      rt: "",
      rw: "",
      provinsi: "",
      kabupaten_kota: "",
      kecamatan: "",
      desa_kelurahan: "",
      dusun: "",
      namaAyahKandung: "",
      namaIbuKandung: "",
      bantuanSosial: false,
      disabilitas: false,
      shdk: "kepala_keluarga",
    },
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: combinedSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const kartuKeluargaData = await createKartuKeluarga(value.kartuKeluarga)
        const kepalaKeluargaData = await createPenduduk({
          ...value.kepalaKeluarga,
          tanggalLahir: formatStringToDate(value.kepalaKeluarga.tanggalLahir),
        })

        if (!kartuKeluargaData || !kepalaKeluargaData) {
          throw new Error(
            "Gagal membuat data kartu keluarga atau kepala keluarga",
          )
        }

        await createAnggotaKeluarga({
          ...value.kepalaKeluarga,
          shdk: "kepala_keluarga",
          pendudukId: kepalaKeluargaData.id,
          kartuKeluargaId: kartuKeluargaData.id,
        })

        await Promise.all(
          anggotaList.map(async (anggota) => {
            const pendudukAnggota = await createPenduduk({
              ...anggota,
              tanggalLahir: formatStringToDate(anggota.tanggalLahir),
            })

            if (!pendudukAnggota) {
              throw new Error("Gagal membuat data penduduk anggota")
            }

            await createAnggotaKeluarga({
              ...anggota,
              pendudukId: pendudukAnggota.id,
              kartuKeluargaId: kartuKeluargaData.id,
            })
          }),
        )

        toast({
          description: "Berhasil membuat penduduk",
        })

        if (isDialog) {
          router.back()
          await invalidateKartuKeluargasKey()
        } else {
          router.push("/kartu-keluarga")
        }
      } catch (error) {
        console.error("Gagal submit:", error)

        toast({
          description: "Terjadi kesalahan saat membuat penduduk.",
        })
      }
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
      <section className="space-y-6">
        <h2 className="mb-4 text-lg font-semibold">Kartu Keluarga</h2>

        <form.AppField name="kartuKeluarga.nomorKartuKeluarga">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Nomor Kartu Keluarga</form.FormLabel>
              <field.BaseField placeholder="Masukkan nomor KK" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="kartuKeluarga.kategoriPenduduk">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Kategori Penduduk</form.FormLabel>
              <field.SelectField
                mode={isDialog ? "inline" : "portal"}
                options={KATEGORI_PENDUDUK.map((item) => ({
                  label: item.replace(/_/g, " ").toUpperCase(),
                  value: item,
                }))}
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
      </section>

      <section className="mt-8 space-y-6">
        <h2 className="mb-4 text-lg font-semibold">Kepala Keluarga</h2>

        <form.AppField name="kepalaKeluarga.namaLengkap">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Nama Lengkap</form.FormLabel>
              <field.BaseField placeholder="Masukkan nama lengkap" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="kepalaKeluarga.nik">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>NIK</form.FormLabel>
              <field.BaseField placeholder="Masukkan NIK" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="kepalaKeluarga.tempatLahir">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Tempat Lahir</form.FormLabel>
              <field.BaseField placeholder="Masukkan tempat lahir" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="kepalaKeluarga.tanggalLahir">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Tanggal Lahir</form.FormLabel>
              <field.DatePickerField mode={isDialog ? "inline" : "portal"} />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="kepalaKeluarga.jenisKelamin">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Jenis Kelamin</form.FormLabel>
              <field.SelectField
                mode={isDialog ? "inline" : "portal"}
                options={[
                  { label: "Laki-laki", value: "laki-laki" },
                  { label: "Perempuan", value: "perempuan" },
                ]}
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="kepalaKeluarga.agama">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Agama</form.FormLabel>
              <field.SelectField
                mode={isDialog ? "inline" : "portal"}
                options={AGAMA.map((item) => ({
                  label: item.replace(/_/g, " ").toUpperCase(),
                  value: item,
                }))}
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="kepalaKeluarga.pendidikanTerakhir">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Pendidikan Terakhir</form.FormLabel>
              <field.SelectField
                mode={isDialog ? "inline" : "portal"}
                options={PENDIDIKAN_TERAKHIR.map((item) => ({
                  label: item.replace(/_/g, " ").toUpperCase(),
                  value: item,
                }))}
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="kepalaKeluarga.pekerjaan">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Pekerjaan</form.FormLabel>
              <field.SelectField
                mode={isDialog ? "inline" : "portal"}
                options={JENIS_PEKERJAAN.map((item) => ({
                  label: item.replace(/_/g, " ").toUpperCase(),
                  value: item,
                }))}
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="kepalaKeluarga.statusPerkawinan">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Status Perkawinan</form.FormLabel>
              <field.SelectField
                mode={isDialog ? "inline" : "portal"}
                options={STATUS_PERKAWINAN.map((item) => ({
                  label: item.replace(/_/g, " ").toUpperCase(),
                  value: item,
                }))}
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="kepalaKeluarga.statusDomisili">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Status Domisili</form.FormLabel>
              <field.SelectField
                mode={isDialog ? "inline" : "portal"}
                options={STATUS_DOMISILI.map((item) => ({
                  label: item.replace(/_/g, " ").toUpperCase(),
                  value: item,
                }))}
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="kepalaKeluarga.asalPenduduk">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Asal Penduduk</form.FormLabel>
              <field.SelectField
                mode={isDialog ? "inline" : "portal"}
                options={ASAL_PENDUDUK.map((item) => ({
                  label: item.replace(/_/g, " ").toUpperCase(),
                  value: item,
                }))}
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="kepalaKeluarga.alamat">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Alamat</form.FormLabel>
              <field.TextareaField placeholder="Masukkan alamat lengkap" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="kepalaKeluarga.rt">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>RT</form.FormLabel>
              <field.BaseField placeholder="Contoh: 01" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="kepalaKeluarga.rw">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>RW</form.FormLabel>
              <field.BaseField placeholder="Contoh: 02" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="kepalaKeluarga.provinsi">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Provinsi</form.FormLabel>
              <field.BaseField placeholder="Masukkan provinsi" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="kepalaKeluarga.kabupaten_kota">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Kabupaten/Kota</form.FormLabel>
              <field.BaseField placeholder="Masukkan kabupaten atau kota" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="kepalaKeluarga.kecamatan">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Kecamatan</form.FormLabel>
              <field.BaseField placeholder="Masukkan kecamatan" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="kepalaKeluarga.desa_kelurahan">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Desa/Kelurahan</form.FormLabel>
              <field.BaseField placeholder="Masukkan desa atau kelurahan" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="kepalaKeluarga.dusun">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Dusun</form.FormLabel>
              <field.BaseField placeholder="Masukkan dusun (opsional)" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="kepalaKeluarga.namaAyahKandung">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Nama Ayah Kandung</form.FormLabel>
              <field.BaseField placeholder="Masukkan nama ayah" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="kepalaKeluarga.namaIbuKandung">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Nama Ibu Kandung</form.FormLabel>
              <field.BaseField placeholder="Masukkan nama ibu" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="kepalaKeluarga.bantuanSosial">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Bantuan Sosial</form.FormLabel>
              <field.CheckboxField label="Menerima bantuan sosial" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.AppField name="kepalaKeluarga.disabilitas">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Disabilitas</form.FormLabel>
              <field.CheckboxField label="Memiliki disabilitas" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
      </section>
      <div className="space-y-2">
        <Button type="button" onClick={() => setShowAnggotaModal(true)}>
          Tambah Anggota Keluarga
        </Button>

        {anggotaList.length > 0 && (
          <ul className="list-disc pl-6 text-sm text-gray-600">
            {anggotaList.map((anggota, index) => (
              <li key={index}>
                {anggota.namaLengkap} - {anggota.nik}
              </li>
            ))}
          </ul>
        )}
        <FormAnggotaModal
          isDialog
          open={showAnggotaModal}
          onClose={() => setShowAnggotaModal(false)}
          onSubmit={(anggota) => setAnggotaList((prev) => [...prev, anggota])}
          defaultValues={defaultValues.kepalaKeluarga}
        />
      </div>
      <form.FormItem>
        <Button type="submit">Simpan</Button>
      </form.FormItem>
    </form>
  )
}

function FormAnggotaModal({
  open,
  onClose,
  onSubmit,
  defaultValues,
  isDialog,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (data: z.infer<typeof pendudukSchema>) => void
  defaultValues: z.input<typeof pendudukSchema>
  isDialog: boolean
}) {
  const form = useAppForm({
    defaultValues: {
      ...defaultValues,
      shdk: "lainnya",
    },
    validators: {
      onChange: pendudukSchema,
    },
    onSubmit: ({ value }) => {
      onSubmit({
        ...value,
        tanggalLahir: formatStringToDate(value.tanggalLahir),
        bantuanSosial: value.bantuanSosial ?? false,
        disabilitas: value.disabilitas ?? false,
        shdk: value.shdk as (typeof SHDK)[number],
      })
      onClose()
    },
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent side="top" mode={isDialog ? "inline" : "portal"}>
        <DialogHeader>
          <DialogTitle>Tambah Anggota Keluarga</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.AppField name="namaLengkap">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Nama Lengkap</form.FormLabel>
                <field.BaseField placeholder="Masukkan nama lengkap" />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>
          <form.AppField name="shdk">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>
                  Status Hubungan Dalam Keluarga (SHDK)
                </form.FormLabel>
                <field.SelectField
                  mode={isDialog ? "inline" : "portal"}
                  options={SHDK.map((value) => ({
                    label: value.replace(/_/g, " ").toUpperCase(),
                    value,
                  }))}
                  placeholder="Pilih SHDK"
                />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>
          <form.AppField name="nik">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>NIK</form.FormLabel>
                <field.BaseField placeholder="Masukkan NIK" />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>

          <form.AppField name="tempatLahir">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Tempat Lahir</form.FormLabel>
                <field.BaseField placeholder="Masukkan tempat lahir" />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>

          <form.AppField name="tanggalLahir">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Tanggal Lahir</form.FormLabel>
                <field.DatePickerField mode={isDialog ? "inline" : "portal"} />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>

          <form.AppField name="jenisKelamin">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Jenis Kelamin</form.FormLabel>
                <field.SelectField
                  mode={isDialog ? "inline" : "portal"}
                  options={[
                    { label: "Laki-laki", value: "laki-laki" },
                    { label: "Perempuan", value: "perempuan" },
                  ]}
                />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>

          <form.AppField name="agama">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Agama</form.FormLabel>
                <field.SelectField
                  mode={isDialog ? "inline" : "portal"}
                  options={AGAMA.map((item) => ({
                    label: item.replace(/_/g, " ").toUpperCase(),
                    value: item,
                  }))}
                />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>

          <form.AppField name="pendidikanTerakhir">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Pendidikan Terakhir</form.FormLabel>
                <field.SelectField
                  mode={isDialog ? "inline" : "portal"}
                  options={PENDIDIKAN_TERAKHIR.map((item) => ({
                    label: item.replace(/_/g, " ").toUpperCase(),
                    value: item,
                  }))}
                />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>

          <form.AppField name="pekerjaan">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Pekerjaan</form.FormLabel>
                <field.SelectField
                  mode={isDialog ? "inline" : "portal"}
                  options={JENIS_PEKERJAAN.map((item) => ({
                    label: item.replace(/_/g, " ").toUpperCase(),
                    value: item,
                  }))}
                />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>

          <form.AppField name="statusPerkawinan">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Status Perkawinan</form.FormLabel>
                <field.SelectField
                  mode={isDialog ? "inline" : "portal"}
                  options={STATUS_PERKAWINAN.map((item) => ({
                    label: item.replace(/_/g, " ").toUpperCase(),
                    value: item,
                  }))}
                />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>

          <form.AppField name="statusDomisili">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Status Domisili</form.FormLabel>
                <field.SelectField
                  mode={isDialog ? "inline" : "portal"}
                  options={STATUS_DOMISILI.map((item) => ({
                    label: item.replace(/_/g, " ").toUpperCase(),
                    value: item,
                  }))}
                />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>

          <form.AppField name="asalPenduduk">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Asal Penduduk</form.FormLabel>
                <field.SelectField
                  mode={isDialog ? "inline" : "portal"}
                  options={ASAL_PENDUDUK.map((item) => ({
                    label: item.replace(/_/g, " ").toUpperCase(),
                    value: item,
                  }))}
                />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>

          <form.AppField name="alamat">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Alamat</form.FormLabel>
                <field.TextareaField placeholder="Masukkan alamat lengkap" />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>

          <form.AppField name="rt">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>RT</form.FormLabel>
                <field.BaseField placeholder="Contoh: 01" />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>

          <form.AppField name="rw">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>RW</form.FormLabel>
                <field.BaseField placeholder="Contoh: 02" />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>

          <form.AppField name="provinsi">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Provinsi</form.FormLabel>
                <field.BaseField placeholder="Masukkan provinsi" />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>

          <form.AppField name="kabupaten_kota">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Kabupaten/Kota</form.FormLabel>
                <field.BaseField placeholder="Masukkan kabupaten atau kota" />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>

          <form.AppField name="kecamatan">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Kecamatan</form.FormLabel>
                <field.BaseField placeholder="Masukkan kecamatan" />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>

          <form.AppField name="desa_kelurahan">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Desa/Kelurahan</form.FormLabel>
                <field.BaseField placeholder="Masukkan desa atau kelurahan" />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>

          <form.AppField name="dusun">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Dusun</form.FormLabel>
                <field.BaseField placeholder="Masukkan dusun (opsional)" />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>

          <form.AppField name="namaAyahKandung">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Nama Ayah Kandung</form.FormLabel>
                <field.BaseField placeholder="Masukkan nama ayah" />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>

          <form.AppField name="namaIbuKandung">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Nama Ibu Kandung</form.FormLabel>
                <field.BaseField placeholder="Masukkan nama ibu" />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>

          <form.AppField name="bantuanSosial">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Bantuan Sosial</form.FormLabel>
                <field.CheckboxField label="Menerima bantuan sosial" />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>

          <form.AppField name="disabilitas">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Disabilitas</form.FormLabel>
                <field.CheckboxField label="Memiliki disabilitas" />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>

          <Button type="submit">Simpan Anggota</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
