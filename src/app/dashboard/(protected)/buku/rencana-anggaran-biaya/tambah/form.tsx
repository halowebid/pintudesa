"use client"

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { useAppForm } from "@/components/dashboard/form"
import { useToast } from "@/components/toast-provider"
import { useTRPC } from "@/lib/trpc/client"
import { Button } from "@/lib/ui"
import { useHandleTRPCError } from "@/lib/utils/error"

const formSchema = z.object({
  bidang: z.string().min(1, "Bidang wajib diisi").trim(),
  waktuPelaksanaan: z.string().min(1, "Waktu pelaksanaan wajib diisi").trim(),
  kegiatan: z.string().min(1, "Kegiatan wajib diisi").trim(),
})

export default function RABForm({ isDialog }: { isDialog: boolean }) {
  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const RABsKey = trpc.rab.all.queryKey()
  const invalidateRABsKey = async () => {
    await queryClient.invalidateQueries({ queryKey: RABsKey })
  }
  const { mutate: createRAB } = useMutation(
    trpc.rab.create.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil membuat rencana anggaran biaya",
        })
        if (isDialog) {
          await invalidateRABsKey()
          router.back()
        } else {
          router.push("/dashboard/buku/rencana-anggaran-biaya")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal membuat rencana anggaran biaya")
      },
    }),
  )

  const defaultValues: z.input<typeof formSchema> = {
    bidang: "",
    waktuPelaksanaan: "",
    kegiatan: "",
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      createRAB(value)
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
      <form.AppField name="bidang">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Bidang</form.FormLabel>
            <field.BaseField placeholder="Masukkan bidang" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="waktuPelaksanaan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Waktu Pelaksanaan</form.FormLabel>
            <field.BaseField placeholder="Masukkan waktu pelaksanaan" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="kegiatan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Kegiatan</form.FormLabel>
            <field.TextareaField placeholder="Masukkan kegiatan" />
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
