"use client"

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import { z } from "zod"

import { useAppForm } from "@/components/dashboard/form"
import { useToast } from "@/components/toast-provider"
import {
  AGAMA,
  ASAL_PENDUDUK,
  JENIS_KELAMIN,
  JENIS_PEKERJAAN,
  PENDIDIKAN_TERAKHIR,
  STATUS_DOMISILI,
  STATUS_PERKAWINAN,
} from "@/lib/db/schema"
import { useTRPC } from "@/lib/trpc/client"
import { Button } from "@/lib/ui"
import { formatStringToDate } from "@/lib/utils"
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

const formSchema = z.object({
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
  bantuanSosial: z.boolean().default(false),
  disabilitas: z.boolean().default(false),
})

export default function PendudukForm({ isDialog }: { isDialog: boolean }) {
  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const penduduksKey = trpc.penduduk.all.queryKey()
  const invalidatePenduduksKey = async () => {
    await queryClient.invalidateQueries({ queryKey: penduduksKey })
  }
  const { mutate: createPenduduk } = useMutation(
    trpc.penduduk.create.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil membuat penduduk",
        })
        if (isDialog) {
          router.back()
          await invalidatePenduduksKey()
        } else {
          router.push("/dashboard/penduduk")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal membuat penduduk")
      },
    }),
  )

  const defaultValues: z.input<typeof formSchema> = {
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
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      createPenduduk({
        ...value,
        tanggalLahir: formatStringToDate(value.tanggalLahir),
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
      <form.AppField name="namaLengkap">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Nama Lengkap</form.FormLabel>
            <field.BaseField placeholder="Masukkan nama lengkap" />
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
            <field.BaseField
              type="number"
              min={0}
              max={100}
              placeholder="Contoh: 01"
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="rw">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>RW</form.FormLabel>
            <field.BaseField
              type="number"
              min={0}
              max={100}
              placeholder="Contoh: 02"
            />
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

      <form.FormItem>
        <Button type="submit">Simpan</Button>
      </form.FormItem>
    </form>
  )
}
