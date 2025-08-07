"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@pintudesa/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { useAppForm } from "@/components/form"
import { useToast } from "@/components/toast-provider"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

const formSchema = z.object({
  namaKegiatan: z.string().min(1, "Nama kegiatan wajib diisi"),
  tahunKegiatan: z.string().min(1, "Tahun kegiatan wajib diisi"),
  volume: z.string().optional(),
  jumlah: z.string().min(1, "Jumlah wajib diisi"),
  waktuPengerjaan: z.string().min(1, "Waktu pengerjaan wajib diisi"),
  pelaksana: z.string().min(1, "Pelaksana wajib diisi"),
  baru: z.string().optional(),
  lanjutan: z.string().optional(),
  keteranganTambahan: z.string().optional().or(z.literal("")),
  biayaDariPemerintah: z.string().min(1, "Biaya dari pemerintah wajib diisi"),
  biayaDariProvinsi: z.string().optional(),
  biayaDariKabupaten: z.string().optional(),
  biayaDariSwadaya: z.string().optional(),
})

export default function KegiatanPembangunanForm({
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

  const kegiatanPembangunanByIdKey = trpc.kegiatanPembangunan.byId.queryKey(id)
  const invalidateKegiatanPembangunanByIdKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: kegiatanPembangunanByIdKey,
    })
  }

  const kegiatanPembangunansKey = trpc.kegiatanPembangunan.all.queryKey()
  const invalidateKegiatanPembangunansKey = async () => {
    await queryClient.invalidateQueries({ queryKey: kegiatanPembangunansKey })
  }
  const { data } = useQuery(trpc.kegiatanPembangunan.byId.queryOptions(id))
  const { mutate: updateKegiatanPembangunan } = useMutation(
    trpc.kegiatanPembangunan.update.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil memperbaharui Kegiatan Pembangunan",
        })

        await invalidateKegiatanPembangunanByIdKey()
        await invalidateKegiatanPembangunansKey()

        if (isDialog) {
          router.back()
        } else {
          router.push("/buku-d2")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal memperbaharui Kegiatan Pembangunan")
      },
    }),
  )

  const defaultValues = React.useMemo<z.input<typeof formSchema>>(
    () => ({
      ...data,
      namaKegiatan: data?.namaKegiatan ?? "",
      tahunKegiatan: data?.tahunKegiatan ?? "",
      volume: data?.volume ?? "",
      jumlah: data?.jumlah ?? "",
      waktuPengerjaan: data?.waktuPengerjaan ?? "",
      pelaksana: data?.pelaksana ?? "",
      baru: data?.baru ?? "",
      lanjutan: data?.lanjutan ?? "",
      keteranganTambahan: data?.keteranganTambahan ?? "",
      biayaDariPemerintah: data?.biayaDariPemerintah ?? "",
      biayaDariProvinsi: data?.biayaDariProvinsi ?? "",
      biayaDariKabupaten: data?.biayaDariKabupaten ?? "",
      biayaDariSwadaya: data?.biayaDariSwadaya ?? "",
    }),
    [data],
  )

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      updateKegiatanPembangunan(value)
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

      <form.AppField name="tahunKegiatan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Tahun Kegiatan</form.FormLabel>
            <field.BaseField placeholder="Contoh: 2025" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="volume">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Volume</form.FormLabel>
            <field.BaseField placeholder="Volume (opsional)" />
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

      <form.AppField name="waktuPengerjaan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Waktu Pengerjaan</form.FormLabel>
            <field.BaseField placeholder="Misal: 3 bulan" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="pelaksana">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Pelaksana</form.FormLabel>
            <field.BaseField placeholder="Masukkan pelaksana" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="baru">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Baru</form.FormLabel>
            <field.BaseField placeholder="Isian baru (opsional)" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="lanjutan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Lanjutan</form.FormLabel>
            <field.BaseField placeholder="Isian lanjutan (opsional)" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="biayaDariPemerintah">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Biaya dari Pemerintah</form.FormLabel>
            <field.BaseField placeholder="Masukkan jumlah biaya" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="biayaDariProvinsi">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Biaya dari Provinsi</form.FormLabel>
            <field.BaseField placeholder="Masukkan biaya (opsional)" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="biayaDariKabupaten">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Biaya dari Kabupaten</form.FormLabel>
            <field.BaseField placeholder="Masukkan biaya (opsional)" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="biayaDariSwadaya">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Biaya dari Swadaya</form.FormLabel>
            <field.BaseField placeholder="Masukkan biaya (opsional)" />
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
        <Button type="submit">Simpan Kegiatan Pembangunan</Button>
      </form.FormItem>
    </form>
  )
}
