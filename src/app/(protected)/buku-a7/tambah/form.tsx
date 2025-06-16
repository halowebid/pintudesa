"use client"

import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { z } from "zod"

import { useToast } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"
import { useAppForm } from "@/components/ui/form"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

const formSchema = z.object({
  jenisSurat: z.enum(["surat_masuk", "surat_keluar"], {
    errorMap: () => ({ message: "Jenis surat tidak valid" }),
  }),
  uraian: z.string().min(1, { message: "Uraian wajib diisi" }).trim(),
  keteranganTambahan: z
    .string({ required_error: "Keterangan tambahan harus berupa teks" })
    .optional()
    .or(z.literal("").transform(() => undefined)),
})

export default function AgendaForm() {
  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const trpc = useTRPC()
  const router = useRouter()

  const { mutate: createAgenda } = useMutation(
    trpc.agenda.create.mutationOptions({
      onSuccess: () => {
        toast({
          description: "Berhasil membuat agenda",
        })
        router.push("/buku-a7")
      },
      onError: (error) => {
        handleError(error, "Gagal membuat agenda")
      },
    }),
  )

  const defaultValues: z.input<typeof formSchema> = {
    jenisSurat: "surat_masuk" as const,
    uraian: "",
    keteranganTambahan: "",
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      createAgenda(value)
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
      <form.AppField name="jenisSurat">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Jenis Surat</form.FormLabel>
            <field.SelectField
              options={[
                { label: "Surat Masuk", value: "surat_masuk" },
                { label: "Surat Keluar", value: "surat_keluar" },
              ]}
              placeholder="Pilih jenis surat"
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="uraian">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Uraian</form.FormLabel>
            <field.TextareaField placeholder="Masukkan uraian" />
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
        <Button type="submit">Simpan Agenda</Button>
      </form.FormItem>
    </form>
  )
}
