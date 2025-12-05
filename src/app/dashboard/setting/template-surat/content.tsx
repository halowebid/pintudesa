"use client"

import * as React from "react"
import Link from "next/link"
import { useMutation, useQuery } from "@tanstack/react-query"

import { useToast } from "@/components/toast-provider"
import AlertDelete from "@/components/ui/alert-delete"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ShowOptions from "@/components/ui/show-options"
import {
  SURAT_TYPE_VALUES,
  type SelectSuratTemplate,
  type SuratType,
} from "@/lib/db/schema"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

const SURAT_TYPE_LABELS: Record<SuratType, string> = {
  "surat-izin-keramaian": "Surat Izin Keramaian",
  "surat-izin-mendirikan-bangunan": "Surat Izin Mendirikan Bangunan",
  "surat-keterangan-belum-memiliki-rumah":
    "Surat Keterangan Belum Memiliki Rumah",
  "surat-keterangan-domisili": "Surat Keterangan Domisili",
  "surat-keterangan-domisili-usaha": "Surat Keterangan Domisili Usaha",
  "surat-keterangan-gaib": "Surat Keterangan Gaib",
  "surat-keterangan-jalan": "Surat Keterangan Jalan",
  "surat-keterangan-kelahiran": "Surat Keterangan Kelahiran",
  "surat-keterangan-kematian": "Surat Keterangan Kematian",
  "surat-keterangan-kepemilikan-rumah": "Surat Keterangan Kepemilikan Rumah",
  "surat-keterangan-penghasilan": "Surat Keterangan Penghasilan",
  "surat-keterangan-penghasilan-orang-tua":
    "Surat Keterangan Penghasilan Orang Tua",
  "surat-keterangan-penyaksian-tanah": "Surat Keterangan Penyaksian Tanah",
  "surat-keterangan-usaha": "Surat Keterangan Usaha",
  "surat-keterangan-beda-nama": "Surat Keterangan Beda Nama",
  "surat-kuasa-ahli-waris": "Surat Kuasa Ahli Waris",
  "surat-kuasa-skgr": "Surat Kuasa SKGR",
  "surat-pengantar-skck": "Surat Pengantar SKCK",
  "surat-pernyataan-belum-menikah": "Surat Pernyataan Belum Menikah",
  "surat-pindah-desa-bpn": "Surat Pindah Desa BPN",
}

export default function TemplateSuratContent() {
  const [expandedSections, setExpandedSections] = React.useState<
    Set<SuratType>
  >(new Set(SURAT_TYPE_VALUES))
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const trpc = useTRPC()
  const { toast } = useToast()
  const handleError = useHandleTRPCError()

  const { data: templates = [], refetch: refetchTemplates } = useQuery(
    trpc.suratTemplate.all.queryOptions({
      page: 1,
      perPage: 100,
    }),
  )

  const { mutate: deleteTemplate } = useMutation(
    trpc.suratTemplate.delete.mutationOptions({
      onSuccess: async () => {
        await refetchTemplates()
        setDeleteId(null)
        toast({
          description: "Berhasil menghapus template",
        })
      },
      onError: (error) => {
        handleError(error, "Gagal menghapus template")
      },
    }),
  )

  const toggleSection = (suratType: SuratType) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(suratType)) {
        next.delete(suratType)
      } else {
        next.add(suratType)
      }
      return next
    })
  }

  const templatesBySuratType = React.useMemo(() => {
    const grouped: Record<SuratType, SelectSuratTemplate[]> = {} as Record<
      SuratType,
      SelectSuratTemplate[]
    >
    for (const suratType of SURAT_TYPE_VALUES) {
      grouped[suratType] = []
    }
    for (const template of templates) {
      grouped[template.suratType].push(template)
    }
    return grouped
  }, [templates])

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Template Surat</h1>
          <p className="text-muted-foreground text-sm">
            Kelola template untuk semua jenis surat
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {SURAT_TYPE_VALUES.map((suratType) => {
          const templatesForType = templatesBySuratType[suratType]
          const isExpanded = expandedSections.has(suratType)

          return (
            <Card key={suratType}>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleSection(suratType)}
                    className="flex flex-1 items-center gap-2 text-left"
                  >
                    <CardTitle>{SURAT_TYPE_LABELS[suratType]}</CardTitle>
                    <Badge variant="secondary">{templatesForType.length}</Badge>
                    <span className="text-muted-foreground ml-auto text-sm">
                      {isExpanded ? "▼" : "▶"}
                    </span>
                  </button>
                  <Button asChild size="sm" className="ml-4">
                    <Link
                      href={`/setting/template-surat/tambah?type=${suratType}`}
                    >
                      Tambah Template
                    </Link>
                  </Button>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent>
                  {templatesForType.length === 0 ? (
                    <p className="text-muted-foreground text-center text-sm">
                      Belum ada template
                    </p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {templatesForType.map((template) => (
                        <Card key={template.id} className="shadow-none">
                          <CardHeader>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <CardTitle className="text-base">
                                  {template.name}
                                </CardTitle>
                                {template.isDefault && (
                                  <Badge variant="default" className="mt-2">
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <ShowOptions
                                onDelete={() => setDeleteId(template.id)}
                                editUrl={`/dashboard/setting/template-surat/edit/${template.id}`}
                                description={template.name}
                              />
                            </div>
                          </CardHeader>
                          <CardContent className="text-muted-foreground text-xs">
                            <p>
                              Dibuat:{" "}
                              {new Date(template.createdAt!).toLocaleDateString(
                                "id-ID",
                              )}
                            </p>
                            {template.updatedAt && (
                              <p>
                                Diperbarui:{" "}
                                {new Date(
                                  template.updatedAt,
                                ).toLocaleDateString("id-ID")}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      <AlertDelete
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onDelete={() => deleteId && deleteTemplate(deleteId)}
        description="template ini"
      />
    </div>
  )
}
