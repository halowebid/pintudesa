"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import { z } from "zod"

import { useToast } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"
import { useAppForm } from "@/components/ui/form"
import { useTRPC } from "@/lib/trpc/client"
import { formatStringToDate } from "@/lib/utils/date"
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

const formSchema = z.object({
  nomorSurat: z.string().min(1, "Nomor surat wajib diisi").trim(),
  tanggalSurat: dateFlexible,
  ditujukan: z.string().min(1, "Tujuan wajib diisi").trim(),
  tanggalPengiriman: optionalDateFlexible,
  uraianSurat: z.string().min(1, "Uraian wajib diisi").trim(),
  keteranganTambahan: z.string().optional().or(z.literal("")),
})

export default function EkspedisiForm({
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

  const ekspedisisKey = trpc.ekspedisi.all.queryKey()
  const invalidateEkspedisisKey = async () => {
    await queryClient.invalidateQueries({ queryKey: ekspedisisKey })
  }
  const { data } = useQuery(trpc.ekspedisi.byId.queryOptions(id))
  const { mutate: updateEkspedisi } = useMutation(
    trpc.ekspedisi.update.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil memperbaharui ekspedisi",
        })
        if (isDialog) {
          router.back()
          await invalidateEkspedisisKey()
        } else {
          router.push("/buku-a8")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal memperbaharui ekspedisi")
      },
    }),
  )

  const defaultValues = React.useMemo<z.input<typeof formSchema>>(
    () => ({
      nomorSurat: data?.nomorSurat ?? "",
      tanggalSurat: data?.tanggalSurat ?? new Date(),
      ditujukan: data?.ditujukan ?? "",
      uraianSurat: data?.uraianSurat ?? "",
      tanggalPengiriman: data?.tanggalPengiriman ?? undefined,
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
      updateEkspedisi({
        ...value,
        tanggalSurat: formatStringToDate(value.tanggalSurat),
        tanggalPengiriman:
          value.tanggalPengiriman !== undefined
            ? formatStringToDate(value.tanggalPengiriman)
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
      <form.AppField name="nomorSurat">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Nomor Surat</form.FormLabel>
            <field.BaseField placeholder="Masukkan nomor surat" />
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

      <form.AppField name="ditujukan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Ditujukan Kepada</form.FormLabel>
            <field.BaseField placeholder="Masukkan tujuan surat" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="tanggalPengiriman">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Tanggal Pengiriman (Opsional)</form.FormLabel>
            <field.DatePickerField mode={isDialog ? "inline" : "portal"} />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="uraianSurat">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Uraian Surat</form.FormLabel>
            <field.TextareaField placeholder="Masukkan uraian surat" />
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
        <Button type="submit">Simpan Ekspedisi</Button>
      </form.FormItem>
    </form>
  )
}
