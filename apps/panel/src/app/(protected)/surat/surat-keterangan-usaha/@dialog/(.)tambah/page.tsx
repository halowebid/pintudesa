import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layout/dialog-wrapper"

const SuratKeteranganUsahaForm = dynamicFn(async () => {
  const SuratKeteranganUsahaForm = await import("../../tambah/form")
  return SuratKeteranganUsahaForm
})
export const metadata = {
  title: "Buat Surat Keterangan Usaha",
}

export default function SuratKeteranganUsahaPage() {
  return (
    <DialogWrapper>
      <SuratKeteranganUsahaForm isDialog />
    </DialogWrapper>
  )
}
