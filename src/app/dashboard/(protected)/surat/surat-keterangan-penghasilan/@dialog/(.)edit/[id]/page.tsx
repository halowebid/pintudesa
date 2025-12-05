import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/dashboard/layout/dialog-wrapper"

const SuratKeteranganPenghasilanForm = dynamicFn(async () => {
  const SuratKeteranganPenghasilanForm = await import("../../../edit/[id]/form")
  return SuratKeteranganPenghasilanForm
})

export const metadata = {
  title: "Edit Surat Keterangan Penghasilan",
}

export default function SuratKeteranganPenghasilanPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <DialogWrapper>
      <SuratKeteranganPenghasilanForm id={params.id} isDialog />
    </DialogWrapper>
  )
}
