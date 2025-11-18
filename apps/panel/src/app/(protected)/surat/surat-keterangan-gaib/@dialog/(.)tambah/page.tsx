import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layout/dialog-wrapper"

const SuratKeteranganGaibForm = dynamicFn(async () => {
  const SuratKeteranganGaibForm = await import("../../tambah/form")
  return SuratKeteranganGaibForm
})
export const metadata = {
  title: "Buat Surat Keterangan Gaib",
}

export default function SuratKeteranganGaibPage() {
  return (
    <DialogWrapper>
      <SuratKeteranganGaibForm isDialog />
    </DialogWrapper>
  )
}
