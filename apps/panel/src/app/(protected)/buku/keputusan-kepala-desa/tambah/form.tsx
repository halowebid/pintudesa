"use client"

import { useRouter } from "next/navigation"
import { Button } from "@pintudesa/ui"
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

const formSchema = z.object({
  nomorSurat: z.string().min(1, "Nomor surat wajib diisi"),
  tanggalSurat: dateFlexible,
  judul: z.string().min(1, "Judul wajib diisi"),
  uraian: z.string().min(1, "Uraian wajib diisi"),
  nomorLaporan: z.string().min(1, "Nomor laporan wajib diisi"),
  tanggalLaporan: dateFlexible,
  keteranganTambahan: z.string().optional().or(z.literal("")),
})

export default function KeputusanKepalaDesaForm({
  isDialog,
}: {
  isDialog: boolean
}) {
  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const keputusanKepalaDesasKey = trpc.keputusanKepalaDesa.all.queryKey()
  const invalidateKeputusanKepalaDesasKey = async () => {
    await queryClient.invalidateQueries({ queryKey: keputusanKepalaDesasKey })
  }
  const { mutate: createKeputusanKepalaDesa } = useMutation(
    trpc.keputusanKepalaDesa.create.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil membuat keputusan kepala desa",
        })
        if (isDialog) {
          await invalidateKeputusanKepalaDesasKey()
          router.back()
        } else {
          router.push("/buku/keputusan-kepala-desa")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal membuat keputusan kepala desa")
      },
    }),
  )

  const defaultValues: z.input<typeof formSchema> = {
    nomorSurat: "",
    tanggalSurat: new Date(),
    judul: "",
    uraian: "",
    nomorLaporan: "",
    tanggalLaporan: new Date(),
    keteranganTambahan: "",
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      createKeputusanKepalaDesa({
        ...value,
        tanggalSurat: formatStringToDate(value.tanggalSurat),
        tanggalLaporan: formatStringToDate(value.tanggalLaporan),
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

      <form.AppField name="judul">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Judul</form.FormLabel>
            <field.BaseField placeholder="Masukkan judul keputusan" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="uraian">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Uraian</form.FormLabel>
            <field.TextareaField placeholder="Masukkan uraian keputusan" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="nomorLaporan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Nomor Laporan</form.FormLabel>
            <field.BaseField placeholder="Masukkan nomor laporan" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="tanggalLaporan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Tanggal Laporan</form.FormLabel>
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
