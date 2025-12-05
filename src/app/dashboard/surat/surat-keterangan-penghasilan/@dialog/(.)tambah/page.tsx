import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layouts/dashboard/dialog-wrapper"

const SuratKeteranganPenghasilanForm = dynamicFn(async () => {
  const SuratKeteranganPenghasilanForm = await import("../../tambah/form")
  return SuratKeteranganPenghasilanForm
})
export const metadata = {
  title: "Buat Surat Keterangan Penghasilan",
}

export default function SuratKeteranganPenghasilanPage() {
  return (
    <DialogWrapper>
      <SuratKeteranganPenghasilanForm isDialog />
    </DialogWrapper>
  )
}
