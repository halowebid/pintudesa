"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import { z } from "zod"

import { useAppForm } from "@/components/dashboard/form"
import { useToast } from "@/components/toast-provider"
import { JENIS_PERATURAN, jenisPeraturan } from "@/lib/db/schema"
import { useTRPC } from "@/lib/trpc/client"
import { Button } from "@/lib/ui"
import { formatStringToDate } from "@/lib/utils"
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
export default function PeraturanForm({
  id,
  isDialog,
}: {
  id: string
  isDialog: boolean
}) {
  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const peraturanByIdKey = trpc.peraturan.byId.queryKey(id)
  const invalidatePeraturanByIdKey = async () => {
    await queryClient.invalidateQueries({ queryKey: peraturanByIdKey })
  }

  const peraturansKey = trpc.peraturan.all.queryKey()
  const invalidatePeraturansKey = async () => {
    await queryClient.invalidateQueries({ queryKey: peraturansKey })
  }
  const { data } = useQuery(trpc.peraturan.byId.queryOptions(id))
  const { mutate: updatePeraturan } = useMutation(
    trpc.peraturan.update.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil memperbaharui peraturan",
        })
        await invalidatePeraturansKey()
        await invalidatePeraturanByIdKey()
        if (isDialog) {
          router.back()
        } else {
          router.push("/dashboard/buku/peraturan")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal memperbaharui peraturan")
      },
    }),
  )

  const defaultValues = React.useMemo<z.input<typeof formSchema>>(
    () => ({
      ...data,
      judul: data?.judul ?? "",
      uraian: data?.uraian ?? "",
      jenisPeraturan: data?.jenisPeraturan ?? "peraturan_desa",
      nomorSuratDitetapkan: data?.nomorSuratDitetapkan ?? "",
      tanggal_surat_ditetapkan: data?.tanggal_surat_ditetapkan ?? new Date(),
      nomorSuratDilaporkan: data?.nomorSuratDilaporkan ?? "",
      tanggalSuratDilaporkan: data?.tanggalSuratDilaporkan ?? undefined,
      nomorSuratDiundangkan: data?.nomorSuratDiundangkan ?? "",
      tanggalSuratDiundangkan: data?.tanggalSuratDiundangkan ?? undefined,
      keteranganTambahan: data?.keteranganTambahan ?? "",
    }),
    [data],
  )

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      updatePeraturan({
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
