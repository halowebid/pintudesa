"use client"

import * as React from "react"
import type { SuratType } from "@pintudesa/db/schema"
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@pintudesa/ui"
import { useQuery } from "@tanstack/react-query"

import { useTRPC } from "@/lib/trpc/client"
import { mapSuratVariables, renderTemplate } from "@/lib/utils/template"

interface PrintPreviewProps {
  suratType: SuratType
  suratData: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PrintPreview({
  suratType,
  suratData,
  open,
  onOpenChange,
}: PrintPreviewProps) {
  const trpc = useTRPC()
  const [renderedHtml, setRenderedHtml] = React.useState<string>("")
  const [error, setError] = React.useState<string | null>(null)

  // Fetch the default template for this surat type
  const { data: template } = useQuery(
    trpc.suratTemplate.bySuratType.queryOptions(suratType),
  )

  // Render template when data is available
  React.useEffect(() => {
    if (!template) {
      setError("Template tidak ditemukan untuk jenis surat ini")
      setRenderedHtml("")
      return
    }

    try {
      // Map variables - we'll use simple desa info for now
      const variables = mapSuratVariables(suratType, suratData)

      // Render template
      const html = renderTemplate(template.htmlContent, variables)
      setRenderedHtml(html)
      setError(null)
    } catch (err) {
      setError("Gagal merender template: " + (err as Error).message)
      setRenderedHtml("")
    }
  }, [template, suratData, suratType])

  const handlePrint = React.useCallback(() => {
    if (!renderedHtml) return

    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Popup blocked. Please allow popups for this site.")
      return
    }

    // Write the content
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Print - ${suratType}</title>
          <style>
            @media print {
              @page {
                size: A4;
                margin: 2cm;
              }
              body {
                margin: 0;
                padding: 0;
              }
            }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #000;
            }
          </style>
        </head>
        <body>
          ${renderedHtml}
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()

    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }, [renderedHtml, suratType])

  return (
    <Dialog open={open} onOpenChange={(details) => onOpenChange(details.open)}>
      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Preview & Cetak</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto rounded-md border bg-white p-4">
          {error ? (
            <div className="text-destructive py-8 text-center">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
              <p className="text-muted-foreground mt-4 text-xs">
                Pastikan template telah dibuat untuk jenis surat ini di menu
                Setting &gt; Template Surat
              </p>
            </div>
          ) : renderedHtml ? (
            <div
              className="print-preview"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          ) : (
            <div className="text-muted-foreground py-8 text-center">
              <p>Memuat preview...</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
          <Button onClick={handlePrint} disabled={!renderedHtml || !!error}>
            Cetak
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
