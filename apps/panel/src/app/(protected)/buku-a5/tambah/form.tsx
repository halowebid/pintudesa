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
  asal: z.string().min(1, "Asal wajib diisi").trim(),
  nomorSertifikat: z.string().min(1, "Nomor sertifikat wajib diisi").trim(),
  luasTanah: z.coerce.number().min(1, "Luas tanah wajib diisi"),

  kelasTanah: z.string().min(1, "Kelas tanah wajib diisi").trim(),

  milikDesa: z.coerce.number().optional(),
  milikPemerintah: z.coerce.number().optional(),
  milikProvinsi: z.coerce.number().optional(),
  milikKabupatenAtauKota: z.coerce.number().optional(),
  milikLainnya: z.coerce.number().optional(),

  tanahSawa: z.coerce.number().optional(),
  tanahTegal: z.coerce.number().optional(),
  tanahKebun: z.coerce.number().optional(),
  tanahTambak: z.coerce.number().optional(),
  tanahKering: z.coerce.number().optional(),
  tanahPatok: z.coerce.number().optional(),
  tanahTidakPatok: z.coerce.number().optional(),

  lokasi: z.string().min(1, "Lokasi wajib diisi").trim(),

  mutasi: z.string().optional().or(z.literal("")),
  keteranganTambahan: z.string().optional().or(z.literal("")),
})

export default function TanahKasForm({ isDialog }: { isDialog: boolean }) {
  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const tanahKassKey = trpc.tanahKas.all.queryKey()
  const invalidateTanahKassKey = async () => {
    await queryClient.invalidateQueries({ queryKey: tanahKassKey })
  }
  const { mutate: createTanahKas } = useMutation(
    trpc.tanahKas.create.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil membuat tanahKas",
        })
        if (isDialog) {
          router.back()
          await invalidateTanahKassKey()
        } else {
          router.push("/buku-a6")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal membuat tanahKas")
      },
    }),
  )

  const defaultValues: z.input<typeof formSchema> = {
    asal: "",
    nomorSertifikat: "",
    luasTanah: 0,
    kelasTanah: "",
    milikDesa: 0,
    milikPemerintah: 0,
    milikProvinsi: 0,
    milikKabupatenAtauKota: 0,
    milikLainnya: 0,

    tanahSawa: 0,
    tanahTegal: 0,
    tanahKebun: 0,
    tanahTambak: 0,
    tanahKering: 0,
    tanahPatok: 0,
    tanahTidakPatok: 0,

    lokasi: "",
    mutasi: "",
    keteranganTambahan: "",
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      createTanahKas({
        ...value,
      })
    },
  })
  const statusMilikSection = [
    ["milikDesa", "Milik Desa"],
    ["milikPemerintah", "Milik Pemerintah"],
    ["milikProvinsi", "Milik Provinsi"],
    ["milikKabupatenAtauKota", "Milik Kabupaten/Kota"],
    ["milikLainnya", "Milik Lainnya"],
  ]
  const tanahSection = [
    ["tanahSawa", "Sawah"],
    ["tanahTegal", "Tegalan"],
    ["tanahKebun", "Kebun"],
    ["tanahTambak", "Tambak"],
    ["tanahKering", "Kering"],
    ["tanahPatok", "Sudah Dipatok"],
    ["tanahTidakPatok", "Belum Dipatok"],
  ]
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
      className="max-w-md space-y-6"
    >
      <form.AppField name="asal">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Asal</form.FormLabel>
            <field.BaseField placeholder="Contoh: Hibah, Pembelian, dll." />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="nomorSertifikat">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Nomor Sertifikat</form.FormLabel>
            <field.BaseField placeholder="Nomor sertifikat tanah" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="luasTanah">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Luas Tanah (m²)</form.FormLabel>
            <field.BaseField
              type="number"
              value={field.state.value}
              min={0}
              onChange={(e) =>
                field.setValue(
                  e.target.value === "" ? 0 : Number(e.target.value),
                )
              }
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="kelasTanah">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Kelas Tanah</form.FormLabel>
            <field.BaseField placeholder="Contoh: Kelas I, II, III" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>
      {statusMilikSection.map(([name, label]) => (
        <form.AppField
          key={name}
          name={name as keyof z.input<typeof formSchema>}
        >
          {(field) => (
            <form.FormItem>
              <form.FormLabel>{label}</form.FormLabel>
              <field.BaseField
                type="number"
                min={0}
                value={field.state.value ?? ""}
                onChange={(e) =>
                  field.setValue(
                    e.target.value === "" ? 0 : Number(e.target.value),
                  )
                }
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
      ))}
      {tanahSection.map(([name, label]) => (
        <form.AppField
          key={name}
          name={name as keyof z.input<typeof formSchema>}
        >
          {(field) => (
            <form.FormItem>
              <form.FormLabel>{label}</form.FormLabel>
              <field.BaseField
                type="number"
                min={0}
                value={field.state.value ?? ""}
                onChange={(e) =>
                  field.setValue(
                    e.target.value === "" ? 0 : Number(e.target.value),
                  )
                }
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
      ))}
      <form.AppField name="lokasi">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Lokasi</form.FormLabel>
            <field.BaseField placeholder="Alamat atau nama lokasi tanah" />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="mutasi">
        {(field) => (
          <form.FormItem>
            <form.FormLabel>Mutasi</form.FormLabel>
            <field.BaseField placeholder="Keterangan mutasi jika ada" />
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
