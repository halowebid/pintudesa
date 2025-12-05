import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const SuratIzinMendirikanBangunanForm = dynamicFn(async () => {
  const SuratIzinMendirikanBangunanForm = await import(
    "../../../edit/[id]/form"
  )
  return SuratIzinMendirikanBangunanForm
})

export const metadata = {
  title: "Edit Surat Izin Mendirikan Bangunan",
}

export default function SuratIzinMendirikanBangunanPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <DialogWrapper>
      <SuratIzinMendirikanBangunanForm id={params.id} isDialog />
    </DialogWrapper>
  )
}
