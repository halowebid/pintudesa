"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/lib/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { useAppForm } from "@/components/dashboard/form"
import { useToast } from "@/components/toast-provider"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

const formSchema = z.object({
  namaHasilPembangunan: z
    .string()
    .min(1, "Nama hasil pembangunan wajib diisi")
    .trim(),
  volume: z.string().min(1, "Volume wajib diisi").trim(),
  biaya: z.string().min(1, "Biaya wajib diisi").trim(),
  lokasi: z.string().min(1, "Lokasi wajib diisi").trim(),
  keteranganTambahan: z.string().optional().or(z.literal("")),
})

export default function InventarisHasilPembangunanForm({
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

  const hasilPembangunanByIdKey =
    trpc.inventarisHasilPembangunan.byId.queryKey(id)
  const invalidateHasilPembangunanByIdKey = async () => {
    await queryClient.invalidateQueries({ queryKey: hasilPembangunanByIdKey })
  }

  const inventarisHasilPembangunansKey =
    trpc.inventarisHasilPembangunan.all.queryKey()
  const invalidateInventarisHasilPembangunansKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: inventarisHasilPembangunansKey,
    })
  }
  const { data } = useQuery(
    trpc.inventarisHasilPembangunan.byId.queryOptions(id),
  )
  const { mutate: updateInventarisHasilPembangunan } = useMutation(
    trpc.inventarisHasilPembangunan.update.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil memperbaharui inventaris hasil bangunan",
        })
        await invalidateHasilPembangunanByIdKey()
        await invalidateInventarisHasilPembangunansKey()

        if (isDialog) {
          router.back()
        } else {
          router.push("/buku/inventaris-hasil-pembangunan")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal memperbaharui inventaris hasil bangunan")
      },
    }),
  )

  const defaultValues = React.useMemo<z.input<typeof formSchema>>(
    () => ({
      ...data,
      namaHasilPembangunan: data?.namaHasilPembangunan ?? "",
      volume: data?.volume ?? "",
      biaya: data?.biaya ?? "",
      lokasi: data?.lokasi ?? "",
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
      updateInventarisHasilPembangunan(value)
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
      <form.AppField name="namaHasilPembangunan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Nama Hasil Pembangunan</form.FormLabel>
            <field.BaseField placeholder="Masukkan nama hasil pembangunan" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="volume">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Volume</form.FormLabel>
            <field.BaseField placeholder="Masukkan volume" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="biaya">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Biaya</form.FormLabel>
            <field.BaseField placeholder="Masukkan biaya" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="lokasi">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Lokasi</form.FormLabel>
            <field.BaseField placeholder="Masukkan lokasi" />
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
        <Button type="submit">Simpan Inventaris</Button>
      </form.FormItem>
    </form>
  )
}
