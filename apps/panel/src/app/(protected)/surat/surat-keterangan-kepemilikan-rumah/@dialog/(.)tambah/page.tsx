import * as React from "react"
import dynamicFn from "next/dynamic"

import DialogWrapper from "@/components/layout/dialog-wrapper"

const SuratKeteranganKepemilikanRumahForm = dynamicFn(async () => {
  const SuratKeteranganKepemilikanRumahForm = await import("../../tambah/form")
  return SuratKeteranganKepemilikanRumahForm
})
export const metadata = {
  title: "Buat Surat Keterangan Kepemilikan Rumah",
}

export default function SuratKeteranganKepemilikanRumahPage() {
  return (
    <DialogWrapper>
      <SuratKeteranganKepemilikanRumahForm isDialog />
    </DialogWrapper>
  )
}
