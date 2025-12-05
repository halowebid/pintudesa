"use client"

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import { z } from "zod"

import { useAppForm } from "@/components/features/forms"
import { useToast } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"
import { JENIS_PERATURAN } from "@/lib/db/schema"
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

const formSchema = z.object({
  jenisPeraturan: z.enum(JENIS_PERATURAN),
  nomorDitetapkan: z.string().min(1, "Nomor Ditetapkan wajib diisi").trim(),
  tanggalDitetapkan: dateFlexible,
  nomorDiundangkan: z.string().min(1, "Nomor Diundangkan wajib diisi").trim(),
  tanggalDiundangkan: dateFlexible,
  tentang: z.string().min(1, "Tentang wajib diisi").trim(),
  keterangan: z.string().optional().or(z.literal("")),
})
export default function LembaranForm({ isDialog }: { isDialog: boolean }) {
  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const lembaransKey = trpc.lembaran.all.queryKey()
  const invalidateLembaransKey = async () => {
    await queryClient.invalidateQueries({ queryKey: lembaransKey })
  }
  const { mutate: createLembaran } = useMutation(
    trpc.lembaran.create.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil membuat lembaran",
        })
        if (isDialog) {
          router.back()
          await invalidateLembaransKey()
        } else {
          router.push("/dashboard/buku/lembaran")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal membuat lembaran")
      },
    }),
  )

  const defaultValues: z.input<typeof formSchema> = {
    jenisPeraturan: "peraturan_desa",
    nomorDitetapkan: "",
    tanggalDitetapkan: "",
    nomorDiundangkan: "",
    tanggalDiundangkan: "",
    tentang: "",
    keterangan: "",
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      createLembaran({
        ...value,
        tanggalDitetapkan: formatStringToDate(value.tanggalDitetapkan),
        tanggalDiundangkan: formatStringToDate(value.tanggalDiundangkan),
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
