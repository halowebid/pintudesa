"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/lib/ui"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { useAppForm } from "@/components/dashboard/form"
import { useToast } from "@/components/toast-provider"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

const formSchema = z.object({
  nama: z.string().min(1, { message: "Nama wajib diisi" }).trim(),
  umur: z.string().min(1, { message: "Umur wajib diisi" }).trim(),
  jenisKelamin: z.enum(["laki-laki", "perempuan"], {
    errorMap: () => ({ message: "Jenis kelamin tidak valid" }),
  }),
  pendidikan: z.string().min(1, { message: "Pendidikan wajib diisi" }).trim(),
  bidang: z.string().min(1, { message: "Bidang wajib diisi" }).trim(),
  alamat: z.string().min(1, { message: "Alamat wajib diisi" }).trim(),
  keteranganTambahan: z
    .string({ required_error: "Keterangan tambahan harus berupa teks" })
    .optional()
    .or(z.literal("").transform(() => undefined)),
})

export default function KaderPemberdayaanMasyarakatForm({
  isDialog,
}: {
  isDialog: boolean
}) {
  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const kaderPemberdayaanMasyarakatsKey =
    trpc.kaderPemberdayaanMasyarakat.all.queryKey()
  const invalidateKaderPemberdayaanMasyarakatsKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: kaderPemberdayaanMasyarakatsKey,
    })
  }
  const { mutate: createKaderPemberdayaanMasyarakat } = useMutation(
    trpc.kaderPemberdayaanMasyarakat.create.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil membuat kader pemberdayaan masyarakat",
        })
        if (isDialog) {
          router.back()
          await invalidateKaderPemberdayaanMasyarakatsKey()
        } else {
          router.push("/buku/kader-pemberdayaan-masyarakat")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal membuat kader pemberdayaan masyarakat")
      },
    }),
  )

  const defaultValues: z.input<typeof formSchema> = {
    nama: "",
    umur: "",
    jenisKelamin: "laki-laki",
    pendidikan: "",
    bidang: "",
    alamat: "",
    keteranganTambahan: "",
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      createKaderPemberdayaanMasyarakat(value)
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
      <form.AppField name="nama">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Nama</form.FormLabel>
            <field.BaseField placeholder="Masukkan nama" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="umur">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Umur</form.FormLabel>
            <field.BaseField placeholder="Masukkan umur" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="jenisKelamin">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Jenis Kelamin</form.FormLabel>
            <field.SelectField
              mode={isDialog ? "inline" : "portal"}
              options={[
                { label: "Laki-laki", value: "laki-laki" },
                { label: "Perempuan", value: "perempuan" },
              ]}
              placeholder="Pilih jenis kelamin"
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="pendidikan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Pendidikan</form.FormLabel>
            <field.BaseField placeholder="Masukkan pendidikan" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="bidang">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Bidang</form.FormLabel>
            <field.BaseField placeholder="Masukkan bidang" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="alamat">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Alamat</form.FormLabel>
            <field.TextareaField placeholder="Masukkan alamat" />
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
