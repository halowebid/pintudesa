"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { JENIS_PERATURAN } from "@pintudesa/db/schema"
import { Button } from "@pintudesa/ui"
import { formatStringToDate } from "@pintudesa/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import { z } from "zod"

import { useAppForm } from "@/components/form"
import { useToast } from "@/components/toast-provider"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

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
  jenisPeraturan: z.enum(JENIS_PERATURAN),
  nomorDitetapkan: z.string().min(1, "Nomor Ditetapkan wajib diisi").trim(),
  tanggalDitetapkan: optionalDateFlexible,
  nomorDiundangkan: z.string().min(1, "Nomor Diundangkan wajib diisi").trim(),
  tanggalDiundangkan: optionalDateFlexible,
  tentang: z.string().min(1, "Tentang wajib diisi").trim(),
  keterangan: z.string().optional().or(z.literal("")),
})

export default function LembaranForm({
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

  const lembaransKey = trpc.lembaran.all.queryKey()
  const lembaranByIdKey = trpc.lembaran.byId.queryKey(id)
  const invalidateLembaranByIdKey = async () => {
    await queryClient.invalidateQueries({ queryKey: lembaranByIdKey })
  }
  const invalidateLembaransKey = async () => {
    await queryClient.invalidateQueries({ queryKey: lembaransKey })
  }
  const { data } = useQuery(trpc.lembaran.byId.queryOptions(id))
  const { mutate: updateLembaran } = useMutation(
    trpc.lembaran.update.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil memperbaharui lembaran",
        })
        await invalidateLembaransKey()
        await invalidateLembaranByIdKey()
        if (isDialog) {
          router.back()
        } else {
          router.push("/buku/lembaran")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal memperbaharui lembaran")
      },
    }),
  )

  const defaultValues = React.useMemo<z.input<typeof formSchema>>(
    () => ({
      ...data,
      jenisPeraturan: data?.jenisPeraturan ?? "peraturan_desa",
      nomorDitetapkan: data?.nomorDitetapkan ?? "",
      tanggalDitetapkan: data?.tanggalDitetapkan ?? "",
      nomorDiundangkan: data?.nomorDiundangkan ?? "",
      tanggalDiundangkan: data?.tanggalDiundangkan ?? "",
      tentang: data?.tentang ?? "",
      keterangan: data?.keterangan ?? "",
    }),
    [data],
  )

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      updateLembaran({
        ...value,
        tanggalDitetapkan: value.tanggalDitetapkan
          ? formatStringToDate(value.tanggalDitetapkan)
          : undefined,
        tanggalDiundangkan: value.tanggalDiundangkan
          ? formatStringToDate(value.tanggalDiundangkan)
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
      <form.AppField name="jenisPeraturan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Jenis Peraturan</form.FormLabel>
            <field.SelectField
              mode={isDialog ? "inline" : "portal"}
              options={[
                { label: "Peraturan Desa", value: "peraturan_desa" },
                { label: "Peraturan Bersama", value: "peraturan_bersama" },
                {
                  label: "Peraturan Kepala Desa",
                  value: "peraturan_kepala_desa",
                },
              ]}
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="nomorDitetapkan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Nomor Ditetapkan</form.FormLabel>
            <field.BaseField placeholder="Masukkan nomor penetapan" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="tanggalDitetapkan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Tanggal Ditetapkan</form.FormLabel>
            <field.DatePickerField mode={isDialog ? "inline" : "portal"} />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="nomorDiundangkan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Nomor Diundangkan</form.FormLabel>
            <field.BaseField placeholder="Masukkan nomor pengundangan" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="tanggalDiundangkan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Tanggal Diundangkan</form.FormLabel>
            <field.DatePickerField mode={isDialog ? "inline" : "portal"} />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="tentang">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Tentang</form.FormLabel>
            <field.TextareaField placeholder="Masukkan deskripsi tentang" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="keterangan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Keterangan (Opsional)</form.FormLabel>
            <field.TextareaField placeholder="Opsional" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.FormItem>
        <Button type="submit">Simpan Lembaran</Button>
      </form.FormItem>
    </form>
  )
}
