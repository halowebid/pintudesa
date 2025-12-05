import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const SuratKeteranganJalanForm = dynamicFn(async () => {
  const SuratKeteranganJalanForm = await import("../../tambah/form")
  return SuratKeteranganJalanForm
})
export const metadata = {
  title: "Buat Surat Keterangan Jalan",
}

export default function SuratKeteranganJalanPage() {
  return (
    <DialogWrapper>
      <SuratKeteranganJalanForm isDialog />
    </DialogWrapper>
  )
}
