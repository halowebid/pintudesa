import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const SuratKeteranganDomisiliForm = dynamicFn(async () => {
  const SuratKeteranganDomisiliForm = await import("../../tambah/form")
  return SuratKeteranganDomisiliForm
})

export const metadata = {
  title: "Buat Surat Keterangan Domisili",
}

export default function SuratKeteranganDomisiliDialogPage() {
  return (
    <DialogWrapper>
      <SuratKeteranganDomisiliForm isDialog />
    </DialogWrapper>
  )
}
