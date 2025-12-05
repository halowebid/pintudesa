import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const SuratPengantarSKCKForm = dynamicFn(async () => {
  const SuratPengantarSKCKForm = await import("../../tambah/form")
  return SuratPengantarSKCKForm
})
export const metadata = {
  title: "Buat Surat Pengantar SKCK",
}

export default function SuratPengantarSKCKPage() {
  return (
    <DialogWrapper>
      <SuratPengantarSKCKForm isDialog />
    </DialogWrapper>
  )
}
