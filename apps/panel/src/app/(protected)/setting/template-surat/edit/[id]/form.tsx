"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SURAT_TYPE_VALUES, type SuratType } from "@pintudesa/db/schema"
import { Button } from "@pintudesa/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { useAppForm } from "@/components/form"
import { useToast } from "@/components/toast-provider"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

const SURAT_TYPE_LABELS: Record<SuratType, string> = {
  "surat-izin-keramaian": "Surat Izin Keramaian",
  "surat-izin-mendirikan-bangunan": "Surat Izin Mendirikan Bangunan",
  "surat-keterangan-domisili": "Surat Keterangan Domisili",
  "surat-keterangan-gaib": "Surat Keterangan Gaib",
  "surat-keterangan-jalan": "Surat Keterangan Jalan",
  "surat-keterangan-kelahiran": "Surat Keterangan Kelahiran",
  "surat-keterangan-kematian": "Surat Keterangan Kematian",
  "surat-keterangan-kepemilikan-rumah": "Surat Keterangan Kepemilikan Rumah",
  "surat-keterangan-penghasilan": "Surat Keterangan Penghasilan",
  "surat-keterangan-penghasilan-orang-tua":
    "Surat Keterangan Penghasilan Orang Tua",
  "surat-keterangan-penyaksian-tanah": "Surat Keterangan Penyaksian Tanah",
  "surat-kuasa-ahli-waris": "Surat Kuasa Ahli Waris",
  "surat-kuasa-skgr": "Surat Kuasa SKGR",
  "surat-pengantar-skck": "Surat Pengantar SKCK",
  "surat-pernyataan-belum-menikah": "Surat Pernyataan Belum Menikah",
}

const formSchema = z.object({
  suratType: z.enum(SURAT_TYPE_VALUES, {
    required_error: "Jenis surat wajib dipilih",
  }),
  name: z.string().min(1, "Nama template wajib diisi"),
  htmlContent: z.string().min(1, "Konten HTML wajib diisi"),
  isDefault: z.boolean().default(false),
})

export default function TemplateSuratForm({
  id,
  isDialog,
}: {
  id?: string
  isDialog: boolean
}) {
  const { toast } = useToast()
  const handleError = useHandleTRPCError()
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  const suratTemplatesKey = trpc.suratTemplate.all.queryKey()

  const invalidateSuratTemplatesKey = async () => {
    await queryClient.invalidateQueries({
      queryKey: suratTemplatesKey,
    })
  }

  // Fetch existing template if editing
  const { data: existingTemplate } = useQuery(
    trpc.suratTemplate.byId.queryOptions(id!, { enabled: !!id }),
  )

  const { mutate: createTemplate } = useMutation(
    trpc.suratTemplate.create.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil menyimpan template",
        })
        await invalidateSuratTemplatesKey()
        if (isDialog) {
          router.back()
        } else {
          router.push("/setting/template-surat")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal menyimpan template")
      },
    }),
  )

  const { mutate: updateTemplate } = useMutation(
    trpc.suratTemplate.update.mutationOptions({
      onSuccess: async () => {
        toast({
          description: "Berhasil memperbarui template",
        })
        await invalidateSuratTemplatesKey()
        if (isDialog) {
          router.back()
        } else {
          router.push("/setting/template-surat")
        }
      },
      onError: (error) => {
        handleError(error, "Gagal memperbarui template")
      },
    }),
  )

  const typeFromUrl = searchParams.get("type") as SuratType | null

  const defaultValues = React.useMemo<z.input<typeof formSchema>>(
    () => ({
      suratType:
        existingTemplate?.suratType ??
        typeFromUrl ??
        "surat-keterangan-domisili",
      name: existingTemplate?.name ?? "",
      htmlContent: existingTemplate?.htmlContent ?? "",
      isDefault: existingTemplate?.isDefault ?? false,
    }),
    [existingTemplate, typeFromUrl],
  )

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      if (id) {
        updateTemplate({ id, ...value })
      } else {
        createTemplate(value)
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
      className="max-w-4xl space-y-6"
    >
      <div className="mb-4">
        <h2 className="text-lg font-bold">
          {id ? "Edit Template" : "Buat Template Baru"}
        </h2>
        <p className="text-muted-foreground text-sm">
          Template digunakan untuk menghasilkan surat dalam format cetak dan PDF
        </p>
      </div>

      <form.AppField name="suratType">
        {(field) => (
          <form.FormItem>
            <field.SelectField
              label="Jenis Surat"
              placeholder="Pilih jenis surat"
              options={SURAT_TYPE_VALUES.map((type) => ({
                label: SURAT_TYPE_LABELS[type],
                value: type,
                disabled: !!id,
              }))}
              mode={isDialog ? "inline" : "portal"}
              disabled={!!id}
            />
            <form.FormMessage />
            {!!id && (
              <form.FormDescription>
                Jenis surat tidak dapat diubah setelah template dibuat
              </form.FormDescription>
            )}
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="name">
        {(field) => (
          <form.FormItem>
            <field.BaseField
              label="Nama Template"
              placeholder="Contoh: Template Formal, Template Sederhana"
            />
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="htmlContent">
        {(field) => (
          <form.FormItem>
            <field.TextareaField
              label="Konten HTML"
              placeholder="Masukkan HTML template..."
              rows={20}
              className="font-mono text-sm"
            />
            <form.FormDescription>
              Gunakan variabel template seperti {`{{namaPenduduk}}`} untuk data
              dinamis
            </form.FormDescription>
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <form.AppField name="isDefault">
        {(field) => (
          <form.FormItem>
            <field.CheckboxField label="Jadikan template default" />
            <form.FormDescription>
              Template default akan digunakan secara otomatis untuk jenis surat
              ini
            </form.FormDescription>
            <form.FormMessage />
          </form.FormItem>
        )}
      </form.AppField>

      <div className="flex gap-2">
        <Button type="submit">
          {id ? "Simpan Perubahan" : "Buat Template"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (isDialog) {
              router.back()
            } else {
              router.push("/setting/template-surat")
            }
          }}
        >
          Batal
        </Button>
      </div>
    </form>
  )
}
