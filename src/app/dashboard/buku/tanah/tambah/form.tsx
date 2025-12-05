"use client"

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { useAppForm } from "@/components/features/forms"
import { useToast } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

const formSchema = z.object({
  namaPemilik: z.string().min(1, "Nama pemilik wajib diisi").trim(),
  totalLuas: z.coerce.number().min(1, "Total luas wajib diisi"),
  hakMilik: z.string().optional().or(z.literal("")),
  hakGunaBangunan: z.string().optional().or(z.literal("")),
  hakPakai: z.string().optional().or(z.literal("")),
  hakGunaUsaha: z.string().optional().or(z.literal("")),
  hakPengelolaan: z.string().optional().or(z.literal("")),
  hakMilikAdat: z.string().optional().or(z.literal("")),
  hakVIMilikPribumi: z.string().optional().or(z.literal("")),
  tanahNegara: z.coerce.number().optional(),
  perumahan: z.coerce.number().optional(),
  perdaganganDanJasa: z.coerce.number().optional(),
  perkantoran: z.coerce.number().optional(),
  industri: z.coerce.number().optional(),
  fasilitasUmum: z.coerce.number().optional(),
  sawah: z.coerce.number().optional(),
  tegalan: z.coerce.number().optional(),
  perkebunan: z.coerce.number().optional(),
  peternakanPerikanan: z.coerce.number().optional(),
  hutanBelukar: z.coerce.number().optional(),
  hutanLebat: z.coerce.number().optional(),
  tanahKosong: z.coerce.number().optional(),
  lainLain: z.coerce.number().optional(),
  mutasi: z.coerce.number().optional(),
  keteranganTambahan: z.string().optional().or(z.literal("")),
})

export default function TanahForm({ isDialog }: { isDialog: boolean }) {
  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const tanahsKey = trpc.tanah.all.queryKey()
  const invalidateTanahsKey = async () => {
    await queryClient.invalidateQueries({ queryKey: tanahsKey })
  }
  const { mutate: createTanah } = useMutation(
    trpc.tanah.create.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil membuat tanah",
        })
        if (isDialog) {
          router.back()
          await invalidateTanahsKey()
        } else {
          router.push("/dashboard/buku/tanah")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal membuat tanah")
      },
    }),
  )

  const defaultValues: z.input<typeof formSchema> = {
    namaPemilik: "",
    totalLuas: 0,
    hakMilik: "",
    hakGunaBangunan: "",
    hakPakai: "",
    hakGunaUsaha: "",
    hakPengelolaan: "",
    hakMilikAdat: "",
    hakVIMilikPribumi: "",
    tanahNegara: 0,
    perumahan: 0,
    perdaganganDanJasa: 0,
    perkantoran: 0,
    industri: 0,
    fasilitasUmum: 0,
    sawah: 0,
    tegalan: 0,
    perkebunan: 0,
    peternakanPerikanan: 0,
    hutanBelukar: 0,
    hutanLebat: 0,
    tanahKosong: 0,
    lainLain: 0,
    mutasi: 0,
    keteranganTambahan: "",
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      createTanah({
        ...value,
      })
    },
  })
  const hakSection = [
    ["hakMilik", "Hak Milik"],
    ["hakGunaBangunan", "Hak Guna Bangunan"],
    ["hakPakai", "Hak Pakai"],
    ["hakGunaUsaha", "Hak Guna Usaha"],
    ["hakPengelolaan", "Hak Pengelolaan"],
    ["hakMilikAdat", "Hak Milik Adat"],
    ["hakVIMilikPribumi", "Hak VI Milik Pribumi"],
  ] as [keyof z.input<typeof formSchema>, string][]
  const luasSection = [
    ["tanahNegara", "Tanah Negara"],
    ["perumahan", "Perumahan"],
    ["perdaganganDanJasa", "Perdagangan & Jasa"],
    ["perkantoran", "Perkantoran"],
    ["industri", "Industri"],
    ["fasilitasUmum", "Fasilitas Umum"],
    ["sawah", "Sawah"],
    ["tegalan", "Tegalan"],
    ["perkebunan", "Perkebunan"],
    ["peternakanPerikanan", "Peternakan & Perikanan"],
    ["hutanBelukar", "Hutan Belukar"],
    ["hutanLebat", "Hutan Lebat"],
    ["tanahKosong", "Tanah Kosong"],
    ["lainLain", "Lain-lain"],
    ["mutasi", "Mutasi"],
  ] as [keyof z.input<typeof formSchema>, string][]
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
      className="max-w-md space-y-6"
    >
      <form.AppField name="namaPemilik">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Nama Pemilik</form.FormLabel>
            <field.BaseField placeholder="Masukkan nama pemilik" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="totalLuas">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Total Luas (m²)</form.FormLabel>
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

      {hakSection.map(([name, label]) => (
        <form.AppField key={name} name={name}>
          {(field) => (
            <form.FormItem>
              <form.FormLabel>{label}</form.FormLabel>
              <field.BaseField placeholder={label} />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
      ))}

      {luasSection.map(([name, label]) => (
        <form.AppField key={name} name={name}>
          {(field) => (
            <form.FormItem>
              <form.FormLabel>{label}</form.FormLabel>
              <field.BaseField
                placeholder={`Luas ${label}`}
                type="number"
                min={0}
                value={field.state.value ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value
                  field.setValue(value === "" ? 0 : Number(value))
                }}
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
      ))}

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
        <Button type="submit">Simpan </Button>
      </form.FormItem>
    </form>
  )
}
