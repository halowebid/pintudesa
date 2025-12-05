import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const SuratKeteranganDomisiliForm = dynamicFn(async () => {
  const SuratKeteranganDomisiliForm = await import("../../edit/form")
  return SuratKeteranganDomisiliForm
})

export const metadata = {
  title: "Edit Surat Keterangan Domisili",
}

export default function SuratKeteranganDomisiliEditDialogPage() {
  return (
    <DialogWrapper>
      <SuratKeteranganDomisiliForm isDialog />
    </DialogWrapper>
  )
}
