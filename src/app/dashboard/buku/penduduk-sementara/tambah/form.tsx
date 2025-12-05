"use client"

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import { z } from "zod"

import { useAppForm } from "@/components/features/forms"
import { useToast } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"
import { JENIS_KELAMIN, JENIS_PEKERJAAN, KEBANGSAAN } from "@/lib/db/schema"
import { useTRPC } from "@/lib/trpc/client"
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

const optionalDateFlexible = z
  .union([z.string(), z.date()])
  .optional()
  .refine(
    (val) => {
      if (val === undefined) return true
      if (typeof val === "string" && val.length > 0) {
        return dayjs(val, "DD/MM/YYYY", true).isValid()
      }
      return val instanceof Date && !isNaN(val.getTime())
    },
    {
      message: "Tanggal tidak valid",
    },
  )
  .transform((val) => {
    if (!val) return undefined
    if (typeof val === "string") {
      return dayjs(val, "DD/MM/YYYY").toDate()
    }
    return val
  })

const formSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi").trim(),
  nomorIndentitas: z.string().min(1, "Nomor identitas wajib diisi").trim(),
  jenisKelamin: z.enum(JENIS_KELAMIN, {
    errorMap: () => ({ message: "Jenis kelamin wajib dipilih" }),
  }),
  tempatLahir: z.string().min(1, "Tempat lahir wajib diisi").trim(),
  tanggalLahir: dateFlexible,
  pekerjaan: z.enum(JENIS_PEKERJAAN, {
    errorMap: () => ({ message: "Pekerjaan wajib dipilih" }),
  }),
  kebangsaan: z.enum(KEBANGSAAN, {
    errorMap: () => ({ message: "Kebangsaan wajib dipilih" }),
  }),
  keturunan: z.string().optional(),
  datangDari: z.string().min(1, "Asal kedatangan wajib diisi").trim(),
  tujuanKedatangan: z.string().min(1, "Tujuan kedatangan wajib diisi").trim(),
  namaYangDidatangi: z
    .string()
    .min(1, "Nama yang didatangi wajib diisi")
    .trim(),
  alamatYangDidatangi: z
    .string()
    .min(1, "Alamat yang didatangi wajib diisi")
    .trim(),
  tanggalDatang: dateFlexible,
  tanggalPergi: optionalDateFlexible,
  keteranganTambahan: z.string().optional(),
})

export default function PendudukSementaraForm({
  isDialog,
}: {
  isDialog: boolean
}) {
  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const pendudukSementarasKey = trpc.pendudukSementara.all.queryKey()
  const invalidatePendudukSementarasKey = async () => {
    await queryClient.invalidateQueries({ queryKey: pendudukSementarasKey })
  }
  const { mutate: createPendudukSementara } = useMutation(
    trpc.pendudukSementara.create.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil membuat penduduk sementara",
        })
        if (isDialog) {
          router.back()
          await invalidatePendudukSementarasKey()
        } else {
          router.push("/dashboard/buku/penduduk-sementara")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal membuat penduduk sementara")
      },
    }),
  )

  const defaultValues: z.input<typeof formSchema> = {
    nama: "",
    nomorIndentitas: "",
    jenisKelamin: "laki-laki",
    tempatLahir: "",
    tanggalLahir: "",
    pekerjaan: "lainnya",
    kebangsaan: "wni",
    keturunan: "",
    datangDari: "",
    tujuanKedatangan: "",
    namaYangDidatangi: "",
    alamatYangDidatangi: "",
    tanggalDatang: "",
    tanggalPergi: "",
    keteranganTambahan: "",
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      createPendudukSementara({
        ...value,
        tanggalLahir: formatStringToDate(value.tanggalLahir),
        tanggalDatang: formatStringToDate(value.tanggalDatang),
        tanggalPergi: value.tanggalPergi
          ? formatStringToDate(value.tanggalPergi)
          : undefined,
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
      <form.AppField name="nama">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Nama</form.FormLabel>
            <field.BaseField placeholder="Masukkan nama" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="nomorIndentitas">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Nomor Identitas</form.FormLabel>
            <field.BaseField placeholder="Masukkan nomor identitas" />
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

      <form.AppField name="kebangsaan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Kebangsaan</form.FormLabel>
            <field.SelectField
              mode={isDialog ? "inline" : "portal"}
              options={[
                { label: "WNI", value: "wni" },
                { label: "WNA", value: "wna" },
              ]}
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="keturunan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Keturunan</form.FormLabel>
            <field.BaseField placeholder="Masukkan keturunan (jika ada)" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="datangDari">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Datang Dari</form.FormLabel>
            <field.BaseField placeholder="Masukkan asal kedatangan" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="tujuanKedatangan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Tujuan Kedatangan</form.FormLabel>
            <field.BaseField placeholder="Masukkan tujuan kedatangan" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="namaYangDidatangi">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Nama yang Didatangi</form.FormLabel>
            <field.BaseField placeholder="Masukkan nama yang didatangi" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="alamatYangDidatangi">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Alamat yang Didatangi</form.FormLabel>
            <field.TextareaField placeholder="Masukkan alamat yang didatangi" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="tanggalDatang">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Tanggal Datang</form.FormLabel>
            <field.DatePickerField mode={isDialog ? "inline" : "portal"} />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="tanggalPergi">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Tanggal Pergi (Opsional)</form.FormLabel>
            <field.DatePickerField mode={isDialog ? "inline" : "portal"} />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="keteranganTambahan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Keterangan Tambahan</form.FormLabel>
            <field.TextareaField placeholder="Opsional" />
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
