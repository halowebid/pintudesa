"use client"

import { useRouter } from "next/navigation"
import { Button } from "@pintudesa/ui"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { useAppForm } from "@/components/form"
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
  isDialog,
}: {
  isDialog: boolean
}) {
  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const inventarisHasilPembangunansKey =
    trpc.inventarisHasilPembangunan.all.queryKey()
  const invalidateInventarisHasilPembangunansKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: inventarisHasilPembangunansKey,
    })
  }
  const { mutate: createInventarisHasilPembangunan } = useMutation(
    trpc.inventarisHasilPembangunan.create.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil membuat inventaris hasil bangunan",
        })
        if (isDialog) {
          router.back()
          await invalidateInventarisHasilPembangunansKey()
        } else {
          router.push("/buku-d3")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal membuat inventarisHasilPembangunan")
      },
    }),
  )

  const defaultValues: z.input<typeof formSchema> = {
    namaHasilPembangunan: "",
    volume: "",
    biaya: "",
    lokasi: "",
    keteranganTambahan: "",
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      createInventarisHasilPembangunan(value)
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
