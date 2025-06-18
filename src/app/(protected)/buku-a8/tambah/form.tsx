"use client"

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { useToast } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"
import { useAppForm } from "@/components/ui/form"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

const formSchema = z.object({
  nomorSurat: z.string().min(1, { message: "Nomor surat wajib diisi" }).trim(),
  tanggalSurat: z.coerce.date({
    invalid_type_error: "Tanggal surat tidak valid",
  }),
  ditujukan: z.string().min(1, { message: "Tujuan wajib diisi" }).trim(),
  tanggalPengiriman: z.coerce
    .date()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  uraianSurat: z.string().min(1, { message: "Uraian wajib diisi" }).trim(),
  keteranganTambahan: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),
})

export default function EkspedisiForm({ isDialog }: { isDialog: boolean }) {
  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const ekspedisisKey = trpc.ekspedisi.all.queryKey()
  const invalidateEkspedisisKey = async () => {
    await queryClient.invalidateQueries({ queryKey: ekspedisisKey })
  }
  const { mutate: createEkspedisi } = useMutation(
    trpc.ekspedisi.create.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil membuat ekspedisi",
        })
        if (isDialog) {
          router.back()
          await invalidateEkspedisisKey()
        } else {
          router.push("/buku-a8")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal membuat ekspedisi")
      },
    }),
  )

  const defaultValues: z.input<typeof formSchema> = {
    nomorSurat: "",
    tanggalSurat: new Date(),
    ditujukan: "",
    tanggalPengiriman: "",
    uraianSurat: "",
    keteranganTambahan: "",
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      createEkspedisi({
        ...value,
        tanggalPengiriman:
          value.tanggalPengiriman === "" ? undefined : value.tanggalPengiriman,
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
            <field.DatePickerField />
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
            <field.DatePickerField />
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
