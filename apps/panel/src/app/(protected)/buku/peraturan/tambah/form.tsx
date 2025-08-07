"use client"

import { useRouter } from "next/navigation"
import { JENIS_PERATURAN, jenisPeraturan } from "@pintudesa/db/schema"
import { Button } from "@pintudesa/ui"
import { formatStringToDate } from "@pintudesa/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import { z } from "zod"

import { useAppForm } from "@/components/form"
import { useToast } from "@/components/toast-provider"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"
import { jenisPeraturanLabelMap } from "@/lib/utils/mapper"

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
      if (typeof val === "string") {
        return dayjs(val, "DD/MM/YYYY", true).isValid()
      }
      return val instanceof Date && !isNaN(val.getTime())
    },
    {
      message: "Tanggal pengiriman tidak valid",
    },
  )
  .transform((val) => {
    if (!val) return undefined
    if (typeof val === "string") {
      return dayjs(val, "DD/MM/YYYY").toDate()
    }
    return val
  })

const formSchema = z
  .object({
    judul: z.string().min(1, "Judul wajib diisi").trim(),
    uraian: z.string().min(1, "Uraian wajib diisi").trim(),
    jenisPeraturan: jenisPeraturan,
    nomorSuratDitetapkan: z.string().min(1, "Nomor surat wajib diisi"),
    tanggal_surat_ditetapkan: dateFlexible,
    nomorSuratDilaporkan: z.string().min(1, "Nomor surat wajib diisi"),
    tanggalSuratDilaporkan: optionalDateFlexible,
    nomorSuratDiundangkan: z.string().optional().or(z.literal("")),
    tanggalSuratDiundangkan: optionalDateFlexible,
    keteranganTambahan: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) =>
      data.jenisPeraturan === "peraturan_kepala_desa" ||
      !!data.nomorSuratDiundangkan,
    {
      message: "Nomor surat diundangkan wajib diisi",
      path: ["nomorSuratDiundangkan"],
    },
  )
  .refine(
    (data) =>
      data.jenisPeraturan === "peraturan_kepala_desa" ||
      !!data.tanggalSuratDiundangkan,
    {
      message: "Tanggal surat diundangkan wajib diisi",
      path: ["tanggalSuratDiundangkan"],
    },
  )

export default function PeraturanForm({ isDialog }: { isDialog: boolean }) {
  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const peraturansKey = trpc.peraturan.all.queryKey()
  const invalidatePeraturansKey = async () => {
    await queryClient.invalidateQueries({ queryKey: peraturansKey })
  }
  const { mutate: createPeraturan } = useMutation(
    trpc.peraturan.create.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil membuat peraturan",
        })
        if (isDialog) {
          await invalidatePeraturansKey()
          router.back()
        } else {
          router.push("/buku-a1")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal membuat peraturan")
      },
    }),
  )

  const defaultValues: z.input<typeof formSchema> = {
    judul: "",
    uraian: "",
    jenisPeraturan: "peraturan_desa",
    nomorSuratDitetapkan: "",
    tanggal_surat_ditetapkan: new Date(),
    nomorSuratDilaporkan: "",
    tanggalSuratDilaporkan: undefined,
    nomorSuratDiundangkan: "",
    tanggalSuratDiundangkan: undefined,
    keteranganTambahan: "",
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      createPeraturan({
        ...value,
        tanggal_surat_ditetapkan: formatStringToDate(
          value.tanggal_surat_ditetapkan,
        ),
        tanggalSuratDilaporkan:
          value.tanggalSuratDilaporkan !== undefined
            ? formatStringToDate(value.tanggalSuratDilaporkan)
            : undefined,
        tanggalSuratDiundangkan:
          value.tanggalSuratDiundangkan !== undefined
            ? formatStringToDate(value.tanggalSuratDiundangkan)
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
      <h3 className="text-lg font-semibold">Informasi Umum</h3>

      <form.AppField name="judul">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Judul Peraturan</form.FormLabel>
            <field.BaseField placeholder="Masukkan judul peraturan" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="uraian">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Uraian</form.FormLabel>
            <field.TextareaField placeholder="Masukkan uraian peraturan" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="jenisPeraturan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Jenis Peraturan</form.FormLabel>
            <field.SelectField
              mode={isDialog ? "inline" : "portal"}
              options={JENIS_PERATURAN.map((value) => ({
                label: jenisPeraturanLabelMap[value],
                value,
              }))}
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <h3 className="text-lg font-semibold">Surat Penetapan</h3>

      <form.AppField name="nomorSuratDitetapkan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Nomor Surat Ditetapkan</form.FormLabel>
            <field.BaseField />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="tanggal_surat_ditetapkan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Tanggal Surat Ditetapkan</form.FormLabel>
            <field.DatePickerField mode={isDialog ? "inline" : "portal"} />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <h3 className="text-lg font-semibold">Surat Pelaporan</h3>

      <form.AppField name="nomorSuratDilaporkan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Nomor Surat Dilaporkan</form.FormLabel>
            <field.BaseField />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="tanggalSuratDilaporkan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Tanggal Surat Dilaporkan</form.FormLabel>
            <field.DatePickerField mode={isDialog ? "inline" : "portal"} />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <h3 className="text-lg font-semibold">Surat Diundangkan</h3>
      <form.AppField name="nomorSuratDiundangkan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Nomor Surat Diundangkan</form.FormLabel>
            <field.BaseField />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="tanggalSuratDiundangkan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Tanggal Surat Diundangkan</form.FormLabel>
            <field.DatePickerField mode={isDialog ? "inline" : "portal"} />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>
      <h3 className="text-lg font-semibold">Lainnya</h3>

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
        <Button type="submit">Simpan Peraturan</Button>
      </form.FormItem>
    </form>
  )
}
