import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/dashboard/layout/dialog-wrapper"

const SuratKeteranganPenyaksianTanahForm = dynamicFn(async () => {
  const SuratKeteranganPenyaksianTanahForm = await import(
    "../../../edit/[id]/form"
  )
  return SuratKeteranganPenyaksianTanahForm
})

export const metadata = {
  title: "Edit Surat Keterangan Penyaksian Tanah",
}

export default function SuratKeteranganPenyaksianTanahPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <DialogWrapper>
      <SuratKeteranganPenyaksianTanahForm id={params.id} isDialog />
    </DialogWrapper>
  )
}
