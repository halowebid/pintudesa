import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layout/dialog-wrapper"

const SuratKeteranganPenyaksianTanahForm = dynamicFn(async () => {
  const SuratKeteranganPenyaksianTanahForm = await import("../../tambah/form")
  return SuratKeteranganPenyaksianTanahForm
})
export const metadata = {
  title: "Buat Surat Keterangan Penyaksian Tanah",
}

export default function SuratKeteranganPenyaksianTanahPage() {
  return (
    <DialogWrapper>
      <SuratKeteranganPenyaksianTanahForm isDialog />
    </DialogWrapper>
  )
}
