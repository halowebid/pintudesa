import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const SuratPengantarSKCKForm = dynamicFn(async () => {
  const SuratPengantarSKCKForm = await import("../../../edit/[id]/form")
  return SuratPengantarSKCKForm
})

export const metadata = {
  title: "Edit Surat Pengantar SKCK",
}

export default function SuratPengantarSKCKPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <DialogWrapper>
      <SuratPengantarSKCKForm id={params.id} isDialog />
    </DialogWrapper>
  )
}
