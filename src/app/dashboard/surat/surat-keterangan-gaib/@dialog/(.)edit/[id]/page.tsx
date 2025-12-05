import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const SuratKeteranganGaibForm = dynamicFn(async () => {
  const SuratKeteranganGaibForm = await import("../../../edit/[id]/form")
  return SuratKeteranganGaibForm
})

export const metadata = {
  title: "Edit Surat Keterangan Gaib",
}

export default function SuratKeteranganGaibPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <DialogWrapper>
      <SuratKeteranganGaibForm id={params.id} isDialog />
    </DialogWrapper>
  )
}
