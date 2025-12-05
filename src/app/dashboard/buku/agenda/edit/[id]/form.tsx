"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { useAppForm } from "@/components/features/forms"
import { useToast } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"
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

export default function AgendaForm({
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

  const agendaByIdKey = trpc.agenda.byId.queryKey(id)
  const invalidateAgendaByIdKey = async () => {
    await queryClient.invalidateQueries({ queryKey: agendaByIdKey })
  }

  const agendasKey = trpc.agenda.all.queryKey()
  const invalidateAgendasKey = async () => {
    await queryClient.invalidateQueries({ queryKey: agendasKey })
  }
  const { data } = useQuery(trpc.agenda.byId.queryOptions(id))
  const { mutate: updateAgenda } = useMutation(
    trpc.agenda.update.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil memperbaharui agenda",
        })

        await invalidateAgendaByIdKey()
        await invalidateAgendasKey()
        if (isDialog) {
          router.back()
        } else {
          router.push("/dashboard/buku/agenda")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal memperbaharui agenda")
      },
    }),
  )

  const defaultValues = React.useMemo<z.input<typeof formSchema>>(
    () => ({
      ...data,
      jenisSurat: data?.jenisSurat ?? "surat_masuk",
      keteranganTambahan: data?.keteranganTambahan ?? "",
      uraian: data?.uraian ?? "",
    }),
    [data],
  )

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      updateAgenda(value)
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
              mode={isDialog ? "inline" : "portal"}
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
