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
  bidang: z.string().min(1, "Bidang wajib diisi").trim(),
  waktuPelaksanaan: z.string().min(1, "Waktu pelaksanaan wajib diisi").trim(),
  kegiatan: z.string().min(1, "Kegiatan wajib diisi").trim(),
})

export default function RABForm({
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

  const rabByIdKey = trpc.rab.byId.queryKey(id)
  const invalidateRABByIdKey = async () => {
    await queryClient.invalidateQueries({ queryKey: rabByIdKey })
  }

  const RABsKey = trpc.rab.all.queryKey()
  const invalidateRABsKey = async () => {
    await queryClient.invalidateQueries({ queryKey: RABsKey })
  }
  const { data } = useQuery(trpc.rab.byId.queryOptions(id))
  const { mutate: updateRAB } = useMutation(
    trpc.rab.update.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil memperbaharui rencana anggaran biaya",
        })
        await invalidateRABByIdKey()
        await invalidateRABsKey()
        if (isDialog) {
          router.back()
        } else {
          router.push("/dashboard/buku/rencana-anggaran-biaya")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal memperbaharui rencana anggaran biaya")
      },
    }),
  )

  const defaultValues = React.useMemo<z.input<typeof formSchema>>(
    () => ({
      ...data,
      bidang: data?.bidang ?? "",
      waktuPelaksanaan: data?.waktuPelaksanaan ?? "",
      kegiatan: data?.kegiatan ?? "",
    }),
    [data],
  )

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      updateRAB(value)
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
