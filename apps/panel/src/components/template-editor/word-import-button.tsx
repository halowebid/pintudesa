"use client"

import { useRef, useState } from "react"
import { Button } from "@pintudesa/ui"
import { Icon } from "@yopem-ui/react-icons"
import mammoth from "mammoth"

import { useToast } from "@/components/toast-provider"

interface WordImportButtonProps {
  onImport: (html: string) => void
  disabled?: boolean
}

export function WordImportButton({
  onImport,
  disabled = false,
}: WordImportButtonProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".docx") && !file.name.endsWith(".doc")) {
      toast({
        description: "Hanya file .docx atau .doc yang didukung",
      })
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        description: "Ukuran file maksimal 10MB",
      })
      return
    }

    setIsUploading(true)

    try {
      const arrayBuffer = await file.arrayBuffer()

      const result = await mammoth.convertToHtml({
        arrayBuffer,
      })

      // Log conversion warnings if any
      if (result.messages.length > 0) {
        // eslint-disable-next-line no-console
        console.warn("Word conversion warnings:", result.messages)
      }

      onImport(result.value)

      toast({
        description: "Dokumen Word berhasil dikonversi",
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Word import error:", error)
      toast({
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".doc,.docx"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || isUploading}
      >
        <Icon name="Upload" />
        {isUploading ? "Mengimport..." : "Import dari Word"}
      </Button>
    </>
  )
}
