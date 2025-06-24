"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@pintudesa/ui"
import { formatStringToDate } from "@pintudesa/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { useAppForm } from "@/components/form"
import { useToast } from "@/components/toast-provider"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

const formSchema = z.object({
  jenisInventaris: z.enum(["barang", "bangunan"], {
    errorMap: () => ({ message: "Jenis inventaris tidak valid" }),
  }),
  tahun: z.coerce.number().int({ message: "Tahun harus berupa angka" }),
  dariPemerintah: z.coerce.number().int().optional(),
  dariProvinsi: z.coerce.number().int().optional(),
  dariKabupatenAtauKota: z.coerce.number().int().optional(),
  diBeliSendiri: z.coerce.number().int().optional(),
  sumbangan: z.coerce.number().int().optional(),
  keadaanBaik: z.coerce.number().int().optional(),
  keadaanRusak: z.coerce.number().int().optional(),
  penghapusanRusak: z.coerce.number().int().optional(),
  penghapusanDijual: z.coerce.number().int().optional(),
  penghapusanHilang: z.coerce.number().int().optional(),
  penghapusanDisumbangkan: z.coerce.number().int().optional(),
  tanggalPenghapusan: z.coerce.date().optional(),
  keadaanBaikAkhirTahun: z.coerce.number().int().optional(),
  keadaanRusakAkhirTahun: z.coerce.number().int().optional(),
  keteranganTambahan: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),
})

export default function InventarisForm({
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
  const inventarisByIdKey = trpc.inventaris.byId.queryKey(id)
  const invalidateInventarisByIdKey = async () => {
    await queryClient.invalidateQueries({ queryKey: inventarisByIdKey })
  }
  const inventarissKey = trpc.inventaris.all.queryKey()
  const invalidateInventarissKey = async () => {
    await queryClient.invalidateQueries({ queryKey: inventarissKey })
  }
  const { data } = useQuery(trpc.inventaris.byId.queryOptions(id))
  const { mutate: updateInventaris } = useMutation(
    trpc.inventaris.update.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil memperbaharui inventaris",
        })
        await invalidateInventarisByIdKey()
        await invalidateInventarissKey()
        if (isDialog) {
          router.back()
        } else {
          router.push("/buku-a3")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal memperbaharui inventaris")
      },
    }),
  )

  const defaultValues = React.useMemo<z.input<typeof formSchema>>(
    () => ({
      ...data,
      jenisInventaris: data?.jenisInventaris ?? "barang",
      tahun: data?.tahun ?? new Date().getFullYear(),
      dariPemerintah: data?.dariPemerintah ?? 0,
      dariProvinsi: data?.dariProvinsi ?? 0,
      dariKabupatenAtauKota: data?.dariKabupatenAtauKota ?? 0,
      diBeliSendiri: data?.diBeliSendiri ?? 0,
      sumbangan: data?.sumbangan ?? 0,
      keadaanBaik: data?.keadaanBaik ?? 0,
      keadaanRusak: data?.keadaanRusak ?? 0,
      penghapusanRusak: data?.penghapusanRusak ?? 0,
      penghapusanDijual: data?.penghapusanDijual ?? 0,
      penghapusanHilang: data?.penghapusanHilang ?? 0,
      penghapusanDisumbangkan: data?.penghapusanDisumbangkan ?? 0,
      tanggalPenghapusan: data?.tanggalPenghapusan ?? undefined,
      keadaanBaikAkhirTahun: data?.keadaanBaikAkhirTahun ?? 0,
      keadaanRusakAkhirTahun: data?.keadaanRusakAkhirTahun ?? 0,
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
      updateInventaris({
        ...value,
        tanggalPenghapusan:
          value.tanggalPenghapusan !== undefined
            ? formatStringToDate(value.tanggalPenghapusan)
            : undefined,
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
      <form.AppField name="jenisInventaris">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Jenis Inventaris</form.FormLabel>
            <field.SelectField
              mode={isDialog ? "inline" : "portal"}
              options={[
                { label: "Barang", value: "barang" },
                { label: "Bangunan", value: "bangunan" },
              ]}
              placeholder="Pilih jenis inventaris"
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="tahun">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Tahun</form.FormLabel>
            <field.BaseField
              type="number"
              value={field.state.value}
              min={0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                field.setValue(value === "" ? 0 : Number(value))
              }}
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="dariPemerintah">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Dari Pemerintah</form.FormLabel>
            <field.BaseField
              type="number"
              value={field.state.value}
              min={0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                field.setValue(value === "" ? 0 : Number(value))
              }}
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="dariProvinsi">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Dari Provinsi</form.FormLabel>
            <field.BaseField
              type="number"
              value={field.state.value}
              min={0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                field.setValue(value === "" ? 0 : Number(value))
              }}
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="dariKabupatenAtauKota">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Dari Kabupaten/Kota</form.FormLabel>
            <field.BaseField
              type="number"
              value={field.state.value}
              min={0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                field.setValue(value === "" ? 0 : Number(value))
              }}
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="diBeliSendiri">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Dibeli Sendiri</form.FormLabel>
            <field.BaseField
              type="number"
              value={field.state.value}
              min={0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                field.setValue(value === "" ? 0 : Number(value))
              }}
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="sumbangan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Sumbangan</form.FormLabel>
            <field.BaseField
              type="number"
              value={field.state.value}
              min={0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                field.setValue(value === "" ? 0 : Number(value))
              }}
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="keadaanBaik">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Keadaan Baik</form.FormLabel>
            <field.BaseField
              type="number"
              value={field.state.value}
              min={0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                field.setValue(value === "" ? 0 : Number(value))
              }}
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="keadaanRusak">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Keadaan Rusak</form.FormLabel>
            <field.BaseField
              type="number"
              value={field.state.value}
              min={0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                field.setValue(value === "" ? 0 : Number(value))
              }}
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="penghapusanRusak">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Penghapusan Rusak</form.FormLabel>
            <field.BaseField
              type="number"
              value={field.state.value}
              min={0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                field.setValue(value === "" ? 0 : Number(value))
              }}
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="penghapusanDijual">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Penghapusan Dijual</form.FormLabel>
            <field.BaseField
              type="number"
              value={field.state.value}
              min={0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                field.setValue(value === "" ? 0 : Number(value))
              }}
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="penghapusanHilang">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Penghapusan Hilang</form.FormLabel>
            <field.BaseField
              type="number"
              value={field.state.value}
              min={0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                field.setValue(value === "" ? 0 : Number(value))
              }}
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="penghapusanDisumbangkan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Penghapusan Disumbangkan</form.FormLabel>
            <field.BaseField
              type="number"
              value={field.state.value}
              min={0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                field.setValue(value === "" ? 0 : Number(value))
              }}
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="tanggalPenghapusan">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Tanggal Penghapusan</form.FormLabel>
            <field.DatePickerField mode={isDialog ? "inline" : "portal"} />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="keadaanBaikAkhirTahun">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Keadaan Baik Akhir Tahun</form.FormLabel>
            <field.BaseField
              type="number"
              value={field.state.value}
              min={0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                field.setValue(value === "" ? 0 : Number(value))
              }}
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="keadaanRusakAkhirTahun">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Keadaan Rusak Akhir Tahun</form.FormLabel>
            <field.BaseField
              type="number"
              value={field.state.value}
              min={0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                field.setValue(value === "" ? 0 : Number(value))
              }}
            />
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
