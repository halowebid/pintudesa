import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layout/dialog-wrapper"

const SuratKeteranganKepemilikanRumahForm = dynamicFn(async () => {
  const SuratKeteranganKepemilikanRumahForm = await import(
    "../../../edit/[id]/form"
  )
  return SuratKeteranganKepemilikanRumahForm
})

export const metadata = {
  title: "Edit Surat Keterangan Kepemilikan Rumah",
}

export default function SuratKeteranganKepemilikanRumahPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <DialogWrapper>
      <SuratKeteranganKepemilikanRumahForm id={params.id} isDialog />
    </DialogWrapper>
  )
}
