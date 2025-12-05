"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { useAppForm } from "@/components/dashboard/form"
import { useToast } from "@/components/toast-provider"
import { siteTitle } from "@/lib/env"
import { useTRPC } from "@/lib/trpc/client"
import { Button } from "@/lib/ui"
import { useHandleTRPCError } from "@/lib/utils/error"

const formSchema = z.object({
  siteTitle: z.string().trim(),
  siteTagline: z.string().trim(),
  siteDescription: z.string().trim(),
  address: z.string().trim(),
  desa: z.string().trim(),
  kodePos: z.string().trim(),
  kecamatan: z.string().trim(),
  kabupaten: z.string().trim(),
  provinsi: z.string().trim(),
  perbatasanUtara: z.string().trim(),
  perbatasanSelatan: z.string().trim(),
  perbatasanTimur: z.string().trim(),
  perbatasanBarat: z.string().trim(),
  supportEmail: z.string().email().trim(),
  facebookUsername: z.string().trim(),
  instagramUsername: z.string().trim(),
  youtubeUsername: z.string().trim(),
  whatsappNumber: z.string().trim(),
})

export default function SettingForm() {
  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const settingsKey = trpc.setting.all.queryKey()
  const invalidateSettingsKey = async () => {
    await queryClient.invalidateQueries({ queryKey: settingsKey })
  }

  const { data: settings } = useQuery(trpc.setting.all.queryOptions())

  const { mutate: upsertSetting } = useMutation(
    trpc.setting.upsert.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil memperbaharui pengaturan",
        })
        await invalidateSettingsKey()
      },
      onError: (error) => {
        handleError(error, "Gagal memperbaharui pengaturan")
      },
    }),
  )

  const defaultValues: z.input<typeof formSchema> = {
    siteTitle:
      settings?.find((s) => s.key === "siteTitle")?.value ?? siteTitle!,
    siteTagline: settings?.find((s) => s.key === "siteTagline")?.value ?? "",
    siteDescription:
      settings?.find((s) => s.key === "siteDescription")?.value ?? "",
    address: settings?.find((s) => s.key === "siteAddress")?.value ?? "",
    desa: settings?.find((s) => s.key === "desa")?.value ?? "",
    kodePos: settings?.find((s) => s.key === "kodePos")?.value ?? "",
    kecamatan: settings?.find((s) => s.key === "kecamatan")?.value ?? "",
    kabupaten: settings?.find((s) => s.key === "kabupaten")?.value ?? "",
    provinsi: settings?.find((s) => s.key === "provinsi")?.value ?? "",
    perbatasanUtara:
      settings?.find((s) => s.key === "perbatasanUtara")?.value ?? "",
    perbatasanSelatan:
      settings?.find((s) => s.key === "perbatasanSelatan")?.value ?? "",
    perbatasanTimur:
      settings?.find((s) => s.key === "perbatasanTimur")?.value ?? "",
    perbatasanBarat:
      settings?.find((s) => s.key === "perbatasanBarat")?.value ?? "",
    supportEmail: settings?.find((s) => s.key === "supportEmail")?.value ?? "",
    facebookUsername:
      settings?.find((s) => s.key === "facebookUsername")?.value ?? "",
    instagramUsername:
      settings?.find((s) => s.key === "instagramUsername")?.value ?? "",
    youtubeUsername:
      settings?.find((s) => s.key === "youtubeUsername")?.value ?? "",
    whatsappNumber:
      settings?.find((s) => s.key === "whatsappNumber")?.value ?? "",
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      Object.entries(value).forEach(([key, val]) => {
        upsertSetting({ key, value: val.toString() })
      })
    },
  })

  return (
    <div className="m-0 flex w-full flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Pengaturan</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
        className="w-full max-w-xl space-y-6"
      >
        <form.AppField name="siteTitle">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Judul Situs</form.FormLabel>
              <field.BaseField placeholder="Masukan Judul Situs" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
        <form.AppField name="siteTagline">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Slogan Situs</form.FormLabel>
              <field.BaseField placeholder="Masukan Slogan Situs" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
        <form.AppField name="siteDescription">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Deskripsi Situs</form.FormLabel>
              <field.TextareaField placeholder="Masukan Deskripsi Situs" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
        <form.AppField name="address">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Alamat</form.FormLabel>
              <field.TextareaField placeholder="Masukan Alamat" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
        <form.AppField name="desa">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Desa</form.FormLabel>
              <field.BaseField placeholder="Masukan Desa" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
        <form.AppField name="kodePos">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Kode Pos</form.FormLabel>
              <field.BaseField type="number" placeholder="Masukan Kode Pos" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
        <form.AppField name="kecamatan">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Kecamatan</form.FormLabel>
              <field.BaseField placeholder="Masukan Kecamatan" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
        <form.AppField name="kabupaten">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Kabupaten</form.FormLabel>
              <field.BaseField placeholder="Masukan Kabupaten" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
        <form.AppField name="provinsi">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Provinsi</form.FormLabel>
              <field.BaseField placeholder="Masukan Provinsi" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
        <form.AppField name="perbatasanUtara">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Perbatasan Utara</form.FormLabel>
              <field.BaseField placeholder="Masukan Perbatasan Utara" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
        <form.AppField name="perbatasanSelatan">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Perbatasan Selatan</form.FormLabel>
              <field.BaseField placeholder="Masukan Perbatasan Selatan" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
        <form.AppField name="perbatasanTimur">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Perbatasan Timur</form.FormLabel>
              <field.BaseField placeholder="Masukan Perbatasan Timur" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
        <form.AppField name="perbatasanBarat">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Perbatasan Barat</form.FormLabel>
              <field.BaseField placeholder="Masukan Perbatasan Barat" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
        <form.AppField name="supportEmail">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Email Dukungan</form.FormLabel>
              <field.BaseField
                type="email"
                placeholder="Masukan Email Dukungan"
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
        <form.AppField name="facebookUsername">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Nama pengguna Facebook</form.FormLabel>
              <field.BaseField placeholder="Masukan Nama pengguna Facebook" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
        <form.AppField name="instagramUsername">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Nama pengguna Instagram</form.FormLabel>
              <field.BaseField placeholder="Masukan Nama pengguna Instagram" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
        <form.AppField name="youtubeUsername">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Nama pengguna YouTube</form.FormLabel>
              <field.BaseField placeholder="Masukan Nama pengguna YouTube" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
        <form.AppField name="whatsappNumber">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Nomor WhatsApp</form.FormLabel>
              <field.BaseField
                type="tel"
                placeholder="Masukan Nomor WhatsApp"
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>

        <form.FormItem>
          <Button type="submit">Simpan</Button>
        </form.FormItem>
      </form>
    </div>
  )
}
