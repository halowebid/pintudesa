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
  namaKegiatan: z.string().min(1, "Nama kegiatan wajib diisi").trim(),
  lokasi: z.string().min(1, "Lokasi wajib diisi").trim(),
  tahunPerencanaan: z.string().min(4, "Tahun wajib diisi").trim(),
  jumlah: z.string().min(1, "Jumlah wajib diisi").trim(),
  pelaksana: z.string().min(1, "Pelaksana wajib diisi").trim(),
  manfaat: z.string().min(1, "Manfaat wajib diisi").trim(),
  keterangan: z.string().min(1, "Keterangan wajib diisi").trim(),
  biayaDariPemerintah: z.string().optional(),
  biayaDariProvinsi: z.string().optional(),
  biayaDariKabupaten: z.string().optional(),
  biayaDariSwadaya: z.string().optional(),
})
export default function RencanaKerjaPembangunanForm({
  isDialog,
}: {
  isDialog: boolean
}) {
  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const rencanaKerjaPembangunansKey =
    trpc.rencanaKerjaPembangunan.all.queryKey()
  const invalidateRencanaKerjaPembangunansKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: rencanaKerjaPembangunansKey,
    })
  }
  const { mutate: createRencanaKerjaPembangunan } = useMutation(
    trpc.rencanaKerjaPembangunan.create.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil membuat Rencana Kerja Pembangunan",
        })
        if (isDialog) {
          router.back()
          await invalidateRencanaKerjaPembangunansKey()
        } else {
          router.push("/dashboard/buku/rencana-kerja-pembangunan")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal membuat Rencana Kerja Pembangunan")
      },
    }),
  )

  const defaultValues: z.input<typeof formSchema> = {
    namaKegiatan: "",
    lokasi: "",
    tahunPerencanaan: "",
    jumlah: "",
    pelaksana: "",
    manfaat: "",
    keterangan: "",
    biayaDariPemerintah: "",
    biayaDariProvinsi: "",
    biayaDariKabupaten: "",
    biayaDariSwadaya: "",
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      createRencanaKerjaPembangunan(value)
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
      <form.AppField name="namaKegiatan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Nama Kegiatan</form.FormLabel>
            <field.BaseField placeholder="Masukkan nama kegiatan" />
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

      <form.AppField name="tahunPerencanaan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Tahun Perencanaan</form.FormLabel>
            <field.BaseField placeholder="Contoh: 2025" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="jumlah">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Jumlah</form.FormLabel>
            <field.BaseField placeholder="Masukkan jumlah" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="pelaksana">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Pelaksana</form.FormLabel>
            <field.BaseField placeholder="Masukkan pelaksana kegiatan" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="manfaat">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Manfaat</form.FormLabel>
            <field.TextareaField placeholder="Tuliskan manfaat kegiatan" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="keterangan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Keterangan</form.FormLabel>
            <field.TextareaField placeholder="Tambahkan keterangan" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="biayaDariPemerintah">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Biaya dari Pemerintah</form.FormLabel>
            <field.BaseField placeholder="Masukkan nominal atau kosongkan" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="biayaDariProvinsi">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Biaya dari Provinsi</form.FormLabel>
            <field.BaseField placeholder="Masukkan nominal atau kosongkan" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="biayaDariKabupaten">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Biaya dari Kabupaten</form.FormLabel>
            <field.BaseField placeholder="Masukkan nominal atau kosongkan" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="biayaDariSwadaya">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Biaya dari Swadaya</form.FormLabel>
            <field.BaseField placeholder="Masukkan nominal atau kosongkan" />
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
